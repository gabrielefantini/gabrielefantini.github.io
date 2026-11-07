import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { orgs } from '../data/site';
import { Art, ArrowUpRight, Button, PageHero } from '../components/ui';

export default function Organizations() {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
  }, [hash]);

  return (
    <>
      <PageHero
        eyebrow="Where I work"
        title="Where I put the craft to work."
        lead="Today I apply domain-driven thinking to data governance and data mesh: on a governance platform, and in an open initiative building standards and open source software for data products."
      />

      {orgs.map((o, i) => (
        <section key={o.id} id={o.id} className="container section org">
          <div className={`org-intro ${i % 2 ? 'reverse' : ''}`}>
            <Art name={o.art} ratio="4 / 3" />
            <div>
              <p className="eyebrow">{o.kicker}</p>
              <h2 className="h-xl">{o.name}</h2>
              {o.description.map((d) => (
                <p key={d.slice(0, 20)} className="body-lg">
                  {d}
                </p>
              ))}
              <div className="hero-actions">
                <Button to={o.url}>Visit website</Button>
                {o.github && (
                  <Button to={o.github} variant="secondary">
                    GitHub
                  </Button>
                )}
              </div>
            </div>
          </div>

          <ul className="focus-list cols-3 mt-xl">
            {o.highlights.map((h) => (
              <li key={h.title}>
                <h3>{h.title}</h3>
                <p>{h.text}</p>
              </li>
            ))}
          </ul>

          {o.repos && (
            <div className="mt-xl">
              <h3 className="h-md">Key repositories</h3>
              <div className="repo-list">
                {o.repos.map((r) => (
                  <a key={r.name} href={r.url} target="_blank" rel="noreferrer" className="repo">
                    <span className="repo-name">
                      {r.name} <ArrowUpRight />
                    </span>
                    <span className="repo-desc">{r.description}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>
      ))}
    </>
  );
}
