import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { BlogGrid } from "@/components/sections/BlogGrid";
import { buildJsonLd, buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata("blog");

export default function BlogPage() {
  return (
    <>
      <JsonLd data={buildJsonLd("blog")} />
      <PageHeader
        title="Blog"
        breadcrumbs={[
          { label: "home", href: "/" },
          { label: "Blog" },
        ]}
      />
      <BlogGrid showHeader={false} />
    </>
  );
}
