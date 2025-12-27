# 编码规范总纲

## 核心原则

**优雅、简洁、可读**

代码是写给人看的，顺便让机器执行。

---

## 一、命名规范

### 1.1 变量与函数

```javascript
// ✅ 好的命名
const rules = [];
function loadRules() { }
const isSidebarOpen = false;

// ❌ 避免
const arr = [];
function load() { }
let flag = false;
```

- 使用 **英文命名**，见名知意
- 变量用 **名词** 或 **形容词**，如 `isValid`、`userData`
- 函数用 **动词**，如 `loadRules`、`saveData`
- 常量全大写 + 下划线，如 `STORAGE_KEY`

### 1.2 扩展相关

```javascript
// ✅ 扩展名格式
const extensionName = "rule-fiction-system";  // kebab-case
const STORAGE_KEY = "rule-fiction-rules";     // storage key

// ✅ DOM ID 统一前缀
const SIDEBAR_ID = "rf-sidebar";              // rf = rule fiction
const TOGGLE_BTN_ID = "rf-toggle-btn";
```

- 扩展文件夹：`kebab-case`
- 存储键：包含扩展名，避免冲突
- DOM ID：统一前缀 `rf-`

---

## 二、注释规范

### 2.1 注释原则

**只注释"为什么"，不注释"是什么"**

```javascript
// ✅ 好的注释 - 解释原因
// 2秒冷却时间，避免频繁保存
const SYNC_SAVE_COOLDOWN = 2000;

// ❌ 避免的注释 - 重复代码含义
// 这是一个数组
const rules = [];
```

### 2.2 重点部分使用中文

```javascript
// ----------------
// 1. 定义常量和状态变量
// ----------------

// 存储键
const STORAGE_KEY_RULES = "rule-fiction-rules";

// 状态
let rules = [];
let isSidebarOpen = false;

// 安全的 z-index 值，避免影响其他插件
const SAFE_Z_INDEX = {
    button: 10000,
    sidebar: 10001,
    modal: 10010
};
```

### 2.3 区块划分

```javascript
// -----------------------------------------------------------------
// 1. 定义常量和状态变量
// -----------------------------------------------------------------

// -----------------------------------------------------------------
// 2. 工具函数
// -----------------------------------------------------------------

// -----------------------------------------------------------------
// 3. UI 创建函数
// -----------------------------------------------------------------
```

使用 `// ----------------` 或 `// ---` 进行逻辑区块划分。

---

## 三、代码结构

### 3.1 典型文件结构

```javascript
// 1. 注释说明
// ----------------

// 2. 常量定义
// ----------------

// 3. 状态变量
// ----------------

// 4. DOM 元素引用
// ----------------

// 5. 工具函数
// ----------------

// 6. UI 创建函数
// ----------------

// 7. 事件绑定
// ----------------

// 8. 业务逻辑函数
// ----------------

// 9. 初始化
// ----------------
```

### 3.2 函数顺序

1. 工具函数（`generateId`、`escapeHtml`）
2. 数据函数（`loadRules`、`saveRules`）
3. UI 创建函数（`createSidebar`、`createButton`）
4. 事件函数（`bindEvents`、`handleClick`）
5. 业务函数（`toggleSidebar`、`saveRule`）
6. 渲染函数（`renderRules`）
7. 初始化函数（`init`）

---

## 四、jQuery 规范

### 4.1 统一使用 jQuery

```javascript
// ✅ 使用 $ 前缀命名 jQuery 对象
const $sidebar = $('#rf-sidebar');
const $btn = $('#rf-toggle-btn');

// ❌ 避免混用
const sidebar = document.getElementById('rf-sidebar');
```

### 4.2 事件委托

```javascript
// ✅ 好的写法 - 事件委托
$('#rule-list').on('click', '.rf-card', function(e) {
    const id = $(this).data('id');
    // ...
});

// ❌ 避免的写法 - 循环绑定
$('.rf-card').each(function() {
    $(this).on('click', ...);
});
```

### 4.3 链式调用

```javascript
// ✅ 链式调用
$('<div>')
    .attr('id', 'rf-sidebar')
    .addClass('rf-sidebar')
    .css({ width: '380px' })
    .appendTo('body');
```

---

## 五、样式规范

### 5.1 CSS 变量

```css
:root {
    --rf-bg-color: #ffffff;
    --rf-text-color: #1a1a1a;
    --rf-primary: #1a1a1a;
    --rf-radius: 8px;
    --rf-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

### 5.2 选择器前缀

```css
/* 所有选择器使用 rf- 前缀，避免污染 */
.rf-sidebar { }
.rf-card { }
.rf-btn-primary { }
```

### 5.3 !important 使用

仅在以下情况使用：
- 覆盖第三方库的样式
- 动态定位（如 `position: fixed`）

```css
#rf-toggle-btn {
    position: fixed !important;  // 必须使用 !important
    z-index: 10000 !important;
}
```

---

## 六、文件管理

### 6.1 必要文件

```
├── manifest.json      # 扩展清单（必须）
├── index.js           # 主脚本（必须）
├── style.css          # 样式文件（必须）
├── README.md          # 简要说明（推荐）
└── INSTALL.md         # 安装说明（可选）
```

### 6.2 禁止添加

- ❌ `test.js` / `test.html`
- ❌ `demo.html`
- ❌ `notes.txt`
- ❌ 过多的 md 文档

保持项目根目录简洁。

---

## 七、性能与安全

### 7.1 避免全局污染

```javascript
// ✅ 好的写法 - 封装在闭包中
jQuery(async () => {
    // 代码...
    window.myExtensionCleanup = cleanup;  // 只暴露必要函数
});

// ❌ 避免的写法
let globalState = {};
function globalHandler() { }
```

### 7.2 错误处理

```javascript
function loadRules() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) rules = JSON.parse(stored);
    } catch (e) {
        console.warn('[Extension] 加载数据失败:', e);
        rules = [];
    }
}
```

### 7.3 XSS 防护

```javascript
// 展示用户输入前必须转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

$('.rf-card-title').text(escapeHtml(rule.title));
```

---

## 八、Git 规范

### 8.1 提交信息

```
feat: 新增规则卡片展开/收起功能
fix: 修复侧边栏关闭按钮无效的问题
refactor: 重构代码结构
docs: 更新安装说明
```

### 82 .gitignore

```
# 构建产物
*.pem
*.crx

# 编辑器
.vscode/
.idea/

# OS 文件
.DS_Store
Thumbs.db
```

---

## 九、检查清单

提交代码前确认：

- [ ] 变量命名清晰，见名知意
- [ ] 复杂逻辑有中文注释
- [ ] 没有多余的 test 文件
- [ ] 没有无用的 md 文档
- [ ] 代码格式整齐
- [ ] 没有全局污染
- [ ] 用户输入已转义
- [ ] 错误有处理

---

## 快速参考

```
扩展名 → kebab-case
存储键 → "扩展名-业务名"
CSS 前缀 → "rf-"
注释 → 重点用中文
文件 → 只留必要的
```

简洁即美德。
