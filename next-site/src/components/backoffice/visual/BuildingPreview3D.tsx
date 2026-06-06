"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Brush, Evaluator, SUBTRACTION } from "three-bvh-csg";
import { buildRidgeCapLines, buildRoofGeometry } from "@/lib/roof-mesh-engine";
import { APERTURE_CATALOG, apertureCenterAlongWall } from "@/lib/aperture-engine";
import { DEFAULT_WALL_THICKNESS_M } from "@/lib/geometry-engine";
import type { ApertureSpec, FootprintVertex, RidgeLine, RoofStructuralStyle } from "@/types/visual-quote";

const MAT_PLASTER = new THREE.MeshStandardMaterial({
  color: "#94A3B8",
  roughness: 0.85,
});
const MAT_FACEBRICK = new THREE.MeshStandardMaterial({
  color: "#64748B",
  roughness: 0.9,
});
const MAT_ROOF = new THREE.MeshStandardMaterial({
  color: "#475569",
  roughness: 0.65,
  metalness: 0.05,
});

type BuildingMeshProps = {
  vertices: FootprintVertex[];
  offsetVertices: FootprintVertex[];
  wallHeightM: number;
  apertures: ApertureSpec[];
  plasterRatio: number;
  roofPitchDeg: number;
  roofOverhangM: number;
  roofStyle: RoofStructuralStyle;
  ridgeLines: RidgeLine[];
};

function verticesToShape(verts: FootprintVertex[]): THREE.Shape {
  const shape = new THREE.Shape();
  if (verts.length < 3) return shape;
  shape.moveTo(verts[0].x, verts[0].y);
  for (let i = 1; i < verts.length; i++) {
    shape.lineTo(verts[i].x, verts[i].y);
  }
  shape.closePath();
  return shape;
}

/** Footprint edge + opening spec → world position & Y rotation for wall-aligned geometry */
function wallOpeningFrame(
  a: FootprintVertex,
  b: FootprintVertex,
  ap: ApertureSpec,
): { position: THREE.Vector3; rotationY: number } {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  // Outward normal in footprint XY → world XZ (footprint y maps to world -Z)
  const nx = -dy / len;
  const nz = -dx / len;
  const centerAlong = apertureCenterAlongWall(ap);
  const midX = a.x + (dx / len) * centerAlong;
  const midY = a.y + (dy / len) * centerAlong;
  const inset = DEFAULT_WALL_THICKNESS_M * 0.6;

  return {
    position: new THREE.Vector3(
      midX + nx * inset,
      ap.sillHeightM + ap.heightM / 2,
      -midY + nz * inset,
    ),
    // BoxGeometry width runs along local +X — align with footprint edge in world XZ
    rotationY: Math.atan2(dy, dx),
  };
}

function RidgeCaps({ segments }: { segments: { start: THREE.Vector3; end: THREE.Vector3 }[] }) {
  return (
    <>
      {segments.map((seg, i) => (
        <Line
          key={`ridge-cap-${i}`}
          points={[seg.start, seg.end]}
          color="#F59E0B"
          lineWidth={3}
        />
      ))}
    </>
  );
}

