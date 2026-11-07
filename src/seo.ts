import { blogPosts, lifePosts, type Post } from './content/posts';
import { education, orgs, profile } from './data/site';

/** Public origin of the site, used for canonical URLs, sitemap and social cards. */
export const SITE_URL = 'https://gabrielefantini.github.io';

export type RouteMeta = {
  title: string;
  description: string;
  path: string;
  type: 'website' | 'profile' | 'article';
  noindex?: boolean;
  jsonLd: Record<string, unknown>[];
  published?: string;
};

const DEFAULT_DESCRIPTION = `${profile.name} is a software engineer and developer based in ${profile.location}. Domain-driven design, clean architecture, EventStorming and AI in software development — applied to data governance at Blindata and the Open Data Mesh Initiative.`;

/** Canonical form of a path: always with a trailing slash ("/about/"). */
export function canonicalPath(pathname: string): string {
  const clean = pathname.split(/[?#]/)[0].replace(/\/+$/, '');
  return clean === '' ? '/' : `${clean}/`;
}

const person = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: profile.name,
  givenName: 'Gabriele',
  familyName: 'Fantini',
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/og.png`,
  jobTitle: 'Software Engineer',
  description: DEFAULT_DESCRIPTION,
  email: `mailto:${profile.email}`,
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Umbria',
    addressCountry: 'IT',
  },
  homeLocation: { '@type': 'Place', name: profile.location },
  worksFor: { '@type': 'Organization', name: 'Blindata', url: 'https://blindata.io' },
  memberOf: {
    '@type': 'Organization',
    name: 'Open Data Mesh Initiative',
    url: 'https://github.com/opendatamesh-initiative',
  },
  alumniOf: education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.place })),
  knowsAbout: [
    'Software engineering',
    'Software development',
    'Domain-driven design',
    'Clean architecture',
    'EventStorming',
    'Domain storytelling',
    'AI in software development',
    'Data governance',
    'Data mesh',
    'Data products',
  ],
  sameAs: [profile.links.github, profile.links.linkedin],
};

const website = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: profile.name,
  description: DEFAULT_DESCRIPTION,
  inLanguage: 'en',
  author: { '@id': `${SITE_URL}/#person` },
};

const graph = (...nodes: Record<string, unknown>[]) => [{ '@context': 'https://schema.org', '@graph': nodes }];

function postMeta(post: Post, sectionLabel: string): RouteMeta {
  const path = `/${post.section}/${post.slug}/`;
  return {
    title: `${post.title} — ${profile.name}`,
    description: post.summary || DEFAULT_DESCRIPTION,
    path,
    type: 'article',
    published: post.date,
    jsonLd: graph({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.summary,
      datePublished: post.date,
      url: `${SITE_URL}${path}`,
      mainEntityOfPage: `${SITE_URL}${path}`,
      image: `${SITE_URL}/og.png`,
      articleSection: sectionLabel,
      keywords: post.tags.join(', '),
      inLanguage: 'en',
      author: person,
    }),
  };
}

/** Title, description and structured data for any path of the site. */
export function getRouteMeta(pathname: string): RouteMeta {
  const path = canonicalPath(pathname);
  const [, section, slug] = path.split('/');

  const page = (title: string, description: string, type: RouteMeta['type'] = 'website'): RouteMeta => ({
    title,
    description,
    path,
    type,
    jsonLd: graph(website, person),
  });

  if (path === '/') {
    return {
      ...page(`${profile.name} — Software Engineer & Developer in ${profile.location}`, DEFAULT_DESCRIPTION),
      jsonLd: graph(website, person, {
        '@type': 'ProfilePage',
        url: `${SITE_URL}/`,
        name: profile.name,
        mainEntity: { '@id': `${SITE_URL}/#person` },
      }),
    };
  }

  switch (section) {
    case 'about':
      return {
        ...page(
          `About ${profile.name} — Software Engineer in ${profile.location}`,
          `${profile.name} is a software engineer and developer based in ${profile.location}: background, craft and experience — DDD, clean architecture, EventStorming and AI in software development.`,
          'profile',
        ),
        jsonLd: graph(website, person, {
          '@type': 'ProfilePage',
          url: `${SITE_URL}${path}`,
          name: `About ${profile.name}`,
          mainEntity: { '@id': `${SITE_URL}/#person` },
        }),
      };
    case 'organizations':
      return page(
        `Work in data governance — ${profile.name}`,
        `${profile.name}'s work in data governance: software engineer at ${orgs[0].name} and contributor to the ${orgs[1].name} (ODM Platform, DPDS).`,
      );
    case 'blog':
      if (slug) {
        const post = blogPosts.find((p) => p.slug === slug);
        if (post) return postMeta(post, 'Blog');
        break;
      }
      return page(
        `Blog — ${profile.name}`,
        `Notes by ${profile.name} on domain-driven design, clean architecture, AI in software development and data governance.`,
      );
    case 'lab':
      return page(
        `Lab — ${profile.name}`,
        `Experimental public repositories by ${profile.name}: AI integrations in software development, modelling tools and architecture spikes.`,
      );
    case 'life':
      if (slug) {
        const post = lifePosts.find((p) => p.slug === slug);
        if (post) return postMeta(post, 'Life');
        break;
      }
      return page(`Life — ${profile.name}`, `${profile.name} off the clock: notes on things that have nothing to do with software.`);
  }

  return { ...page(`Page not found — ${profile.name}`, DEFAULT_DESCRIPTION), noindex: true, jsonLd: [] };
}

/** Every indexable path, for pre-rendering and the sitemap. */
export function listRoutes(): { path: string; lastmod?: string }[] {
  const latest = (posts: Post[]) => posts[0]?.date;
  return [
    { path: '/' },
    { path: '/about/' },
    { path: '/organizations/' },
    { path: '/blog/', lastmod: latest(blogPosts) },
    ...blogPosts.map((p) => ({ path: `/blog/${p.slug}/`, lastmod: p.date })),
    { path: '/lab/' },
    { path: '/life/', lastmod: latest(lifePosts) },
    ...lifePosts.map((p) => ({ path: `/life/${p.slug}/`, lastmod: p.date })),
  ];
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The <head> tags for a route, as an HTML string (used at build time). */
export function renderHead(meta: RouteMeta): string {
  const url = `${SITE_URL}${meta.path}`;
  const image = `${SITE_URL}/og.png`;
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<meta name="author" content="${esc(profile.name)}" />`,
    meta.noindex ? `<meta name="robots" content="noindex" />` : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:site_name" content="${esc(profile.name)}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(profile.name)} — Software Engineer" />`,
    `<meta property="og:locale" content="en_US" />`,
    meta.published ? `<meta property="article:published_time" content="${meta.published}" />` : '',
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    ...meta.jsonLd.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`),
  ];
  return tags.filter(Boolean).join('\n    ');
}

/** Keep the document title and description in sync during client-side navigation. */
export function applyRouteMeta(pathname: string): void {
  const meta = getRouteMeta(pathname);
  document.title = meta.title;
  const set = (selector: string, attr: string, value: string) => {
    const el = document.head.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };
  set('meta[name="description"]', 'content', meta.description);
  set('link[rel="canonical"]', 'href', `${SITE_URL}${meta.path}`);
  set('meta[property="og:title"]', 'content', meta.title);
  set('meta[property="og:description"]', 'content', meta.description);
  set('meta[property="og:url"]', 'content', `${SITE_URL}${meta.path}`);
}
