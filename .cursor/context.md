# BlackRice Tarot - 项目上下文

> 更新日期：2026-03-18

## 项目概述

**BlackRice Tarot**（黑米塔罗）是一款基于 Vite + Vue3 + TypeScript 的轻量级塔罗占卜 Web App，支持 GitHub Pages 部署及 Capacitor 打包原生 App。产品名字源自小黑猫"黑米"，融合塔罗的神秘感与黑猫的灵性。

### 核心特点

| 特点 | 描述 |
|------|------|
| 🚀 即开即用 | 无需注册，打开即可使用 |
| 🌙 视觉沉浸 | 神秘感强的深色金色主题 |
| 👆 轻交互 | 简洁的点击/翻牌交互体验 |
| 📱 跨端适配 | PC、移动端、原生 App |
| 🔮 专业内容 | 基于韦特塔罗的专业解读 |
| 🌍 国际化 | 中英双语支持 |

---

## 技术栈

### 核心技术

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.4+ | UI 框架（组合式 API） |
| TypeScript | 5.x | 类型安全 |
| Vite | 5.x | 构建工具 |
| Tailwind CSS | 3.x | 原子化 CSS |
| Vue Router | 4.x | 路由管理 |
| vue-i18n | 11.x | 国际化 |
| Capacitor | 8.x | 原生 App 打包 |

### 辅助库

| 库 | 用途 |
|----|------|
| motion-v | 动画库（Vue 版 Framer Motion） |
| lucide-vue-next | 图标库 |
| clsx + tailwind-merge | 条件类名合并 |
| @vueuse/core | Vue 组合式工具库 |
| @capacitor/haptics | 震动反馈 |
| @capacitor/share | 系统分享 |
| @capacitor/preferences | 本地存储 |

---

## 项目结构

```
tarot/
├── .cursor/                    # Cursor IDE 配置
│   └── context.md              # 项目上下文（本文件）
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 自动部署
├── docs/                       # 产品与技术文档
│   ├── product/                # PRD、UX 设计、用户流程
│   ├── technical/              # 技术架构、API 设计、路线图
│   └── reference/              # 塔罗牌参考资料
├── public/
│   └── favicon.svg             # 网站图标
├── src/
│   ├── assets/
│   │   └── tarot/              # 塔罗牌图片资源
│   │       ├── 178/            # 莱德韦特牌组图片
│   │       └── README.md       # 牌组资源说明
│   ├── components/             # 组件
│   │   ├── tarot/              # 塔罗业务组件
│   │   │   ├── TarotCard.vue   # 塔罗牌纯渲染组件
│   │   │   ├── HoloTarot.vue   # 全息塔罗牌组件（tilt+flip+zoom）
│   │   │   └── index.ts        # 组件导出
│   │   ├── holo/               # 全息效果组件
│   │   │   ├── HoloFoil.vue    # hover-tilt 包装器
│   │   │   ├── presets.ts      # 全息效果预设配置
│   │   │   ├── effects/        # CSS 效果（shadows, gradients, masks）
│   │   │   └── index.ts        # 组件导出
│   │   ├── deck/               # 牌组组件
│   │   │   └── DeckCover.vue   # 牌组封面展示
│   │   ├── ui/                 # 基础 UI 组件
│   │   │   └── button.vue
│   │   ├── NavBar.vue          # 导航栏（底部 Tab Bar）
│   │   └── StarBackground.vue  # 星空背景
│   ├── composables/            # 组合式函数
│   │   ├── useTarot.ts         # 塔罗状态管理（含翻牌状态持久化）
│   │   └── useDevice.ts        # 设备检测
│   ├── data/                   # 数据层
│   │   ├── index.ts            # 数据导出、多语言数据加载
│   │   ├── tarot-base.json     # 基础配置（逆位概率等）
│   │   └── card-images.ts      # 卡牌图片路径工具
│   ├── i18n/                   # 国际化
│   │   ├── index.ts            # i18n 配置
│   │   └── locales/
│   │       ├── zh.json         # 中文 UI 文案
│   │       ├── en.json         # 英文 UI 文案
│   │       └── cards/
│   │           ├── zh.json     # 中文牌义（78张）
│   │           └── en.json     # 英文牌义（78张）
│   ├── layouts/                # 布局组件
│   │   └── MainLayout.vue      # 主布局
│   ├── lib/                    # 工具库
│   │   └── utils.ts            # 通用工具函数 (cn)
│   ├── pages/                  # 页面视图
│   │   ├── Home.vue            # Daily Fortune 首页（单卡抽取）
│   │   ├── Divination.vue      # 占卜页（3/5 牌阵选择）
│   │   ├── Reading.vue         # 解读页（轮播展示）
│   │   ├── Library.vue         # 牌库页（网格收集）
│   │   └── Settings.vue        # 设置页
│   ├── router/                 # 路由配置
│   │   └── index.ts
│   ├── styles/                 # 样式
│   │   ├── design-tokens.css   # 设计系统变量（暗夜优雅）
│   │   └── globals.css         # 全局样式
│   ├── App.vue                 # 根组件
│   ├── main.ts                 # 入口文件
│   └── vite-env.d.ts           # Vite 类型声明
├── capacitor.config.ts         # Capacitor 配置
├── index.html                  # HTML 入口
├── package.json                # 依赖配置（pnpm）
├── pnpm-lock.yaml              # 依赖锁定
├── postcss.config.js           # PostCSS 配置
├── tailwind.config.js          # Tailwind 配置
├── tsconfig.json               # TypeScript 配置
├── tsconfig.node.json          # Node TypeScript 配置
└── vite.config.ts              # Vite 配置
```

