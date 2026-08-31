---
title: Codex 配置、约束与批量任务工作流
timestamp: 2026-08-31 15:22:11+08:00
series: AI
tags: [Codex, Agent]
description: 记录通过权限配置、AGENTS.md、任务目录、脚本与 Git 审查，把 Codex 组织成可重复、可检查的工程工作流。
toc: true
---

前段时间尝试批量生产小项目的时候, 原汤化原食发现一套优美的Codex工作流配置。

把全局权限放在 `config.toml`，把项目里的长期规则写进 `AGENTS.md`，再通过配置文件、参考资料和脚本组织具体任务。经过这样的拆分，Codex 的工作过程变得更清楚，也更容易检查和复用。

## 权限配置

Codex 的用户级配置放在：

```text
~/.codex/config.toml
```

我比较在意的一点是：Codex 可以正常读写项目，但不应该随意接触环境变量、密钥之类的文件。

所以我给项目开发准备过一套自定义权限，大致如下：

```toml
default_permissions = "dashboard-safe"

[permissions.dashboard-safe]
description = "Allow normal project development but deny secrets"
extends = ":workspace"

[permissions.dashboard-safe.filesystem.":workspace_roots"]
".env" = "deny"
".env.local" = "deny"
".env.development" = "deny"
".env.production" = "deny"
"secrets" = "deny"
"*.pem" = "deny"
"*.key" = "deny"
```

思路很简单：工作区里的普通代码照常读写，但明显属于敏感信息的文件直接禁止访问。配置完成后，再在 Codex 的权限管理里选择对应的自定义配置。

这类限制不只是为了防止误操作。实际使用 Agent 时，权限边界越清楚，后续维护越省心。否则项目一大，就很难保证它每次只接触“应该接触”的内容。

## AGENTS.md：把长期规则留在项目里

除了权限，我现在几乎都会在项目根目录放一个：

```text
AGENTS.md
```

以前每开一个新会话，我可能都会重新告诉 Codex：

- 这个项目使用什么技术栈；
- 哪些目录不要修改；
- 应该运行哪些测试；
- 输出文件放在哪里；
- 完成任务后需要检查什么。

这些内容本身并不会频繁变化，所以没必要在每次会话中重复说明。更合适的做法，是把项目目标、目录结构、技术栈、修改范围、构建与测试命令，以及交付前的检查项统一写进 `AGENTS.md`。

这样以后进入项目并启动 Codex，项目本身就已经附带了一份工作说明。

我习惯把两类配置分开看：

```text
~/.codex/config.toml
```

它主要解决 Codex 在系统和工作区里“能做什么”。

而：

```text
AGENTS.md
```

解决的是它进入这个项目之后“应该怎么做”。

两者结合起来，基本就构成了最基础的一层约束。

## 一套批量任务目录

最近处理批量课设时，我使用的目录大致如下：

```text
数据库课设/
│
├── .agents/
├── .codex/
├── .git/
│
├── artifacts/
├── configs/
├── outputs/
├── reference/
├── shared/
├── tools/
│
├── AGENTS.md
├── batch_registry.json
└── 使用说明.md
```

这里需要区分一点：`AGENTS.md`、Codex CLI 和用户级配置属于 Codex 的使用方式；`configs/`、`artifacts/`、`reference/` 等目录，则是我自己为项目设计的组织结构，并不是 Codex 官方要求的固定目录。

不过这套结构用起来比较顺手，因为批量任务真正麻烦的地方不是“生成一份代码”，而是如何让几十个相似任务保持一致，又不互相污染。

## 把规则、资料和任务参数分开

在这套目录中，我设置了：

```text
reference/
shared/
configs/
```

它们分别解决三个不同的问题。

`reference/` 用来存放参考资料，例如课程要求、数据库设计规范、示例报告和格式要求，Codex 需要时再查阅。

`shared/` 用来存放多个任务都会使用的内容，例如公共模板、统一说明、固定脚本或公共资源。

`configs/` 则只保存每个任务真正不同的部分。

例如，同样是批量制作小项目，整体要求保持不变，但题目可能不同：

```text
configs/
├── library_system.json
├── course_selection.json
└── warehouse_system.json
```

这样就不需要每次重新写：

```text
帮我做一个图书管理系统
帮我做一个选课系统
帮我做一个仓库管理系统
```

更合理的方式是固定执行流程，只替换任务配置：

```text
读取项目规则
→ 读取当前任务配置
→ 必要时查阅参考资料
→ 开始生成
→ 检查
→ 输出
```

这一点对批量任务很重要。规则和任务参数混在一起时，每一轮 prompt 都会越来越长，而且很容易把某个任务的要求带到另一个任务里。拆开之后，流程反而更稳定。

## 能写成脚本的，就不要让 Agent 每次现想

项目里我还会单独放一个：

```text
tools/
```

这里适合放一些确定性很强的操作，例如：

```text
tools/
├── validate_schema.py
├── build_project.py
├── check_output.py
└── collect_result.py
```

