import Link from "next/link";
import { SiteImage } from "@/components/ui/SiteImage";
import { projectSingle } from "@/content/site-content";

export function ProjectSingleContent() {
  const project = projectSingle;

  return (
    <div className="page-project-single">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="page-single-image">
              <figure className="image-anime reveal">
                <SiteImage
                  src={project.image}
                  alt={project.title}
                  width={900}
                  height={500}
                  className="img-fluid"
                />
              </figure>
            </div>
            <div className="project-entry">
              <h2 className="text-anime-style-3">{project.title}</h2>
              <dl className="project-details-list">
                {Object.entries(project.fields).map(([label, value]) => (
                  <div key={label} className="project-detail-row">
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4">
                <Link href="/contact" className="btn-default">
                  <i className="fa-solid fa-envelope btn-contact-icon" aria-hidden="true" />
                  Request a similar quote
                </Link>
              </p>
              <p>
                <Link href="/projects" className="readmore-btn">
                  Back to all projects
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
