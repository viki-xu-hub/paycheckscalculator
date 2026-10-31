import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import { BLOG_POSTS, blogPostBySlug, type BlogPost } from "../lib/blogPosts";

const SITE = "https://www.paycheckscalculator.org";
const AUTHOR = "Paycheck Atlas Editorial Team";

export type Faq = { q: string; a: string };
export type Source = { label: string; url: string };

const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export function blogMetadata(slug: string): Metadata {
  const post = blogPostBySlug[slug];
  const canonical = `${SITE}/blog/${post.slug}`;
  return {
    title: post.metaTitle,
    description: post.description,
    alternates: { canonical },
    openGraph: {
      title: post.metaTitle,
      description: post.description,
      url: canonical,
      type: "article",
      siteName: "Paycheck Atlas",
      publishedTime: post.published,
      modifiedTime: post.updated,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: "summary_large_image", images: ["/og.png"] },
  };
}

export function Figure({ src, alt, caption, width = 960, height = 440 }: { src: string; alt: string; caption: ReactNode; width?: number; height?: number }) {
  return (
    <figure className="blog-figure">
      <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export function DataTable({ caption, head, rows }: { caption: string; head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="blog-table">
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>{head.map(h => <th key={h} scope="col">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => (j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>))}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Formula({ children }: { children: ReactNode }) {
  return <div className="blog-formula">{children}</div>;
}

export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="blog-callout">
      <b>{title}</b>
      {children}
    </aside>
  );
}

export function BlogArticle({
  slug,
  eyebrow,
  quickAnswer,
  takeaways,
  toc,
  faqs,
  sources,
  howTo,
  related,
  children,
}: {
  slug: string;
  eyebrow: string;
  quickAnswer: ReactNode;
  takeaways: string[];
  toc: { id: string; label: string }[];
  faqs: Faq[];
  sources: Source[];
  howTo?: { name: string; steps: string[] };
  related: { href: string; title: string; blurb: string }[];
  children: ReactNode;
}) {
  const post = blogPostBySlug[slug];
  const canonical = `${SITE}/blog/${post.slug}`;
  const otherPosts = BLOG_POSTS.filter(item => item.slug !== slug);

  const schemas: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: canonical,
      mainEntityOfPage: canonical,
      image: `${SITE}${post.hero}`,
      datePublished: post.published,
      dateModified: post.updated,
      author: { "@type": "Organization", name: AUTHOR, url: `${SITE}/about` },
      publisher: { "@type": "Organization", name: "Paycheck Atlas", url: SITE, logo: { "@type": "ImageObject", url: `${SITE}/favicon.svg` } },
      keywords: post.keyword,
      citation: sources.map(item => item.url),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(item => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: canonical },
      ],
    },
  ];
  if (howTo) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: howTo.name,
      step: howTo.steps.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text })),
    });
  }

  return (
    <main>
      {schemas.map(schema => (
        <script key={schema["@type"] as string} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <SiteHeader />

      <nav className="crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">›</span>
        <a href="/blog">Blog</a>
        <span aria-hidden="true">›</span>
        <span>{post.title}</span>
      </nav>

      <article className="blog-article">
        <header className="blog-head">
          <div className="eyebrow">{eyebrow}</div>
          <h1>{post.title}</h1>
          <div className="blog-byline">
            By <a href="/about">{AUTHOR}</a> · Calculations checked against <a href="/methodology">our 2026 payroll engine</a> · Updated{" "}
            <time dateTime={post.updated}>{longDate(post.updated)}</time> · {post.readMinutes} min read
          </div>
        </header>

        <div className="blog-answer">
          <div className="kicker">QUICK ANSWER</div>
          {quickAnswer}
        </div>

        <Figure src={post.hero} alt={post.heroAlt} caption={post.heroAlt} />

        <div className="blog-grid">
          <nav className="blog-toc" aria-label="Table of contents">
            <b>In this guide</b>
            <ol>
              {toc.map(item => (
                <li key={item.id}>
                  <a href={`/blog/${post.slug}#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="blog-takeaways">
            <b>Key takeaways</b>
            <ul>
              {takeaways.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="blog-body">{children}</div>

        <section className="blog-faq faq" id="faq">
          <p className="kicker">COMMON QUESTIONS</p>
          <h2>Frequently Asked Questions</h2>
          {faqs.map(item => (
            <details key={item.q}>
              <summary>
                {item.q}
                <span>+</span>
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </section>

        <section className="blog-body" id="sources">
          <h2>Sources and How We Checked the Numbers</h2>
          <p>
            Every dollar figure in this article is produced by the same 2026 payroll engine that runs our calculators: the IRS
            percentage method from Publication 15-T for federal withholding, the 2026 Social Security wage base, and the state
            rules documented on our <a href="/methodology">methodology page</a>. Rates and limits were checked against these primary
            sources:
          </p>
          <ul className="blog-sources">
            {sources.map(item => (
              <li key={item.url}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">{item.label}</a>
              </li>
            ))}
          </ul>
          <div className="blog-author">
            <div className="blog-author-mark" aria-hidden="true">★</div>
            <div>
              <b>About the author</b>
              <p>
                The {AUTHOR} builds and maintains the free paycheck calculators on this site. We read the IRS and state withholding
                publications each year, encode them in our calculator, and test the results against published examples before
                writing about them. We are not a tax firm; for advice on your own return, talk to a CPA or enrolled agent.{" "}
                <a href="/about">More about us</a> · <a href="/contact">Report an error</a>
              </p>
              <p className="blog-dates">
                Published <time dateTime={post.published}>{longDate(post.published)}</time> · Last reviewed{" "}
                <time dateTime={post.updated}>{longDate(post.updated)}</time>
              </p>
            </div>
          </div>
          <p className="blog-disclaimer">
            <strong>Disclaimer:</strong> examples are estimates for a single W-4 with no adjustments unless stated otherwise. Your
            employer&apos;s payroll system, benefit elections and year-to-date wages determine your actual paycheck.
          </p>
        </section>

        <section className="blog-body">
          <h2>Related Calculators and Guides</h2>
          <div className="tool-links">
            {related.map(item => (
              <a key={item.href} href={item.href}>
                <b>{item.title}</b>
                <span>{item.blurb} →</span>
              </a>
            ))}
            {otherPosts.map((item: BlogPost) => (
              <a key={item.slug} href={`/blog/${item.slug}`}>
                <b>{item.title}</b>
                <span>Read the guide →</span>
              </a>
            ))}
          </div>
        </section>
      </article>

      <SiteFooter />
    </main>
  );
}
