# TOOLS.md — Blog Workspace

## 从公用工具库继承

> 通用工具和认证见 `~/.huiyuanclaw/TOOLS.md`。

## 核心写作工具

### three-minds（博文专属写作流程）

three-minds 按思想者、叙事者、去味师顺序产出中文稿，再翻译为英文。

本地原生 Agent 路径：先把事实素材放入 `resources/<文章主题>/`；依次运行三个角色，分别保存 `01-thinking.md`、`02-narrative.md`、`03-polished.md`。每个角色读取上一阶段产物；主 Agent 核对中文成稿后整理英文版与正式文章。写作语气优先参考 `resources/writing-style/`，该目录待提供时参考 `src/content/posts/` 中已发表文章。

外部 CLI 路径：运行环境包含 `dist/index.js` 和 `configs/blog-writing.json` 后执行：

```sh
THREE_MINDS_ROOT=/absolute/path/to/three-minds pnpm three-minds -- "基于 resources/ 中的素材撰写中文稿"
```

`THREE_MINDS_ROOT` 默认指向本项目 `resources/three-minds/three-minds`。角色执行次序与产物契约在两种路径中一致。

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
