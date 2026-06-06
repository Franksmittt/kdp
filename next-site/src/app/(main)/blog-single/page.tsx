import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { BlogPostContent } from "@/components/sections/BlogPostContent";
import { featuredBlogPost } from "@/content/site-content";
import { buildJsonLd, buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata("blog-single");

export default function BlogSinglePage() {
  return (
    <>
      <JsonLd data={buildJsonLd("blog-single")} />
      <PageHeader
        title="Article"
        breadcrumbs={[
          { label: "home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: featuredBlogPost.title },
        ]}
      />
      <BlogPostContent />
    </>
  );
}
