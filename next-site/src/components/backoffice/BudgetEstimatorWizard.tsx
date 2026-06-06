"use client";

import { useMemo, useState, useTransition } from "react";
import {
  SUBSTRATE_PROFILES,
  defaultEstimationInputFromWizard,
  runEstimation,
  type EstimationResult,
  type SubstrateProfileId,
} from "@/lib/estimation-engine";
import {
  ESTIMATOR_ESTATES,
  ESTIMATOR_MRRP_STATUS,
  ESTIMATOR_PAIN_POINTS,
  ESTIMATOR_SCALES,
  ESTIMATOR_SUBSTRATES,
} from "@/content/estimator-options";
import {
  submitEstimatorLead,
  type EstimatorPayload,
} from "@/app/actions/estimator";

const STEPS = [
  "Suburb",
  "Scale & type",
  "Substrate & diagnostics",
  "STSMA cycle",
  "Quote & contact",
] as const;

function formatZAR(n: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function BudgetEstimatorWizard() {
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<EstimationResult | null>(null);

  const [form, setForm] = useState({
    estate: "",
    scale: "",
    substrate: "smooth_plaster" as SubstrateProfileId,
    painPoints: new Set<string>(),
    mrrpStatus: "",
    wallAreaSqm: "",
    crackLinearM: "",
    name: "",
    email: "",
    phone: "",
    organisation: "",
    selectedTier: "tier2" as "tier1" | "tier2" | "tier3",
  });

  const estateLabel =
    ESTIMATOR_ESTATES.find((e) => e.id === form.estate)?.label ?? "your scheme";

  const previewResult = useMemo(() => {
    if (!form.scale || !form.substrate) return null;
    try {
      const input = defaultEstimationInputFromWizard({
        scale: form.scale,
        substrate: form.substrate,
        painPoints: [...form.painPoints],
        wallAreaSqm: form.wallAreaSqm ? Number(form.wallAreaSqm) : undefined,
        crackLinearM: form.crackLinearM ? Number(form.crackLinearM) : undefined,
      });
      return runEstimation(input);
    } catch {
      return null;
    }
  }, [form.scale, form.substrate, form.painPoints, form.wallAreaSqm, form.crackLinearM]);

  function togglePain(id: string) {
    setForm((f) => {
      const next = new Set(f.painPoints);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...f, painPoints: next };
    });
  }

  function validateStep(): boolean {
    setError(null);
    if (step === 0 && !form.estate) {
      setError("Select the suburb or estate you manage.");
      return false;
    }
    if (step === 1 && !form.scale) {
      setError("Select the scale and scheme type.");
      return false;
    }
    if (step === 2 && form.painPoints.size === 0) {
      setError("Select at least one exterior failure indicator.");
      return false;
    }
    if (step === 3 && !form.mrrpStatus) {
      setError("Select your 10-Year MRRP / PMR 22 status.");
      return false;
    }
    return true;
  }

  function nextStep() {
    if (!validateStep()) return;
    if (step === 3 && previewResult) {
      setResult(previewResult);
      setForm((f) => ({
        ...f,
        selectedTier: previewResult.recommendedTier,
      }));
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function prevStep() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!result) {
      setError("Estimation could not be calculated. Go back and check your inputs.");
      return;
    }

    const payload: EstimatorPayload = {
      estate: form.estate,
      scale: form.scale,
      substrate: form.substrate,
      painPoints: [...form.painPoints],
      mrrpStatus: form.mrrpStatus,
      name: form.name,
      email: form.email,
      phone: form.phone,
      organisation: form.organisation,
      wallAreaSqm: form.wallAreaSqm ? Number(form.wallAreaSqm) : undefined,
      crackLinearM: form.crackLinearM ? Number(form.crackLinearM) : undefined,
      selectedTier: form.selectedTier,
      estimationResult: result,
    };

    startTransition(async () => {
      const res = await submitEstimatorLead(payload);
      if (res.ok) setDone(true);
      else setError(res.error);
    });
  }

  if (done) {
    return (
      <div className="rounded-xl border border-charcoal-border bg-surface p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-turquoise-light text-turquoise-dark">
          <i className="fa-solid fa-check text-lg" aria-hidden="true" />
        </div>
        <h3 className="font-display text-xl font-semibold text-ink">PMR 22 outline queued</h3>
        <p className="mt-2 text-ink-muted leading-relaxed">
          Rico will send your phased reserve-fund drawdown schedule and tiered material
          specification for <strong className="text-ink">{estateLabel}</strong> within one
          business day.
        </p>
      </div>
    );
  }

  const activeTier =
    result?.tiers.find((t) => t.tier === form.selectedTier) ??
    previewResult?.tiers.find((t) => t.tier === form.selectedTier);

  return (
    <div className="rounded-xl border border-charcoal-border bg-surface shadow-sm">
      {/* Progress */}
      <div className="border-b border-charcoal-border px-6 py-4">
        <div className="flex gap-1">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-turquoise" : "bg-surface-muted"
              }`}
              title={label}
            />
          ))}
        </div>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
          Step {step + 1} of {STEPS.length} — {STEPS[step]}
        </p>
      </div>

      <div className="p-6">
        {step === 0 && (
          <fieldset>
            <legend className="font-display text-lg font-semibold text-ink">
              Which Krugersdorp node do you manage?
            </legend>
            <p className="mt-1 mb-4 text-sm text-ink-muted">
              Select the West Rand suburb or estate for localized rules and access protocols.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ESTIMATOR_ESTATES.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, estate: e.id }))}
                  className={`rounded-lg border px-3 py-3 text-left text-sm font-medium transition-colors ${
                    form.estate === e.id
                      ? "border-turquoise bg-turquoise-light text-ink ring-1 ring-turquoise"
                      : "border-charcoal-border bg-surface text-ink-muted hover:border-turquoise/50"
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset>
            <legend className="font-display text-lg font-semibold text-ink">
              Scheme scale &amp; type
            </legend>
            <p className="mt-1 mb-4 text-sm text-ink-muted">
              Drives default wall area for quantity surveying when dimensions are not supplied.
            </p>
            <div className="flex flex-col gap-2">
              {ESTIMATOR_SCALES.map((s) => (
                <label
                  key={s.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
                    form.scale === s.id
                      ? "border-turquoise bg-turquoise-light ring-1 ring-turquoise"
                      : "border-charcoal-border hover:border-turquoise/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="scale"
                    className="mt-1 accent-turquoise"
                    checked={form.scale === s.id}
                    onChange={() => setForm((f) => ({ ...f, scale: s.id }))}
                  />
                  <span>
                    <span className="block font-medium text-ink">{s.label}</span>
                    {s.hint && (
                      <span className="block text-xs text-ink-muted">{s.hint}</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
            <label className="mt-4 block">
              <span className="text-sm font-medium text-ink">
                Gross exterior wall area (m²) — optional
              </span>
              <input
                type="number"
                min={50}
                placeholder="e.g. 2200"
                value={form.wallAreaSqm}
                onChange={(e) => setForm((f) => ({ ...f, wallAreaSqm: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-charcoal-border px-3 py-2 text-ink focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/30"
              />
            </label>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="space-y-6">
            <div>
              <legend className="font-display text-lg font-semibold text-ink">
                Substrate profile (α_sub)
              </legend>
              <p className="mt-1 mb-3 text-sm text-ink-muted">
                Absorption multiplier applied before spreading-rate division.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {ESTIMATOR_SUBSTRATES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, substrate: s.id as SubstrateProfileId }))
                    }
                    className={`rounded-lg border px-3 py-3 text-left text-sm transition-colors ${
                      form.substrate === s.id
                        ? "border-turquoise bg-turquoise-light ring-1 ring-turquoise"
                        : "border-charcoal-border hover:border-turquoise/40"
                    }`}
                  >
                    <span className="font-semibold text-ink">{s.label}</span>
                    <span className="mt-0.5 block text-xs text-ink-muted">{s.hint}</span>
                    <span className="mt-1 inline-block rounded bg-charcoal px-1.5 py-0.5 text-xs font-mono text-surface">
                      α = {SUBSTRATE_PROFILES[s.id as SubstrateProfileId].alpha}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-display text-base font-semibold text-ink">
                Visible failure indicators
              </p>
              <div className="mt-2 flex flex-col gap-2">
                {ESTIMATOR_PAIN_POINTS.map((p) => (
                  <label
                    key={p.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 ${
                      form.painPoints.has(p.id)
                        ? "border-turquoise bg-turquoise-light"
                        : "border-charcoal-border"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mt-1 accent-turquoise"
                      checked={form.painPoints.has(p.id)}
                      onChange={() => togglePain(p.id)}
                    />
                    <span className="text-sm text-ink">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-ink">
                Structural crack length (linear metres) — optional
              </span>
              <input
                type="number"
                min={0}
                placeholder="e.g. 35"
                value={form.crackLinearM}
                onChange={(e) => setForm((f) => ({ ...f, crackLinearM: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-charcoal-border px-3 py-2 text-ink focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/30"
              />
            </label>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend className="font-display text-lg font-semibold text-ink">
              STSMA PMR 22 / 10-Year MRRP status
            </legend>
            <p className="mt-1 mb-4 text-sm text-ink-muted">
              Determines phased reserve-fund drawdown scheduling for your AGM pack.
            </p>
            <div className="flex flex-col gap-2">
              {ESTIMATOR_MRRP_STATUS.map((s) => (
                <label
                  key={s.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 ${
                    form.mrrpStatus === s.id
                      ? "border-turquoise bg-turquoise-light ring-1 ring-turquoise"
                      : "border-charcoal-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="mrrp"
                    className="mt-1 accent-turquoise"
                    checked={form.mrrpStatus === s.id}
                    onChange={() => setForm((f) => ({ ...f, mrrpStatus: s.id }))}
                  />
                  <span className="text-sm text-ink">{s.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 4 && (
          <form onSubmit={submit} className="space-y-6">
            {previewResult && (
              <div className="space-y-4">
                <h3 className="font-display text-lg font-semibold text-ink">
                  Triple-tier capital forecast
                </h3>
                <div className="grid gap-3 lg:grid-cols-3">
                  {previewResult.tiers.map((t) => (
                    <button
                      key={t.tier}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, selectedTier: t.tier }))}
                      className={`rounded-xl border p-4 text-left transition-all ${
                        form.selectedTier === t.tier
                          ? "border-turquoise bg-turquoise-light ring-2 ring-turquoise"
                          : "border-charcoal-border bg-surface hover:border-turquoise/40"
                      }`}
                    >
                      <span className="text-xs font-bold uppercase tracking-wider text-turquoise-dark">
                        {t.label}
                      </span>
                      <p className="mt-1 font-display text-2xl font-bold text-ink">
                        {formatZAR(t.totalZAR)}
                      </p>
                      <p className="text-xs text-ink-muted">{t.products}</p>
                      <ul className="mt-3 space-y-1 text-xs text-ink-muted">
                        <li>
                          {t.paintLiters}L topcoat · {t.drumAllocation.drums20L}×20L
                        </li>
                        <li>{formatZAR(t.costPerSqmZAR)}/m² all-in</li>
                        <li>
                          {formatZAR(t.monthlyReserveDrawdownZAR)}/mo over {t.phasedMonths}{" "}
                          mo
                        </li>
                      </ul>
                      {previewResult.recommendedTier === t.tier && (
                        <span className="mt-2 inline-block rounded-full bg-turquoise px-2 py-0.5 text-xs font-semibold text-surface">
                          Recommended
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {activeTier && (
                  <div className="rounded-lg border border-charcoal-border bg-surface-muted p-4 text-sm">
                    <p className="font-semibold text-ink">PMR 22 cash-flow outline</p>
                    <p className="mt-1 text-ink-muted">
                      Effective area {activeTier.effectiveAreaSqm} m² (α={activeTier.alphaSub}) ·
                      Filler {previewResult.fillerDryKg} kg · {previewResult.maskingTapeRolls}{" "}
                      tape rolls · {previewResult.dropSheets} drop sheets
                    </p>
                    <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-charcoal-border">
                      {Array.from({ length: Math.min(activeTier.phasedMonths, 36) }).map(
                        (_, i) => (
                          <div
                            key={i}
                            className="flex-1 border-r border-surface/20 bg-turquoise last:border-0"
                            style={{ opacity: 0.4 + (i / activeTier.phasedMonths) * 0.6 }}
                          />
                        ),
                      )}
                    </div>
                    <p className="mt-2 text-xs text-ink-muted">
                      Sequential block drawdown — {activeTier.phasedMonths}-month phased chunking
                      aligned to reserve accruals.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                required
                placeholder="Full name *"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="rounded-lg border border-charcoal-border px-3 py-2 text-ink focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/30"
              />
              <input
                placeholder="Managing agent / body corporate"
                value={form.organisation}
                onChange={(e) => setForm((f) => ({ ...f, organisation: e.target.value }))}
                className="rounded-lg border border-charcoal-border px-3 py-2 text-ink focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/30"
              />
              <input
                required
                type="email"
                placeholder="Email *"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="rounded-lg border border-charcoal-border px-3 py-2 text-ink focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/30"
              />
              <input
                required
                type="tel"
                placeholder="Phone / WhatsApp *"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="rounded-lg border border-charcoal-border px-3 py-2 text-ink focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/30"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-turquoise px-5 py-2.5 text-sm font-semibold text-surface hover:bg-turquoise-dark disabled:opacity-60 sm:w-auto"
            >
              {pending ? "Submitting…" : "Receive PMR 22 outline & quote"}
            </button>
          </form>
        )}

        {error && (
          <p className="mt-4 text-sm font-medium text-red-700" role="alert">
            {error}
          </p>
        )}

        {step < STEPS.length - 1 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="rounded-lg border border-charcoal-border px-5 py-2.5 text-sm font-semibold text-ink hover:bg-surface-muted"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={nextStep}
              className="rounded-lg bg-turquoise px-5 py-2.5 text-sm font-semibold text-surface hover:bg-turquoise-dark"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
