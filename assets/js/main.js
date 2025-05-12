// 设置Cloudflare Worker API的基础URL
const API_BASE_URL = '替换为自己的Cloudflare Worker API的基础URL';

// 获取必应每日壁纸
function getBingWallpaper() {
    // 使用更可靠的必应壁纸API
    const bingUrl = 'https://bing.img.run/rand.php';
    
    // 创建图片对象预加载
    const img = new Image();
    
    // 图片加载成功后设置背景
    img.onload = function() {
        $('body').css({
            'background-image': `url(${img.src})`,
            'background-size': 'cover',
            'background-position': 'center',
            'background-repeat': 'no-repeat',
            'background-attachment': 'fixed' // 添加固定背景，防止滚动时背景移动
        });
    };
    
    // 图片加载失败时的处理
    img.onerror = function() {
        console.error('获取必应壁纸失败');
        // 使用备用API尝试
        const backupUrl = 'https://api.dujin.org/bing/1920.php';
        const backupImg = new Image();
        
        backupImg.onload = function() {
            $('body').css({
                'background-image': `url(${backupImg.src})`,
                'background-size': 'cover',
                'background-position': 'center',
                'background-repeat': 'no-repeat',
                'background-attachment': 'fixed'
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
    $('body').css({
        'background-color': '#121212', // 深色背景
        'background-image': 'none'      // 移除背景图片
    });
}

// 获取一言
async function getHitokoto() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/hitokoto`);
    if (!response.ok) throw new Error('获取一言失败');
    
    const data = await response.json();
    $('.hitokoto-text').text(data.hitokoto);
    $('.hitokoto-from').text(`- [${data.from}]`);
  } catch (error) {
    console.error('获取一言失败:', error);
    try {
      const directResponse = await fetch('https://v1.hitokoto.cn');
      const directData = await directResponse.json();
      $('.hitokoto-text').text(directData.hitokoto);
      $('.hitokoto-from').text(`- [${directData.from}]`);
    } catch (directError) {
      console.error('直接获取一言也失败:', directError);
    }
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
  return `
    <div class="message-item">
      <div class="message-header">
        <span class="message-author">${message.name}</span>
        <span class="message-date">${formatDate(message.timestamp)}</span>
      </div>
      <div class="message-content">
        <p>${message.content}</p>
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
    $('.message-list').empty();
    
    messages.forEach(message => {
      $('.message-list').append(createMessageHTML(message));
    });
  } catch (error) {
    console.error('获取留言失败:', error);
    alert('获取留言失败，请稍后再试');
  }
}

// 页面加载完成后执行
$(document).ready(function() {
    // 初始化加载背景和一言
    getBingWallpaper(); // 使用必应壁纸
    getHitokoto();
    
    // 每天更新一次壁纸
    const oneDayInMs = 24 * 60 * 60 * 1000;
    setInterval(getBingWallpaper, oneDayInMs);
    
    // 每分钟更新一次一言
    setInterval(getHitokoto, 60 * 1000);
    
    if ($('#guestbook').length) getMessages();
    
    // 处理留言板表单提交
    $('#guestbook-form').on('submit', async function(e) {
      e.preventDefault();
      
      const name = $(this).find('input[name="name"]').val() || '访客';
      const email = $(this).find('input[name="email"]').val();
      const content = $(this).find('textarea[name="message"]').val();
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/messages`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ name, email, content })
        });
        
        if (!response.ok) throw new Error('提交留言失败');
        
        const result = await response.json();
        $('.message-list').prepend(createMessageHTML(result));
        
        alert('留言提交成功！');
        this.reset();
      } catch (error) {
        console.error('提交留言失败:', error);
        alert('提交留言失败，请稍后再试');
      }
    });
    
    // 处理联系表单提交
    $('#contact-form').on('submit', async function(e) {
      e.preventDefault();
      
      const name = $(this).find('input[name="name"]').val();
      const email = $(this).find('input[name="email"]').val();
      const message = $(this).find('textarea[name="message"]').val();
      
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
    
    // 处理返回按钮点击
    $('.back-btn').on('click', function(e) {
      e.preventDefault();
      $('html, body').animate({scrollTop: 0}, 800);
      window.location.href = window.location.pathname;
    });
});