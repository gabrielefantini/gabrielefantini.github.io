import { Link } from 'react-router-dom';
import { blogPosts } from '../content/posts';
import { bridge, exploring, orgs, pillars, profile } from '../data/site';
import { Art, ArrowRight, ArrowUpRight, Button, Card, SectionHeader } from '../components/ui';
import { postMeta } from '../components/Posts';

export default function Home() {
  const latest = blogPosts.slice(0, 3);

  return (
    <>
      <header className="page-hero container home-hero">
        <p className="eyebrow">{profile.eyebrow}</p>
        <h1 className="display">{profile.headline}</h1>
        <p className="lead">{profile.tagline}</p>
        <div className="hero-actions">
          <Button to="/about">About me</Button>
          <Button to="/blog" variant="secondary">
            Read the blog
          </Button>
        </div>
      </header>

      <section className="container">
        <Art name="fan-dark" ratio="21 / 9" className="hero-art" eager />
      </section>

      <section className="container section">
        <SectionHeader title="My work in data governance" action={{ label: 'More about my work', to: '/organizations' }} />
        <div className="grid grid-2">
          {orgs.map((o) => (
            <Link key={o.id} to={`/organizations#${o.id}`} className="card card-lg">
              <Art name={o.art} ratio="4 / 3" />
              <div className="card-body">
                <p className="card-meta">{o.kicker}</p>
                <h3 className="card-title card-title-lg">{o.name}</h3>
                <p className="card-text">{o.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="split">
          <div>
            <p className="eyebrow">How I work</p>
            <h2 className="h-xl">Understand the domain first. Then let the code follow.</h2>
            <p className="lead">
              Most hard problems in software are understanding problems. I start from conversations, shape them into a
              model, and protect that model with architecture and tests.
            </p>
          </div>
          <ul className="focus-list">
            {pillars.map((p, i) => (
              <li key={p.title}>
                <span className="step">0{i + 1}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container section">
        <SectionHeader title="Exploring now" action={{ label: 'Visit the lab', to: '/lab' }} />
        <div className="grid grid-3">
          {exploring.map((e) => (
            <Card key={e.title} to="/lab" art={e.art} meta={e.tag} title={e.title} text={e.text} />
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="split">
          <div>
            <p className="eyebrow">Where software craft meets data</p>
            <h2 className="h-xl">The same ideas, one level up.</h2>
            <p className="lead">
              In data governance I keep meeting old friends. The ideas that make software maintainable are the ones
              that make data trustworthy — for people and for AI.
            </p>
          </div>
          <ul className="bridge">
            {bridge.map((b) => (
              <li key={b.from}>
                <span className="bridge-from">{b.from}</span>
                <ArrowRight size={16} />
                <div>
                  <span className="bridge-to">{b.to}</span>
                  <p>{b.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {latest.length > 0 && (
        <section className="container section">
          <SectionHeader title="Latest writing" action={{ label: 'View all', to: '/blog' }} />
          {latest.length < 3 ? (
            // Too few posts for a grid: show the newest one as a featured row.
            <Link to={`/blog/${latest[0].slug}`} className="feature">
              <Art name={latest[0].art} ratio="16 / 9" />
              <div className="feature-body">
                <p className="card-meta">{postMeta(latest[0])}</p>
                <h3 className="feature-title">{latest[0].title}</h3>
                <p className="card-text">{latest[0].summary}</p>
              </div>
            </Link>
          ) : (
            <div className="grid grid-3">
              {latest.map((p) => (
                <Card key={p.slug} to={`/blog/${p.slug}`} art={p.art} meta={postMeta(p)} title={p.title} text={p.summary} />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="container section">
        <SectionHeader title="More of me" />
        <div className="grid grid-3">
          <Card to="/about" art="ribbon-light" meta="Introduction" title="About me" text="Background, craft, and how I ended up modelling data." />
          <Card to="/lab" art="rays-dark" meta="Experiments" title="Lab" text="Public experimental repos: AI integrations in software development and more." />
          <Card to="/life" art="orbits-light" meta="Off the clock" title="Life" text="Notes on things that have nothing to do with software." />
        </div>
      </section>

      <section className="container section cta">
        <h2 className="h-xl">Let’s talk modelling, architecture and AI.</h2>
        <div className="hero-actions center">
          <Button to={`mailto:${profile.email}`}>Get in touch</Button>
          <a className="btn btn-secondary" href={profile.links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <ArrowUpRight />
          </a>
        </div>
      </section>
    </>
  );
}
