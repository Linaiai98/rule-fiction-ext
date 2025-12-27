// 规则怪谈扩展 - 后台脚本
chrome.runtime.onInstalled.addListener(() => {
  console.log('规则怪谈扩展已安装');
});

// 处理扩展图标点击
chrome.action.onClicked.addListener((tab) => {
  // 发送消息到内容脚本切换侧边栏
  chrome.tabs.sendMessage(tab.id, { action: 'toggleSidebar' });
});

// 监听快捷命令（如果有）
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-sidebar') {
    // 获取当前活动标签页并发送消息
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleSidebar' });
      }
    });
  }
});
