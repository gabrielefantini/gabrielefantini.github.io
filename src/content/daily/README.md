# The daily newspapers — authoring guide

This folder holds the two daily papers published at <https://gabrielefantini.github.io/daily/>:

| Paper | Folder | Subject |
| --- | --- | --- |
| **The Daily Theorem** | `math/` | Mathematics, from the Italian *liceo scientifico* programme to the last year of a software engineering degree |
| **The Daily Commit** | `softeng/` | The software engineering subjects of a full software engineering degree (bachelor + master) |

Both run for **104 weeks**, from **Monday 23 November 2026** to **Saturday 18 November 2028**.
This guide is what the weekly routine (and any human) follows to write the issues.

## Calendar

- **Monday–Friday**: a daily issue (`kind: daily`).
- **Saturday**: the weekend review (`kind: review`): a short recap of the week and mixed problems.
- **Sunday**: no issue.
- Week *N* starts on Monday `2026-11-23 + 7·(N−1)` days. The topics for every day are fixed in
  `<paper>/syllabus.md`. **Follow the syllabus; do not invent, skip or reorder topics.** If a
  syllabus line is too big for one day, cover the core and say what the next days build on.
- Issue numbers count all issues of a paper: week *N*, day *d* (Mon = 1 … Sat = 6) is issue
  `6·(N−1) + d`.

## Files

For each paper and day, two files in `<paper>/issues/`:

```
2026-11-23.md             the issue: topics + exercises
2026-11-23.solutions.md   full solutions to that issue's exercises
```

The site shows each day's solutions **inside the next issue** of the same paper (Saturday's
solutions appear on Monday). A production build only includes issues dated today or earlier
(Europe/Rome), so writing the whole week on Monday is safe: nothing leaks early. Every issue is
also printed to PDF at build time from the same page.

### Issue frontmatter

```markdown
---
issue: 1
week: 1
kind: daily
title: Truth tables, or how to argue with a machine
summary: One or two sentences: what today is about and why it matters.
topics: [Propositions, Connectives, Truth tables]
---
```

`title` is a real headline, not the topic name. `topics`: 2–4 short labels.

### Issue body

```markdown
## <Topic 1 headline>
…explanation…

## <Topic 2 headline>
…explanation…

## Exercises
**1.** … (warm-up)
**2.** …
**3.** …
**4.** … (challenge, marked ★)
```

- **Two or three topics per daily issue**, ~1,200–2,000 words in total, plus **4–6 exercises**
  that go from routine to one harder ★ problem. Number them `**1.**`, `**2.**`, …
- **Review issues (Saturday)**: a ~400-word "The week in one page" recap (the key ideas and how
  they connect), then 6–8 mixed exercises across the week, one of them a ★ synthesis problem.
- **Solutions file**: same numbering, `**1.**` … with complete worked solutions — every step a
  student needs, not just the answer. For proofs, write the proof. For code, give working code
  and explain it. End each solution with the final answer in bold when there is one.

## Style: explain it like 3Blue1Brown

The hardest idea of each day gets the 3Blue1Brown treatment:

1. **Start from a question or a puzzle**, not a definition. Make the reader *want* the concept.
2. **Picture first, formula second.** Draw the idea (see Figures) and only then write the
   algebra, as a description of the picture.
3. **Let the reader rediscover it**: build the definition step by step, as if inventing it.
4. **Concrete before abstract**: a small worked example with real numbers before the general case.
5. **Two views of the same thing** (geometric and algebraic, intuitive and formal), then say
   what each view is good for.
6. Close with a one-line **"Why it matters"** that links to what's coming later in the programme.

Use a blockquote for the key intuition of the day:

```markdown
> **The big picture.** A derivative is not a slope formula: it's the answer to "if I nudge
> the input by a tiny amount, how much does the output get nudged?"
```

Tone: warm, precise, curious; second person ("you"); no fluff. English (British or American,
consistently US spelling). Mathematical rigour matches the level: high-school weeks are
intuitive but correct, university weeks have proper definitions and proofs.

## Math

