type JsonRecord = Record<string, unknown>;

function safeJsonStringify(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function JsonLd({ data }: { data: JsonRecord[] }) {
  return (
    <>
      {data.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonStringify(obj) }}
        />
      ))}
    </>
  );
}