---

## 国际化架构

### 语言文件结构

```
src/i18n/
├── index.ts              # i18n 配置（自动检测浏览器语言）
└── locales/
    ├── zh.json           # 中文 UI 文案
    ├── en.json           # 英文 UI 文案
    └── cards/
        ├── zh.json       # 中文牌义数据
        └── en.json       # 英文牌义数据
```

### 多语言数据加载

```typescript
// 使用方式 1：在组件中使用 UI 文案
const { t } = useI18n()
const label = t('home.drawButton') // "开始抽牌" / "Draw Cards"

// 使用方式 2：获取响应式牌义数据
const { majorArcana, suits, tips, spreads } = useTarot()
// 数据会随 locale 变化自动切换语言
```

### 支持的语言

| 语言代码 | 语言名称 | 状态 |
|---------|---------|------|
| `zh` | 简体中文 | ✅ 完整 |
| `en` | English | ✅ 完整 |

---

## Capacitor 集成

### 配置文件

```typescript
// capacitor.config.ts
{
  appId: 'com.blackrice.tarot',
  appName: 'BlackRice Tarot',
  webDir: 'dist',
}
```

### 可用插件

| 插件 | 用途 | composable |
|------|------|------------|
| @capacitor/haptics | 震动反馈 | `useNative().hapticFeedback()` |
| @capacitor/share | 系统分享 | `useNative().shareCard()` |
| @capacitor/preferences | 本地存储 | `useNative().saveData()` / `loadData()` |
| @capacitor/status-bar | 状态栏控制 | - |
| @capacitor/splash-screen | 启动屏 | - |

### 构建命令

```bash
# Web 构建（GitHub Pages）
pnpm build

# Capacitor 构建（原生 App）
pnpm build:cap

# 打开 iOS 项目（需先 npx cap add ios）
pnpm app:ios

# 打开 Android 项目（需先 npx cap add android）
pnpm app:android
```

---

## SOP：开发与部署流程

### 1. 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 访问 http://localhost:5173
```

### 2. 构建测试

```bash
# 构建生产版本
pnpm build

# 本地预览构建结果
pnpm preview
```

### 3. 部署到 GitHub Pages

#### 方式 A：自动部署（推荐）

1. 将代码推送到 GitHub 仓库的 `main` 分支
2. 进入仓库 Settings → Pages
3. Source 选择 "GitHub Actions"
4. 推送代码后自动触发部署

#### 方式 B：手动部署

```bash
pnpm deploy
```

### 4. Capacitor App 构建

```bash
# 首次添加平台
npx cap add ios      # 需要 Mac + Xcode
npx cap add android  # 需要 Android Studio

