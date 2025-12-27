// 规则怪谈扩展 - 内容脚本
(function() {
  'use strict';

  // 存储键名
  const STORAGE_KEY = 'ruleFictionRules';

  // 状态
  let rules = [];
  let isSidebarOpen = false;

  // 创建侧边栏
  function createSidebar() {
    // 检查是否已存在
    if (document.getElementById('rule-fiction-sidebar')) {
      return;
    }

    // 创建侧边栏容器
    const sidebar = document.createElement('div');
    sidebar.id = 'rule-fiction-sidebar';
    sidebar.className = 'sidebar';
    document.body.appendChild(sidebar);

    // 加载侧边栏内容
    loadSidebarContent();
  }

  // 加载侧边栏内容
  async function loadSidebarContent() {
    const sidebar = document.getElementById('rule-fiction-sidebar');
    if (!sidebar) return;

    try {
      // 获取扩展资源
      const response = await fetch(chrome.runtime.getURL('sidebar.html'));
      if (response.ok) {
        const html = await response.text();
        sidebar.innerHTML = html;

        // 注入 CSS
        await injectStyles();

        // 加载脚本
        await injectScript(chrome.runtime.getURL('sidebar.js'));

        // 初始化
        initializeSidebar();
      }
    } catch (error) {
      console.error('加载侧边栏失败:', error);
    }
  }

  // 注入样式
  async function injectStyles() {
    // CSS 已经通过 content_scripts 自动注入
    // 这里可以添加额外的动态样式
  }

  // 注入脚本
  function injectScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = resolve; // 即使失败也继续
      document.body.appendChild(script);
    });
  }

  // 初始化侧边栏
  function initializeSidebar() {
    const sidebar = document.getElementById('rule-fiction-sidebar');
    if (!sidebar) return;

    // 创建切换按钮
    createToggleButton();

    // 绑定侧边栏事件
    const closeBtn = document.getElementById('sidebar-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', toggleSidebar);
    }

    // 监听存储变化
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local' && changes[STORAGE_KEY]) {
        // 通知侧边栏刷新
        sidebar.dispatchEvent(new CustomEvent('rf-refresh-rules'));
      }
    });
  }

  // 创建切换按钮
  function createToggleButton() {
    if (document.getElementById('rf-toggle-btn')) {
      return;
    }

    const button = document.createElement('button');
    button.id = 'rf-toggle-btn';
    button.innerHTML = 'R';
    button.title = '规则怪谈 - 点击展开/收起';
    document.body.appendChild(button);

    button.addEventListener('click', toggleSidebar);
  }

  // 切换侧边栏
  function toggleSidebar() {
    const sidebar = document.getElementById('rule-fiction-sidebar');
    if (!sidebar) return;

    isSidebarOpen = !isSidebarOpen;
    sidebar.classList.toggle('open', isSidebarOpen);
  }

  // 加载规则
  function loadRules() {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      if (result[STORAGE_KEY]) {
        rules = result[STORAGE_KEY];
      }
    });
  }

  // 初始化
  function init() {
    loadRules();
    createSidebar();
  }

  // 页面加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 监听来自 background script 的消息
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggleSidebar') {
      toggleSidebar();
      sendResponse({ success: true });
    } else if (message.action === 'refreshRules') {
      loadRules();
      const sidebar = document.getElementById('rule-fiction-sidebar');
      if (sidebar) {
        sidebar.dispatchEvent(new CustomEvent('rf-refresh-rules'));
      }
      sendResponse({ success: true });
    }
    return true;
  });
})();
