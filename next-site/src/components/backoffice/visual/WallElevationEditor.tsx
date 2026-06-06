"use client";

import { useMemo, useRef, useState } from "react";
import { Group, Layer, Line, Rect, Stage, Text } from "react-konva";
import type Konva from "konva";
import {
  APERTURE_CATALOG,
  clampAperture,
  createAperture,
  ELEVATION_PX_PER_M,
  snapElevationM,
  wallNetPaintSqm,
} from "@/lib/aperture-engine";
import type { ApertureSpec, ApertureType } from "@/types/visual-quote";

const PX = ELEVATION_PX_PER_M;
const PAD = 40;

type Props = {
  wallIndex: number;
  wallLabel: string;
  wallLengthM: number;
  wallHeightM: number;
  apertures: ApertureSpec[];
  onChange: (apertures: ApertureSpec[]) => void;
  onClose: () => void;
};

function toStageX(m: number) {
  return PAD + m * PX;
}

function toStageYBottom(mFromGround: number, wallHeightM: number) {
  return PAD + (wallHeightM - mFromGround) * PX;
}

export function WallElevationEditor({
  wallIndex,
  wallLabel,
  wallLengthM,
  wallHeightM,
  apertures,
  onChange,
  onClose,
}: Props) {
  const stageRef = useRef<Konva.Stage>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stageW = PAD * 2 + wallLengthM * PX + 20;
  const stageH = PAD * 2 + wallHeightM * PX + 48;

  const selected = apertures.find((a) => a.id === selectedId) ?? null;
  const paint = wallNetPaintSqm(wallLengthM, wallHeightM, apertures);

  const gridLines = useMemo(() => {
    const lines: React.ReactNode[] = [];
    for (let m = 0; m <= Math.ceil(wallLengthM); m++) {
      const x = toStageX(m);
      lines.push(
        <Line
          key={`gv-${m}`}
          points={[x, PAD, x, PAD + wallHeightM * PX]}
          stroke="#374151"
          strokeWidth={m % 5 === 0 ? 1 : 0.5}
          opacity={0.5}
          listening={false}
        />,
      );
    }
    for (let m = 0; m <= Math.ceil(wallHeightM); m++) {
      const y = toStageYBottom(m, wallHeightM);
      lines.push(
        <Line
          key={`gh-${m}`}
          points={[PAD, y, PAD + wallLengthM * PX, y]}
          stroke="#374151"
          strokeWidth={m % 5 === 0 ? 1 : 0.5}
          opacity={0.5}
          listening={false}
        />,
      );
    }
    return lines;
  }, [wallLengthM, wallHeightM]);

  function updateOne(id: string, patch: Partial<ApertureSpec>) {
    onChange(
      apertures.map((a) =>
        a.id === id ? clampAperture({ ...a, ...patch }, wallLengthM, wallHeightM) : a,
      ),
    );
  }

  function addOpening(type: ApertureType) {
    const next = createAperture(type, wallIndex, wallLengthM, wallHeightM, apertures);
    onChange([...apertures, next]);
    setSelectedId(next.id);
  }

  function removeSelected() {
    if (!selectedId) return;
    onChange(apertures.filter((a) => a.id !== selectedId));
    setSelectedId(null);
  }

  return (
    <div className="rounded-xl border border-blue-500/40 bg-[#1F2937] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-blue-400">
            {wallLabel} — front elevation
          </h4>
          <p className="mt-1 text-xs text-slate-400">
            {wallLengthM} m × {wallHeightM} m · 1 grid square = 1 m · drag openings horizontally ·
            openings deduct from paint area
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs text-slate-400 hover:text-white"
        >
          Close
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(APERTURE_CATALOG) as ApertureType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => addOpening(type)}
            className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-blue-400 hover:text-white"
            style={{ borderLeftColor: APERTURE_CATALOG[type].color, borderLeftWidth: 3 }}
          >
            + {APERTURE_CATALOG[type].label}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl bg-[#111827] p-2">
        <Stage ref={stageRef} width={Math.min(stageW, 720)} height={stageH}>
          <Layer>
            {gridLines}

            <Rect
              x={PAD}
              y={PAD}
              width={wallLengthM * PX}
              height={wallHeightM * PX}
              fill="#334155"
              stroke="#3B82F6"
              strokeWidth={2}
              listening={false}
            />

            {apertures.map((ap) => {
              const cat = APERTURE_CATALOG[ap.type];
              const x = toStageX(ap.leftOffsetM);
              const y = toStageYBottom(ap.sillHeightM + ap.heightM, wallHeightM);
              const w = ap.widthM * PX;
              const h = ap.heightM * PX;
              const isSel = ap.id === selectedId;
              return (
                <Group key={ap.id}>
                  <Rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill={cat.color}
                    opacity={0.75}
                    stroke={isSel ? "#FFFFFF" : cat.color}
                    strokeWidth={isSel ? 2 : 1}
                    draggable
                    dragBoundFunc={(pos) => {
                      const minX = toStageX(0);
                      const maxX = toStageX(wallLengthM - ap.widthM);
                      return { x: Math.min(Math.max(pos.x, minX), maxX), y };
                    }}
                    onClick={() => setSelectedId(ap.id)}
                    onTap={() => setSelectedId(ap.id)}
                    onDragEnd={(e) => {
                      const leftM = snapElevationM((e.target.x() - PAD) / PX);
                      updateOne(ap.id, { leftOffsetM: leftM });
                      e.target.x(toStageX(leftM));
                    }}
                  />
                  <Text x={x + 4} y={y + 4} text={cat.label} fontSize={9} fill="#FFFFFF" listening={false} />
                </Group>
              );
            })}

            <Line
              points={[
                PAD - 8,
                PAD + wallHeightM * PX,
                PAD + wallLengthM * PX + 8,
                PAD + wallHeightM * PX,
              ]}
              stroke="#64748B"
              strokeWidth={2}
              listening={false}
            />
          </Layer>
        </Stage>
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-400">
        <div>
          Gross: <span className="font-mono text-white">{paint.gross.toFixed(1)} m²</span>
        </div>
        <div>
          Openings: <span className="font-mono text-white">{paint.openings.toFixed(1)} m²</span>
        </div>
        <div>
          Net paint: <span className="font-mono text-blue-400">{paint.net.toFixed(1)} m²</span>
        </div>
      </dl>

      {selected && (
        <div className="mt-4 grid gap-3 rounded-lg border border-slate-600 bg-slate-800/60 p-3 sm:grid-cols-2 lg:grid-cols-5">
          <p className="col-span-full text-xs font-semibold text-white">
            {APERTURE_CATALOG[selected.type].label}
          </p>
          <label className="text-xs text-slate-400">
            From left (m)
            <input
              type="number"
              min={0}
              step={0.1}
              value={selected.leftOffsetM}
              onChange={(e) => updateOne(selected.id, { leftOffsetM: Number(e.target.value) })}
              className="vqe-input mt-1 w-full font-mono text-sm"
            />
          </label>
          <label className="text-xs text-slate-400">
            Width (m)
            <input
              type="number"
              min={0.3}
              step={0.1}
              value={selected.widthM}
              onChange={(e) => updateOne(selected.id, { widthM: Number(e.target.value) })}
              className="vqe-input mt-1 w-full font-mono text-sm"
            />
          </label>
          <label className="text-xs text-slate-400">
            Height (m)
            <input
              type="number"
              min={0.3}
              step={0.1}
              value={selected.heightM}
              onChange={(e) => updateOne(selected.id, { heightM: Number(e.target.value) })}
              className="vqe-input mt-1 w-full font-mono text-sm"
            />
          </label>
          <label className="text-xs text-slate-400">
            Sill / floor gap (m)
            <input
              type="number"
              min={0}
              step={0.1}
              value={selected.sillHeightM}
              onChange={(e) => updateOne(selected.id, { sillHeightM: Number(e.target.value) })}
              className="vqe-input mt-1 w-full font-mono text-sm"
            />
          </label>
          <div className="flex items-end">
            <button
              type="button"
              onClick={removeSelected}
              className="w-full rounded-lg border border-red-500/40 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
