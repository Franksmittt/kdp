import Link from "next/link";
import { SiteImage } from "@/components/ui/SiteImage";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { blogPosts } from "@/content/site-content";

type BlogGridProps = {
  limit?: number;
  showHeader?: boolean;
};

export function BlogGrid({ limit, showHeader = true }: BlogGridProps) {
  const posts = limit ? blogPosts.slice(0, limit) : blogPosts;

  return (
    <div className={showHeader ? "our-blog" : "page-blog"}>
      <div className="container">
        {showHeader ? (
          <div className="row section-row">
            <div className="col-lg-12">
              <SectionTitle
                eyebrow="Latest articles"
                title="Prep, coatings, and running tidy job sites"
                centered={!showHeader}
              />
            </div>
          </div>
        ) : (
          <div className="row section-row">
            <div className="col-lg-12">
              <SectionTitle
                eyebrow="Latest articles"
                title="Prep, coatings, and running tidy job sites"
                centered
              />
            </div>
          </div>
        )}

        <div className="row">
          {posts.map((post, i) => (
            <div key={post.slug} className="col-xl-4 col-md-6">
              <div
                className="post-item wow fadeInUp"
                data-wow-delay={i > 0 ? `${i * 0.1}s` : undefined}
              >
                <div className="post-featured-image">
                  <Link href="/blog-single">
                    <figure className="image-anime">
                      <SiteImage
                        src={post.image}
                        alt={post.title}
                        width={400}
                        height={260}
                      />
                    </figure>
                  </Link>
                </div>
                <div className="post-item-body">
                  <div className="post-item-tags">
                    <Link href="/blog-single">{post.tag}</Link>
                  </div>
                  <div className="post-item-content">
                    <h2>
                      <Link href="/blog-single">{post.title}</Link>
                    </h2>
                  </div>
                  <div className="post-item-meta">
                    <p>{post.date}</p>
                  </div>
                  <div className="post-item-btn">
                    <Link href="/blog-single" className="readmore-btn">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
