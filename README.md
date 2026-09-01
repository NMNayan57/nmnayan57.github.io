# nasimnayan.github.io

Personal site and writing of **Nasim Mahmud Nayan** — Deputy Manager, AI & Machine Learning
at BRAC's Central Data Team in Dhaka, Bangladesh.

Work focus: AI governance, responsible AI deployment, and fairness evaluation for development
programmes at population scale. Published researcher in fair and explainable machine learning
(12 papers, 174 citations, h-index 6), currently working on trust and interpretability in
large language models. Peer reviewer for two international journals.

**Live site → https://nasimmahmudnayan.com**

| | |
|---|---|
| Google Scholar | https://scholar.google.com/citations?user=zAuBXLUAAAAJ&hl=en |
| ORCID | https://orcid.org/0009-0003-4157-3518 |
| LinkedIn | https://www.linkedin.com/in/nasim-mahmud-nayan-8475211b9/ |
| OgroPath | https://ogropath.com |

---

## Architecture

Hand-authored static HTML5. **No framework, no build step, no dependencies, no npm.**
This is deliberate — it keeps the site fast, keeps the content in the initial HTML response
where crawlers and language models can read it, and means there is nothing to rot or patch.

Please keep it that way.

```
index.html              Single-page portfolio (10 anchored sections)
404.html                Branded not-found page (root-relative asset paths)
robots.txt              Permissive, including AI answer engines
sitemap.xml             All six indexable URLs
assets/
  styles.css            Design system + all component styles
  script.js             ~140-line IIFE: reveals, counters, nav, filters
blog/
  index.html            Writing index
  blog.css              Article-specific styles
  *.html                One file per article
photos/                 Images and CV
.github/
  workflows/links.yml   CI: runs the two checks below on push
  scripts/              Standard-library Python, no pip installs
```

## Design system

All colour, type, and layout values are CSS custom properties on `:root` in
`assets/styles.css`. Components consume the tokens; nothing hard-codes a value.

- **Palette** — warm cream ground (`--paper`), single terracotta accent (`--rust`).
  Restraint is the point: one accent, used for eyebrows, active nav, citation counts
  and italic emphasis, and nothing else.
- **Type** — Newsreader (serif display and long-form), JetBrains Mono (labels and data),
  system sans for body copy.
- **Contrast** — `--ink-3` carries every small label and is held at WCAG AA or better
  (4.54:1 on the deepest band). If you darken or lighten it, re-check against
  `--paper`, `--paper-2` **and** `--card`.
- **Motion** — the `.reveal` → `.in` → `.done` sequence plays a one-shot entrance and
  then removes the animation. The base state is `opacity: 1` on purpose, so crawlers and
  JS-disabled visitors see everything. `prefers-reduced-motion` is fully honoured.
  Preserve this behaviour through any change.

## Running locally

No install step. Serve the directory over HTTP — `file://` will not resolve `/blog/`
as a directory or the root-relative paths in `404.html`:

```bash
python -m http.server 8000
# then open http://127.0.0.1:8000
```

## Checks

Two CI jobs run on every push (and are worth running before committing):

```bash
python .github/scripts/check_links.py    # every local src/href resolves on disk
python .github/scripts/check_jsonld.py   # every JSON-LD block parses
```

The link checker exists because five broken image references once shipped unnoticed.

## Conventions

- **British English** throughout — except inside published paper titles, venue names, and
  established terms of art (for example "equalized odds", which is the formal metric name).
- **Person-first language.** "People", "participants", "colleagues" — never "beneficiaries".
- **Structured data** — a single `Person` entity is declared on `index.html` and referenced
  by `@id` from every article, so all pages describe one entity. Keep `sameAs` accurate;
  a broken profile URL there is worse than omitting it.
- **Scholar figures are hardcoded** and drift as citations accrue. They appear in three
  places: the hero stat strip, the `<head>` meta description, and the Publications section
  aside. There is a comment above the stat strip listing them.
- **Canonical tags are intentionally absent** until a custom domain resolves. The comment at
  the top of `index.html` lists every location that needs updating when it does.

## Licence

No licence is currently declared. The site's written content, images, and CV are not
free to reuse — please ask first.
