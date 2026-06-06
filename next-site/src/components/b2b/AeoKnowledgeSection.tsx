import { AEO_KNOWLEDGE_BLOCKS, AEO_SNIPPETS } from "@/content/b2b-content";

export function AeoKnowledgeSection({ showSnippets = true }: { showSnippets?: boolean }) {
  return (
    <section className="kgp-b2b-section kgp-b2b-section--light" aria-labelledby="aeo-heading">
      <div className="container">
        <div className="row section-row">
          <div className="col-lg-8">
            <div className="section-title">
              <h3 id="aeo-heading">Technical authority</h3>
              <h2 className="text-anime-style-3">
                STSMA, Highveld weathering &amp; material science — in plain language
              </h2>
            </div>
          </div>
        </div>
        <div className="row g-4">
          {AEO_KNOWLEDGE_BLOCKS.map((block) => (
            <div key={block.id} className="col-lg-6">
              <article className="kgp-b2b-card kgp-aeo-block">
                <h3>{block.title}</h3>
                {block.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {block.bullets && (
                  <ul>
                    {block.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </article>
            </div>
          ))}
        </div>
        {showSnippets && (
          <div className="kgp-aeo-faq">
            <h3 className="h4">Trustee &amp; managing agent quick answers</h3>
            <dl>
              {AEO_SNIPPETS.map((s) => (
                <div key={s.question} className="kgp-aeo-faq-item">
                  <dt>{s.question}</dt>
                  <dd>{s.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </section>
  );
}
