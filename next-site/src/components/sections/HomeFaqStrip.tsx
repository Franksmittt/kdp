export type HomeFaqItem = {
  question: string;
  answer: string;
};

export function HomeFaqStrip({ items }: { items: HomeFaqItem[] }) {
  return (
    <section className="kgp-lp-faq" aria-labelledby="home-faq-heading">
      <div className="container">
        <header className="kgp-lp-section-head kgp-lp-section-head--left">
          <p className="kgp-lp-eyebrow">Common questions</p>
          <h2 id="home-faq-heading">Before you ask</h2>
        </header>

        <div className="kgp-lp-faq__list">
          {items.map((item, index) => (
            <details key={item.question} open={index === 0}>
              <summary>
                {item.question}
                <i className="fa-solid fa-chevron-down" aria-hidden="true" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
