import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProjectSingleContent } from "@/components/sections/ProjectSingleContent";
import { projectSingle } from "@/content/site-content";
import { buildJsonLd, buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata("project-single");

export default function ProjectSinglePage() {
  return (
    <>
      <JsonLd data={buildJsonLd("project-single")} />
      <PageHeader
        title="Project detail"
        breadcrumbs={[
          { label: "home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: projectSingle.title },
        ]}
      />
      <ProjectSingleContent />
    </>
  );
}
