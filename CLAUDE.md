@AGENTS.md

# CLAUDE.md — Technical Reference

> Agent 启动协议见 AGENTS.md（已自动加载）。以下为技术文档，供开发参考。

## Commands

- `npm run dev` — Start dev server at localhost:4321
- `npm run build` — Build static site to `./dist/`
- `npm run preview` — Preview production build locally

## Architecture

Bilingual (zh/en) personal blog built with Astro v5, deployed as a static site on Cloudflare Pages.

**Bilingual system:** Single-page approach using `data-lang="zh"` / `data-lang="en"` attributes on elements. A CSS class (`lang-en`) on `<html>` toggles visibility. Language preference is stored in `localStorage`. No separate routes per language.

**Content:** Published and planned posts live in `src/content/posts/*.md`. Published posts contain both languages — frontmatter has dual fields (`title`/`titleEn`, `description`/`descriptionEn`) and the body uses `<div data-lang="zh">` / `<div data-lang="en">` sections. Content collection schema is defined in `src/content.config.ts` using Astro's glob loader. Planned entries use `placeholder: true`, bilingual titles and grouping metadata, without publication dates, summaries or body. Private diary files are excluded from content loading.

**UI translations:** Components render both language variants at build time; JS toggles the CSS class. `src/i18n/translations.ts` is a retained legacy dictionary, currently not imported by UI components; verify consumers before editing it. The article menu reads titles from the post collection.

**Layouts:** `BaseLayout.astro` wraps all pages (loads fonts, header, footer). `PostLayout.astro` extends it for article pages with back-link, date, tags, and dual-language title.

## Content Workflow

The owner communicates in Chinese. The writing process has two stages:

**Stage 1 — Three Minds (Chinese draft):** Follow `TOOLS.md` for the sequential thinker, narrator and voice-editor workflow, using native agents or the configured external CLI. Source material and intermediate drafts live in `resources/<article-topic>/`.

**Stage 2 — Translation & publishing:** Claude translates the final Chinese draft to English, formats both into the bilingual markdown structure (`<div data-lang="zh/en">`), and places it in `src/content/posts/`.

**Key paths:**
- `resources/writing-style/` — voice references when available; published posts provide the fallback style samples
- `resources/` — raw materials for blog posts
- `scripts/three-minds.sh` — wrapper script
- `TOOLS.md` — three-role writing workflow and external CLI configuration

## Deployment

See README.md for current verification and publication boundaries. The existing site is served through Cloudflare at `huiyuanxp.com`; exact Pages project, production branch, build configuration and deployment commit have not been independently verified. A review-branch push does not mean the change is merged, deployed or live verified.
