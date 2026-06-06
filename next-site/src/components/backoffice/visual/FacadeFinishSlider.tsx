"use client";

/** Facade finish slider — X = plaster, 1−X = facebrick (blueprint § Slider UI) */

type Props = {
  plasterRatio: number;
  onChange: (plasterRatio: number) => void;
};

export function FacadeFinishSlider({ plasterRatio, onChange }: Props) {
  const facebrickPct = Math.round((1 - plasterRatio) * 100);
  const plasterPct = Math.round(plasterRatio * 100);

  return (
    <div className="vqe-facade-slider rounded-xl border border-slate-600 bg-charcoal-elevated p-4">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
          Facade finish
        </p>
        <p className="font-mono text-sm text-vqe-turquoise">
          {plasterPct}% plaster · {facebrickPct}% facebrick
        </p>
      </div>
      <p className="mt-1 text-xs text-slate-400">
        Only plastered area is quoted for paint — facebrick is deducted automatically
      </p>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={plasterPct}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        className="vqe-range mt-3 w-full"
        aria-label="Plaster percentage"
      />
      <div className="mt-3 flex h-3 overflow-hidden rounded-full">
        <div
          className="bg-slate-400 transition-all"
          style={{ width: `${plasterPct}%` }}
          title="Cement plaster"
        />
        <div
          className="bg-slate-600 transition-all"
          style={{ width: `${facebrickPct}%` }}
          title="Facebrick (no paint)"
        />
      </div>
    </div>
  );
}
