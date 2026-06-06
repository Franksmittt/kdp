"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Circle, Group, Layer, Line, Stage, Text } from "react-konva";
import type Konva from "konva";
import {
  getWallEndpoints,
  isFloorplanClosed,
  snapWallMagnetic,
  toggleWallOrientation,
} from "@/lib/wall-assembly-engine";
import {
  metresToPx,
  pxToMetres,
  touchDistance,
  touchMidpoint,
} from "@/lib/geometry-engine";
import type { WallSegment } from "@/types/visual-quote";

const COLORS = {
  grid: "#374151",
  wall: "#0D9488",
  wallSelected: "#14B8A6",
  magnet: "#FFFFFF",
  magnetHot: "#0D9488",
  fill: "rgba(13, 148, 136, 0.15)",
  label: "#E5E7EB",
};

export type WallAssemblyCanvasProps = {
  walls: WallSegment[];
  locked: boolean;
  pxPerMetre: number;
  selectedWallId: string | null;
  onWallsChange: (walls: WallSegment[]) => void;
  onSelectWall: (id: string | null) => void;
  onLock: () => void;
  onUnlock: () => void;
};

function WallShape({
  wall,
  pxPerMetre,
  scale,
  selected,
  locked,
  snapHot,
  onSelect,
  onDragEnd,
}: {
  wall: WallSegment;
  pxPerMetre: number;
  scale: number;
  selected: boolean;
  locked: boolean;
  snapHot: boolean;
  onSelect: () => void;
  onDragEnd: (dx: number, dy: number) => void;
}) {
  const { start, end } = getWallEndpoints(wall);
  const sx = metresToPx(start.x, pxPerMetre);
  const sy = metresToPx(start.y, pxPerMetre);
  const ex = metresToPx(end.x, pxPerMetre);
  const ey = metresToPx(end.y, pxPerMetre);
  const mx = (sx + ex) / 2;
  const my = (sy + ey) / 2;
  const r = Math.max(5, 7 / scale);

  return (
    <Group
      x={0}
      y={0}
      draggable={!locked}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        const node = e.target;
        onDragEnd(node.x(), node.y());
        node.position({ x: 0, y: 0 });
      }}
    >
      <Line
        points={[sx, sy, ex, ey]}
        stroke={selected ? COLORS.wallSelected : COLORS.wall}
        strokeWidth={selected ? 4 / scale : 3 / scale}
        lineCap="round"
        hitStrokeWidth={16 / scale}
      />
      <Text
        x={mx - 20}
        y={my - 14 / scale}
        text={`${wall.label} · ${wall.lengthM}m`}
        fontSize={11 / scale}
        fill={COLORS.label}
        listening={false}
      />
      <Circle
        x={sx}
        y={sy}
        radius={r}
        fill={snapHot ? COLORS.magnetHot : COLORS.magnet}
        stroke={COLORS.wall}
        strokeWidth={1.5 / scale}
        listening={false}
      />
      <Circle
        x={ex}
        y={ey}
        radius={r}
        fill={snapHot ? COLORS.magnetHot : COLORS.magnet}
        stroke={COLORS.wall}
        strokeWidth={1.5 / scale}
        listening={false}
      />
    </Group>
  );
}