LaTeX with KaTeX: `$x^2$` inline, and display math on its own lines:

```markdown
$$
\int_a^b f(x)\,dx = F(b) - F(a)
$$
```

Avoid macros KaTeX doesn't support (`\newcommand` is fine inside a single formula only).
Don't put `$` signs in normal prose (write "USD 5"), they start math.

## Code (software engineering paper)

Fenced code blocks with a language: ` ```python `, ` ```java `, ` ```c `, ` ```sql `,
` ```bash `. Use **Python** by default; **C** for memory/systems topics, **Java** for OOP and
design patterns, **SQL** for databases, **TypeScript** for web. Keep listings short (≤ 30 lines).
Every program in an issue or solution must actually run: check it before committing.

## Figures

Figures are **inline SVG** inside a `<figure class="fig">`, so they follow the light/dark theme
and print sharply in the PDF. Write the whole `<figure>…</figure>` as one HTML block **with no
blank lines inside**, and leave a blank line before and after it.

```html
<figure class="fig">
<svg viewBox="0 0 400 220" role="img" aria-label="A vector v = (3, 2) drawn from the origin">
<path class="grid" d="M0 20H400M0 60H400M0 100H400M0 140H400M0 180H400"/>
<line class="axis" x1="20" y1="200" x2="380" y2="200"/>
<line class="axis" x1="40" y1="210" x2="40" y2="10"/>
<line class="s1" x1="40" y1="200" x2="220" y2="80" stroke-width="3"/>
<circle class="f2" cx="220" cy="80" r="4"/>
<text class="t1" x="228" y="76">v = (3, 2)</text>
</svg>
<figcaption>A vector is an arrow: 3 steps right, 2 steps up.</figcaption>
</figure>
```

Classes (colors adapt to the theme):

| Class | Use |
| --- | --- |
| `grid` | faint background grid lines |
| `axis` | axes, neutral ink lines (also `ink` for any neutral stroke) |
| `s1` `s2` `s3` `s4` | stroke in blue, yellow, green, red |
| `f1` `f2` `f3` `f4` | fill in the same colors |
| `t1` `t2` `t3` `t4` | colored text (plain `<text>` is the normal ink color) |
| `fade` | 25% opacity, for "before" states, ghosts, areas |

Lines need `fill="none"` when drawn with `<path>`. Set `stroke-width` explicitly (2–3 for the
main objects, 1 for helpers). Keep the viewBox around 400–560 wide; text around 13–15 units.
Never use hard-coded colors (to paint the page background, e.g. to cut a hole, use
`style="fill: var(--bg)"`). Any `id` (for `clipPath`, `marker`, `mask`) must be unique on the page:
prefix it with the paper and date, e.g. `id="m-2026-11-25-arrow"`, because the previous day's
solutions are shown on the same page. Every figure needs an `aria-label` and a `figcaption`.

Aim for **at least one figure per daily issue** in the math paper and wherever a picture helps in
the software engineering paper (memory layouts, trees, graphs, sequence diagrams, architectures).

## Checking (do not skip)

- Re-derive every math answer independently; for numeric or symbolic results check with Python
  (`python3 -c "import sympy …"`) before committing.
- Run every code snippet and solution (`python3`, `gcc`, `javac`/`java`, `sqlite3`, `node`).
- `npm run build` must pass, then open one issue page to see that math and figures render.

## The Monday routine

Every Monday morning a scheduled Claude task:

1. Works out the current week *N* from today's date and reads week *N* in both syllabi.
2. Skips any day whose issue file already exists (the run is idempotent).
3. Reads the previous week's issues of each paper (for continuity and to avoid repeating
   exercises), then writes Monday–Saturday for both papers: 12 issues + 12 solutions files.
4. Checks math and code as above, runs `npm run build`, and commits
   `Daily: week N issues (YYYY-MM-DD → YYYY-MM-DD)` straight to `main` and pushes.

The push deploys the site, so Monday's issues go live right away; a daily rebuild just after
midnight (Rome) in `.github/workflows/deploy.yml` publishes the rest of the week day by day.
