// 规则怪谈扩展 - 弹出窗口脚本
(function() {
  'use strict';

  const STORAGE_KEY = 'ruleFictionRules';

  const toggleBtn = document.getElementById('toggle-sidebar-btn');
  const clearBtn = document.getElementById('clear-all-btn');
  const statsEl = document.getElementById('stats');

  // 初始化
  init();

  function init() {
    loadStats();
    bindEvents();
  }

  // 加载统计数据
  function loadRules(callback) {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      const rules = result[STORAGE_KEY] || [];
      callback(rules);
    });
  }

  function loadStats() {
    loadRules((rules) => {
      statsEl.textContent = `已保存 ${rules.length} 条规则`;
    });
  }

  // 绑定事件
  function bindEvents() {
    // 展开侧边栏
    toggleBtn.addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleSidebar' }, () => {
            window.close();
          });
        }
      });
    });

    // 清空所有规则
    clearBtn.addEventListener('click', () => {
      if (confirm('确定要清空所有规则吗？此操作不可恢复。')) {
        chrome.storage.local.remove(STORAGE_KEY, () => {
          // 通知内容脚本刷新
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
              chrome.tabs.sendMessage(tabs[0].id, { action: 'refreshRules' });
            }
          });
          loadStats();
        });
      }
    });
  }
})();
