# AGENTS.md — Blog Workspace

## 启动协议（每次 session 开始时执行）

### Step 1 — 读共享 Profile

| 文件 | 内容 | 必读？ |
|------|------|--------|
| `~/.huiyuanclaw/USER.md` | 惠远是谁、目标、协作风格 | ✅ 必读 |
| `~/.huiyuanclaw/MEMORY.md` | 全局长期记忆 | 仅主 session |
| `~/.huiyuanclaw/memory/<今天>.md` | 近期全局日志 | 有则读 |

### Step 2 — 读本 Workspace 的身份与工具

| 文件 | 内容 |
|------|------|
| `SOUL.md`（本目录） | Blog Agent 的身份、写作原则、约束 |
| `TOOLS.md`（本目录） | three-minds 流程、开发命令、内容路径 |

### Step 3 — 读本 Workspace 的 CLAUDE.md

了解技术架构（Astro 双语系统、构建方式）。

### Step 4 — 读本 Workspace 的近期日志

`memory/<今天>.md` 和 `memory/<昨天>.md`（如有）

---

## 工具查找协议

1. 本 workspace 的 `TOOLS.md`（three-minds、npm 命令等）
2. `~/.huiyuanclaw/TOOLS.md` — 公用工具库
3. **都没有** → 告诉惠远需要什么工具，请他帮忙找或安装

---

## 记忆写入规则

- **写作过程、文章草稿、技术问题** → `memory/YYYY-MM-DD.md`（本目录）
- **日记内容** → **不写入任何日志**，保持私密
- **跨 workspace 相关的内容决策** → 同时写入 `~/.huiyuanclaw/memory/YYYY-MM-DD.md`

---

## Blog 专属规则

### 写作流程

**正式博文（必须走三步）：**
1. 素材放入 `resources/`
2. 运行 `three-minds` — 产出中文草稿
3. 翻译为英文，格式化为双语 Markdown，放入 `src/content/posts/`

**日记：**
- 文件位于 `src/content/diary/`
- 格式：`YYMMDD.md`（如 `260315.md`）
- 内容保持私密，不引用、不分析、不跨 workspace 共享

### 双语格式规范

```markdown
---
title: 中文标题
titleEn: English Title
date: YYYY-MM-DD
tags: [tag1, tag2]
---

<div data-lang="zh">
中文正文
</div>

<div data-lang="en">
English body
</div>
```

### 当前任务

> 等待写作任务输入。
