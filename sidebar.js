// 规则怪谈扩展 - 侧边栏脚本
(function() {
  'use strict';

  // 存储键名
  const STORAGE_KEY = 'ruleFictionRules';

  // 当前状态
  let rules = [];
  let editingRuleId = null;

  // DOM 元素
  const sidebar = document.getElementById('rule-fiction-sidebar');
  const ruleList = document.getElementById('rule-list');
  const addBtn = document.getElementById('add-rule-btn');
  const modal = document.getElementById('edit-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalClose = document.getElementById('modal-close');
  const cancelBtn = document.getElementById('cancel-btn');
  const saveBtn = document.getElementById('save-btn');
  const titleInput = document.getElementById('rule-title');
  const contentInput = document.getElementById('rule-content');
  const colorSelect = document.getElementById('rule-color');

  // 初始化
  function init() {
    loadRules();
    renderRules();
    bindEvents();
  }

  // 加载规则
  function loadRules() {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      if (result[STORAGE_KEY]) {
        rules = result[STORAGE_KEY];
      } else {
        rules = [];
      }
      renderRules();
    });
  }

  // 保存规则
  function saveRules() {
    chrome.storage.local.set({ [STORAGE_KEY]: rules }, () => {
      renderRules();
    });
  }

  // 渲染规则列表
  function renderRules() {
    if (rules.length === 0) {
      ruleList.innerHTML = `
        <div class="empty-state">
          <p>暂无规则，点击下方按钮添加</p>
        </div>
      `;
      return;
    }

    ruleList.innerHTML = rules.map((rule, index) => `
      <div class="rule-card ${rule.color || 'default'}" data-id="${rule.id}">
        <div class="rule-card-header">
          <span class="rule-card-title">${escapeHtml(rule.title)}</span>
        </div>
        <div class="rule-card-content">${escapeHtml(rule.content)}</div>
        <div class="rule-card-actions">
          <button class="edit-btn" data-index="${index}">编辑</button>
          <button class="delete-btn delete" data-index="${index}">删除</button>
        </div>
      </div>
    `).join('');
  }

  // HTML 转义
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 生成唯一 ID
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // 打开弹窗
  function openModal(rule = null) {
    if (rule) {
      editingRuleId = rule.id;
      modalTitle.textContent = '编辑规则';
      titleInput.value = rule.title;
      contentInput.value = rule.content;
      colorSelect.value = rule.color || 'default';
    } else {
      editingRuleId = null;
      modalTitle.textContent = '添加规则';
      titleInput.value = '';
      contentInput.value = '';
      colorSelect.value = 'default';
    }
    modal.classList.remove('hidden');
  }

  // 关闭弹窗
  function closeModal() {
    modal.classList.add('hidden');
    titleInput.value = '';
    contentInput.value = '';
    colorSelect.value = 'default';
    editingRuleId = null;
  }

  // 保存规则
  function handleSave() {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title) {
      alert('请输入规则标题');
      return;
    }

    if (!content) {
      alert('请输入规则内容');
      return;
    }

    if (editingRuleId) {
      // 编辑现有规则
      const index = rules.findIndex(r => r.id === editingRuleId);
      if (index !== -1) {
        rules[index] = {
          ...rules[index],
          title,
          content,
          color: colorSelect.value
        };
      }
    } else {
      // 添加新规则
      rules.push({
        id: generateId(),
        title,
        content,
        color: colorSelect.value,
        createdAt: Date.now()
      });
    }

    saveRules();
    closeModal();
  }

  // 删除规则
  function deleteRule(index) {
    if (confirm('确定要删除这条规则吗？')) {
      rules.splice(index, 1);
      saveRules();
    }
  }

  // 绑定事件
  function bindEvents() {
    // 添加规则
    addBtn.addEventListener('click', () => openModal());

    // 关闭弹窗
    modalClose.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // 保存规则
    saveBtn.addEventListener('click', handleSave);

    // 点击弹窗外部关闭
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // 规则列表事件委托
    ruleList.addEventListener('click', (e) => {
      const card = e.target.closest('.rule-card');
      if (!card) return;

      // 展开/收起
      card.classList.toggle('expanded');

      // 编辑按钮
      const editBtn = e.target.closest('.edit-btn');
      if (editBtn) {
        const index = parseInt(editBtn.dataset.index);
        openModal(rules[index]);
        return;
      }

      // 删除按钮
      const deleteBtn = e.target.closest('.delete-btn');
      if (deleteBtn) {
        const index = parseInt(deleteBtn.dataset.index);
        deleteRule(index);
      }
    });

    // ESC 关闭弹窗
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });
  }

  // 启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
