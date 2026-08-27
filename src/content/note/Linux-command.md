---
title: Linux 命令备忘录
timestamp: 2026-08-19 22:38:38+08:00
series: Linux
tags: [Linux, EndeavourOS, Arch Linux, Git, Shell]
description: 面向 EndeavourOS / Arch Linux 日常使用的命令备忘，涵盖文件、搜索、Git、软件包、历史记录与归档操作。
toc: true
---

## 基础命令
```bash
pwd  #查看自己现在的位置
ls -lah   #查看此目录下有什么文件, l表示长信息, a表示all显示所有文件, h显示文件大小
tree -a -L 2  #用树形结构查看两层目录, -a是all, -L 2的意思是只显示到第二层
mkdir -p backend/app # 创建目录, -p 会自动创建缺失的父目录
touch test # 新建名为test的文件
cp 原文件 新文件 # 复制文件
cp -r 原目录 新目录 # 复制目录。
mv "old folder" "new folder"  # 移动或重命名。带空格的文件名加引号
ls -la ~  # 查看所有文件
. # 表示当前目录
rm 文件名 # 删除文件    
rm -r 目录名 #删除目录, -r递归删除目录及里面所有文件
trash # 移动到回收站
grep "关键词" 文件名  # 在文件中查找文字。
grep -R "关键词" .  # 递归搜索当前项目
cat README.md tasks.json # 查看文件
type cd  # 判断命令类型
ss -ltnp | grep ':8000' # 查找进程
ps -o pid,ppid,stat,cmd -p 49153,49157 # 看清楚关系
kill 49153 # 杀死进程
kill -9 49153 # 强制杀死进程
```
## nano中
```bash
Ctrl+Shift+6  # 启动选择模式 

```

## find
```bash
## 基本使用 : 文件在哪里

# 一般使用
find . -name "*.py"  # 查找当前目录下的 Python 文件
find . -iname "readme.md"  # 查找当前目录下无论大小写的README文件
find . -name "*task*" # 查找名字里包含 task 的文件

# 加上类型
find . -type f -name "*.py" # -type f   普通文件
find . -type d -name "*cache*" # -type d   目录

# 加上时间
find . -type f -mtime -1 # 查找最近 1 天修改过的文件：
find . -type f -mmin -30 # 查找最近 30 分钟修改过的文件
```

## grep
```bash
## 搜索文本内容

# 一般使用
grep "FastAPI" backend/main.py # grep "要找的内容" 文件
grep -i "fastapi" backend/main.py # -i忽略大小写

# 显示行号
grep -n "FastAPI" backend/main.py # -n

# 递归搜索
grep -r "daily-reviews" .  # -r递归搜索 -rn 显示行号

## 更方便的 rg

rg "HTTPException"  # 在当前目录及所有子目录中，搜索包含 HTTPException 的代码行。
rg "daily-reviews" backend  # 只在 backend 目录里搜索 daily-reviews
rg -g "*.py" "BaseModel"  # 只在 .py 文件中搜索 BaseModel
```

## 项目命令

```bash
source .venv/bin/activate # 启动虚拟py环境, 原理是修改PATH
deactivate # 退出环境
```

## GIT命令

```bash
git diff # 显示改变的地方
空格       下一页
b          上一页
↑ / ↓      上下滚动
/关键词     搜索
n          下一个搜索结果
q          退出

git diff --stat # 更简洁的展现

git rm --cached 文件名 #想让一个已经跟踪的文件以后真正不再跟踪
--cached # 表示只从 Git 的暂存区和跟踪记录中删除，保留你硬盘上的实际文件。

\   # 在命令行最后加上反斜杠表示命令还没结束
    # 其中单引号时候命令行未结束可以直接 Enter 换行
    # \ 必须是行尾最后一个字符，后面不能有空格

code -m Temp # 打开vscode并打开Temp
```

## 下载安装命令

```bash
# 下载
yay -Ss qq  #查找
yay -S linuxqq #下载 

# 查找
pacman -Qs 关键词  # 确定包名
pacman -Qi 包名  # 看包信息,  比如版本, 依赖, 安装原因, 被依赖

# 删除
yay -R 包名  # 删除包
yay -Rs 包名  # 删除包和依赖
yay -Rns 包名 # 删除包和依赖和配置文件

# 清除内存
pacman -Qdt # 查询孤儿包
sudo pacman -Rns $(pacman -Qdtq) # 删除孤儿包

```

## tldr命令

```bash
tldr + 命令 # 查询用法

tldr --update # --update：更新本地命令说明书(缓存), 缓存：把说明书存在电脑里，查询更快且可离线使用

tldr -L zh git  # 指定中文输出结果
```

## history 命令

```bash
history  # 直接显示历史命令

history | tail -n 30  # 显示最近 30 条命令行

# |：管道, 它会把左边命令的标准输出，作为右边命令的标准输入：, history用于列数据, tail用于处理
# tail    显示末尾内容
# -n      指定行数
# 30      显示 30 行

!20  # 重新执行命令编号20的

history | grep git  # 包含 git 的命令行
```

## python命令

```bash
python 文件.py          运行文件
python -m 模块名        运行 Python 模块
python -m pip ...       管理当前 Python 的依赖

python -m pip install -r requirements.txt # 安装依赖文件中的全部库
```

## tar命令

c 创建
x 解压
t 查看
z gzip
f 文件名

```bash
tar -czf /目标目录/压缩包名.tar.gz 要压缩的文件或目录
tar -czf project.tar.gz project/ # f后面接文件名 在后面接文件
tar -tzf project.tar.gz  # 解压到当下目录
tar -xzf project.tar.gz
tar -xzf project.tar.gz -C extracted/  # -C, 解压到指定目录
```

## 检查更新完是否需要重启命令
```bash
uname -r
ls /usr/lib/modules/
```
