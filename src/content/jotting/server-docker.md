---
title: 服务器与 Docker 运维备忘
timestamp: 2026-08-15 17:12:36+08:00
tags: [Linux, 服务器, Docker, 运维]
description: 常用服务器检查、Docker Compose 更新、日志查看、容器管理、资源监控与故障排查命令。
---

这是一份面向日常维护的命令速查，示例服务以 AstrBot 和 NapCat 为主。执行更新或重建操作前，先进入包含 `compose.yaml` 或 `docker-compose.yml` 的目录。

## 连接与基础检查

```bash
ping 服务器IP                 # 检查网络是否可达；禁用 ICMP 时不一定有响应
ssh 用户名@服务器IP           # 登录服务器
uptime                        # 查看运行时间和系统负载
date                          # 确认服务器时间
ip -br addr                   # 简洁查看网卡和 IP 地址
ss -lntp                      # 查看正在监听的 TCP 端口
```

## 更新 Docker Compose 服务

```bash
cd /opt/astrbot
docker compose config         # 先检查 Compose 配置是否有效
docker compose pull           # 拉取最新镜像
docker compose up -d          # 按新配置重建有变化的服务
docker compose ps             # 确认容器状态
docker compose logs --tail=100
```

通常不必先执行 `down`。`docker compose up -d` 会重建镜像或配置发生变化的服务，停机时间更短。

- 只需重新启动现有容器：`docker compose restart`
- 修改了 Compose 文件、环境变量或镜像：`docker compose up -d`
- 需要彻底重建容器和默认网络：先 `docker compose down`，再 `docker compose up -d`

> `docker compose restart` 不会应用 Compose 配置变化，也不会使用刚拉取的新镜像。不要随意给 `down` 加 `-v`，否则可能删除 Compose 管理的命名卷及其中的数据。

## 容器、日志与交互

| 目的 | 命令 |
| --- | --- |
| 查看全部服务 | `docker compose ps` |
| 查看最近日志 | `docker compose logs --tail=100` |
| 持续查看 AstrBot 日志 | `docker compose logs -f --tail=100 astrbot` |
| 持续查看 NapCat 日志 | `docker compose logs -f --tail=100 napcat` |
| 重启 AstrBot | `docker compose restart astrbot` |
| 重启全部服务 | `docker compose restart` |
| 启动或更新整套服务 | `docker compose up -d` |
| 停止并移除容器和默认网络 | `docker compose down` |
| 进入 AstrBot 容器 | `docker compose exec astrbot sh` |
| 退出容器 | `exit` |

查看单个容器的详细状态：

```bash
docker inspect 容器名
docker logs --tail=100 容器名
docker exec -it 容器名 sh
```

## 系统与资源监控

```bash
free -h                       # 内存使用情况
df -h                         # 文件系统磁盘占用
du -sh /var/lib/docker        # Docker 数据目录大小
docker stats                  # 实时查看容器资源占用
docker system df              # 查看镜像、容器、卷和构建缓存占用
systemctl status docker       # Docker 服务状态
journalctl -u docker -n 100   # Docker 服务最近 100 行日志
```

## 常见排查顺序

1. `docker compose ps`：确认容器是否启动、是否反复重启。
2. `docker compose logs --tail=100 服务名`：查看应用报错。
3. `docker compose config`：检查合并后的 Compose 配置。
4. `ss -lntp`：检查主机端口是否监听。
5. `free -h`、`df -h`、`docker stats`：排除内存、磁盘和负载问题。
6. `systemctl status docker`：确认 Docker 服务本身是否正常。

如果容器持续重启，可以进一步查看退出码：

```bash
docker inspect --format '{{.State.Status}} exit={{.State.ExitCode}} error={{.State.Error}}' 容器名
```
