---
title: Git 命令备忘录
timestamp: 2026-09-23 22:16:08+08:00
tags: [Git, GitHub, Shell]
description: Git 仓库初始化、分支协作、变基同步与 Pull Request 流程的常用命令备忘。
---

## 建立仓库

```bash
git init
git add .
git commit -m "Initial commit"

git branch -M main  # 重命分支名为main
git remote add origin git@github.com:xxx/my-project.git

git push -u origin main
```

## git协作

### 基础命令

```bash
# 创建分支并提交
git switch -c feature/room-generator  # 创建并切换分支
git add .
git commit -m "implement room generation"
git push -u origin feature/room-generator  # 创建分支后第一次提交

# 分支合并到主分支
git switch main  # 切换到主分支
git pull
git merge feature/room-generator
git push

# 合并分支后删除分支
git branch -d feature/room-generator
git push origin --delete feature/room-generator

# 没有pull导致push报错
git pull --rebase origin main
git add .
git rebase --continue
git push

# 在分支获取主分支最新进度
git fetch origin
git rebase origin/main
```

### 提交PR

1. 流程：在分支提交commit --> 提交PR --> 本地同步main --> 删除分支

2. 过程

```bash
# ===== PR =====
# 去 GitHub：
# Pull requests → New pull request
#
# base:    main
# compare: feature/room-generator
#
# Create pull request
# → 队友 review
# → 队友 Approve
# → 在 GitHub 上 Merge / Squash and merge

# PR 合并完成后，本地同步 main
git switch main
git pull
```
