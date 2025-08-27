# Universal Dark Mode

一个智能的通用深色模式用户脚本，自动将网页转换为深色主题，同时保护图片和视频的原始外观。

## 特性

- 🌙 **自动深色模式** - 跟随系统深色模式设置自动启用
- 🎯 **智能内容保护** - 保护图片、视频、logo 等媒体内容不被反转
- ⚡ **高性能** - 使用 CSS filter 实现，性能优异
- 🎨 **现代设计** - 按钮、输入框等表单元素采用现代深色主题设计
- 🔧 **可配置** - 支持排除指定网站，支持自定义参数
- 🚀 **兼容性强** - 支持 SPA 应用，适配各种网站架构

## 安装

1. 安装用户脚本管理器：
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome/Edge/Firefox/Safari)
   - [Violentmonkey](https://violentmonkey.github.io/) (Chrome/Firefox)
   - [Greasemonkey](https://www.greasespot.net/) (Firefox)

2. 点击安装脚本：
   - [darkmode.user.js](./darkmode.user.js) 

## 配置

### 排除网站

如果不希望在某些网站应用深色模式，可以修改 `config.excludeHosts` 参数：

```javascript
excludeHosts: 'github.com,google.com,*.stackoverflow.com'
```

支持的格式：
- 完整域名：`github.com`
- 通配符子域名：`*.google.com`
- 多个网站用逗号分隔

### 自定义参数

可以调整以下参数来优化显示效果：

```javascript
const config = {
    intensity: 0.9,    // 反转强度 (0-1)
    contrast: 1.1,     // 对比度调整
    brightness: 0.9,   // 亮度调整
    sepia: 0.1,        // 棕褐色效果 (减少蓝光)
    excludeHosts: ''   // 排除的网站
};
```

## 工作原理

1. **系统检测** - 仅在系统设置为深色模式时启用
2. **智能识别** - 检测网站是否已有深色主题，避免重复应用
3. **CSS Filter** - 使用 `invert()` 和 `hue-rotate()` 转换页面颜色
4. **内容保护** - 对图片、视频等媒体内容进行二次反转，恢复原始外观
5. **动态适配** - 监听 DOM 变化和 SPA 路由变化，自动适配动态内容

## 技术实现

### 核心CSS策略

```css
/* 页面主体反转 */
body {
    filter: invert(0.9) hue-rotate(180deg) contrast(1.1) brightness(0.9) sepia(0.1);
}

/* 媒体内容保护 */
img:not(.icon), video, canvas {
    filter: invert(1) hue-rotate(180deg) contrast(0.91) brightness(1.11);
}
```

### 智能图片过滤

使用CSS选择器精确识别和保护不同类型的内容：
- 排除图标和UI元素
- 保护头像、封面图等内容图片
- 特殊处理懒加载图片

## 兼容性

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ SPA 单页应用
- ✅ 动态加载内容

## 常见问题

### Q: 为什么有些网站没有应用深色模式？
A: 脚本仅在系统深色模式开启时工作。检查操作系统设置是否启用了深色主题。

### Q: 如何排除特定网站？
A: 修改脚本中的 `excludeHosts` 配置，添加要排除的域名。

### Q: 图片显示异常怎么办？
A: 脚本已经优化了图片处理逻辑，如遇问题可以调整 `intensity` 等参数。

## 版本历史

- **v1.2.0** - 添加网站排除功能，优化UI样式，修复图片反转问题
- **v1.1.0** - 改进媒体内容保护，支持更多网站
- **v1.0.0** - 初始版本

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

[MIT License](LICENSE)

