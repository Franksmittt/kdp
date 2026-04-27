import { LegacyPage } from "@/components/LegacyPage";
import { JsonLd } from "@/components/JsonLd";
import { buildJsonLd, type PageSlug } from "@/config/seo";

type Props = { file: string; slug: PageSlug };

export function LegacyHtmlRoute({ file, slug }: Props) {
  return (
    <>
      <JsonLd data={buildJsonLd(slug)} />
      <LegacyPage file={file} />
    </>
  );
}
