import { blogPosts, lifePosts } from '../content/posts';
import { experiments, profile } from '../data/site';
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

export function Lab() {
  return (
    <>
      <PageHero
        eyebrow="Lab"
        title="Experiments in the open."
        lead="Public, experimental repositories where I try new ways to build software — AI integrations in the development loop, modelling tools and architecture spikes. Expect rough edges and honest notes."
      />
      <section className="container">
        {experiments.length === 0 ? (
          <div className="empty">
            <Art name="orbits-dark" ratio="21 / 9" />
            <div className="empty-body">
              <h2 className="h-lg">The first experiments are on their way.</h2>
              <p className="muted">
                Coming up: AI-assisted modelling from EventStorming boards, coding agents that respect the
                architecture, and governed context for AI. In the meantime, browse my GitHub.
              </p>
              <div className="hero-actions">
                <Button to={profile.links.github}>Browse my GitHub</Button>
                <Button to="/blog" variant="secondary">
                  Read the notes
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-3">
            {experiments.map((e, i) => (
              <Card
                key={e.url}
                to={e.url}
                art={e.art ?? (['flow-light', 'spiro-dark', 'lattice-light', 'ribbon-dark'] as const)[i % 4]}
                meta={[e.tags.join(' · '), e.status && e.status !== 'active' ? e.status : ''].filter(Boolean).join(' · ')}
                title={e.name}
                text={e.description}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
