# AGENTS.md — Blog Workspace

## 委派与项目收尾

新 chat/thread/session 启动时使用 sub-agent 拆分独立工作，并下传此契约。启动前核验可用性，spawn 明确指定 model/reasoning：简单短程 `gpt-6.1-sol / low`；简单长程 `gpt-6-luna / xhigh`；其他简单任务 `gpt-6-luna / high` 或 `xhigh`；复杂任务 `gpt-6.1-sol / high`。不可用则报告，不静默替换；每个子任务明确边界、验收和证据，避免覆盖他人工作。

每票完成或重大改动先按 [neat-freak](https://github.com/KKKKhazix/khazix-skills/blob/main/neat-freak/SKILL.md) 对齐文档、规则和实际状态，再 commit/push 对应项目分支并验证远端可恢复版本。现有分支推送授权不包含 force-push、删除分支、自动合并或公开生产部署。风险验证使用独立 worktree、端口及数据；worktree 不隔离系统或数据库。记忆默认只读，未确认不删除工作区或证据。

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

### 交互引导

“行不言之教”：优先用动画、位置变化和控件反馈引导用户。能够直接表达操作关系时，页面保持简洁，不增加说明文字；保留必要的按钮名称和无障碍标签。风格吸附完成后，手柄变形并归入 Style 按钮，提示可再次选择。

全站采用 Apple Design 的交互逻辑：实时反馈、可打断的缓动、克制的悬停高光与随指针移动的阴影。共享布局覆盖首页和文章页，并照顾键盘、触屏与减少动态效果偏好。

### Blog 入口

顶部文章菜单从公开文章集合读取双语标题与原 URL，排除待写条目。悬停临时展开；点击固定，再次点击、外部点击或 Escape 关闭并解除固定；未固定时离开触发器和菜单区域关闭。键盘与触屏均可操作，aria 状态与展开同步。文章页返回入口仍指向首页 `/#blog`。Blog 分为按日期倒序的文章列表和精选文章两栏；待写文章放在正式文章后面，显示「待写」状态且不附阅读链接。精选由 Markdown 的 `featured: true` 指定，展开、选中与悬停反馈共用全站交互。

### 文章页面与占位约束

- 每篇文章及首页的文章占位入口都对应 `src/content/posts/<slug>.md`，由统一路由生成独立的 `/posts/<slug>/` 页面。
- 标题、描述、正文和占位状态以该 Markdown 为唯一来源；首页读取对应文件的 metadata，两个风格共用内容。
- 尚无正文时创建仅有 frontmatter 的待写 Markdown，设置 `placeholder: true`；记录原始中文标题、英文标题、序号、暂定主题与交叉引用，不写正文、摘要或日期。页面显示「待写」，首页不附阅读全文链接。正式成稿后设为 `false` 并补充实际发布日期、已确认摘要与正文。
- 待写记录由 `topic` 暂定归属到六个栏目，`topicConfirmed: false` 表示尚未由用户确认；栏目顺序以 `src/data/topics.ts` 为准。`order` 保留原清单的独立序号，`toolkit: codex` 表示已明确的 Toolkit 交叉引用。各位置读取同一 Markdown 记录。
- 待写页仅展示标题与状态；正式博文仍按上述 three-minds 流程产出。
- 处理写作清单或未定稿副标题时，读取 `WRITING-BACKLOG.md`。其中六个 Agent 副标题已经按用户要求在下一次互动询问，当前等待归属答复；未确认前不挂到任何文章下。

### 双语格式规范（正式文章）

```markdown
---
title: 中文标题
titleEn: English Title
description: 中文摘要
descriptionEn: English summary
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

> 当前功能、运行方法、生产部署证据与发布状态以 README.md 为准。
