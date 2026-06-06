"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SiteImage } from "@/components/ui/SiteImage";
import {
  projectCategoryFilters,
  projects,
  type ProjectCategory,
} from "@/content/site-content";
import { BUSINESS } from "@/config/site";

type ProjectFilterGridProps = {
  showHeader?: boolean;
  defaultFilter?: ProjectCategory | "all";
  limit?: number;
};

export function ProjectFilterGrid({
  showHeader = true,
  defaultFilter = "homes",
  limit,
}: ProjectFilterGridProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | "all">(
    defaultFilter,
  );

  const filtered = useMemo(() => {
    const list =
      activeFilter === "all"
        ? projects
        : projects.filter((p) => p.categories.includes(activeFilter));
    return limit ? list.slice(0, limit) : list;
  }, [activeFilter, limit]);

  return (
    <div className={showHeader ? "our-projects" : "page-projects"}>
      <div className="container">
        {showHeader ? (
          <div className="row section-row align-items-center">
            <div className="col-xl-6">
              <div className="section-title">
                <h3 className="wow fadeInUp">Our Projects</h3>
                <h2 className="text-anime-style-3" data-cursor="-opaque">
                  A snapshot of repaints, facades, and common-area work we take pride in
                </h2>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="section-content-btn">
                <div className="section-title-content wow fadeInUp" data-wow-delay="0.2s">
                  <p>
                    Browse a mix of interior makeovers, exterior refreshers, body-corporate
                    batches, and roof coatings. Each job is quoted on its prep and access,
                    so what you see is what we actually deliver on site.
                  </p>
                </div>
                <div className="section-btn wow fadeInUp" data-wow-delay="0.4s">
                  <Link href="/projects" className="btn-default">
                    View All Projects
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row section-row">
            <div className="col-lg-12">
              <div className="section-title section-title-center">
                <h3 className="wow fadeInUp">Portfolio</h3>
                <h2 className="text-anime-style-3" data-cursor="-opaque">
                  Repaints, facades, common areas, and roof coatings
                </h2>
              </div>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-lg-12">
            <div className="project-nav wow fadeInUp" data-wow-delay="0.2s">
              <ul>
                {projectCategoryFilters.map((filter) => (
                  <li key={filter.value}>
                    <button
                      type="button"
                      className={activeFilter === filter.value ? "active-btn" : undefined}
                      onClick={() => setActiveFilter(filter.value)}
                    >
                      {filter.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-lg-12">
            <div className="row project-item-list wow fadeInUp" data-wow-delay="0.4s">
              {filtered.map((project, i) => (
                <div
                  key={project.slug}
                  className={`col-xl-4 col-md-6 project-item-box ${project.categories.join(" ")}`}
                >
                  <div className={`project-item${i === 0 ? " active" : ""}`}>
                    <div className="project-item-image">
                      <Link href="/project-single">
                        <figure className="image-anime">
                          <SiteImage
                            src={project.image}
                            alt={project.title}
                            width={400}
                            height={300}
                          />
                        </figure>
                      </Link>
                    </div>
                    <div className="project-item-content">
                      <h2>
                        <Link href="/project-single">{project.title}</Link>
                      </h2>
                      <p>{project.subtitle}</p>
                    </div>
                    <div className="project-item-btn">
                      <Link href="/project-single" aria-label={`View ${project.title}`}>
                        <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!showHeader ? (
            <div className="col-lg-12 text-center wow fadeInUp">
              <Link href="/contact" className="btn-default">
                Discuss your project
              </Link>
            </div>
          ) : (
            <div className="col-lg-12">
              <div className="section-footer-text section-satisfy-img wow fadeInUp" data-wow-delay="0.4s">
                <p>
                  Need a walk-through on site? Call or WhatsApp Rico:{" "}
                  <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phoneDisplay}</a> ·{" "}
                  <a
                    href={BUSINESS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
