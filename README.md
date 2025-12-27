# 规则怪谈 - Chrome 扩展

在 SillyTavern 中玩规则怪谈游戏的侧边栏插件。

## 功能特性

- **侧边栏面板** - 右侧滑出式侧边栏，不遮挡主界面
- **规则卡片** - 点击展开/收起规则内容
- **自定义编辑** - 添加、编辑、删除规则
- **多种颜色** - 支持默认/警告/信息/注意/安全五种颜色
- **数据持久** - 规则存储在 Chrome 本地存储中

## 安装方法

1. 打开 Chrome 浏览器，地址栏输入 `chrome://extensions/`
2. 开启右上角的「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择 `rule-fiction-ext` 文件夹
5. 安装完成

## 使用方法

1. 点击页面右下角的 **R** 按钮展开侧边栏
2. 点击「+ 添加规则」创建新的规则卡片
3. 输入规则标题和内容，选择颜色后保存
4. 点击规则卡片展开查看完整内容
5. 点击「编辑」或「删除」管理规则

## 文件结构

```
rule-fiction-ext/
├── manifest.json      # 扩展清单文件
├── background.js      # 后台服务脚本
├── content.js         # 内容注入脚本
├── popup.html         # 弹出窗口页面
├── popup.js           # 弹出窗口脚本
├── sidebar.html       # 侧边栏页面
├── sidebar.css        # 侧边栏样式
├── sidebar.js         # 侧边栏逻辑
└── icons/             # 图标文件夹
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 自定义样式

在 `sidebar.css` 中可以修改：
- 侧边栏宽度：`#rule-fiction-sidebar` 的 `width` 属性
- 卡片圆角：`.rule-card` 的 `border-radius` 属性
- 主题颜色：`.btn-add` 和按钮样式

## 注意事项

- 首次使用前请确保已安装并启用扩展
- 规则数据存储在浏览器本地，更换设备后不会同步
- 建议定期备份重要规则内容

## License

MIT License
