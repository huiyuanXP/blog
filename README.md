# Personal blog

An Astro 5 static site with Chinese/English writing, two reading styles and an existing Cloudflare-hosted public site at https://huiyuanxp.com/. Local previews serve the current workspace build. Production release status is tracked separately below.

## Reading and navigation

The top Articles/文章 dropdown lists published posts from the shared content collection, newest first, with bilingual titles and their original `/posts/<slug>/` URLs. Hover opens a temporary menu; clicking the trigger pins it open. Clicking again, clicking outside or pressing Escape closes and unpins it. An unpinned menu closes when the pointer leaves the trigger and menu area. Enter/Space, ArrowDown and touch provide alternatives to hover; Escape returns focus to the trigger.

Article-page return links lead to `/#blog`. The homepage retains its article area, PDF resume and language preference.

## Homepage identity

The first viewport centers the bold 惠远 name and bilingual subtitle. Both styles share the same geometry: the initial 50% divider falls between the two characters. The divider grip sits below the name. Content starts below the first viewport.

The left style, 繁而不乱 / Ornate, uses the approved three-layer SVG in `public/images/ornament-composition.svg` against a black-and-gold palette. Its ring rotates clockwise at 3°/s. Dragging follows the pointer angle; release velocity decays back to that speed with a 1.1-second time constant. Left/right arrow keys rotate the focused ring. Touch retains vertical page scrolling. Minimal presents the centered typography on a light background.

Scrolling through the first 70% of the viewport moves and scales the name into the fixed top-left brand. The ornament remains as a faint, rotating background. Scrolling back reverses the name movement. Reduced-motion preference presents a static ornament with direct manual rotation and a fading name transition; hidden tabs pause rotation.

`HeroIdentity.astro` coordinates the scroll geometry; `hero.css` shares it across the two preview layers; `ornament-motion.ts` owns dragging and inertia. Run `node --test scripts/ornament-motion.test.mjs` for signed-angle, inertia, frame-rate and release-pause checks.

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
- Published articles retain their complete Chinese and English body and original URLs. Two current formal articles are `/posts/agent-swarm/` and `/posts/langchain-end/`.
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
- **Remote backup:** `codex/ornament-hero` is the delivery branch; the task closeout reports its verified pushed revision.
- **Production — pending:** publication is a separate action. Cloudflare project settings and the live deployment revision require verification for a release.
- **Memory and evidence:** historical logs retain their dated context; current screenshots are retained in `/tmp/blog-motion-*.png`.

## Branch backup and publication

For each completed ticket or major change, reconcile project docs/rules using [neat-freak](https://github.com/KKKKhazix/khazix-skills/blob/main/neat-freak/SKILL.md), distinguish implementation/preview/remote/production state, and commit and push the reviewed project branch. This permission does not authorize force-push, branch deletion, automatic merge or production deployment.

Before any separately authorized release, recheck the remote base, apply only the reviewed changes, rebuild and run menu verification, confirm unchanged formal content and resume, then use the verified existing GitHub/Cloudflare publication path. Never publish an older checkout's build or invent a replacement pipeline. Keep the previous recoverable Git version and production rollback metadata. Retain worktrees and evidence until explicitly authorized to remove them.
