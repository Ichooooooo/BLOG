---
title: 服务器与 Docker 运维备忘
timestamp: 2026-08-15 17:12:36+08:00
series: Linux
tags: [Linux, 服务器, Docker, 运维]
description: 常用服务器检查、Docker Compose 更新、日志查看、容器管理与资源监控命令。
toc: true
---

```bash
ping 服务器IP  # 检查服务器是否好
```

## 更新docker
```bash
docker compose pull
docker compose down
docker compose up -d
```
**restart和up/down区别**
改 AstrBot 内部配置
→ restart

改 docker-compose.yml
→ down / up 或 up -d

## 常用命令
| 想干什么         | 命令                                          |
| ------------ | ------------------------------------------- |
| 我在哪          | `pwd`                                       |
| 看文件          | `ls -lah`                                   |
| 进入目录         | `cd /opt/astrbot`                           |
| 看文件          | `cat 文件名`                                   |
| 编辑文件         | `nano 文件名`                                  |
| 看容器          | `docker compose ps`                         |
| 看 AstrBot 日志 | `docker compose logs -f --tail=100 astrbot` |
| 看 NapCat 日志  | `docker compose logs -f --tail=100 napcat`  |
| 重启 AstrBot   | `docker compose restart astrbot`            |
| 重启全部         | `docker compose restart`                    |
| 启动整套         | `docker compose up -d`                      |
| 停止整套         | `docker compose down`                       |
| 进入 AstrBot   | `docker compose exec astrbot sh`            |
| 退出容器         | `exit`                                      |
| 看端口          | `ss -lntp`                                  |
| 看内存          | `free -h`                                   |
| 看硬盘          | `df -h`                                     |
| 看容器资源        | `docker stats`                              |
| 看 Docker 状态  | `systemctl status docker`                   |


