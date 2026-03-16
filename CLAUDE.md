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

**Content:** Blog posts live in `src/content/posts/*.md`. Each post contains both languages — frontmatter has dual fields (`title`/`titleEn`, `description`/`descriptionEn`) and the body uses `<div data-lang="zh">` / `<div data-lang="en">` sections. Content collection schema is defined in `src/content.config.ts` using Astro's glob loader.

**UI translations:** Static UI strings (nav, footer, labels) are in `src/i18n/translations.ts`. Both language variants are rendered at build time; JS only toggles the CSS class.

**Layouts:** `BaseLayout.astro` wraps all pages (loads fonts, header, footer). `PostLayout.astro` extends it for article pages with back-link, date, tags, and dual-language title.

## Content Workflow

The owner communicates in Chinese. The writing process has two stages:

**Stage 1 — Three Minds (Chinese draft):**
```bash
npm run three-minds -- "基于 resources/ 中的素材，写一篇关于 [主题] 的博客文章"
```
This runs three AI agents sequentially on the same workspace:
1. 思想者 — digs for depth, finds the core insight
2. 叙事者 — polishes expression, rhythm, and imagery
3. 去味师 — removes AI-sounding patterns, injects the owner's personal voice

All three agents read `resources/writing-style/` to match the owner's tone. Output is a Chinese draft.

**Stage 2 — Translation & publishing:** Claude translates the final Chinese draft to English, formats both into the bilingual markdown structure (`<div data-lang="zh/en">`), and places it in `src/content/posts/`.

**Key paths:**
- `resources/writing-style/` — owner's voice definition and sample texts
- `resources/` — raw materials for blog posts
- `scripts/three-minds.sh` — wrapper script
- `resources/three-minds/three-minds/configs/blog-writing.json` — agent personas

## Deployment

Cloudflare Pages connected to GitHub repo `huiyuanXP/blog`. Every push to `main` triggers auto-build. Domain: `huiyuanxp.com`.
