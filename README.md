# Personal blog

An Astro 5 static site with Chinese/English writing, two reading styles and an existing Cloudflare-hosted public site at https://huiyuanxp.com/. Local previews serve the current workspace build. Production release status is tracked separately below.

## Reading and navigation

The top Articles/文章 dropdown lists published posts from the shared content collection, newest first, with bilingual titles and their original `/posts/<slug>/` URLs. Hover opens a temporary menu; clicking the trigger pins it open. Clicking again, clicking outside or pressing Escape closes and unpins it. An unpinned menu closes when the pointer leaves the trigger and menu area. Enter/Space, ArrowDown and touch provide alternatives to hover; Escape returns focus to the trigger.

The global header stays at the top while reading. The Agent Harness chapter navigation sticks immediately below it, spans the viewport and shares the global style; measured header heights keep chapter anchors visible across responsive layouts. `scripts/check-sticky-headers.mjs` checks both styles at desktop and narrow widths using the same browser environment variables as the style check.

Article-page return links lead to `/#blog`. The homepage retains its article area, PDF resume and language preference. Home leads to `/#home`, with the identity docked and the resume card at the top of the content area. Resume opens `/resume.pdf`. The selected open-source card and Projects navigation open `/projects/`; each of huiyuanclaw, alva and AtlasMode has a first-level heading, a short editable introduction from `src/data/projects.ts`, and its GitHub link. Next Token to Agent Harness is included in featured writing. `scripts/check-home-projects.mjs` verifies these entry points with the browser environment variables described below.

## Style selection

First visits show the split style chooser. Choosing a style saves `blog-style` in localStorage persistently; refreshes and article navigation restore it before painting. Saved preferences from the dated format remain valid. Opening Style starts a fresh preview. Downward scrolling during an undecided preview settles into Minimal with the divider and returning-grip animation, preserving the reading position and focus. Explicit button and divider interactions take priority. Reduced-motion preferences use an immediate selection.

Run `scripts/check-style-choice.mjs` against a running preview with `PLAYWRIGHT_MODULE`, `BROWSER_CHANNEL` (optional), `PREVIEW_URL` and `EVIDENCE_DIR`. It covers first visits, scrolling, persistence, explicit selection, navigation, reduced motion and stored preferences.

## Homepage identity

The first viewport centers the bold 惠远 name and bilingual subtitle. Both styles share the same geometry: the initial 50% divider falls between the two characters. The divider grip sits below the name. Content starts below the first viewport.

The left style, 繁而不乱 / Ornate, uses the approved three-layer SVG in `public/images/ornament-composition.svg` against a black-and-gold palette. Its ring rotates clockwise at 3°/s. Dragging follows the pointer angle; release velocity decays back to that speed with a 1.1-second time constant. Left/right arrow keys rotate the focused ring. Touch retains vertical page scrolling. Minimal presents the centered typography on a light background.

Scrolling through the first 70% of the viewport moves and scales the name into the fixed top-left brand. The ornament remains as a faint, rotating background. Scrolling back reverses the name movement. Reduced-motion preference presents a static ornament with direct manual rotation and a fading name transition; hidden tabs pause rotation.

`HeroIdentity.astro` coordinates the scroll geometry; `hero.css` shares it across the two preview layers; `ornament-motion.ts` owns dragging and inertia. Run `node --test scripts/ornament-motion.test.mjs` for signed-angle, inertia, frame-rate and release-pause checks.

## Ornament article and studio

`/posts/svg-traditional-ornaments/` presents the bilingual making-of article with the approved SVG and an embedded studio. `/ornament-studio/` hosts the companion static site, with a 28-item catalogue, three configurable layers, source overlays and SVG export. `?preset=avatar` loads the exact static blog composition; each layer starts at speed zero. The article and studio share this repository and the Cloudflare Pages deployment. The current delivery branch is `codex/ornament-article`; production publication is tracked separately from branch push.

Studio source and assets live in `public/ornament-studio/`. It uses the same point geometry for Canvas previews and exported SVG paths. Article materials and sequential thinker/narrator/editor drafts are retained locally under `resources/ornament-article/`; the writing workflow is described in `TOOLS.md`.

## Development

```sh
npm ci
npm run dev
npm run build
npm run preview
```

