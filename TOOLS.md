# TOOLS.md — Blog Workspace

## 从公用工具库继承

> 通用工具和认证见 `~/.huiyuanclaw/TOOLS.md`。

## 核心写作工具

### three-minds（博文专属写作流程）

**这是 blog workspace 的主写作工具，其他 workspace 不使用。**

```bash
npm run three-minds -- "基于 resources/ 中的素材，写一篇关于 [主题] 的博客文章"
```

三个 agent 顺序执行：
1. **思想者** — 挖掘深度，找到核心洞见
2. **叙事者** — 打磨表达、节奏与意象
3. **去味师** — 去除 AI 腔，注入惠远的个人声音

配置文件：`resources/three-minds/three-minds/configs/blog-writing.json`
写作风格定义：`resources/writing-style/`

也可通过 Claude Code skill 触发（说"帮我写篇文章"即可）。

## 开发工具

| 命令 | 用途 |
|------|------|
| `npm run dev` | 启动开发服务器 localhost:4321 |
| `npm run build` | 构建静态站点到 ./dist/ |
| `npm run preview` | 本地预览 dist 构建产物 |

## 内容路径

| 路径 | 内容 |
|------|------|
| `src/content/posts/` | 博客文章（双语 Markdown） |
| `src/content/diary/` | 日记文件 |
| `resources/writing-style/` | 惠远的声音定义与示例文本 |
| `resources/` | 博文素材 |

## 部署

- **平台：** Cloudflare Pages
- **仓库：** GitHub `huiyuanXP/blog`
- **域名：** huiyuanxp.com
- **触发：** 2026-10-11 已确认 main 推送触发既有 blog 项目的 Cloudflare Pages 构建，并更新 huiyuanxp.com。当前部署证据与发布状态见 README.md。

## 工具查找协议

1. 先查本文件
2. 再查 `~/.huiyuanclaw/TOOLS.md`
3. 都没有 → 告诉惠远，请他帮忙找或安装

## 文档收尾

每票或重大改动按 [neat-freak 文本指令](https://github.com/KKKKhazix/khazix-skills/blob/main/neat-freak/SKILL.md) 同步文档与规则；本项目不依赖已安装的同名脚本。状态与验证命令见 README.md，提交和分支推送权限边界见 AGENTS.md。
