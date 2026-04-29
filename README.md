# usearranger

Demo landing page for **usearranger** — a tool that listens during the funeral arrangement meeting and prepares the obituary and death certificate, so the director can be present with the family instead of typing.

Live: https://www.usearranger.com

## Develop

It's a single static HTML file. No build step.

```
open index.html
```

(or any local web server pointed at this directory)

## What's in the repo

- `index.html` — the production page. Self-contained: inline CSS, inline JSX, React + Babel from CDN.
- `arranger-demo-page/` — original handoff bundle from [Claude Design](https://claude.ai/design), kept as a design reference. Re-import this into Claude Design to iterate on the visuals.
