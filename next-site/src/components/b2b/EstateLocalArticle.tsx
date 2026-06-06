import type { EstateProfile } from "@/content/estates";

export function EstateLocalArticle({ estate }: { estate: EstateProfile }) {
  return (
    <article className="rounded-xl border border-charcoal-border bg-surface p-6 lg:p-8">
      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-turquoise-dark">
          {estate.nodeType.replace(/_/g, " ")} · {estate.region}
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
          Exterior substrate preservation in {estate.name}
        </h2>
      </header>

      <div className="prose prose-slate max-w-none space-y-5 text-ink-muted leading-relaxed">
        <p>{estate.subheading}</p>

        <section>
          <h3 className="font-display text-lg font-semibold text-ink">
            STSMA, PMR 22 &amp; reserve fund planning
          </h3>
          <p>
            Body corporates and managing agents in {estate.name} need defensible capital
            programmes — not generic painting. Under the{" "}
            <strong className="text-ink">Sectional Titles Schemes Management Act (STSMA)</strong>,
            Prescribed Management Rule 22 (PMR 22) mandates a written{" "}
            <strong className="text-ink">
              10-Year Maintenance, Repair, and Replacement Plan (MRRP)
            </strong>{" "}
            for all major capital items on common property, funded through an isolated reserve
            account (PMR 24(2)).
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {estate.legalContext.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="font-display text-lg font-semibold text-ink">
            Section 5 median line &amp; fenestration
          </h3>
          <p>
            Section 5 of the Sectional Titles Act places the boundary through the centre of
            exterior windows and doors — the inner 50% is the owner&apos;s section, the outer 50%
            is common property. We structure quotations with pre-calculated{" "}
            <strong className="text-ink">50/50 STSMA split invoicing</strong> for fenestration
            maintenance, removing administrative friction for your managing agent.
          </p>
        </section>

        <section>
          <h3 className="font-display text-lg font-semibold text-ink">
            Highveld geology &amp; thermal shock
          </h3>
          <p>{estate.climateNote}</p>
          <p>
            Krugersdorp&apos;s sloped nodes rest on expansive clays and quartzite ridges.
            Hydrostatic <strong className="text-ink">lateral damp migration</strong> on
            earth-retaining walls differs from capillary rising damp — each requires distinct
            remediation (PRO-STRUCT 506 cementitious tanking vs silane DPC injection) before
            topcoat.{" "}
            <strong className="text-ink">Highveld thermal shock</strong> — diurnal swings
            exceeding 20°C — demands elastomeric films such as Plascon Micatex at 100&nbsp;µm
            aggregate dry film thickness (DFT), applied only between 10°C and 40°C ambient.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-charcoal-border bg-surface-muted p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Working window
            </h4>
            <p className="mt-2 text-sm text-ink">{estate.workingWindow}</p>
            <p className="mt-1 text-xs text-ink-muted">{estate.hours}</p>
          </div>
          <div className="rounded-lg border border-charcoal-border bg-surface-muted p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Access perimeter
            </h4>
            <p className="mt-2 text-sm text-ink">{estate.accessPerimeter}</p>
            <p className="mt-1 text-xs text-ink-muted">{estate.security}</p>
          </div>
          <div className="rounded-lg border border-charcoal-border bg-surface-muted p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Local methodology
            </h4>
            <p className="mt-2 text-sm text-ink">{estate.geoSignal}</p>
          </div>
        </section>

        <p className="text-sm">
          <strong className="text-ink">Exterior-only mandate:</strong> zero interior access, zero
          resident key handovers — 100% of our operational footprint remains on common property
          and the outer median line. Phased block-by-block chunking aligns drawdowns to monthly
          reserve accruals, eliminating special-levy shocks.
        </p>
      </div>
    </article>
  );
}
