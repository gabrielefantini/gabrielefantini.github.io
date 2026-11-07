import { Link } from 'react-router-dom';
import { blogPosts } from '../content/posts';
import { focusAreas, orgs, profile } from '../data/site';
import { Art, ArrowUpRight, Button, Card, SectionHeader } from '../components/ui';
import { postMeta } from '../components/Posts';

export default function Home() {
  const latest = blogPosts.slice(0, 3);

  return (
    <>
      <header className="page-hero container home-hero">
        <p className="eyebrow">
          {profile.role} at Blindata · Open Data Mesh Initiative
        </p>
        <h1 className="display">{profile.headline}</h1>
        <p className="lead">{profile.tagline}</p>
        <div className="hero-actions">
          <Button to="/organizations">See my work</Button>
          <Button to="/about" variant="secondary">
            About me
          </Button>
        </div>
      </header>

      <section className="container">
        <Art name="mesh-dark" ratio="21 / 9" className="hero-art" eager />
      </section>

      <section className="container section">
        <SectionHeader title="Current work" action={{ label: 'All organizations', to: '/organizations' }} />
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

      <section className="section band">
        <div className="container">
          <div className="split">
            <div>
              <p className="eyebrow">Specialization</p>
              <h2 className="h-xl">Data governance, built where data is built.</h2>
              <p className="lead">
                My work sits where data management meets software engineering: data products described as code,
                governance policies that run automatically, and metadata trustworthy enough to give to AI.
              </p>
            </div>
            <ul className="focus-list">
              {focusAreas.map((f) => (
                <li key={f.title}>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </li>
              ))}
            </ul>
          </div>
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
        <SectionHeader title="Explore" />
        <div className="grid grid-3">
          <Card to="/about" art="ribbon-light" meta="Introduction" title="About me" text="Who I am, what I studied and how I got into data." />
          <Card to="/sponsoring" art="rays-dark" meta="Open source" title="Projects I support" text="The open source work I want to give back to." />
          <Card to="/life" art="spiro-light" meta="Off the clock" title="Life" text="Notes on things that have nothing to do with data." />
        </div>
      </section>

      <section className="container section cta">
        <h2 className="h-xl">Let’s talk data products.</h2>
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
