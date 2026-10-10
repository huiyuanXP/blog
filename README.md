# Personal blog

An Astro 5 static site with Chinese/English writing, two reading styles and an existing Cloudflare-hosted public site at https://huiyuanxp.com/. This VM is a development environment, not the production web server.

## Reading and navigation

The top Articles/文章 dropdown lists published posts from the shared content collection, newest first, with bilingual titles and their original `/posts/<slug>/` URLs. Hover opens a temporary menu; clicking the trigger pins it open. Clicking again, clicking outside or pressing Escape closes and unpins it. An unpinned menu closes when the pointer leaves the trigger and menu area. Enter/Space, ArrowDown and touch provide alternatives to hover; Escape returns focus to the trigger.

Article-page return links still lead to `/#blog`. The homepage article area, PDF resume, current site name, language preference and left/right style-selection behavior are unchanged by this menu update.

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

## Verified status and remaining work — 2026-10-10

| Fact surface | State | Evidence / limitation |
| --- | --- | --- |
| Menu code | changed-and-verified | Shared published-article source; no content or style-selector changes. |
| Exact-version private preview | changed-and-verified | Build and 162 Chromium assertions passed; desktop/mobile screenshots reviewed. |
| Public production menu | pending | This menu has not been deployed or verified at the canonical public URL. |
| Docs and rules | changed-and-verified | Menu contract, schema notes, commands and publication boundaries reconciled with code using neat-freak's text workflow. |
| Agent memory | out-of-scope | No global or generated memory written. Historical project logs remain historical. |
| Workspaces / evidence | pending | Review worktrees, private previews, patches and evidence retained; no cleanup authorization assumed. |

The review started from GitHub `main` commit `788722a69202502ef7fd833b827351b413614004`. That baseline's generated homepage main HTML and resource names matched the public homepage, and its resume PDF hash matched the public PDF. This is content equivalence evidence, not a confirmed Cloudflare deployment commit. The old VM checkout was behind remote main and must not be used as a deployment source.

Cloudflare's exact Pages project, domain association, production branch, build settings and current deployment commit remain unverified: the existing noninteractive CLI lacks usable authorization, and GitHub commit status returned no records. Existing documents describe a main-triggered build, but production settings must be checked through an already authorized account before release.

## Branch backup and publication

For each completed ticket or major change, reconcile project docs/rules using [neat-freak](https://github.com/KKKKhazix/khazix-skills/blob/main/neat-freak/SKILL.md), distinguish implementation/preview/remote/production state, and commit and push the reviewed project branch. This permission does not authorize force-push, branch deletion, automatic merge or production deployment.

Before any separately authorized release, recheck the remote base, apply only the reviewed changes, rebuild and run menu verification, confirm unchanged formal content and resume, then use the verified existing GitHub/Cloudflare publication path. Never publish an older checkout's build or invent a replacement pipeline. Keep the previous recoverable Git version and production rollback metadata. Retain worktrees and evidence until explicitly authorized to remove them.
