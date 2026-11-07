import { education, experience, profile } from '../data/site';
import { Art, Button, SmartLink } from '../components/ui';

export default function About() {
  return (
    <>
      <header className="page-hero container">
        <p className="eyebrow">About</p>
        <h1>Hi, I’m {profile.shortName}.</h1>
        <p className="lead">
          I’m a software engineer from Italy. Since 2022 I’ve been building data governance software at Blindata, and
          contributing to the open source platform of the Open Data Mesh Initiative.
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
              I studied computer engineering in Perugia and Turin. My theses were about shipping software reliably —
              over-the-air updates for automotive systems, then continuous integration for end-to-end testing of
              mobile apps.
            </p>
            <p>
              Today the same instinct points at data: I care about making data products <em>describable</em>,{' '}
              <em>testable</em> and <em>governable</em> the way we already treat code. That means declarative
              descriptors, policies that run automatically and metadata people — and AI agents — can trust.
            </p>
            <p>
              Outside work I keep a small corner of this site for <SmartLink to="/life">things that have nothing to do
              with data</SmartLink>.
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
