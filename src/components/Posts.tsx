import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDate, type Post } from '../content/posts';
import { Art, ArrowRight, Card } from './ui';
import NotFound from '../pages/NotFound';

export function postMeta(p: Post): string {
  const tag = p.tags[0] ? p.tags[0][0].toUpperCase() + p.tags[0].slice(1) : '';
  return [tag, formatDate(p.date)].filter(Boolean).join(' · ');
}

/** Grid of posts with tag filters. Used by both the Blog and Life sections. */
export function PostIndex({ posts, emptyText }: { posts: Post[]; emptyText: string }) {
  const [tag, setTag] = useState<string | null>(null);
  const tags = useMemo(() => [...new Set(posts.flatMap((p) => p.tags))].sort(), [posts]);
  const shown = tag ? posts.filter((p) => p.tags.includes(tag)) : posts;

  if (posts.length === 0) {
    return (
      <section className="container">
        <p className="muted">{emptyText}</p>
      </section>
    );
  }

  const [featured, ...rest] = shown;

  return (
    <section className="container">
      {tags.length > 1 && (
        <div className="chips" role="toolbar" aria-label="Filter by tag">
          <button className={`chip ${tag === null ? 'active' : ''}`} onClick={() => setTag(null)}>
            All
          </button>
          {tags.map((t) => (
            <button key={t} className={`chip ${tag === t ? 'active' : ''}`} onClick={() => setTag(t)}>
              {t}
            </button>
          ))}
        </div>
      )}

      {featured && (
        <Link to={`/${featured.section}/${featured.slug}`} className="feature">
          <Art name={featured.art} ratio="16 / 9" />
          <div className="feature-body">
            <p className="card-meta">
              {postMeta(featured)}
              {featured.draft && <span className="badge">Draft</span>}
            </p>
            <h2>{featured.title}</h2>
            <p className="card-text">{featured.summary}</p>
            <span className="btn btn-ghost">
              Read <ArrowRight />
            </span>
          </div>
        </Link>
      )}

      {rest.length > 0 && (
        <div className="grid grid-3 mt-xl">
          {rest.map((p) => (
            <Card
              key={p.slug}
              to={`/${p.section}/${p.slug}`}
              art={p.art}
              meta={postMeta(p) + (p.draft ? ' · Draft' : '')}
              title={p.title}
              text={p.summary}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/** A single post page. */
export function PostPage({ posts, backLabel }: { posts: Post[]; backLabel: string }) {
  const { slug } = useParams();
  const index = posts.findIndex((p) => p.slug === slug);
  const post = posts[index];
  if (!post) return <NotFound />;
  const next = posts[index + 1];

  return (
    <article className="post">
      <header className="container post-header">
        <Link to={`/${post.section}`} className="back-link">
          ← {backLabel}
        </Link>
        <p className="eyebrow">
          {formatDate(post.date)} · {post.readingMinutes} min read
        </p>
        <h1>{post.title}</h1>
        {post.summary && <p className="lead">{post.summary}</p>}
        {post.tags.length > 0 && (
          <div className="chips static">
            {post.tags.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        )}
      </header>
      <div className="container">
        <Art name={post.art} ratio="21 / 9" className="post-art" eager />
      </div>
      <div className="container prose">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children }) =>
              href && /^https?:/.test(href) ? (
                <a href={href} target="_blank" rel="noreferrer">
                  {children}
                </a>
              ) : (
                <a href={href}>{children}</a>
              ),
          }}
        >
          {post.body}
        </ReactMarkdown>
      </div>
      {next && (
        <div className="container prose post-next">
          <p className="card-meta">Next</p>
          <Link to={`/${next.section}/${next.slug}`} className="next-link">
            {next.title} <ArrowRight />
          </Link>
        </div>
      )}
    </article>
  );
}
