"use client";

import { ridgeLabel, ridgeLineLengthM, totalRidgeLengthLm } from "@/lib/ridge-engine";

type Props = {
  ridgeLines: { id: string; start: { x: number; y: number }; end: { x: number; y: number } }[];
  onChange: (lines: Props["ridgeLines"]) => void;
  drawMode: boolean;
  onDrawModeChange: (active: boolean) => void;
  pendingStart: { x: number; y: number } | null;
  onCancelDraw: () => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

export function RidgeLineEditor({
  ridgeLines,
  onChange,
  drawMode,
  onDrawModeChange,
  pendingStart,
  onCancelDraw,
  selectedId,
  onSelect,
}: Props) {
  const totalLm = totalRidgeLengthLm(ridgeLines);

  function removeRidge(id: string) {
    onChange(ridgeLines.filter((r) => r.id !== id));
    if (selectedId === id) onSelect(null);
  }

  return (
    <div className="rounded-xl border border-orange-500/30 bg-[#1F2937] p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-orange-400">
            Roof plan — draw lines
          </h4>
          <p className="mt-1 text-xs text-slate-400">
            Blue = unit walls. Orange border = roof edge (with overhang). Draw orange ridge &amp;
            hip lines on the roof plan — click start, click end, repeat.
          </p>
        </div>
        <div className="text-right text-xs text-slate-400">
          <div>
            <span className="font-mono text-white">{ridgeLines.length}</span> line
            {ridgeLines.length !== 1 ? "s" : ""}
          </div>
          <div>
            <span className="font-mono text-white">{totalLm.toFixed(1)}</span> m total
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            if (drawMode) onCancelDraw();
            else onDrawModeChange(true);
          }}
          className={`rounded-lg border px-4 py-2.5 text-sm font-semibold ${
            drawMode
              ? "border-orange-500 bg-orange-500/20 text-orange-200"
              : "border-orange-500/50 text-orange-300 hover:bg-orange-500/10"
          }`}
        >
          {drawMode ? "Done drawing" : "Draw roof line"}
        </button>
        {ridgeLines.length > 0 && (
          <button
            type="button"
            onClick={() => {
              onChange([]);
              onSelect(null);
            }}
            className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-500 hover:text-red-400"
          >
            Clear all lines
          </button>
        )}
      </div>

      {drawMode && (
        <p className="mt-3 rounded-lg border border-orange-500/40 bg-orange-500/10 px-3 py-2 text-sm text-orange-100">
          {pendingStart ? (
            <>
              <strong>Step 2:</strong> Click where the line ends (snaps to grid &amp; corners)
            </>
          ) : (
            <>
              <strong>Step 1:</strong> Click where the line starts — then click again for the end.
              Stay in draw mode to add more lines.
            </>
          )}
        </p>
      )}

      {ridgeLines.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {ridgeLines.map((ridge, i) => {
            const len = ridgeLineLengthM(ridge);
            const selected = selectedId === ridge.id;
            return (
              <li
                key={ridge.id}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
                  selected
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-slate-600 bg-slate-800/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(selected ? null : ridge.id)}
                  className="flex flex-1 flex-wrap items-center gap-2 text-left"
                >
                  <span className="font-bold text-orange-400">{ridgeLabel(i)}</span>
                  <span className="font-mono text-white">{len.toFixed(1)} m</span>
                </button>
                <button
                  type="button"
                  onClick={() => removeRidge(ridge.id)}
                  className="text-slate-500 hover:text-red-400"
                  aria-label={`Remove ${ridgeLabel(i)}`}
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        !drawMode && (
          <p className="mt-3 text-xs text-slate-500">
            No roof lines yet. Hit &quot;Draw roof line&quot; and trace ridges &amp; hips on the
            plan like your site sketch.
          </p>
        )
      )}
    </div>
  );
}