像文件检查、目录生成、SQL 初始化、编译、测试和格式校验，如果脚本已经能稳定完成，就没有必要每次都让 Codex 临场写一遍。

Codex 更适合负责：

```text
判断下一步做什么
分析错误
修改代码
处理例外情况
```

脚本则负责那些重复、确定、可验证的步骤。这样做的好处是，无论任务运行十次还是一百次，检查标准基本不会漂移。

如果所有步骤都交给模型自由发挥，单次执行看起来很灵活，但批量运行时很容易出现“这一份检查了，下一份却忘了”的情况。把确定性流程固化成脚本，才能让 Agent 把精力放在真正需要判断的部分。

## artifacts 和 outputs 分开

批量生成过程中会产生不少临时内容，例如：

- 调试文件；
- 中间 SQL；
- 检查报告；
- 日志；
- 临时导出结果。

这些内容如果和最终作业混在一起，目录很快就会变得难以整理。

因此，我把它们分成两类：

```text
artifacts/
```

用于存放执行过程中的中间产物。

```text
outputs/
```

只存放最后真正需要提交、交付或归档的结果。

例如：

```text
artifacts/
├── temp_sql/
├── reports/
└── validation_logs/

outputs/
├── 001_图书管理系统/
├── 002_选课系统/
└── 003_仓库管理系统/
```

这样在最终检查时，就不需要从一堆临时文件里判断哪个才是交付版本。

## 用 batch_registry.json 记录批次状态

一次只有一两个任务时，是否记录状态差别不大。但如果同时处理很多任务，很快就会遇到几个问题：

```text
这个做完了吗？
那个失败在哪一步？
这个输出在哪里？
刚才运行的是第几份？
```

所以项目里还会有一个：

```text
batch_registry.json
```

它更像一个简单的批次登记表，例如：

```json
{
  "task_id": "001",
  "status": "completed",
  "config": "configs/001.json",
  "output": "outputs/001/",
  "last_error": null
}
```

这里我会把“任务配置”和“任务状态”分开：`configs/` 负责说明这份任务应该做什么，`batch_registry.json` 负责记录它当前进行到哪里。

这样即使中途退出 Codex，之后恢复任务时也不需要完全依赖会话记忆。

## Git 还是最后一道保险

我不会因为 Codex 说“已经完成”，就直接认为任务结束。

项目本身放在 Git 中，所以修改完成后，我至少会查看：

```text
/diff
```

或者：

```bash
git status
git diff
```

复杂一些的修改还会运行：

```text
/review
```

如果想直接审查当前所有未提交改动，也可以使用：

```bash
codex review --uncommitted
```

这一层很重要，因为 Agent 修改代码的速度很快，但速度快并不意味着每次修改范围都完全正确。Git 的作用，就是把实际变化摊开来给人检查。

我比较习惯的工作方式是：

```text
Codex 修改
→ 测试
→ 查看 diff
→ review
→ 人工确认
→ git commit
```

而不是让 Agent 从修改一路自动执行到提交。

## 常用的 Codex CLI 命令

启动一个新的 Codex 会话：

```bash
codex
```

一般我会先 `cd` 到项目根目录，再启动 Codex。

恢复之前的会话：

```bash
codex resume
```

这个命令在长任务中很好用，尤其适合继续未完成的批次，或者在中途退出后恢复工作。

直接审查当前未提交改动：

```bash
codex review --uncommitted
```

会话中常用的命令包括：

| 命令 | 用途 |
| --- | --- |
| `/status` | 查看当前会话状态 |
| `/permissions` | 查看或切换权限 |
| `/plan` | 复杂任务开始前先梳理步骤 |
| `/diff` | 查看当前 Git 改动 |
| `/review` | 审查代码修改 |
| `/exit` | 退出当前 Codex CLI 会话 |

平时处理普通项目，我的流程基本是：

```text
cd 项目目录
→ codex
→ /status
→ /plan
→ 开始修改
→ 运行测试
→ /diff
→ /review
→ /exit
→ 确认后 git commit
```

批量任务则会多几层：

```text
确认 AGENTS.md
→ 选择 configs/ 中的任务
→ 启动 Codex
→ /plan
→ 执行当前批次
→ 查看 artifacts/
→ 运行 tools/ 中的检查脚本
→ /diff
→ /review
→ 确认 outputs/
→ 更新 batch_registry.json
→ 继续下一份
```

## 小结

现在回头看，这套目录和配置最有用的地方，并不是让 Codex “更聪明”，而是减少不确定性。

权限放在 `config.toml`，项目规则写进 `AGENTS.md`，不同任务放进 `configs/`，资料和公共资源分开保存，再用脚本负责重复检查，最后通过 Git 审查实际修改。

这样即使任务数量增加，整个工作流也不会完全依赖某一次会话中的 prompt。

对于一次性的代码修改，当然没有必要设计这么多目录。但如果 Codex 要在一个项目里反复工作，或者需要连续处理很多相似任务，这种组织方式会比不断堆叠 prompt 稳定得多。
