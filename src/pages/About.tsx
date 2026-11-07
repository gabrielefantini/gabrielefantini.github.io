import { education, experience, profile } from '../data/site';
import { Art, Button, SmartLink } from '../components/ui';

export default function About() {
  return (
    <>
      <header className="page-hero container">
        <p className="eyebrow">About</p>
        <h1>Hi, I’m {profile.name}.</h1>
        <p className="lead">
          I’m a software engineer and developer based in Umbria, Italy, who likes to understand a problem before solving it — and who keeps
          experimenting with better ways to build software.
        </p>
      </header>

      <section className="container">
        <Art name="ribbon-dark" ratio="21 / 9" className="hero-art" eager />
      </section>

      <section className="container section">
        <div className="split">
          <h2 className="h-lg">In short</h2>
          <div className="prose prose-flush">
            <p>
              <strong>Roots.</strong> I have a solid engineering background, and both my theses were about shipping
              software reliably — over-the-air updates for automotive systems, then continuous integration for
              end-to-end testing of mobile apps. That instinct stuck: I care that code is correct, testable and easy to
              change, not just done.
            </p>
            <p>
              <strong>Craft.</strong> Over time I’ve become convinced that most hard problems are understanding
              problems. So I start with domain storytelling and EventStorming, shape the solution with domain-driven
              design, and keep it honest with clean architecture.
            </p>
            <p>
              <strong>Frontier.</strong> I like working at the edge of how software is made: trying new development
              techniques and treating AI as a real collaborator in the loop — from modelling sessions to code, tests
              and reviews. I write down what works and what doesn’t.
            </p>
            <p>
              <strong>Today.</strong> I apply all of this to data governance and data mesh, at{' '}
              <SmartLink to="/organizations">Blindata and in the Open Data Mesh Initiative</SmartLink>. The same ideas
              carry over surprisingly well: ubiquitous language becomes ontologies, bounded contexts become federated
              domains, and contracts become data contracts.
            </p>
            <p>
              Outside work I keep a small corner of this site for{' '}
              <SmartLink to="/life">things that have nothing to do with software</SmartLink>.
            </p>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="split">
          <h2 className="h-lg">Experience</h2>
          <ol className="timeline">
            {experience.map((e) => (
              <li key={e.place}>
                <span className="timeline-period">{e.period}</span>
                <div>
                  <h3>
                    {e.title} ·{' '}
                    {e.url ? <SmartLink to={e.url}>{e.place}</SmartLink> : e.place}
                  </h3>
                  <p>{e.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container section">
        <div className="split">
          <h2 className="h-lg">Education</h2>
          <ol className="timeline">
            {education.map((e) => (
              <li key={e.place}>
                <span className="timeline-period">{e.period}</span>
                <div>
                  <h3>
                    {e.title} · {e.place}
                  </h3>
                  <p>{e.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container section">
        <div className="split">
          <h2 className="h-lg">Elsewhere</h2>
          <div className="hero-actions">
            <Button to={profile.links.github}>GitHub</Button>
            <Button to={profile.links.linkedin} variant="secondary">
              LinkedIn
            </Button>
            <Button to={`mailto:${profile.email}`} variant="secondary">
              Email
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