`dev` defaults to port 4321. Use a separate worktree and free loopback port when another agent has a running preview. For a static build preview:

```sh
python3 -m http.server 14322 --bind 127.0.0.1 --directory dist
```

Do not replace another preview or expose a new public service. Worktrees isolate source changes, not system services, ports or databases; any runtime data needs separate isolation and backup.

## Content and rules

- `src/content/posts/` is the single source for published and planned articles. `placeholder: true` entries contain bilingual titles and grouping metadata, without publication dates, summaries or body; the top menu excludes them.
- Published articles retain the author-approved language and complete body. Chinese-only imports remain readable in both interface languages; their title and description fields both use the original Chinese. Published titles and routes are discovered from the collection.
- `/posts/next-token-agent-harness/` contains the complete supplied Chinese HTML article, published to the collection on 2026-10-11. Its screenshots and three interactive diagrams live in `public/articles/next-token-agent-harness/`; article CSS and controls are scoped to `.harness-article`. The homepage tool catalogue in `src/data/tools.ts` links to the six Skill introductions in this article. Toolkit covers the author’s Skills, MCPs and workflows.
- `src/content/diary/` is private source/history and is excluded from collection loading. Never publish, copy into reports or delete it during UI work.
- `AGENTS.md` owns workflow and protection rules. `CLAUDE.md` imports it and holds a short technical reference; `TOOLS.md` records project commands and writing tools.

## Menu verification

`scripts/check-article-menu.mjs` runs real Chromium interactions against an already running exact-version preview. It requires an existing Playwright installation and browser; it does not install them or start a server. Set `PLAYWRIGHT_MODULE` to an absolute Playwright `index.mjs` when it is outside this project's dependency resolution. `PREVIEW_URL` defaults to `http://127.0.0.1:14322`; `EVIDENCE_DIR` defaults to `/tmp/blog-menu-evidence`.

```sh
PREVIEW_URL=http://127.0.0.1:14322 EVIDENCE_DIR=/tmp/blog-menu-evidence \
  node scripts/check-article-menu.mjs
```

The checks cover 1440/390 viewports, both styles and languages, pointer movement into the menu, hover dismissal, click pinning and dismissal, keyboard/Escape focus, touch, full menu containment and hit testing, both formal article links and runtime errors. Screenshots and `results.txt` go to the evidence directory. Inspect screenshots as well as assertions; DOM visibility alone does not catch clipped content. Mobile widths are simulated, not a claim of physical-device acceptance.

## Implementation and release state — 2026-10-11

- **Code and local preview — changed-and-verified:** based on `main` commit `c392bd6`, including the bilingual article menu. The centered first viewport, split styles, draggable ornament and scroll-to-brand behavior are implemented. Astro build and four rotation tests pass; desktop and 390px simulated mobile views cover the split, ornate, minimal and scrolled states.
- **Docs and rules — changed-and-verified:** this README describes the current homepage behavior; `AGENTS.md` owns the workflow and article contracts.
- **Remote backup — verified-current:** `codex/ornament-hero` was fast-forward merged into `main` at `be4c87b`; both branches retain the reviewed implementation.
- **Production — live verified:** the authorized `main` push of `be4c87b` completed Cloudflare Pages deployment `6f077c6c-b65c-438c-b157-f0c1d3200561` successfully on 2026-10-11. `https://huiyuanxp.com/` serves the centered identity, ornament control and approved SVG reference. The GitHub check links this deployment to the existing Cloudflare Pages project `blog`.
- **Memory and evidence:** historical logs retain their dated context; current screenshots are retained in `/tmp/blog-motion-*.png`.

## Branch backup and publication

For each completed ticket or major change, reconcile project docs/rules using [neat-freak](https://github.com/KKKKhazix/khazix-skills/blob/main/neat-freak/SKILL.md), distinguish implementation/preview/remote/production state, and commit and push the reviewed project branch. This permission does not authorize force-push, branch deletion, automatic merge or production deployment.

Before any separately authorized release, recheck the remote base, apply only the reviewed changes, rebuild and run menu verification, confirm unchanged formal content and resume, then use the verified existing GitHub/Cloudflare publication path. Never publish an older checkout's build or invent a replacement pipeline. Keep the previous recoverable Git version and production rollback metadata. Retain worktrees and evidence until explicitly authorized to remove them.
