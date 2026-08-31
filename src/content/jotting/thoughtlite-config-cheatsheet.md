---
title: ThoughtLite 博客配置速查
timestamp: 2026-08-31 14:55:25+08:00
tags: [ThoughtLite, Astro, 博客配置]
description: ThoughtLite 博客常用目录、配置入口和文章字段速查，按当前单语言站点结构整理。
---

## 目录树

当前博客使用单语言模式，因此文章和站点信息直接放在各自栏目目录下，不再保留 `zh-cn/` 这一层。

```text
博客根目录/
│
├── site.config.ts                  # 站点基础配置
├── astro.config.ts                 # Astro、域名、字体、插件配置
│
├── public/                         # favicon、友链头像、静态资源
│
└── src/
    ├── content/                    # 博客内容
    │   ├── note/                   # 文记（正式文章）
    │   ├── jotting/                # 随笔
    │   ├── preface/                # 首页序文
    │   └── information/
    │       ├── introduction.md     # 自述
    │       ├── linkroll.mdx        # 友链数据
    │       ├── chronicle.yaml      # 时间线
    │       └── policy.md           # 网站政策
    │
    ├── components/                 # UI 组件
    │   └── Linkroll.astro          # 友链样式与排列
    │
    ├── pages/                      # 页面结构
    │   └── [...locale]/
    │       ├── index.astro         # 首页
    │       └── about.astro         # 关于页
    │
    ├── layouts/                    # 全站布局
    │   ├── App.astro
    │   ├── Base.astro
    │   ├── Footer.astro
    │   └── header/
    │
    ├── styles/                     # 全站样式
    │   ├── global.css
    │   └── markdown.css
    │
    ├── icons/
    │   └── site-logo.svg           # 首页 Logo
    │
    ├── i18n/                       # 界面文本
    └── content.config.ts           # 内容字段规则
```

常用定位：

```text
站点名称 / 作者 / 时区         → site.config.ts
文记（正式文章）               → src/content/note/
随笔                           → src/content/jotting/
友链数据                       → src/content/information/linkroll.mdx
友链样式                       → src/components/Linkroll.astro
关于页整体布局                 → src/pages/[...locale]/about.astro
全站颜色 / 字体 / 字号        → src/styles/global.css
Markdown 正文样式             → src/styles/markdown.css
favicon / 静态图片            → public/
首页 Logo                      → src/icons/site-logo.svg
```

## 文记的前置配置

文记放在：

```text
src/content/note/
```

文件开头可使用：

```yaml
---
title: 文章标题
timestamp: 2026-08-31 12:00:00+08:00
series: 系列名称
tags: [Astro, Blog]
description: 文章简介
sensitive: false
toc: true
top: 0
draft: false
---
```

| 字段 | 是否必填 | 作用 |
| --- | --- | --- |
| `title` | 是 | 文章标题 |
| `timestamp` | 是 | 发布时间 |
| `series` | 否 | 所属系列 |
| `tags` | 否 | 标签列表 |
| `description` | 否 | 文章简介或摘要 |
| `sensitive` | 否 | 是否标记为敏感内容，默认 `false` |
| `toc` | 否 | 是否显示目录，默认 `false` |
| `top` | 否 | 置顶优先级，数字越大优先级越高，默认 `0` |
| `draft` | 否 | 是否为草稿，默认 `false` |

常用模板：

```yaml
---
title: ""
timestamp: 2026-08-31 12:00:00+08:00
tags: []
description: ""
toc: true
draft: false
---
```

## 随笔的前置配置

随笔放在：

```text
src/content/jotting/
```

随笔不使用 `series` 和 `toc` 字段，其余常用字段与文记一致：

```yaml
---
title: 随笔标题
timestamp: 2026-08-31 12:00:00+08:00
tags: [标签]
description: 随笔简介
sensitive: false
top: 0
draft: false
---
```

如果重新启用多语言模式，则需要根据语言配置恢复 `zh-cn/` 等语言子目录。
