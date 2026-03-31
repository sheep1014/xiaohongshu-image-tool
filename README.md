# 小红书图片生成器

一个本地网页小工具。

## 功能

- 上传主图 / 截图
- 编辑主标题、副标题、说明卡片、标签
- 切换深色 / 浅色模板
- 切换 3:4 / 4:5 / 1:1 比例
- 导出 PNG
- 支持直接拖图片进页面

## 使用

### 方式 1：直接用本地临时服务

如果我已经帮你启动了服务，直接打开：

- http://127.0.0.1:8765

### 方式 2：你自己启动

在这个目录执行：

```bash
cd /Users/sheeepsheepmac/.openclaw/workspace/xiaohongshu-image-tool
python3 -m http.server 8765
```

然后浏览器打开：

- http://127.0.0.1:8765

## 文件结构

- `index.html` 页面结构
- `styles.css` 样式
- `script.js` 交互和导出逻辑
- `assets/reference.png` 示例参考图

## 备注

导出使用 `html2canvas` CDN。
如果后面你要：

- 做成多个模板
- 批量生成
- 命令行生成
- 自动套你的小红书常用文案风格

可以继续在这个基础上加。
