import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProjectFilterGrid } from "@/components/sections/ProjectFilterGrid";
import { buildJsonLd, buildMetadata } from "@/config/seo";

export const metadata: Metadata = buildMetadata("projects");

export default function ProjectsPage() {
  return (
    <>
      <JsonLd data={buildJsonLd("projects")} />
      <PageHeader
        title="Projects"
        breadcrumbs={[
          { label: "home", href: "/" },
          { label: "Projects" },
        ]}
      />
      <ProjectFilterGrid showHeader={false} defaultFilter="all" />
    </>
  );
}