export function WallAssemblyCanvas({
  walls,
  locked,
  pxPerMetre,
  selectedWallId,
  onWallsChange,
  onSelectWall,
  onLock,
  onUnlock,
}: WallAssemblyCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [stageSize, setStageSize] = useState({ width: 320, height: 300 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 30, y: 30 });
  const [isZooming, setIsZooming] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [snapPreviewId, setSnapPreviewId] = useState<string | null>(null);
  const lastDistRef = useRef(0);

  const closed = isFloorplanClosed(walls);

  useEffect(() => {
    function resize() {
      const w = containerRef.current?.offsetWidth ?? window.innerWidth - 32;
      setStageSize({ width: Math.min(w, 520), height: Math.min(w * 0.85, 400) });
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const handleWallDragEnd = useCallback(
    (wallId: string, dxPx: number, dyPx: number) => {
      setDraggingId(null);
      setSnapPreviewId(null);
      const dx = pxToMetres(dxPx, pxPerMetre);
      const dy = pxToMetres(dyPx, pxPerMetre);

      onWallsChange(
        walls.map((w) => {
          if (w.id !== wallId) return w;
          const moved = {
            ...w,
            startX: w.startX + dx,
            startY: w.startY + dy,
          };
          return snapWallMagnetic(moved);
        }),
      );
    },
    [walls, onWallsChange, pxPerMetre],
  );

  const handleTouchMove = useCallback(
    (e: Konva.KonvaEventObject<TouchEvent>) => {
      const evt = e.evt;
      const t1 = evt.touches[0];
      const t2 = evt.touches[1];
      const stage = stageRef.current;
      if (!stage || !t1 || !t2) return;

      evt.preventDefault();
      setIsZooming(true);
      stage.stopDrag();

      const dist = touchDistance(t1, t2);
      const center = touchMidpoint(t1, t2);

      if (lastDistRef.current > 0) {
        const oldScale = scale;
        const newScale = Math.min(4, Math.max(0.35, oldScale * (dist / lastDistRef.current)));
        const pointer = {
          x: (center.x - stage.container().offsetLeft - position.x) / oldScale,
          y: (center.y - stage.container().offsetTop - position.y) / oldScale,
        };
        setScale(newScale);
        setPosition({
          x: center.x - stage.container().offsetLeft - pointer.x * newScale,
          y: center.y - stage.container().offsetTop - pointer.y * newScale,
        });
      }
      lastDistRef.current = dist;
    },
    [position.x, position.y, scale],
  );

  const handleTouchEnd = useCallback(() => {
    lastDistRef.current = 0;
    setIsZooming(false);
  }, []);

  const selectedWall = walls.find((w) => w.id === selectedWallId);

  function rotateSelected() {
    if (!selectedWallId || locked) return;
    onWallsChange(
      walls.map((w) => (w.id === selectedWallId ? toggleWallOrientation(w) : w)),
    );
  }

  return (
    <div ref={containerRef} className="vqe-canvas-wrap relative w-full touch-none">
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        draggable={!isZooming && !draggingId && !locked}
        onDragEnd={(e) => {
          if (!isZooming && e.target === stageRef.current) {
            setPosition({ x: e.target.x(), y: e.target.y() });
          }
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="rounded-xl bg-[#1F2937]"
      >
        <Layer>
          {Array.from({ length: 16 }).map((_, i) => (
            <Line
              key={`g-${i}`}
              points={[0, i * 28, stageSize.width / scale, i * 28]}
              stroke={COLORS.grid}
              strokeWidth={0.5}
              opacity={0.3}
              listening={false}
            />
          ))}

          {walls.map((wall) => (
            <WallShape
              key={wall.id}
              wall={wall}
              pxPerMetre={pxPerMetre}
              scale={scale}
              selected={wall.id === selectedWallId}
              locked={locked}
              snapHot={snapPreviewId === wall.id}
              onSelect={() => !locked && onSelectWall(wall.id)}
              onDragEnd={(dx, dy) => handleWallDragEnd(wall.id, dx, dy)}
            />
          ))}

          <Text
            text={
              locked
                ? "Floorplan locked"
                : "Drag walls · endpoints snap magnetically · pinch to zoom"
            }
            x={8}
            y={8}
            fontSize={10}
            fill="#9CA3AF"
            listening={false}
          />
        </Layer>
      </Stage>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {!locked && (
          <>
            <button
              type="button"
              onClick={rotateSelected}
              disabled={!selectedWallId}
              className="vqe-btn-secondary rounded-lg px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
            >
              ↻ Rotate 90°
              {selectedWall ? ` (${selectedWall.label})` : ""}
            </button>
            <span
              className={`text-xs ${closed ? "text-vqe-turquoise" : "text-slate-500"}`}
            >
              {closed ? "✓ Closed loop — ready to lock" : "Connect all endpoints to close shape"}
            </span>
            <button
              type="button"
              onClick={onLock}
              disabled={!closed}
              className="vqe-btn-primary ml-auto rounded-lg px-4 py-1.5 text-xs font-semibold disabled:opacity-40"
            >
              Lock floorplan
            </button>
          </>
        )}
        {locked && (
          <button
            type="button"
            onClick={onUnlock}
            className="vqe-btn-secondary rounded-lg px-3 py-1.5 text-xs font-semibold"
          >
            Unlock &amp; re-assemble
          </button>
        )}
      </div>
    </div>
  );
}

// Re-export for backward compat — old FloorplanCanvas import path
export { WallAssemblyCanvas as FloorplanCanvas };
