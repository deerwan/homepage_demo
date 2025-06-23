// 设置Cloudflare Worker API的基础URL
const API_BASE_URL = '更换为自己的Cloudflare Worker API的基础URL'; //必填项

// 获取必应每日壁纸
function getBingWallpaper() {
    // 使用更可靠的必应壁纸API
    const bingUrl = 'https://bing.img.run/rand.php';
    
    // 创建图片对象预加载
    const img = new Image();
    
    // 图片加载成功后设置背景
    img.onload = function() {
        Object.assign(document.body.style, {
            backgroundImage: `url(${img.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
        });
    };
    
    // 图片加载失败时的处理
    img.onerror = function() {
        console.error('获取必应壁纸失败');
        // 使用备用API尝试
        const backupUrl = 'https://api.dujin.org/bing/1920.php';
        const backupImg = new Image();
        
        backupImg.onload = function() {
            Object.assign(document.body.style, {
                backgroundImage: `url(${backupImg.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed'
            });
        };
        
        backupImg.onerror = function() {
            console.error('备用API也失败，使用默认背景色');
            setBackground();
        };
        
        // 添加时间戳防止缓存
        const timestamp = new Date().getTime();
        backupImg.src = `${backupUrl}?t=${timestamp}`;
    };

    // 添加时间戳防止缓存
    const timestamp = new Date().getTime();
    img.src = `${bingUrl}?t=${timestamp}`;
}

// 设置固定背景色或图片
function setBackground() {
    Object.assign(document.body.style, {
        backgroundColor: '#121212',
        backgroundImage: 'none'
    });
}

// 获取一言
async function getHitokoto() {
    try {
      const directResponse = await fetch('https://v1.hitokoto.cn');
      const directData = await directResponse.json();
      document.querySelector('.hitokoto-text').textContent = directData.hitokoto;
      document.querySelector('.hitokoto-from').textContent = `- [${directData.from}]`;
    } catch (directError) {
      console.error('直接获取一言也失败:', directError);
    }
}

// 格式化日期
function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.getFullYear() + '-' + 
         String(date.getMonth() + 1).padStart(2, '0') + '-' + 
         String(date.getDate()).padStart(2, '0');
}

// 创建留言HTML
function createMessageHTML(message) {
  // 使用模板字符串，并对内容进行简单的HTML转义，防止XSS
  const escapeHTML = (str) => str.replace(/[&<>'"]/g, 
    tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));

  return `
    <div class="message-item">
      <div class="message-header">
        <span class="message-author">${escapeHTML(message.name)}</span>
        <span class="message-date">${formatDate(message.timestamp)}</span>
      </div>
      <div class="message-content">
        <p>${escapeHTML(message.content)}</p>
      </div>
    </div>
  `;
}

// 获取留言列表
async function getMessages() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/messages`);
    if (!response.ok) throw new Error('获取留言失败');
    
    const messages = await response.json();
    const messageList = document.querySelector('.message-list');
    messageList.innerHTML = ''; // 清空列表
    
    messages.forEach(message => {
      messageList.insertAdjacentHTML('beforeend', createMessageHTML(message));
    });
  } catch (error) {
    console.error('获取留言失败:', error);
    alert('获取留言失败，请稍后再试');
  }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化加载背景和一言
    getBingWallpaper(); // 使用必应壁纸
    getHitokoto();
    getMessages(); // 添加这一行来加载留言
    
    const guestbookForm = document.getElementById('guestbook-form');
    if (guestbookForm) {
        guestbookForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[name="name"]').value || '访客';
            const email = this.querySelector('input[name="email"]').value;
            const content = this.querySelector('textarea[name="message"]').value;
            
            try {
                const response = await fetch(`${API_BASE_URL}/api/messages`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ name, email, content })
                });
                
                if (!response.ok) throw new Error('提交留言失败');
                
                const result = await response.json();
                document.querySelector('.message-list').insertAdjacentHTML('afterbegin', createMessageHTML(result));
                
                alert('留言提交成功！');
                this.reset();
            } catch (error) {
                console.error('提交留言失败:', error);
                alert('提交留言失败，请稍后再试');
            }
        });
    }
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[name="name"]').value;
            const email = this.querySelector('input[name="email"]').value;
            const message = this.querySelector('textarea[name="message"]').value;
            
            try {
                const response = await fetch(`${API_BASE_URL}/api/contact`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ name, email, message })
                });
                
                if (!response.ok) throw new Error('提交联系表单失败');
                
                alert('感谢您的留言，我会尽快回复！');
                this.reset();
            } catch (error) {
                console.error('提交联系表单失败:', error);
                alert('提交联系表单失败，请稍后再试');
            }
        });
    }

    // 为所有弹出层（section）添加点击背景关闭的功能
    document.querySelectorAll('.section').forEach(section => {
        section.addEventListener('click', function(e) {
            // 当点击事件的目标是 section 本身（即半透明的背景）时
            if (e.target === this) {
                // 通过将 hash 设置为空字符串来关闭当前 :target 激活的弹出层
                // 这比直接修改 history state 更简单可靠
                window.location.hash = '';
            }
        });
    });
});