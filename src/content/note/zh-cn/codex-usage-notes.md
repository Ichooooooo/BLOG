---
title: Codex 使用与权限配置笔记
timestamp: 2026-07-24 19:58:10+08:00
tags: [Codex, CLI, 开发工具]
description: Codex 权限配置、项目指令以及常用 CLI 会话命令的个人备忘。
toc: true
---

## 管理Codex权限

1. 修改 ~/.codex/config.toml 配置文件
例如 : 

```bash
default_permissions = "dashboard-safe"  # 声明写在最上面

[permissions.dashboard-safe]
description = "Allow normal project development but deny secrets"
extends = ":workspace" #表示继续保留正常的工作区读写能力

[permissions.dashboard-safe.filesystem.":workspace_roots"]
".env" = "deny"
".env.local" = "deny"
".env.development" = "deny"
".env.production" = "deny"
"secrets" = "deny"
"*.pem" = "deny"
"*.key" = "deny"
```

然后再权限管理里面选择**自定义 / Custom (config.toml)**

2. 在项目里加入 AGENTS.md 文件作为行为指令

## CLI终端命令

| 命令                           | 用途                                                              |
| ---------------------------- | --------------------------------------------------------------- |
| `codex`                      | 在**当前目录**启动一个新的 Codex CLI 会话。通常先 `cd` 到项目根目录再执行。                |
| `codex resume`               | 恢复之前保存的会话，继续原来的上下文和任务；默认会优先显示当前项目相关会话。                          |
| `codex review --uncommitted` | 不进入普通聊天，直接审查当前 Git 仓库中**已暂存、未暂存和未跟踪**的改动，主要找 bug、风险和遗漏，不主动修改代码。 |


| 命令             | 用途                                         |
| -------------- | ------------------------------------------ |
| `/status`      | 查看当前会话状态，例如模型、上下文使用、速率限制等。                 |
| `/permissions` | 查看或切换文件、命令和网络访问权限；你这里通常选 `dashboard-safe`。 |
| `/plan`        | 开关规划模式。适合多文件修改：先调查并列方案，再开始动代码。             |
| `/diff`        | 查看当前 Git 改动，包括 staged、unstaged 和未跟踪文件。     |
| `/review`      | 进入代码审查模式，可审查未提交改动、某次提交或相对某个分支的差异。          |
| `/exit`        | 退出 Codex CLI；和 `/quit` 作用相同，不会自动提交代码。      |


codex
→ /status
→ /plan
→ 让它分析或修改
→ /diff
→ /review
→ /exit
→ 自己运行测试和 git commit
