# 个人主页演示

这是一个简洁美观的个人主页演示项目，包含响应式设计、动态背景、留言板和联系表单等功能。项目使用HTML、CSS和JavaScript构建前端，Cloudflare Worker作为后端API支持。

## 功能特点

- 响应式设计，适配各种设备
- 动态背景图片（使用必应每日壁纸）
- 一言功能（随机名言显示）
- 留言板功能
- 联系表单
- 无服务器后端支持

## 项目结构
/
├── assets/
│   ├── css/         # 样式文件
│   ├── fonts/       # 字体文件
│   ├── img/         # 图片资源
│   └── js/          # JavaScript文件
├── lib/             # 第三方库
├── cloudflare-worker.js  # Cloudflare Worker后端
└── index.html       # 主页面
## 快速开始

### 1. 克隆项目
git clone https://github.com/yourusername/homepage_demo.git
cd homepage_demo
### 2. 配置API

在以下文件中更新您的API地址：
// assets/js/main.js
const API_BASE_URL = 'YOUR_WORKER_DOMAIN';
### 3. 部署Cloudflare Worker

1. 注册 Cloudflare Workers 账号
2. 创建一个新的Worker
3. 将 cloudflare-worker.js 文件内容复制到Worker编辑器中
4. 创建KV命名空间 KV_MESSAGES 并绑定到Worker
5. 设置环境变量 NOTIFICATION_API_URL （可选，用于接收通知）
6. 部署Worker

### 4. 本地测试

您可以使用任何静态文件服务器在本地测试前端：
# 使用Python的简易HTTP服务器
python -m http.server 8000
然后在浏览器中访问 http://localhost:8000

## 自定义

### 修改个人信息

编辑 index.html 文件，更新以下内容：

- 个人姓名和简介
- 社交媒体链接
- 联系信息

### 更换背景图片

默认使用必应每日壁纸作为背景，您也可以在 assets/js/main.js 中修改背景图片来源。

### 自定义样式

编辑 assets/css/style.css 文件，根据个人喜好调整颜色、字体等样式。

## 高级配置

### 通知功能

Worker支持在收到新留言或联系表单提交时发送通知。支持以下平台：

- 飞书机器人
- 钉钉机器人
- 企业微信机器人

在Worker环境变量中设置 NOTIFICATION_API_URL 为对应平台的Webhook地址即可。

### 留言审核

默认情况下，所有留言会直接显示。如需开启审核功能，请修改 cloudflare-worker.js 中的相关配置。

## 技术栈

- 前端：HTML5, CSS3, JavaScript, jQuery
- 后端：Cloudflare Worker, Cloudflare KV Storage
- 字体：975MaruSC (包含在项目中)

## 许可证

本项目采用 MIT 许可证，详情请参阅 LICENSE 文件。

## 贡献

欢迎提交问题和拉取请求，一起改进这个项目！

## 致谢

- jQuery - JavaScript库
- Cloudflare Workers - 无服务器计算平台
- 必应每日壁纸 - 背景图片来源
    