# 构建并打开原生项目
pnpm app:ios
pnpm app:android
```

---

## 核心功能

### 当前实现 (v1.5 暗夜优雅版)

- [x] 78 张塔罗牌完整数据（22大 + 56小阿尔卡纳）
- [x] Daily Fortune 每日运势首页（沉浸式单卡）
- [x] 多牌阵支持：单牌、三牌阵、五牌阵
- [x] **逆位模式**：经典(50%)、轻逆位(30%)、重逆位(70%)、极轻(10%)
- [x] **HoloTarot 卡牌系统**
  - hover-tilt 3D 倾斜效果
  - Glare 全息效果（多种预设）
  - 双面 tilt 架构（正反面独立倾斜）
  - 3D 翻转 + 点击放大（动态居中 + 最高层级）
  - 翻牌状态 useStorage 持久化
- [x] **暗夜优雅设计系统**
  - 陶土橙主色 + 虚空黑背景
  - CSS 设计令牌 `design-tokens.css`
  - 弹性动画曲线 (Spring Easing)
- [x] 星空背景动画
- [x] 轮播式解读页面
- [x] 网格收集式牌库（含锁定/解锁状态）
- [x] 响应式布局（移动优先）
- [x] 多牌组支持（Emoji + 韦特塔罗 + 中国风）
- [x] i18n 国际化（中英双语）
- [x] Capacitor 项目结构（原生 App 支持）
- [x] GitHub Pages 一键部署

### 扩展方向

- [ ] 更多牌阵（凯尔特十字等）
- [ ] 抽牌历史记录（LocalStorage）
- [ ] 图鉴收集系统（稀有度）
- [ ] 分享功能（生成卡片）
- [ ] AI 解读集成
- [ ] PWA 离线支持
- [ ] iOS/Android App 上架

---

## 设计系统

> **暗夜优雅** (Dark Elegant) - 像深夜星空下的占卜小屋

详见 `docs/design/DESIGN-SYSTEM.md`

### 核心颜色

```css
/* 主色 - 陶土橙 */
--primary-500: #E07B5A;   /* 主色 */
--primary-400: #ED9370;   /* 悬停 */
--primary-600: #CB5E3D;   /* 点击 */

/* 背景 - 虚空黑 */
--void-950: #08080C;      /* 页面背景 */
--void-900: #0D0D12;      /* 卡片背景 */
--void-200: #D4D4D8;      /* 主文字 */
--void-400: #71717A;      /* 次要文字 */

/* 语义色 */
--upright: #34D399;       /* 正位 - 翡翠绿 */
--reversed: #F87171;      /* 逆位 - 玫瑰红 */
```

### 交互流程

```mermaid
flowchart TD
    A[进入首页] --> B{当日已抽?}
    B -->|否| C[显示卡背]
    C --> D[点击翻牌]
    D --> E[3D 翻转动画]
    E --> F[显示解读]
    B -->|是| F
    F --> G{继续?}
    G -->|更多牌阵| H[占卜页]
    G -->|浏览牌库| I[牌库页]
    H --> J[选择牌阵]
    J --> K[抽牌]
    K --> L[依次翻牌]
    L --> M[查看解读]
```

---

## 配置项

### 逆位模式

在设置页可选择四种模式：

| 模式 | 概率 | 说明 |
|------|------|------|
| 经典 Classic | 50% | 标准随机 |
| 轻逆位 Light | 30% | 适合初学者 |
| 重逆位 Heavy | 70% | 强调挑战 |
| 极轻 Minimal | 10% | 几乎无逆位 |

### 牌阵配置

牌阵数据位于语言文件 `src/i18n/locales/cards/{lang}.json` 的 `spreads` 字段：

```json
{
  "spreads": {
    "1": {
      "name": "单牌占卜",
      "description": "最简单的牌阵，适合每日指引或快速问答",
      "positions": [{ "name": "今日指引", "row": 0, "col": 0 }]
    }
  }
}
```

### 语言设置

语言偏好存储在 `localStorage` 的 `tarot-locale` 键中，默认自动检测浏览器语言。

---

## 内容呈现原则

1. **反思工具定位** - 塔罗作为自我探索的镜子，而非命运预测
2. **正向引导** - 即使是"困难"牌也提供建设性解读
3. **明确 AI 定位** - 娱乐和自我反思用途，不提供决策建议
4. **尊重传统** - 基于韦特塔罗经典含义，不随意臆造

---

## 常见问题

### Q: 部署后页面空白？

检查 `vite.config.ts` 中的 `base` 是否与仓库名匹配。

### Q: 如何添加新语言？

1. 在 `src/i18n/locales/` 下创建 `{lang}.json`（UI 文案）
2. 在 `src/i18n/locales/cards/` 下创建 `{lang}.json`（牌义数据）
3. 在 `src/data/index.ts` 的 `cardDataMap` 中注册新语言
4. 在 `src/i18n/index.ts` 的 `messages` 中添加新语言
5. 在 Settings 页面的 `languageOptions` 中添加选项

### Q: 如何修改牌阵？

1. 在所有语言的 `cards/{lang}.json` 的 `spreads` 中添加新牌阵
2. 在 `src/data/index.ts` 的 `generateSummary` 中添加对应解读逻辑

### Q: 如何构建原生 App？

1. 运行 `pnpm build:cap` 构建 Web 资源
2. 运行 `npx cap add ios` 或 `npx cap add android`
3. 运行 `npx cap sync` 同步资源
4. 运行 `npx cap open ios` 或 `npx cap open android` 打开原生项目

---

## 相关资源

- [Vue 3 文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [vue-i18n 文档](https://vue-i18n.intlify.dev/)
- [Capacitor 文档](https://capacitorjs.com/docs)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- 项目文档：`docs/` 目录
