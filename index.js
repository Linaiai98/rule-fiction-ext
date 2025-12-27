// 规则怪谈系统 - SillyTavern插件
console.log("[RuleFiction] 脚本开始加载...");

// 使用 jQuery 确保在 DOM 加载完毕后执行
jQuery(async () => {
    console.log("[RuleFiction] jQuery ready, 开始初始化...");

    // -----------------------------------------------------------------
    // 1. 定义常量和状态变量
    // -----------------------------------------------------------------
    const extensionName = "rule-fiction-system";
    const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

    console.log(`[${extensionName}] Starting initialization...`);
    console.log(`[${extensionName}] Extension folder path: ${extensionFolderPath}`);

    // 存储键
    const STORAGE_KEY_RULES = "rule-fiction-rules";
    const STORAGE_KEY_SIDEBAR_STATE = "rule-fiction-sidebar-open";
    const STORAGE_KEY_SETTINGS = "rule-fiction-settings";

    // DOM IDs
    const SIDEBAR_ID = "rf-sidebar";
    const TOGGLE_BTN_ID = "rf-toggle-btn";
    const CLOSE_BTN_ID = "rf-sidebar-close";
    const RULE_LIST_ID = "rf-rule-list";
    const ADD_BTN_ID = "rf-add-btn";
    const MODAL_ID = "rf-modal";
    const MODAL_TITLE_ID = "rf-modal-title";
    const MODAL_CLOSE_ID = "rf-modal-close";
    const CANCEL_BTN_ID = "rf-cancel-btn";
    const SAVE_BTN_ID = "rf-save-btn";
    const TITLE_INPUT_ID = "rf-title-input";
    const CONTENT_INPUT_ID = "rf-content-input";
    const COLOR_SELECT_ID = "rf-color-select";

    // 状态
    let rules = [];
    let editingRuleId = null;
    let isSidebarOpen = false;

    // 安全的 z-index 值
    const SAFE_Z_INDEX = {
        button: 10000,
        sidebar: 10001,
        modal: 10010
    };

    // 作者信息
    const AUTHOR_NAME = "匿名";

    // 默认设置
    const DEFAULT_SETTINGS = {
        enabled: true,
        defaultColor: 'default',
        shortcutKey: 'Escape',
        showCount: true
    };

    // 当前设置
    let settings = { ...DEFAULT_SETTINGS };

    // -----------------------------------------------------------------
    // 2. 工具函数
    // -----------------------------------------------------------------

    // 生成唯一 ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // HTML 转义
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 加载规则
    function loadRules() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY_RULES);
            if (stored) {
                rules = JSON.parse(stored);
            } else {
                rules = [];
            }
        } catch (e) {
            console.warn(`[${extensionName}] 加载规则失败:`, e);
            rules = [];
        }
    }

    // 保存规则
    function saveRules() {
        try {
            localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(rules));
            renderRules();
        } catch (e) {
            console.warn(`[${extensionName}] 保存规则失败:`, e);
        }
    }

    // 加载设置
    function loadSettings() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
            if (stored) {
                settings = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
            }
        } catch (e) {
            console.warn(`[${extensionName}] 加载设置失败:`, e);
            settings = { ...DEFAULT_SETTINGS };
        }
    }

    // 保存设置
    function saveSettings() {
        try {
            localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
        } catch (e) {
            console.warn(`[${extensionName}] 保存设置失败:`, e);
        }
    }

    // -----------------------------------------------------------------
    // 3. UI 创建函数
    // -----------------------------------------------------------------

    // 创建悬浮按钮
    function createToggleButton() {
        if ($(`#${TOGGLE_BTN_ID}`).length) return;

        const $btn = $('<button>')
            .attr('id', TOGGLE_BTN_ID)
            .text('R')
            .attr('title', '规则怪谈 - 点击展开/收起');

        $('body').append($btn);

        $btn.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
        });
    }

    // 创建侧边栏
    function createSidebar() {
        if ($(`#${SIDEBAR_ID}`).length) return;

        const $sidebar = $('<div>')
            .attr('id', SIDEBAR_ID)
            .addClass('rf-sidebar');

        // 头部
        const $header = $('<div>').addClass('rf-header');
        $header.append($('<h2>').text('规则怪谈'));
        $header.append(
            $('<button>')
                .addClass('rf-close-btn')
                .attr('id', CLOSE_BTN_ID)
                .html('&times;')
        );

        // 规则列表
        const $ruleList = $('<div>').attr('id', RULE_LIST_ID).addClass('rf-rule-list');

        // 添加按钮
        const $addBtn = $('<button>')
            .addClass('rf-add-btn')
            .attr('id', ADD_BTN_ID)
            .text('+ 添加规则');

        // 弹窗
        const $modal = $('<div>').attr('id', MODAL_ID).addClass('rf-modal rf-hidden');
        $modal.append(
            $('<div>').addClass('rf-modal-content').append(
                $('<div>').addClass('rf-modal-header').append(
                    $('<h3>').attr('id', MODAL_TITLE_ID).text('添加规则')
                ).append(
                    $('<button>')
                        .addClass('rf-close-btn')
                        .attr('id', MODAL_CLOSE_ID)
                        .html('&times;')
                )
            ).append(
                $('<div>').addClass('rf-modal-body').append(
                    $('<div>').addClass('rf-form-group').append(
                        $('<label>').text('规则标题')
                    ).append(
                        $('<input>')
                            .attr('type', 'text')
                            .attr('id', TITLE_INPUT_ID)
                            .attr('placeholder', '输入规则标题...')
                    )
                ).append(
                    $('<div>').addClass('rf-form-group').append(
                        $('<label>').text('规则内容')
                    ).append(
                        $('<textarea>')
                            .attr('id', CONTENT_INPUT_ID)
                            .attr('rows', '8')
                            .attr('placeholder', '输入规则内容...\n\n支持多行文本')
                    )
                ).append(
                    $('<div>').addClass('rf-form-group').append(
                        $('<label>').text('卡片颜色')
                    ).append(
                        $('<select>').attr('id', COLOR_SELECT_ID).append(
                            $('<option>').val('default').text('默认 (黑白)')
                        ).append(
                            $('<option>').val('red').text('警告 (红色)')
                        ).append(
                            $('<option>').val('blue').text('信息 (蓝色)')
                        ).append(
                            $('<option>').val('yellow').text('注意 (黄色)')
                        ).append(
                            $('<option>').val('green').text('安全 (绿色)')
                        )
                    )
                )
            ).append(
                $('<div>').addClass('rf-modal-footer').append(
                    $('<button>')
                        .addClass('rf-btn-secondary')
                        .attr('id', CANCEL_BTN_ID)
                        .text('取消')
                ).append(
                    $('<button>')
                        .addClass('rf-btn-primary')
                        .attr('id', SAVE_BTN_ID)
                        .text('保存')
                )
            )
        );

        $sidebar.append($header);
        $sidebar.append($ruleList);
        $sidebar.append($addBtn);
        $sidebar.append($modal);

        $('body').append($sidebar);

        // 绑定事件
        bindSidebarEvents();
    }

    // -----------------------------------------------------------------
    // 3.1 设置面板创建函数
    // -----------------------------------------------------------------

    function createSettingsPanel() {
        const SETTINGS_ID = "rf-settings-panel";

        // 如果已存在，先移除
        $(`#${SETTINGS_ID}`).remove();

        const settingsHtml = `
            <div id="${SETTINGS_ID}" class="rf-settings-panel">
                <h3>⚙️ 规则怪谈设置</h3>

                <div class="rf-setting-item">
                    <label class="rf-toggle-label">
                        <input type="checkbox" id="rf-enabled-toggle" ${settings.enabled ? 'checked' : ''}>
                        <span>启用扩展</span>
                    </label>
                    <p class="rf-setting-desc">关闭后侧边栏按钮将隐藏</p>
                </div>

                <div class="rf-setting-item">
                    <label>默认卡片颜色</label>
                    <select id="rf-default-color">
                        <option value="default" ${settings.defaultColor === 'default' ? 'selected' : ''}>默认 (黑白)</option>
                        <option value="red" ${settings.defaultColor === 'red' ? 'selected' : ''}>警告 (红色)</option>
                        <option value="blue" ${settings.defaultColor === 'blue' ? 'selected' : ''}>信息 (蓝色)</option>
                        <option value="yellow" ${settings.defaultColor === 'yellow' ? 'selected' : ''}>注意 (黄色)</option>
                        <option value="green" ${settings.defaultColor === 'green' ? 'selected' : ''}>安全 (绿色)</option>
                    </select>
                </div>

                <div class="rf-setting-item">
                    <label>关闭侧边栏快捷键</label>
                    <select id="rf-shortcut-key">
                        <option value="Escape" ${settings.shortcutKey === 'Escape' ? 'selected' : ''}>Escape (ESC)</option>
                        <option value="KeyQ" ${settings.shortcutKey === 'KeyQ' ? 'selected' : ''}>Q</option>
                        <option value="KeyW" ${settings.shortcutKey === 'KeyW' ? 'selected' : ''}>W</option>
                        <option value="KeyX" ${settings.shortcutKey === 'KeyX' ? 'selected' : ''}>X</option>
                    </select>
                </div>

                <div class="rf-setting-item">
                    <label>规则管理</label>
                    <div class="rf-setting-actions">
                        <button id="rf-export-btn" class="rf-btn-secondary">📤 导出规则</button>
                        <button id="rf-import-btn" class="rf-btn-secondary">📥 导入规则</button>
                    </div>
                    <input type="file" id="rf-import-file" accept=".json" style="display: none;">
                </div>

                <div class="rf-setting-item rf-danger-zone">
                    <label>危险操作</label>
                    <p class="rf-setting-desc">此操作无法撤销</p>
                    <button id="rf-clear-all-btn" class="rf-btn-danger">🗑️ 清除所有规则</button>
                </div>

                <div class="rf-setting-item">
                    <p class="rf-setting-info">规则数量: <span id="rf-rule-count">${rules.length}</span></p>
                </div>
            </div>
        `;

        // 尝试添加到扩展设置容器（带延迟重试）
        function appendSettingsPanel() {
            const $target = $("#extensions_settings2").length ? $("#extensions_settings2") : $("#extensions_settings");
            if ($target.length) {
                $target.append(settingsHtml);
                console.log(`[${extensionName}] 设置面板已添加到扩展设置页面`);
                bindSettingsPanelEvents();
                return true;
            }
            return false;
        }

        // 立即尝试
        if (!appendSettingsPanel()) {
            // 1秒后重试（等待 SillyTavern 加载扩展设置页面）
            setTimeout(() => {
                if (!appendSettingsPanel()) {
                    // 最终降级方案：添加到 body
                    $('body').append(settingsHtml);
                    console.warn(`[${extensionName}] 未找到扩展设置容器，设置面板添加到 body`);
                    bindSettingsPanelEvents();
                }
            }, 1000);
        }
    }

    // 绑定设置面板事件
    function bindSettingsPanelEvents() {
        // 启用/禁用开关
        $("#rf-enabled-toggle").on('change', function() {
            settings.enabled = $(this).is(':checked');
            saveSettings();
            toggleExtensionUI(settings.enabled);
        });

        // 默认颜色
        $("#rf-default-color").on('change', function() {
            settings.defaultColor = $(this).val();
            saveSettings();
        });

        // 快捷键
        $("#rf-shortcut-key").on('change', function() {
            settings.shortcutKey = $(this).val();
            saveSettings();
            updateGlobalShortcuts();
        });

        // 导出规则
        $("#rf-export-btn").on('click', function() {
            exportRules();
        });

        // 导入按钮
        $("#rf-import-btn").on('click', function() {
            $("#rf-import-file").click();
        });

        // 导入文件选择
        $("#rf-import-file").on('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                importRules(file);
            }
            $(this).val(''); // 清空选择
        });

        // 清除所有规则
        $("#rf-clear-all-btn").on('click', function() {
            if (confirm('确定要清除所有规则吗？此操作无法撤销！')) {
                if (confirm('再次确认：您确定要删除所有规则吗？')) {
                    rules = [];
                    saveRules();
                    updateRuleCount();
                    alert('所有规则已清除');
                }
            }
        });
    }

    // 切换扩展 UI 显示/隐藏
    function toggleExtensionUI(enabled) {
        if (enabled) {
            $(`#${TOGGLE_BTN_ID}`).show();
            if (isSidebarOpen) {
                $(`#${SIDEBAR_ID}`).addClass('open');
            }
        } else {
            $(`#${TOGGLE_BTN_ID}`).hide();
            $(`#${SIDEBAR_ID}`).removeClass('open');
        }
    }

    // 更新全局快捷键
    function updateGlobalShortcuts() {
        $(document).off('keydown', null, null, 'keydown');

        $(document).on('keydown', function(e) {
            // ESC 关闭侧边栏（可选）
            if (e.code === settings.shortcutKey) {
                if (isSidebarOpen) {
                    closeSidebar();
                }
            }
        });
    }

    // 导出规则
    function exportRules() {
        const exportData = {
            version: 1,
            exportTime: new Date().toISOString(),
            extension: extensionName,
            rules: rules
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rule-fiction-rules-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log(`[${extensionName}] 规则已导出，共 ${rules.length} 条`);
    }

    // 导入规则
    function importRules(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);

                // 验证数据格式
                if (!data.rules || !Array.isArray(data.rules)) {
                    alert('文件格式无效');
                    return;
                }

                const importCount = data.rules.length;
                const mergeOption = confirm(
                    `发现 ${importCount} 条规则。\n\n` +
                    `点击"确定"追加到现有规则（合并）\n` +
                    `点击"取消"替换现有规则`
                );

                if (mergeOption) {
                    // 追加
                    rules = [...rules, ...data.rules];
                } else {
                    // 替换
                    rules = data.rules;
                }

                saveRules();
                updateRuleCount();
                alert(`成功导入 ${importCount} 条规则`);

            } catch (err) {
                console.warn(`[${extensionName}] 导入失败:`, err);
                alert('导入失败，请确保文件格式正确');
            }
        };
        reader.readAsText(file);
    }

    // 更新规则数量显示
    function updateRuleCount() {
        const $countEl = $("#rf-rule-count");
        if ($countEl.length) {
            $countEl.text(rules.length);
        }
    }

    // -----------------------------------------------------------------
    // 4. 事件绑定
    // -----------------------------------------------------------------

    function bindSidebarEvents() {
        // 关闭按钮
        $(`#${CLOSE_BTN_ID}`).on('click', function(e) {
            e.preventDefault();
            closeSidebar();
        });

        // 添加规则按钮
        $(`#${ADD_BTN_ID}`).on('click', function(e) {
            e.preventDefault();
            openModal();
        });

        // 弹窗关闭按钮
        $(`#${MODAL_CLOSE_ID}`).on('click', function(e) {
            e.preventDefault();
            closeModal();
        });

        // 取消按钮
        $(`#${CANCEL_BTN_ID}`).on('click', function(e) {
            e.preventDefault();
            closeModal();
        });

        // 保存按钮
        $(`#${SAVE_BTN_ID}`).on('click', function(e) {
            e.preventDefault();
            saveRule();
        });

        // 点击弹窗外部关闭
        $(`#${MODAL_ID}`).on('click', function(e) {
            if ($(e.target).is(this)) {
                closeModal();
            }
        });

        // ESC 关闭弹窗
        $(document).on('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        // 规则列表点击事件（委托）
        $(`#${RULE_LIST_ID}`).on('click', function(e) {
            const $card = $(e.target).closest('.rf-card');
            if (!$card.length) return;

            const ruleId = $card.data('id');

            // 展开/收起
            $card.toggleClass('expanded');

            // 编辑按钮
            if ($(e.target).closest('.rf-edit-btn').length) {
                const index = $card.data('index');
                openModal(rules[index]);
                return;
            }

            // 删除按钮
            if ($(e.target).closest('.rf-delete-btn').length) {
                const index = $card.data('index');
                deleteRule(index);
            }
        });
    }

    // -----------------------------------------------------------------
    // 5. 侧边栏控制
    // -----------------------------------------------------------------

    function toggleSidebar() {
        isSidebarOpen = !isSidebarOpen;
        $(`#${SIDEBAR_ID}`).toggleClass('open', isSidebarOpen);

        // 保存状态
        try {
            localStorage.setItem(STORAGE_KEY_SIDEBAR_STATE, isSidebarOpen);
        } catch (e) {
            console.warn(`[${extensionName}] 保存状态失败:`, e);
        }
    }

    function closeSidebar() {
        isSidebarOpen = false;
        $(`#${SIDEBAR_ID}`).removeClass('open');

        try {
            localStorage.setItem(STORAGE_KEY_SIDEBAR_STATE, 'false');
        } catch (e) {
            console.warn(`[${extensionName}] 保存状态失败:`, e);
        }
    }

    // -----------------------------------------------------------------
    // 6. 弹窗控制
    // -----------------------------------------------------------------

    function openModal(rule = null) {
        if (rule) {
            editingRuleId = rule.id;
            $(`#${MODAL_TITLE_ID}`).text('编辑规则');
            $(`#${TITLE_INPUT_ID}`).val(rule.title);
            $(`#${CONTENT_INPUT_ID}`).val(rule.content);
            $(`#${COLOR_SELECT_ID}`).val(rule.color || 'default');
        } else {
            editingRuleId = null;
            $(`#${MODAL_TITLE_ID}`).text('添加规则');
            $(`#${TITLE_INPUT_ID}`).val('');
            $(`#${CONTENT_INPUT_ID}`).val('');
            $(`#${COLOR_SELECT_ID}`).val('default');
        }

        $(`#${MODAL_ID}`).removeClass('rf-hidden');
    }

    function closeModal() {
        $(`#${MODAL_ID}`).addClass('rf-hidden');
        editingRuleId = null;
    }

    function saveRule() {
        const title = $(`#${TITLE_INPUT_ID}`).val().trim();
        const content = $(`#${CONTENT_INPUT_ID}`).val().trim();
        const color = $(`#${COLOR_SELECT_ID}`).val();

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
                    color
                };
            }
        } else {
            // 添加新规则
            rules.push({
                id: generateId(),
                title,
                content,
                color: settings.defaultColor,
                createdAt: Date.now()
            });
        }

        saveRules();
        closeModal();
    }

    function deleteRule(index) {
        if (confirm('确定要删除这条规则吗？')) {
            rules.splice(index, 1);
            saveRules();
        }
    }

    // -----------------------------------------------------------------
    // 7. 渲染函数
    // -----------------------------------------------------------------

    function renderRules() {
        const $ruleList = $(`#${RULE_LIST_ID}`);

        if (rules.length === 0) {
            $ruleList.html(
                '<div class="rf-empty"><p>暂无规则，点击下方按钮添加</p></div>'
            );
            return;
        }

        let html = '';
        rules.forEach((rule, index) => {
            const colorClass = rule.color && rule.color !== 'default' ? `rf-${rule.color}` : '';
            html += `
                <div class="rf-card ${colorClass}" data-id="${rule.id}" data-index="${index}">
                    <div class="rf-card-header">
                        <span class="rf-card-title">${escapeHtml(rule.title)}</span>
                    </div>
                    <div class="rf-card-content">${escapeHtml(rule.content)}</div>
                    <div class="rf-card-actions">
                        <button class="rf-edit-btn" data-index="${index}">编辑</button>
                        <button class="rf-delete-btn rf-delete" data-index="${index}">删除</button>
                    </div>
                </div>
            `;
        });

        $ruleList.html(html);
    }

    // -----------------------------------------------------------------
    // 8. 清理函数
    // -----------------------------------------------------------------

    function cleanup() {
        console.log(`[${extensionName}] 清理中...`);
        $(`#${TOGGLE_BTN_ID}`).remove();
        $(`#${SIDEBAR_ID}`).remove();
        $(`#rf-settings-panel`).remove();
        $(document).off('keydown', null, null, 'keydown');
    }

    // -----------------------------------------------------------------
    // 9. 初始化
    // -----------------------------------------------------------------

    function init() {
        console.log(`[${extensionName}] 开始初始化...`);

        // 加载数据和设置
        loadRules();
        loadSettings();

        // 创建 UI
        createToggleButton();
        createSidebar();
        renderRules();

        // 创建设置面板
        createSettingsPanel();

        // 应用设置 - 控制 UI 显示
        toggleExtensionUI(settings.enabled);

        // 恢复侧边栏状态
        try {
            const savedState = localStorage.getItem(STORAGE_KEY_SIDEBAR_STATE);
            if (savedState === 'true' && settings.enabled) {
                isSidebarOpen = true;
                $(`#${SIDEBAR_ID}`).addClass('open');
            }
        } catch (e) {
            console.warn(`[${extensionName}] 恢复状态失败:`, e);
        }

        // 设置全局快捷键
        updateGlobalShortcuts();

        console.log(`[${extensionName}] 初始化完成！`);
    }

    // 执行初始化
    init();

    // 暴露清理函数到全局（用于卸载时调用）
    window.ruleFictionCleanup = cleanup;
});

// 卸载脚本调用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {};
}
