"use client";

import { defaultWallPresets, wallLabelFromIndex } from "@/lib/wall-assembly-engine";
import type { WallPreset } from "@/types/visual-quote";

type Props = {
  presets: WallPreset[];
  onChange: (presets: WallPreset[]) => void;
  onStartAssembly: () => void;
};

export function WallPresetEditor({ presets, onChange, onStartAssembly }: Props) {
  function setCount(count: number) {
    const n = Math.min(16, Math.max(3, count));
    onChange(defaultWallPresets(n));
  }

  function patchPreset(id: string, partial: Partial<WallPreset>) {
    onChange(presets.map((p) => (p.id === id ? { ...p, ...partial } : p)));
  }

  function addWall() {
    const i = presets.length;
    onChange([
      ...presets,
      { id: `wall-${Date.now()}`, label: wallLabelFromIndex(i), lengthM: 4 },
    ]);
  }

  function removeWall(id: string) {
    if (presets.length <= 3) return;
    onChange(
      presets
        .filter((p) => p.id !== id)
        .map((p, i) => ({ ...p, label: wallLabelFromIndex(i) })),
    );
  }

  const totalPerimeter = presets.reduce((s, p) => s + p.lengthM, 0);

  return (
    <section className="vqe-card rounded-xl border p-4 sm:p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-vqe-turquoise">
        Step 1 · Name your walls
      </h3>
      <p className="mt-1 text-sm text-slate-400">
        Walk the unit and count every exterior wall you see — each side gets a name and a length.
        Complex shapes (L, T, courtyard) often have 6–10 walls, not just four.
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <div>
          <label className="vqe-label">How many walls?</label>
          <select
            value={presets.length}
            onChange={(e) => setCount(Number(e.target.value))}
            className="vqe-input mt-1 min-w-[5rem]"
          >
            {Array.from({ length: 13 }, (_, i) => i + 3).map((n) => (
              <option key={n} value={n}>
                {n} walls
              </option>
            ))}
          </select>
        </div>
        <p className="text-sm text-slate-400">
          Total perimeter:{" "}
          <span className="font-mono font-semibold text-white">{totalPerimeter.toFixed(1)} m</span>
        </p>
      </div>

      <ul className="mt-4 space-y-2">
        {presets.map((p) => (
          <li
            key={p.id}
            className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-600 bg-[#1F2937] p-3"
          >
            <span className="min-w-[4.5rem] text-sm font-semibold text-vqe-turquoise">
              {p.label}
            </span>
            <input
              type="number"
              min={0.5}
              step={0.1}
              value={p.lengthM}
              onChange={(e) => patchPreset(p.id, { lengthM: Number(e.target.value) })}
              className="vqe-input w-24"
            />
            <span className="text-xs text-slate-500">metres</span>
            <input
              value={p.label}
              onChange={(e) => patchPreset(p.id, { label: e.target.value })}
              className="vqe-input ml-auto min-w-0 flex-1 text-xs"
              placeholder="Custom name"
            />
            <button
              type="button"
              onClick={() => removeWall(p.id)}
              disabled={presets.length <= 3}
              className="text-xs text-slate-500 hover:text-white disabled:opacity-30"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={addWall}
          className="vqe-btn-secondary rounded-lg px-3 py-2 text-xs font-semibold"
        >
          + Add wall
        </button>
        <button
          type="button"
          onClick={onStartAssembly}
          className="vqe-btn-primary rounded-lg px-4 py-2 text-sm font-semibold"
        >
          Open assembly board →
        </button>
      </div>
    </section>
  );
}
