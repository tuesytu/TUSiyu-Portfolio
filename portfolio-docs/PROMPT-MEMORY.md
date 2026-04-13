# Prompt Memory

这是当前作品集网站的长期记忆文件。

后续你通过对话补充的偏好、风格结论、结构调整、禁用项，都应该持续写回这里。  
可以把它理解成“项目内的记忆型 Markdown”，作用类似一个长期伴随的 skill 上下文。

## 当前已确认内容

### 项目目标

- 做一个个人作品集网站
- 展示简历、作品、其他作品
- 支持中英双语切换

### 当前主视觉系统

- 使用 `NOGGIN Playful Systematic 4.1`
- 整体感觉：手绘 + 系统化 + 实验记录本 + 档案页 + 简历式分段浏览
- 避免普通圆角 SaaS 卡片风

### 当前关键视觉规则

- 底色：`#F2E7DF`
- 主强调：`#FFC12D`
- 次强调：`#D06444`
- 墨迹色：`#222222`
- 背景使用 `60px * 60px` 细线网格
- 标题：粗糙马克笔感
- 导航 / 标签 / 按钮：`Space Mono`
- 中文系统文字：`PingFang SC`
- 页面里的中文要显式使用 `PingFang SC`，不要依赖英文字体回退
- 但展示型中文例外：技能圆文字和大标题中文要保留之前的显示字体风格，不用苹方
- `项目经历` 和 `实习经历` 里的正文说明文字使用 `PingFang SC`
- 页面标题使用：`TU Siyu Portfolio`
- 联系方式文字优先使用：`PingFang SC`
- 数字 + 标题的分段导航上方不要额外横线
- `Education / Projects / Internships` 三个模块的分段导航上边距更紧
- `Projects / Internships` 内部经历块纵向间距再收紧一点
- 封面主标题改为：`TU Siyu / Portfolio`
- 页脚黑底收尾文案改为：`See You`
- 在实习经历后新增 `Other Work` 模块，版式参考 `About Me`
- 其他作品图片统一放在：`other-work-images/`
- 当前为 12 张图，文件名按 `01.png` 到 `12.png` 对应
- 邮箱统一使用小写展示
- 教育背景悬停说明标签使用 `PingFang SC`
- 教育背景主标签与悬停说明标签之间保持稳定等距
- `Education / Projects / Internships` 细分行之间不要细横线
- 这些模块整体留白继续偏紧凑
- `Other Work` 模块不要再显示 `05 / 其他作品 OTHER WORK` 那条导航标题
- 模块 `2-4` 的垂直节奏规则：
  - 模块整体上下留白最大
  - 导航标题到内容的间距次之
  - 两条内容之间的间距最小
  - 视觉上不能出现下边距明显大于上边距
  - 当前倾向是下边距略收，内容之间再紧一点
- 模块导航标题颜色按背景对比切换：
  - 默认用红色
  - 背景变成红色或绿色时切成白色
  - 当前 `Education` 与 `Projects` 用白色，其他模块保持红色
- `Other Work` 使用错落作品墙排版，不要整齐均分网格
- `Other Work` 图片不要边框
- `Other Works` 图片整体大小保持接近一致
- `Other Works` 使用两排错落作品带，不是静态宫格
- 默认状态下图片整体从右向左循环漂移，左侧消失后从右侧连续补入
- 鼠标悬停时当前图片放大，整排漂移暂停
- 顶部导航需要支持点击后平滑滚动到对应模块
- 顶部第三项文案改为 `Other Works`
- 顶部第二项文案改为 `作品集 PROJECTS`
- 当前仍保持原有分段结构：
  - `About Me`
  - `Education`
  - `Project Experience`
  - `Internships`
  - `Projects`
  - `Other Works`
- `Education / Project Experience / Internships` 都属于 `About Me` 这一板块语义
- 单独的 `作品集 PROJECTS` 标题块放在 `Other Works` 前面
- 不要为了折叠交互改掉原本的样式、层级和间距
- `About Me` 标题和下面 `技能概括` 之间不要出现横线
- `About Me` 与 `Other Works` 的主标题都采用中文在前、英文在后
- `Other Works` 标题写作：`其他作品 OTHER WORKS`
- `About Me` 主标题区上边距要比之前更紧一点
- 在 `Other Works` 前新增一个可导航的 `作品集 PROJECTS` 板块标题
- 顶部导航滚动定位要精确到目标模块顶部线与顶部导航栏底线重合
- 页脚 `See You` 高度要与封面主标题同级
- 页脚整体高度要更接近顶部封面区块的纵向体量，不要显得过短
- 黑色 `See You` 页脚应接近一整屏高度，而不是普通短页脚
- 拉高页脚后，`See You` 标题要保持在黑色页面视觉正中间
- 当前 `See You` 需要在此基础上再上移 `80px`
- 页脚底部保留一排白字联系信息，格式参考：
  - `TEL/Wechat`
  - `E-mail`
  - `TU Siyu Personal portfolio`

### 当前页面结构偏好

- 左上角显示 `Portfolio`
- 顶部导航当前采用中英并置：
  - `关于我 ABOUT ME`
  - `作品集 WORKS`
  - `其他 OTHER`
- 右上角语言切换器使用不规则手绘圈按钮
- 页面主体当前分为：
  - Hero
  - About / Skills
  - Education
  - Projects
  - Internships
  - Footer / Contact

### 当前实现策略

- 先使用静态 HTML 快速迭代视觉
- 后续如果内容和交互变复杂，再迁移到 React / Vite

### 当前未完成内容

- 语言切换按钮目前仍是视觉组件，尚未接入完整双语内容切换
- 作品详情页、其他作品图片墙、完整项目资料还没有并入这版页面
- 当前页面已从纯视觉样张，推进到个人简历型首页，但还不是最终完整作品集

## 后续更新规则

每次用户明确说“改成这样”“以后都按这个来”“不要再那样做”，都应更新到这里。
