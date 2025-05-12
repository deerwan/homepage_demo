# 个人主页演示

## 项目简介

这是一个简洁美观的个人主页演示项目，包含响应式设计、动态
背景、留言板和联系表单等功能。项目使用HTML、CSS和
JavaScript构建前端，Cloudflare Worker作为后端API支
持。

## ✨ 功能特点

- 📱 响应式设计 - 完美适配各种设备
- 🖼️ 动态背景 - 自动获取必应每日壁纸
- 💬 一言功能 - 每日随机名言展示
- 📝 留言板 - 访客互动交流
- 📧 联系表单 - 便捷联系方式
- ☁️ 无服务器架构 - 基于Cloudflare Worker

## 📂 项目结构

```
/
├── assets/
│   ├── css/         # 样式文件
│   ├── fonts/       # 字体文件
│   ├── img/         # 图片资源
│   └── js/          # JavaScript文件
├── lib/             # 第三方库
├── cloudflare-worker.js  # Cloudflare Worker后端
└── index.html       # 主页面
```

## 🚀 快速开始

### 1. 部署Cloudflare Pages

1. Fork 此项目到你的 GitHub 账号
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
3. 进入 Pages 页面，点击「创建项目」
4. 选择「从 Git 连接」，授权并选择你 fork 的仓库
5. 部署配置：
   - 构建命令：留空
   - 输出目录：留空
6. 点击「保存并部署」
7. 绑定域名（可选）

### 2. 部署Cloudflare Worker

1. 注册 Cloudflare Workers 账号
2. 创建新Worker
3. 复制 cloudflare-worker.js 内容到Worker编辑器
4. 创建KV命名空间 KV_MESSAGES 并绑定
5. 设置环境变量 NOTIFICATION_API_URL （可选）
6. 部署Worker
7. 绑定域名

### 3. 配置API

修改API地址：

```
// assets/js/main.js
const API_BASE_URL = 'YOUR_WORKER_DOMAIN'; // 替换为您的Worker域名
```


## 🎨 自定义选项

### 个人信息修改

编辑 index.html 更新：

- 姓名和简介
- 社交媒体链接
- 联系方式

### 背景设置

修改 assets/js/main.js 中的背景图源

### 样式调整

编辑 assets/css/style.css 自定义：

- 配色方案
- 字体样式
- 布局效果

## ⚙️ 可选配置

### 通知集成

支持平台：

- 飞书机器人
- 钉钉机器人
- 企业微信机器人

设置 NOTIFICATION_API_URL 环境变量

### 留言审核

修改 cloudflare-worker.js 启用审核功能

## 🛠️ 技术栈

- 前端：HTML5, CSS3, JavaScript, jQuery
- 后端：Cloudflare Worker, KV Storage
- 字体：975MaruSC

## 📜 许可证

MIT 许可证 - 详见 LICENSE 文件

## 🤝 贡献指南

欢迎提交：

- 问题报告
- 功能建议
- 代码改进

## 🙏 致谢

- jQuery - JavaScript库
- Cloudflare Workers - 无服务器平台
- 必应壁纸 - 每日精美背景
