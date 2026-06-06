import Link from "next/link";

export type BreadcrumbLink = {
  label: string;
  href?: string;
};

type PageHeaderProps = {
  title: string;
  breadcrumbs: BreadcrumbLink[];
};

export function PageHeader({ title, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="page-header parallaxie">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="page-header-box">
              <h1 className="text-anime-style-3" data-cursor="-opaque">
                {title}
              </h1>
              <nav className="wow fadeInUp" aria-label="Breadcrumb">
                <ol className="breadcrumb">
                  {breadcrumbs.map((crumb, i) => {
                    const isLast = i === breadcrumbs.length - 1;
                    return (
                      <li
                        key={`${crumb.label}-${i}`}
                        className={`breadcrumb-item${isLast ? " active" : ""}`}
                        {...(isLast ? { "aria-current": "page" as const } : {})}
                      >
                        {crumb.href && !isLast ? (
                          <Link href={crumb.href}>{crumb.label}</Link>
                        ) : (
                          crumb.label
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
