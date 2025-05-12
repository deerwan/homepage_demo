###  配置API
在以下文件中更新您的API地址：

// assets/js/main.js
const API_BASE_URL = 'YOUR_WORKER_DOMAIN';

### 部署Cloudflare Worker

1. 注册 Cloudflare Workers 账号
2. 创建一个新的Worker
3. 将 cloudflare-worker.js 文件内容复制到Worker编辑器中
4. 创建KV命名空间 KV_MESSAGES 并绑定到Worker
5. 设置环境变量 NOTIFICATION_API_URL （可选，用于接收通知）
6. 部署Worker













/
├── assets/
│   ├── css/         # 样式文件
│   ├── fonts/       # 字体文件
│   ├── img/         # 图片资源
│   └── js/          # JavaScript文件
├── lib/             # 第三方库
├── cloudflare-worker.js  # Cloudflare Worker后端代码
└── index.html       # 主页面