type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  centered,
  className,
}: SectionTitleProps) {
  return (
    <div
      className={`section-title${centered ? " section-title-center" : ""}${className ? ` ${className}` : ""}`}
    >
      {eyebrow ? <h3 className="wow fadeInUp">{eyebrow}</h3> : null}
      <h2 className="text-anime-style-3" data-cursor="-opaque">
        {title}
      </h2>
      {description ? (
        <p className="wow fadeInUp" data-wow-delay="0.2s">
          {description}
        </p>
      ) : null}
    </div>
  );
}
