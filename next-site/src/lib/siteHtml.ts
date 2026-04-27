import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

const HTML_DIR = path.join(process.cwd(), "content", "html");

function stripScripts(html: string) {
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}

/** Removes preloader markup (improves LCP / Lighthouse; scripts no longer wait on it). */
function stripPreloader(html: string) {
  return html
    .replace(/<!--\s*Preloader Start\s*-->[\s\S]*?<!--\s*Preloader End\s*-->/gi, "")
    .replace(/<div class="preloader"[\s\S]*?<\/div>\s*/gi, "");
}

function stripWhatsappFloat(html: string) {
  return html.replace(
    /<a\b[^>]*class="[^"]*whatsapp-float[^"]*"[^>]*>[\s\S]*?<\/a>/gi,
    "",
  );
}

/** Map legacy .html links to App Router paths */
function rewriteLegacyLinks(html: string) {
  let s = html;
  const pairs: [RegExp, string][] = [
    [/href="\.\/"/gi, 'href="/"'],
    [/href='\.\/'/gi, "href='/'"],
    [/href="index\.html"/gi, 'href="/"'],
    [/href='index\.html'/gi, "href='/'"],
    [/href="about\.html"/gi, 'href="/about"'],
    [/href='about\.html'/gi, "href='/about'"],
    [/href="services\.html"/gi, 'href="/services"'],
    [/href='services\.html'/gi, "href='/services'"],
    [/href="service-single\.html"/gi, 'href="/service-single"'],
    [/href='service-single\.html'/gi, "href='/service-single'"],
    [/href="contact\.html"/gi, 'href="/contact"'],
    [/href='contact\.html'/gi, "href='/contact'"],
    [/href="blog\.html"/gi, 'href="/blog"'],
    [/href='blog\.html'/gi, "href='/blog'"],
    [/href="blog-single\.html"/gi, 'href="/blog-single"'],
    [/href='blog-single\.html'/gi, "href='/blog-single'"],
    [/href="projects\.html"/gi, 'href="/projects"'],
    [/href='projects\.html'/gi, "href='/projects'"],
    [/href="project-single\.html"/gi, 'href="/project-single"'],
    [/href='project-single\.html'/gi, "href='/project-single'"],
    [/href="faqs\.html"/gi, 'href="/faqs"'],
    [/href='faqs\.html'/gi, "href='/faqs'"],
    [/href="testimonials\.html"/gi, 'href="/testimonials"'],
    [/href='testimonials\.html'/gi, "href='/testimonials'"],
  ];
  for (const [re, rep] of pairs) s = s.replace(re, rep);

  s = s.replace(/src="images\//gi, 'src="/images/');
  s = s.replace(/src='images\//gi, "src='/images/");
  return s;
}

export const loadHtmlBody = cache((filename: string) => {
  const full = path.join(HTML_DIR, filename);
  const raw = fs.readFileSync(full, "utf8");
  const m = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  let inner = m?.[1] ?? "";
  inner = stripPreloader(inner);
  inner = stripScripts(inner);
  inner = stripWhatsappFloat(inner);
  inner = rewriteLegacyLinks(inner);
  return inner;
});

export function getHtmlTitle(filename: string): string {
  const full = path.join(HTML_DIR, filename);
  const raw = fs.readFileSync(full, "utf8");
  const m = raw.match(/<title>([^<]*)<\/title>/i);
  return (m?.[1] ?? "Krugersdorp Painters").trim();
}

export function getHtmlDescription(filename: string): string | undefined {
  const full = path.join(HTML_DIR, filename);
  const raw = fs.readFileSync(full, "utf8");
  const m = raw.match(
    /<meta\s+name="description"\s+content="([^"]*)"/i,
  );
  return m?.[1]?.trim();
}
