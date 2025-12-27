# 图标说明

Chrome 扩展需要 PNG 格式的图标文件。

## 需要的图标尺寸

- `icon16.png` - 16x16 像素
- `icon48.png` - 48x48 像素
- `icon128.png` - 128x128 像素

## 临时方案

当前使用 SVG 格式的 `icon.svg` 作为后备，某些浏览器可能支持。

## 快速生成 PNG 图标

### 使用 PowerShell（需要 ImageMagick）
```powershell
convert -background none -resize 16x16 icon.svg icon16.png
convert -background none -resize 48x48 icon.svg icon48.png
convert -background none -resize 128x128 icon.svg icon128.png
```

### 在线工具
1. 打开 https://cloudconvert.com/svg-to-png
2. 上传 `icon.svg`
3. 分别转换为 16x16、48x48、128x128
4. 下载并保存到 `icons` 文件夹

### 设计建议
- 保持简洁的 "R" 字母设计
- 使用黑白配色
- 确保在 16px 小尺寸下仍可辨识
