# 开发进度

> 记录开发状态，换机器后从此文件继续

## 当前状态

**阶段**：基础功能开发

**最后更新**：2025-12-27

---

## 已完成 ✅

### 核心功能
- [x] 侧边栏 UI（右侧滑出）
- [x] 规则卡片（展开/收起）
- [x] CRUD 操作（添加/编辑/删除）
- [x] 5 种颜色标记（默认/红/蓝/黄/绿）
- [x] 数据持久化（localStorage）

### 设置面板
- [x] 启用/禁用扩展开关
- [x] 默认卡片颜色设置
- [x] 快捷键配置（ESC/Q/W/X）
- [x] 规则导入/导出（JSON 格式）
- [x] 清除所有数据（危险操作）
- [x] 规则数量显示

### 工程化
- [x] SillyTavern 扩展 manifest.json
- [x] jQuery 架构
- [x] z-index 冲突防护
- [x] 清理函数（卸载时移除 DOM）
- [x] 编码规范总纲

### 文档
- [x] README.md（项目说明）
- [x] INSTALL.md（安装指南）
- [x] CODING_STANDARD.md（编码规范）

---

## 待办 ⏳

### 优化
- [ ] 移动端适配优化
- [ ] 深色模式支持

### 未来功能
- [ ] 规则模板预设
- [ ] 规则搜索/筛选
- [ ] 批量操作

---

## 技术决策

| 决策 | 选择 | 原因 |
|------|------|------|
| 扩展格式 | SillyTavern 第三方扩展 | 可通过扩展管理器安装 |
| UI 库 | jQuery（SillyTavern 内置） | 无需额外依赖 |
| 数据存储 | localStorage | 简单够用 |
| 样式方案 | 纯 CSS + CSS 变量 | 轻量级 |
| 命名空间 | `rf-` 前缀 | 避免冲突 |
| z-index 基准 | 10000 | 低于其他悬浮插件 |

---

## 本地路径

```
项目目录：C:\Users\Administrator\Desktop\没想好\rule-fiction-ext
Git 仓库：C:\Users\Administrator\Desktop\没想好\rule-fiction-ext\.git
```

---

## 继续开发

```bash
# 1. 进入项目目录
cd "C:\Users\Administrator\Desktop\没想好\rule-fiction-ext"

# 2. 查看状态
git status

# 3. 查看最近提交
git log --oneline -5

# 4. 拉取最新（如果有远程）
git pull

# 5. 开始开发...
```

---

## 下一步

从待办列表中选择一个功能开发，或根据需求新增。
