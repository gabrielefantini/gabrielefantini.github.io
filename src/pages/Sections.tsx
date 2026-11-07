import { blogPosts, lifePosts } from '../content/posts';
import { sponsored } from '../data/site';
import { Art, Button, Card, PageHero } from '../components/ui';
import { PostIndex, PostPage } from '../components/Posts';

export function Blog() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Notes on modelling, architecture and AI."
        lead="Domain-driven design, clean architecture, AI in the development loop — and where all of it meets data governance."
      />
      <PostIndex posts={blogPosts} emptyText="No posts yet — the first one is on its way." />
    </>
  );
}

export function BlogPost() {
  return <PostPage posts={blogPosts} backLabel="Blog" />;
}

export function Life() {
  return (
    <>
      <PageHero
        eyebrow="Life"
        title="Off the clock."
        lead="A personal space for everything unrelated to work — hobbies, trips, books and whatever else is on my mind."
      />
      <PostIndex posts={lifePosts} emptyText="Nothing here yet." />
    </>
  );
}

export function LifePost() {
  return <PostPage posts={lifePosts} backLabel="Life" />;
}

export function Sponsoring() {
  return (
    <>
      <PageHero
        eyebrow="Sponsoring"
        title="Open source I want to support."
        lead="The software I use every day stands on the work of maintainers. This page collects the projects I sponsor or want to give back to."
      />
      <section className="container">
        {sponsored.length === 0 ? (
          <div className="empty">
            <Art name="orbits-dark" ratio="21 / 9" />
            <div className="empty-body">
              <h2 className="h-lg">Nothing here yet.</h2>
              <p className="muted">
                I’m putting together the list of projects I want to sponsor. Check back soon — or browse what I’m
                working on in the meantime.
              </p>
              <div className="hero-actions">
                <Button to="https://github.com/sponsors/explore">Explore GitHub Sponsors</Button>
                <Button to="/organizations" variant="secondary">
                  My open source work
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-3">
            {sponsored.map((s, i) => (
              <Card
                key={s.url}
                to={s.sponsorUrl ?? s.url}
                art={s.art ?? (['flow-light', 'spiro-dark', 'lattice-light'] as const)[i % 3]}
                meta={s.owner}
                title={s.name}
                text={s.description}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
