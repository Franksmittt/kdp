import { loadHtmlBody } from "@/lib/siteHtml";

type Props = { file: string };

/** Server-rendered legacy HTML body (scripts stripped; loaded via LegacyScriptLoader). */
export function LegacyPage({ file }: Props) {
  const html = loadHtmlBody(file);
  return (
    <div
      className="kgp-legacy-root"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
