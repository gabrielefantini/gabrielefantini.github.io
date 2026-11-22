import { Link, useParams } from 'react-router-dom';
import {
  issuesOf,
  latestIssue,
  longDate,
  paperById,
  papers,
  pdfUrl,
  publishCutoff,
  syllabusOf,
  useIssueContent,
  type Issue,
  type Paper,
} from '../content/daily';
import { formatDate } from '../content/posts';
import { Art, ArrowRight, PageHero } from '../components/ui';
import NotFound from './NotFound';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function addDays(iso: string, n: number): string {
  const d = new Date(iso + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="icon">
      <path d="M8 2.5v8M4.5 7L8 10.5 11.5 7M3 13.5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function issueMeta(issue: Issue): string {
  return [`No. ${issue.number}`, `Week ${issue.week}`, issue.kind === 'review' ? 'Weekend review' : ''].filter(Boolean).join(' · ');
}

/** /daily/ — the two papers and today's front pages. */
export function DailyHome() {
  return (
    <>
      <PageHero
        eyebrow="Daily"
        title="Two newspapers, every morning."
        lead="A daily paper on mathematics and one on software engineering. Each issue has a couple of topics, exercises on them, and the solutions to the previous day's exercises. Monday to Friday, plus a weekend review on Saturday — readable here or as a PDF."
      />
      <section className="container">
        <div className="grid grid-2">
          {papers.map((p) => (
            <PaperCard key={p.id} paper={p} />
          ))}
        </div>
      </section>
    </>
  );
}

function PaperCard({ paper }: { paper: Paper }) {
  const latest = latestIssue(paper.id);
  return (
    <div className="card daily-card">
      <Art name={paper.art} ratio="16 / 9" />
      <div className="card-body">
        <p className="card-meta">{paper.subject}</p>
        <h2 className="daily-card-name">{paper.name}</h2>
        <p className="card-text">{paper.tagline}</p>
        {latest ? (
          <Link to={`/daily/${paper.id}/${latest.date}`} className="daily-today">
            <span className="card-meta">
              {latest.date === publishCutoff ? 'Today' : longDate(latest.date)} · {issueMeta(latest)}
            </span>
            <span className="daily-today-title">
              {latest.title} <ArrowRight />
            </span>
          </Link>
        ) : (
          <p className="muted daily-today">The first issue is on its way.</p>
        )}
        <div className="daily-card-links">
          <Link to={`/daily/${paper.id}`}>All issues</Link>
          <Link to={`/daily/${paper.id}/programme`}>The programme</Link>
        </div>
      </div>
    </div>
  );
}

/** /daily/:paper/ — archive, grouped by week. */
export function PaperArchive() {
  const { paper: id } = useParams();
  const paper = paperById(id);
  if (!paper) return <NotFound />;
  const issues = issuesOf(paper.id);
  const syllabus = syllabusOf(paper.id);
  const weeks = [...new Set(issues.map((i) => i.week))];

  return (
    <>
      <PageHero eyebrow={`Daily · ${paper.subject}`} title={paper.name} lead={paper.tagline}>
        <Link className="btn btn-secondary" to={`/daily/${paper.id}/programme`}>
          The 2-year programme
        </Link>
      </PageHero>
      <section className="container daily-archive">
        {issues.length === 0 && <p className="muted">The first issue is on its way.</p>}
        {weeks.map((w) => {
          const theme = syllabus?.weeks.find((s) => s.week === w)?.theme;
          return (
            <div key={w} className="daily-week">
              <h2 className="daily-week-title">
                Week {w}
                {theme && <span className="muted"> · {theme}</span>}
              </h2>
              <ul className="daily-list">
                {issues
                  .filter((i) => i.week === w)
                  .map((i) => (
                    <li key={i.date}>
                      <Link to={`/daily/${paper.id}/${i.date}`} className="daily-row">
                        <span className="daily-row-date">{formatDate(i.date)}</span>
                        <span className="daily-row-title">
                          {i.title}
                          {i.scheduled && <span className="badge">Scheduled</span>}
                          {i.kind === 'review' && <span className="badge">Review</span>}
                        </span>
                        <span className="daily-row-topics muted">{i.topics.join(' · ')}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          );
        })}
      </section>
    </>
  );
}

/** /daily/:paper/:date/ — one issue. Also the source of the PDF. */
export function IssuePage() {
  const { paper: id, date } = useParams();
  const paper = paperById(id);
  if (!paper) return <NotFound />;
  const issues = issuesOf(paper.id);
  const index = issues.findIndex((i) => i.date === date);
  const issue = issues[index];
  if (!issue) return <NotFound />;
  return <IssueView key={issue.date} paper={paper} issue={issue} newer={issues[index - 1]} older={issues[index + 1]} />;
}

function IssueView({ paper, issue, newer, older }: { paper: Paper; issue: Issue; newer?: Issue; older?: Issue }) {
  const content = useIssueContent(issue);
  const key = `${issue.paper}/${issue.date}`;

  return (
    <article className="daily-issue">
      <header className="container daily-masthead">
        <div className="daily-masthead-top no-print">
          <Link to={`/daily/${paper.id}`} className="back-link">
            ← {paper.name}
          </Link>
          <a className="btn btn-secondary btn-sm" href={pdfUrl(issue)} download>
            PDF <DownloadIcon />
          </a>
        </div>
        <p className="daily-paper-name">{paper.name}</p>
        <p className="daily-dateline">
          <span>{longDate(issue.date)}</span>
          <span>{issueMeta(issue)}</span>
          <span className="print-only">gabrielefantini.github.io/daily</span>
        </p>
        {issue.scheduled && <p className="badge">Scheduled — not public yet</p>}
        <h1>{issue.title}</h1>
        {issue.summary && <p className="lead">{issue.summary}</p>}
        {issue.topics.length > 0 && (
          <div className="chips static">
            {issue.topics.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        )}
      </header>

      {content ? (
        <div className="container prose daily-body" data-daily-body={key} dangerouslySetInnerHTML={{ __html: content.html }} />
      ) : (
        <div className="container prose daily-body">
          <p className="muted">Loading…</p>
        </div>
      )}

      {content?.prevSolutions && (
        <section className="container prose daily-solutions">
          <p className="eyebrow">Solutions to the previous issue</p>
          <h2 className="daily-solutions-title">
            {formatDate(content.prevSolutions.date)} — {content.prevSolutions.title}
          </h2>
          <div data-daily-solutions={key} dangerouslySetInnerHTML={{ __html: content.prevSolutions.html }} />
        </section>
      )}

      <nav className="container prose daily-pager no-print" aria-label="Issues">
        {older ? (
          <Link to={`/daily/${paper.id}/${older.date}`}>
            <span className="card-meta">← Previous</span>
            <span>{older.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {newer && (
          <Link to={`/daily/${paper.id}/${newer.date}`} className="daily-pager-next">
            <span className="card-meta">Next →</span>
            <span>{newer.title}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}

/** /daily/:paper/programme/ — the full 2-year syllabus. */
export function Programme() {
  const { paper: id } = useParams();
  const paper = paperById(id);
  if (!paper) return <NotFound />;
  const syllabus = syllabusOf(paper.id);
  const published = new Set(issuesOf(paper.id).map((i) => i.date));

  return (
    <>
      <PageHero eyebrow={`${paper.name} · Programme`} title={syllabus?.title || 'The programme'} lead={syllabus?.intro}>
        <Link className="btn btn-secondary" to={`/daily/${paper.id}`}>
          All issues
        </Link>
      </PageHero>
      <section className="container daily-programme">
        {syllabus?.phases.map((phase) => (
          <div key={phase} className="daily-phase">
            <h2 className="daily-phase-title">{phase}</h2>
            {syllabus.weeks
              .filter((w) => w.phase === phase)
              .map((w) => {
                const current = publishCutoff >= w.start && publishCutoff <= addDays(w.start, 6);
                return (
                  <details key={w.week} className={`daily-pweek ${current ? 'is-current' : ''}`} open={current}>
                    <summary>
                      <span className="daily-pweek-n">Week {w.week}</span>
                      <span className="daily-pweek-theme">{w.theme}</span>
                      <span className="muted daily-pweek-date">{formatDate(w.start)}</span>
                    </summary>
                    <ul>
                      {w.days.map((d) => {
                        const date = addDays(w.start, DAYS.indexOf(d.day));
                        return (
                          <li key={d.day}>
                            <span className="daily-pday">{d.day}</span>
                            {published.has(date) ? <Link to={`/daily/${paper.id}/${date}`}>{d.topic}</Link> : <span>{d.topic}</span>}
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                );
              })}
          </div>
        ))}
      </section>
    </>
  );
}
