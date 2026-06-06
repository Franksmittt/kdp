import Link from "next/link";
import { SiteImage } from "@/components/ui/SiteImage";
import { featuredBlogPost } from "@/content/site-content";
import { BUSINESS } from "@/config/site";

export function BlogPostContent() {
  const post = featuredBlogPost;

  return (
    <div className="page-single-post">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="post-content">
              <div className="post-entry">
                <h2 className="text-anime-style-3">{post.title}</h2>
                <div className="post-single-meta">
                  <ol>
                    <li>
                      <i className="fa-regular fa-user" aria-hidden="true" /> Krugersdorp
                      Painters
                    </li>
                    <li>
                      <i className="fa-regular fa-calendar" aria-hidden="true" /> Feb 12, 2026
                    </li>
                    <li>
                      <i className="fa-solid fa-tag" aria-hidden="true" /> {post.tag}
                    </li>
                  </ol>
                </div>
                <div className="post-image">
                  <figure>
                    <SiteImage
                      src={post.image}
                      alt={post.title}
                      width={900}
                      height={500}
                    />
                  </figure>
                </div>
                {post.body?.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
                <p>
                  <Link href="/contact" className="btn-default">
                    <i className="fa-solid fa-envelope btn-contact-icon" aria-hidden="true" />
                    Book a site assessment
                  </Link>
                </p>
                <p>
                  <Link href="/blog" className="readmore-btn">
                    Back to blog
                  </Link>{" "}
                  ·{" "}
                  <a href={BUSINESS.whatsapp} target="_blank" rel="noopener noreferrer">
                    WhatsApp Rico
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
