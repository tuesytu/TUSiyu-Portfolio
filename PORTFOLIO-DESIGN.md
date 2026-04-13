# NOGGIN Portfolio Design System 4.0

## 核心视觉定位

- 手绘与系统的碰撞：粗犷的马克笔标题和严格的单线网格同时存在
- 触感审美：像实验记录本、档案页、纸质排版
- 结构化布局：强调大面积水平分割和全屏垂直网格

## 字体系统

### Type A

- 用途：主标题、作品标题、页脚大字
- 风格：手写 / 马克笔感粗体
- 技术实现：
  - 基础字体：`Arial Black`
  - 视觉处理：`SVG Turbulence Filter (#rough-edge)`
  - 规格：`5.5rem` / 行高 `0.85` / 字母间距 `-3px`

### Type B

- 用途：导航、标签、按钮、元信息
- 基础字体：`Space Mono Bold`
- 处理：强制大写
- 规格：`0.85rem` / 字母间距 `1px`

### Type C

- 用途：正文介绍、项目描述
- 基础字体：`Space Mono Regular`
- 处理：自然大小写
- 规格：`0.9rem`

### Type CN

- 用途：中文系统文本
- 基础字体：`PingFang SC`
- 规则：尺寸与英文对齐，不强制全大写

## 颜色系统

- 纸张背景：`#F2E7DF`
- 核心橙：`#D06444`
- 核心黄：`#FFC12D`
- 点缀绿：`#96A388`
- 线条炭黑：`#222222`
- 网格线：`rgba(34, 34, 34, 0.08)`

## 组件规范

### C1 Block Button

- 不规则边缘矩形
- 固定高度
- 大面积填充
- 用于页脚主 CTA

### C2 Pill Button

- 高度圆角
- 手绘滤镜质感
- 用于项目状态 / 操作入口

### C3 Small Tag

- 小矩形圆角标签
- 用于分类、状态、项目标记

### C4 Hand-drawn Circle Toggle

- 极细黑色描边
- 不规则椭圆形
- Hover 时 `rotate(-4deg)` + 轻微放大 + 描边加粗

## 全局尺寸

- Nav Height：`72px`
- Work Row Height：`240px`
- Grid System：`60px * 60px`

## 当前站点实现

- 文件：`index.html`
- 技术：静态 HTML + Tailwind CDN + 原生 CSS + 原生 JS
- 当前预览重点：
  - 不规则语言切换按钮
  - SVG rough-edge 滤镜
  - 固定高度作品行
  - 中英切换
  - NOGGIN 4.0 色彩与网格
