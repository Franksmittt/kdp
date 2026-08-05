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

        <ul className="kgp-lp-faq__grid">
          {items.map((item) => (
            <li key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
