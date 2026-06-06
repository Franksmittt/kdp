"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Circle, Group, Layer, Line, Stage, Text } from "react-konva";
import type Konva from "konva";
import { touchDistance } from "@/lib/geometry-engine";
import { ridgeLabel, snapMetreCoord } from "@/lib/ridge-engine";
import {
  getWallEndpoints,
  PREVIEW_PX_PER_METRE,
  walkAroundClosure,
} from "@/lib/wall-assembly-engine";
import type { FootprintVertex, RidgeLine, WallSegment } from "@/types/visual-quote";

const PX_PER_M = PREVIEW_PX_PER_METRE;
const ORIGIN_PAD = 48;

const COLORS = {
  grid: "#374151",
  gridMajor: "#4B5563",
  wall: "#0D9488",
  wallBlue: "#3B82F6",
  wallActive: "#2DD4BF",
  magnet: "#FFFFFF",
  fill: "rgba(59, 130, 246, 0.15)",
  gap: "#64748B",
  label: "#9CA3AF",
  roofOutline: "#F97316",
  ridge: "#FB923C",
  ridgePending: "#FDBA74",
  ridgeSelected: "#FDE047",
  ridgeGhost: "rgba(251, 146, 60, 0.55)",
};

type RidgeDrawMode = {
  active: boolean;
  pendingStart: { x: number; y: number } | null;
  onPoint: (point: { x: number; y: number }) => void;
  selectedRidgeId?: string | null;
};

type Props = {
  walls: WallSegment[];
  activeWallIndex: number | null;
  roofOutlineVertices?: FootprintVertex[];
  ridgeLines?: RidgeLine[];
  ridgeDraw?: RidgeDrawMode;
  /** Locked phase — blue walls, orange roof plan */
  roofPlanMode?: boolean;
  selectedWallIndex?: number | null;
  onWallClick?: (wallIndex: number) => void;
};

function wallsGeometryKey(walls: WallSegment[]): string {
  return walls
    .map((w) => `${w.id}:${w.lengthM}:${w.startX}:${w.startY}:${w.orientation}`)
    .join("|");
}

function metreToStage(mx: number, my: number) {
  return {
    x: ORIGIN_PAD + mx * PX_PER_M,
    y: ORIGIN_PAD + my * PX_PER_M,
  };
}

