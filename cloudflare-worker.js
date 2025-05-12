// Cloudflare Worker脚本 - 个人主页后端API

// 定义KV命名空间绑定名称（部署时需要在Cloudflare Dashboard中创建并绑定）
// KV_MESSAGES 是KV命名空间的绑定名称

// 定义环境变量（需要在Cloudflare Dashboard中配置）
// NOTIFICATION_API_URL - 通知平台的API URL（如飞书/钉钉/企业微信机器人的Webhook地址）

/**
 * 发送通知到配置的通知平台
 * 需要在Cloudflare Workers环境变量中配置：
 * - NOTIFICATION_API_URL: 通知平台的API URL
 */
async function sendNotification(type, data) {
  // 检查是否配置了通知API
  const notificationApiUrl = NOTIFICATION_API_URL || null;
  
  if (!notificationApiUrl) {
    console.log('通知功能未配置，跳过发送通知');
    return;
  }
  
  try {
    // 构建通知内容
    let title, content;
    
    if (type === 'message') {
      title = '新留言通知';
      content = `收到来自 ${data.name} (${data.email || '未提供邮箱'}) 的新留言：\n${data.content}`;
    } else if (type === 'contact') {
      title = '新联系表单提交';
      content = `收到来自 ${data.name} (${data.email}) 的联系表单：\n${data.message}`;
    } else {
      return; // 未知类型，不发送通知
    }
    
    // 构建通知请求体 (适用于飞书机器人，可根据实际使用的平台调整)
    const notificationData = {
      msg_type: "text",
      content: {
        text: `${title}\n\n${content}`
      }
    };
    
    // 发送通知请求
    const response = await fetch(notificationApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notificationData)
    });
    
    if (!response.ok) {
      throw new Error(`通知发送失败: ${response.status}`);
    }
    
    console.log('通知发送成功');
  } catch (error) {
    console.error('发送通知时出错:', error);
    // 通知发送失败不影响主流程
  }
}

/**
 * 处理请求的主函数
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // 设置CORS头，允许前端页面访问
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // 在生产环境中应该设置为特定域名
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  // 处理预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  
  // 处理一言API请求 (作为代理，避免前端跨域问题)
  if (path === '/api/hitokoto') {
    if (request.method === 'GET') {
      try {
        const response = await fetch('https://v1.hitokoto.cn');
        const data = await response.json();
        
        return new Response(JSON.stringify(data), {
          headers: corsHeaders
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: '获取一言失败' }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }
  }
  
  // 处理留言板API
  if (path === '/api/messages') {
    // 获取所有留言
    if (request.method === 'GET') {
      try {
        // 从KV存储中获取留言数据
        const messagesJson = await KV_MESSAGES.get('wall-messages');
        const messages = messagesJson ? JSON.parse(messagesJson) : [];
        
        // 按时间倒序排序，最新的留言在前面
        messages.sort((a, b) => b.timestamp - a.timestamp);
        
        return new Response(JSON.stringify(messages), {
          headers: corsHeaders
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: '获取留言失败' }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }
    
    // 添加新留言
    if (request.method === 'POST') {
      try {
        // 解析请求体
        const data = await request.json();
        
        // 验证必填字段
        if (!data.name || !data.content) {
          return new Response(JSON.stringify({ error: '缺少必填字段' }), {
            status: 400,
            headers: corsHeaders
          });
        }
        
        // 从KV存储中获取现有留言
        const messagesJson = await KV_MESSAGES.get('wall-messages');
        const messages = messagesJson ? JSON.parse(messagesJson) : [];
        
        // 创建新留言对象
        const newMessage = {
          id: Date.now(),
          name: data.name,
          email: data.email || '',
          content: data.content,
          timestamp: Date.now()
        };
        
        // 添加到留言数组
        messages.push(newMessage);
        
        // 保存回KV存储
        await KV_MESSAGES.put('wall-messages', JSON.stringify(messages));
        
        // 发送新留言通知
        await sendNotification('message', newMessage);
        
        return new Response(JSON.stringify(newMessage), {
          headers: corsHeaders
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: '添加留言失败' }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }
  }
  
  // 处理联系表单提交
  if (path === '/api/contact') {
    if (request.method === 'POST') {
      try {
        // 解析请求体
        const data = await request.json();
        
        // 验证必填字段
        if (!data.name || !data.email || !data.message) {
          return new Response(JSON.stringify({ error: '缺少必填字段' }), {
            status: 400,
            headers: corsHeaders
          });
        }
        
        // 从KV存储中获取现有联系表单提交
        const contactsJson = await KV_MESSAGES.get('contact-submissions');
        const contacts = contactsJson ? JSON.parse(contactsJson) : [];
        
        // 创建新联系表单提交对象
        const newContact = {
          id: Date.now(),
          name: data.name,
          email: data.email,
          message: data.message,
          timestamp: Date.now()
        };
        
        // 添加到联系表单提交数组
        contacts.push(newContact);
        
        // 保存回KV存储
        await KV_MESSAGES.put('contact-submissions', JSON.stringify(contacts));
        
        // 发送新联系表单通知
        await sendNotification('contact', newContact);
        
        return new Response(JSON.stringify({ success: true }), {
          headers: corsHeaders
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: '提交联系表单失败' }), {
          status: 500,
          headers: corsHeaders
        });
      }
    }
  }
  
  // 如果没有匹配的路径，返回404
  return new Response(JSON.stringify({ error: '未找到请求的资源' }), {
    status: 404,
    headers: corsHeaders
  });
}

// 注册事件监听器
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});