function ExtrudedWallsWithCSG({
  vertices,
  offsetVertices,
  wallHeightM,
  apertures,
  plasterRatio,
  roofPitchDeg,
  roofOverhangM,
  roofStyle,
  ridgeLines,
}: BuildingMeshProps) {
  const wallMesh = useMemo(() => {
    const shapeVerts = offsetVertices.length >= 3 ? offsetVertices : vertices;
    if (shapeVerts.length < 3) return null;

    const shape = verticesToShape(shapeVerts);
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: wallHeightM,
      bevelEnabled: false,
    });
    // Footprint in XY → extrude +Z, rotate to sit on y=0..wallHeightM, z=-footprintY
    geom.rotateX(-Math.PI / 2);

    let brush = new Brush(geom, MAT_PLASTER);
    brush.updateMatrixWorld();

    const evaluator = new Evaluator();
    const cutterDepth = Math.max(1.2, DEFAULT_WALL_THICKNESS_M * 4);
    const wallVerts = shapeVerts;

    for (const ap of apertures) {
      const wallIdx = ap.wallIndex;
      if (wallIdx >= wallVerts.length) continue;
      const a = wallVerts[wallIdx];
      const b = wallVerts[(wallIdx + 1) % wallVerts.length];
      const { position, rotationY } = wallOpeningFrame(a, b, ap);

      const boxGeom = new THREE.BoxGeometry(ap.widthM, ap.heightM, cutterDepth);
      const boxBrush = new Brush(boxGeom, MAT_FACEBRICK);
      boxBrush.position.copy(position);
      boxBrush.rotation.y = rotationY;
      boxBrush.updateMatrixWorld();

      brush = evaluator.evaluate(brush, boxBrush, SUBTRACTION) as Brush;
    }

    return brush;
  }, [apertures, offsetVertices, vertices, wallHeightM]);

  const roofParams = useMemo(
    () => ({
      footprint: vertices,
      wallHeightM,
      pitchDeg: roofPitchDeg,
      overhangM: roofOverhangM,
      style: roofStyle,
      ridgeLines,
    }),
    [vertices, wallHeightM, roofPitchDeg, roofOverhangM, roofStyle, ridgeLines],
  );

  const roofGeometry = useMemo(
    () => buildRoofGeometry(roofParams),
    [roofParams],
  );

  const ridgeCaps = useMemo(
    () => buildRidgeCapLines(roofParams),
    [roofParams],
  );

  const openingMarkers = useMemo(() => {
    const wallVerts = offsetVertices.length >= 3 ? offsetVertices : vertices;
    return apertures
      .filter((ap) => ap.wallIndex < wallVerts.length)
      .map((ap) => {
        const a = wallVerts[ap.wallIndex];
        const b = wallVerts[(ap.wallIndex + 1) % wallVerts.length];
        const { position, rotationY } = wallOpeningFrame(a, b, ap);
        const color = APERTURE_CATALOG[ap.type].color;
        return { id: ap.id, position, rotationY, widthM: ap.widthM, heightM: ap.heightM, color };
      });
  }, [apertures, offsetVertices, vertices]);

  if (!wallMesh) return null;

  return (
    <group>
      <mesh geometry={wallMesh.geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color={plasterRatio > 0.5 ? "#94A3B8" : "#64748B"}
          roughness={0.85}
        />
      </mesh>
      {openingMarkers.map((m) => (
        <mesh
          key={m.id}
          position={m.position}
          rotation={[0, m.rotationY, 0]}
          castShadow
        >
          <planeGeometry args={[m.widthM, m.heightM]} />
          <meshStandardMaterial
            color={m.color}
            transparent
            opacity={0.85}
            roughness={0.2}
            metalness={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      {roofGeometry && (
        <mesh geometry={roofGeometry} castShadow receiveShadow material={MAT_ROOF} />
      )}
      <RidgeCaps segments={ridgeCaps} />
    </group>
  );
}

type Props = BuildingMeshProps & { className?: string };

export function BuildingPreview3D(props: Props) {
  const { vertices, className } = props;
  const cx = useMemo(() => {
    if (vertices.length === 0) return 0;
    return vertices.reduce((s, v) => s + v.x, 0) / vertices.length;
  }, [vertices]);
  const cz = useMemo(() => {
    if (vertices.length === 0) return 0;
    // Footprint y → world -Z (same as extruded wall geometry)
    return -vertices.reduce((s, v) => s + v.y, 0) / vertices.length;
  }, [vertices]);

  const camY = useMemo(() => {
    const maxDim = Math.max(
      ...vertices.map((v) => v.x),
      ...vertices.map((v) => v.y),
      4,
    );
    return Math.max(8, props.wallHeightM + maxDim * 0.6);
  }, [vertices, props.wallHeightM]);

  if (vertices.length < 3) {
    return (
      <div
        className={`flex h-48 items-center justify-center rounded-xl bg-[#1F2937] text-sm text-slate-400 ${className ?? ""}`}
      >
        Close the floorplan to preview 3D
      </div>
    );
  }

  return (
    <div
      className={`vqe-3d-preview h-52 w-full overflow-hidden rounded-xl bg-[#1F2937] sm:h-64 ${className ?? ""}`}
    >
      <Canvas
        camera={{ position: [cx + 12, camY, cz + 12], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#1F2937"]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[10, 15, 8]} intensity={0.9} castShadow />
        <ExtrudedWallsWithCSG {...props} />
        <OrbitControls
          target={[cx, props.wallHeightM / 2, cz]}
          enablePan
          maxPolarAngle={Math.PI / 2.05}
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>
    </div>
  );
}