export function WalkAroundPreview({
  walls,
  activeWallIndex,
  roofOutlineVertices,
  ridgeLines,
  ridgeDraw,
  roofPlanMode = false,
  selectedWallIndex = null,
  onWallClick,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [stageSize, setStageSize] = useState({ width: 320, height: 320 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isZooming, setIsZooming] = useState(false);
  const [cursorMetres, setCursorMetres] = useState<{ x: number; y: number } | null>(null);
  const lastDistRef = useRef(0);

  const wallsKey = useMemo(() => wallsGeometryKey(walls), [walls]);
  const closure = useMemo(() => walkAroundClosure(walls), [wallsKey]);
  const isDrawingRidge = ridgeDraw?.active ?? false;

  const wallStroke = roofPlanMode ? COLORS.wallBlue : COLORS.wall;
  const wallFill = roofPlanMode ? COLORS.fill : "rgba(13, 148, 136, 0.12)";

  const openLoop = useMemo(() => {
    if (walls.length === 0) return null;
    const first = getWallEndpoints(walls[0]).start;
    const lastWall = walls[walls.length - 1];
    const last =
      lastWall.lengthM > 0
        ? getWallEndpoints(lastWall).end
        : getWallEndpoints(lastWall).start;
    const gapM = Math.hypot(last.x - first.x, last.y - first.y);
    return { first, last, gapM, show: gapM > 0.05 && !closure.closed };
  }, [walls, wallsKey, closure.closed]);

  const bounds = useMemo(() => {
    let minX = 0;
    let minY = 0;
    let maxX = 8;
    let maxY = 8;
    walls.forEach((w) => {
      if (w.lengthM <= 0) return;
      const { start, end } = getWallEndpoints(w);
      for (const p of [start, end]) {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      }
    });
    roofOutlineVertices?.forEach((p) => {
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
    });
    if (walls.length > 0) {
      for (const p of [closure.lastPoint, closure.firstPoint]) {
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
      }
    }
    return { minX, minY, maxX, maxY };
  }, [walls, wallsKey, closure, roofOutlineVertices]);

  const gridCells = useMemo(() => {
    const cols = Math.max(8, Math.ceil(bounds.maxX) + 3);
    const rows = Math.max(8, Math.ceil(bounds.maxY) + 3);
    return { cols, rows };
  }, [bounds.maxX, bounds.maxY]);

  useEffect(() => {
    function resize() {
      const w = containerRef.current?.offsetWidth ?? 320;
      setStageSize({ width: Math.min(w, 560), height: Math.min(w, 560) });
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const scale = zoom;

  function pointerToMetres(): { x: number; y: number } | null {
    const stage = stageRef.current;
    if (!stage) return null;
    const pos = stage.getRelativePointerPosition();
    if (!pos) return null;
    return {
      x: snapMetreCoord((pos.x - ORIGIN_PAD) / PX_PER_M),
      y: snapMetreCoord((pos.y - ORIGIN_PAD) / PX_PER_M),
    };
  }

  function handleStageClick(e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) {
    if (!isDrawingRidge || !ridgeDraw?.onPoint) return;
    if (e.target !== e.target.getStage()) return;
    const m = pointerToMetres();
    if (m) ridgeDraw.onPoint(m);
  }

  function handlePointerMove() {
    if (!isDrawingRidge || !ridgeDraw?.pendingStart) {
      setCursorMetres(null);
      return;
    }
    setCursorMetres(pointerToMetres());
  }

  const fillPoints: number[] = [];
  if (closure.closed && walls.length >= 3) {
    walls.forEach((w) => {
      if (w.lengthM <= 0) return;
      const p = metreToStage(w.startX, w.startY);
      fillPoints.push(p.x, p.y);
    });
  }

  const gridLines: React.ReactNode[] = [];
  for (let c = 0; c <= gridCells.cols; c++) {
    const x = ORIGIN_PAD + c * PX_PER_M;
    const major = c % 5 === 0;
    gridLines.push(
      <Line
        key={`gv-${c}`}
        points={[x, ORIGIN_PAD, x, ORIGIN_PAD + gridCells.rows * PX_PER_M]}
        stroke={major ? COLORS.gridMajor : COLORS.grid}
        strokeWidth={major ? 1 : 0.5}
        opacity={major ? 0.55 : 0.35}
        listening={false}
      />,
    );
  }
  for (let r = 0; r <= gridCells.rows; r++) {
    const y = ORIGIN_PAD + r * PX_PER_M;
    const major = r % 5 === 0;
    gridLines.push(
      <Line
        key={`gh-${r}`}
        points={[ORIGIN_PAD, y, ORIGIN_PAD + gridCells.cols * PX_PER_M, y]}
        stroke={major ? COLORS.gridMajor : COLORS.grid}
        strokeWidth={major ? 1 : 0.5}
        opacity={major ? 0.55 : 0.35}
        listening={false}
      />,
    );
  }

  const ghostLine =
    ridgeDraw?.pendingStart && cursorMetres
      ? (() => {
          const s = metreToStage(ridgeDraw.pendingStart.x, ridgeDraw.pendingStart.y);
          const e = metreToStage(cursorMetres.x, cursorMetres.y);
          return [s.x, s.y, e.x, e.y];
        })()
      : null;

  return (
    <div ref={containerRef} className="vqe-canvas-wrap w-full touch-none">
      <p className="mb-2 text-xs text-slate-500">
        1 square = 1 m · drag to pan · pinch to zoom
        {roofPlanMode && (
          <>
            {" "}
            · <span className="text-blue-400">blue</span> = walls ·{" "}
            <span className="text-orange-400">orange</span> = roof
          </>
        )}
        {roofPlanMode && !isDrawingRidge && (
          <> · click a <span className="text-blue-400">blue wall</span> on the plan</>
        )}
        {isDrawingRidge && (
          <> · roof line mode: click start → click end</>
        )}
      </p>
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={scale}
        scaleY={scale}
        x={pan.x}
        y={pan.y}
        draggable={!isZooming && !isDrawingRidge}
        onClick={handleStageClick}
        onTap={handleStageClick}
        onMouseMove={handlePointerMove}
        onTouchMove={(e) => {
          const t1 = e.evt.touches[0];
          const t2 = e.evt.touches[1];
          if (t1 && !t2 && isDrawingRidge) handlePointerMove();
          if (!t1 || !t2) return;
          e.evt.preventDefault();
          setIsZooming(true);
          stageRef.current?.stopDrag();
          const dist = touchDistance(t1, t2);
          if (lastDistRef.current > 0) {
            setZoom((z) => Math.min(3, Math.max(0.4, z * (dist / lastDistRef.current))));
          }
          lastDistRef.current = dist;
        }}
        onTouchEnd={() => {
          lastDistRef.current = 0;
          setIsZooming(false);
        }}
        onDragEnd={(e) => setPan({ x: e.target.x(), y: e.target.y() })}
        className="rounded-xl bg-[#1F2937]"
      >
        <Layer>
          {gridLines}
          <Text x={ORIGIN_PAD - 6} y={ORIGIN_PAD - 18} text="A1" fontSize={11} fill={COLORS.label} listening={false} />

          {fillPoints.length >= 6 && (
            <Line points={fillPoints} closed fill={wallFill} stroke={wallStroke} strokeWidth={2} listening={false} />
          )}

          {walls.map((wall, i) => {
            if (wall.lengthM <= 0) return null;
            const { start, end } = getWallEndpoints(wall);
            const s = metreToStage(start.x, start.y);
            const en = metreToStage(end.x, end.y);
            const active = activeWallIndex === i;
            const selected = selectedWallIndex === i;
            const clickable = roofPlanMode && !isDrawingRidge && onWallClick;
            return (
              <Group key={wall.id}>
                <Line
                  points={[s.x, s.y, en.x, en.y]}
                  stroke={
                    selected ? "#60A5FA" : active ? COLORS.wallActive : wallStroke
                  }
                  strokeWidth={selected ? 7 : active ? 5 : roofPlanMode ? 4 : 4}
                  lineCap="square"
                  listening={!!clickable}
                  hitStrokeWidth={clickable ? 20 : 0}
                  onClick={(e) => {
                    if (!clickable) return;
                    e.cancelBubble = true;
                    onWallClick(i);
                  }}
                  onTap={(e) => {
                    if (!clickable) return;
                    e.cancelBubble = true;
                    onWallClick(i);
                  }}
                  onMouseEnter={() => {
                    if (clickable && containerRef.current) {
                      containerRef.current.style.cursor = "pointer";
                    }
                  }}
                  onMouseLeave={() => {
                    if (containerRef.current) containerRef.current.style.cursor = "default";
                  }}
                />
                {roofPlanMode && (
                  <Text
                    x={(s.x + en.x) / 2 - 8}
                    y={(s.y + en.y) / 2 - 8}
                    text={String.fromCharCode(65 + i)}
                    fontSize={13}
                    fontStyle="bold"
                    fill={selected ? "#FFFFFF" : "#93C5FD"}
                    listening={!!clickable}
                    onClick={(e) => {
                      if (!clickable) return;
                      e.cancelBubble = true;
                      onWallClick!(i);
                    }}
                    onTap={(e) => {
                      if (!clickable) return;
                      e.cancelBubble = true;
                      onWallClick!(i);
                    }}
                  />
                )}
              </Group>
            );
          })}

          {roofOutlineVertices && roofOutlineVertices.length >= 3 && (
            <Line
              points={roofOutlineVertices.flatMap((v) => {
                const p = metreToStage(v.x, v.y);
                return [p.x, p.y];
              })}
              closed
              stroke={COLORS.roofOutline}
              strokeWidth={3}
              listening={false}
            />
          )}

          {ghostLine && (
            <Line points={ghostLine} stroke={COLORS.ridgeGhost} strokeWidth={2} dash={[8, 6]} listening={false} />
          )}

          {ridgeLines?.map((ridge, i) => {
            const s = metreToStage(ridge.start.x, ridge.start.y);
            const e = metreToStage(ridge.end.x, ridge.end.y);
            const selected = ridgeDraw?.selectedRidgeId === ridge.id;
            return (
              <Group key={ridge.id}>
                <Line
                  points={[s.x, s.y, e.x, e.y]}
                  stroke={selected ? COLORS.ridgeSelected : COLORS.ridge}
                  strokeWidth={selected ? 5 : 4}
                  lineCap="round"
                  listening={false}
                />
                <Text
                  x={(s.x + e.x) / 2 - 8}
                  y={(s.y + e.y) / 2 - 18}
                  text={ridgeLabel(i)}
                  fontSize={10}
                  fontStyle="bold"
                  fill={selected ? COLORS.ridgeSelected : COLORS.ridge}
                  listening={false}
                />
              </Group>
            );
          })}

          {ridgeDraw?.pendingStart && (
            <Circle
              x={metreToStage(ridgeDraw.pendingStart.x, ridgeDraw.pendingStart.y).x}
              y={metreToStage(ridgeDraw.pendingStart.x, ridgeDraw.pendingStart.y).y}
              radius={8}
              fill={COLORS.ridgePending}
              stroke="#FFFFFF"
              strokeWidth={2}
              listening={false}
            />
          )}

          {!roofPlanMode && openLoop?.show && (
            <Line
              points={(() => {
                const lp = metreToStage(openLoop.last.x, openLoop.last.y);
                const fp = metreToStage(openLoop.first.x, openLoop.first.y);
                return [lp.x, lp.y, fp.x, fp.y];
              })()}
              stroke={COLORS.gap}
              strokeWidth={1.5}
              dash={[8, 6]}
              listening={false}
            />
          )}

          {!roofPlanMode &&
            walls.map((wall, i) => {
              if (wall.lengthM <= 0 && i > 0) return null;
              const { start, end } = getWallEndpoints(wall);
              const s = metreToStage(start.x, start.y);
              const en = wall.lengthM > 0 ? metreToStage(end.x, end.y) : s;
              return (
                <Group key={`${wall.id}-pts`}>
                  <Circle x={s.x} y={s.y} radius={5} fill={COLORS.magnet} stroke={wallStroke} strokeWidth={2} listening={false} />
                  {wall.lengthM > 0 && (
                    <Circle x={en.x} y={en.y} radius={5} fill={COLORS.magnet} stroke={wallStroke} strokeWidth={2} listening={false} />
                  )}
                  <Text
                    x={wall.lengthM > 0 ? (s.x + en.x) / 2 - 4 : s.x - 4}
                    y={wall.lengthM > 0 ? (s.y + en.y) / 2 + 8 : s.y + 10}
                    text={String.fromCharCode(65 + i)}
                    fontSize={12}
                    fontStyle="bold"
                    fill="#FFFFFF"
                    listening={false}
                  />
                </Group>
              );
            })}
        </Layer>
      </Stage>
    </div>
  );
}
