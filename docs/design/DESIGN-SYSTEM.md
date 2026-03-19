# BlackRice Tarot - 设计系统

> **暗夜优雅** (Dark Elegant)
> 
> 像深夜星空下的占卜小屋——神秘但不压抑

---

## 一、品牌定位

### 1.1 情感基调

| 维度 | 描述 |
|------|------|
| **核心情感** | 暗夜优雅 - 神秘而不压抑 |
| **视觉隐喻** | 深夜星空下的占卜小屋 |
| **交互感受** | 弹性活泼 - 有回弹感，有趣但不轻浮 |

### 1.2 目标用户

基于 PRD 用户画像：

- **年龄**: 16-30岁
- **特征**: 对世界充满好奇，愿意探索未知
- **核心需求**: 寻求内心指引、收集图鉴、学习塔罗

### 1.3 IP 角色

| 角色 | 形象 | 定位 | 性格 |
|------|------|------|------|
| **黑米** | 🐈‍⬛ 黑猫 | 占卜者 (Reader) | 神秘、智慧 |
| **面包** | 🐱 白猫 | 问卜者 (Querent) | 好奇、温暖 |

---

## 二、色彩系统

### 2.1 主色 - 陶土橙

在深黑背景上形成温暖对比，既神秘又有温度。

```css
--primary-50:  #FEF6F3;   /* 最浅 */
--primary-100: #FDE9E1;
--primary-200: #FBD3C3;
--primary-300: #F5B59A;
--primary-400: #ED9370;   /* 悬停 */
--primary-500: #E07B5A;   /* ⭐ 主色 */
--primary-600: #CB5E3D;   /* 点击 */
--primary-700: #AA4A30;
--primary-800: #8C3E2B;
--primary-900: #743627;   /* 最深 */
```

### 2.2 背景色 - 虚空黑

深黑色阶，营造深夜星空的感觉。

```css
--void-950: #08080C;   /* 页面背景 */
--void-900: #0D0D12;   /* 卡片背景 */
--void-850: #121218;   /* 浮层背景 */
--void-800: #18181F;   /* 边框 */
--void-700: #252530;   /* 次级边框 */
--void-500: #52525E;   /* 辅助文字 */
--void-400: #71717A;   /* 次要文字 */
--void-200: #D4D4D8;   /* 主文字 */
--void-100: #F4F4F5;   /* 高亮文字 */
```

### 2.3 语义色

```css
/* 正位 - 翡翠绿 */
--upright: #34D399;

/* 逆位 - 玫瑰红 */
--reversed: #F87171;

/* 信息 - 星空紫 */
--info: #A78BFA;

/* 警告 - 琥珀 */
--warning: #FBBF24;
```

### 2.4 稀有度发光

```css
--glow-common: 0 0 8px rgba(224, 123, 90, 0.2);
--glow-rare: 0 0 12px rgba(224, 123, 90, 0.4), 0 0 24px rgba(224, 123, 90, 0.2);
--glow-epic: 0 0 16px rgba(167, 139, 250, 0.5), 0 0 32px rgba(167, 139, 250, 0.25);
--glow-legendary: 0 0 20px rgba(251, 191, 36, 0.6), 0 0 40px rgba(251, 191, 36, 0.3);
```

---

## 三、字体系统

### 3.1 字体家族

```css
/* 主字体 - 现代无衬线 */
--font-sans: "Inter", "SF Pro Display", "PingFang SC", "Noto Sans SC", system-ui, sans-serif;

/* 等宽字体 */
--font-mono: "JetBrains Mono", "SF Mono", monospace;
```

### 3.2 字号比例

| 名称 | 大小 | 用途 |
|------|------|------|
| `text-xs` | 12px | 辅助说明、徽章 |
| `text-sm` | 14px | 次要信息、标签 |
| `text-base` | 16px | 正文 |
| `text-lg` | 18px | 强调 |
| `text-xl` | 20px | 小标题 |
| `text-2xl` | 24px | 卡片标题 |
| `text-3xl` | 30px | 页面标题 |
| `text-4xl` | 36px | 大标题 |

### 3.3 字重

| 名称 | 值 | 用途 |
|------|------|------|
| `normal` | 400 | 正文 |
| `medium` | 500 | 标签、按钮 |
| `semibold` | 600 | 小标题 |
| `bold` | 700 | 大标题、强调 |

---

## 四、间距系统

基于 4px 基数：

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

---

## 五、圆角系统

```css
--radius-sm: 6px;    /* 小标签 */
--radius-md: 8px;    /* 输入框 */
--radius-lg: 12px;   /* 按钮、小卡片 */
--radius-xl: 16px;   /* 卡片 */
--radius-2xl: 20px;  /* 大卡片 */
--radius-card: 12px; /* 塔罗牌 */
```

---

## 六、阴影系统

暗色模式优化的阴影：

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.35), 0 2px 4px rgba(0, 0, 0, 0.2);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.4), 0 4px 6px rgba(0, 0, 0, 0.25);
--shadow-card: 0 8px 24px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.25);
```

---

## 七、动画系统

### 7.1 时长

```css
--duration-instant: 50ms;   /* 即时反馈 */
--duration-fast: 150ms;     /* 按钮状态 */
--duration-normal: 250ms;   /* 常规过渡 */
--duration-slow: 400ms;     /* 页面切换 */
--duration-ritual: 800ms;   /* 仪式感动画 */
```

### 7.2 缓动曲线

```css
/* 弹性曲线 - Spring */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-spring-soft: cubic-bezier(0.22, 1.2, 0.36, 1);
```

### 7.3 预设动画

| 动画 | 用途 |
|------|------|
| `fade-in` | 淡入 |
| `slide-up` | 向上滑入 |
| `spring-in` | 弹性入场 |
| `breathe` | 呼吸光效（卡牌待翻） |
| `twinkle` | 星星闪烁 |
| `shuffle` | 洗牌摇晃 |

---

## 八、组件规范

### 8.1 按钮

| 类型 | 类名 | 用途 |
|------|------|------|
| 主按钮 | `.btn-primary` | 柔和填充，常规操作 |
| 强调按钮 | `.btn-accent` | 实心渐变，重要操作 |
| 幽灵按钮 | `.btn-ghost` | 边框，次要操作 |

### 8.2 卡片

| 类型 | 类名 | 用途 |
|------|------|------|
| 基础卡片 | `.card` | 内容容器 |
| 玻璃卡片 | `.card-glass` | 毛玻璃效果 |
| 交互卡片 | `.card-interactive` | 可点击，有悬停效果 |

### 8.3 稀有度徽章

```html
<span class="badge-rarity badge-common">普通</span>
<span class="badge-rarity badge-rare">稀有</span>
<span class="badge-rarity badge-epic">史诗</span>
<span class="badge-rarity badge-legendary">传说</span>
```

### 8.4 正/逆位标签

```html
<span class="tag-upright">正位</span>
<span class="tag-reversed">逆位</span>
```

---

## 九、布局规范

### 9.1 导航

- **移动端**: 极简隐藏式，核心页面无导航
- **沉浸页面**: Daily Fortune 全屏无导航
- **其他页面**: 底部 Tab Bar（仅在需要时显示）

### 9.2 首页结构

```
┌─────────────────────────────────────────┐
│                                         │
│           ✦ 微光星空背景 ✦              │
│                                         │
│                                         │
│         ╔═════════════════════╗        │
│         ║                     ║        │
│         ║    今日塔罗卡牌     ║  ← 居中
│         ║   (待翻/已翻)       ║
│         ║                     ║        │
│         ╚═════════════════════╝        │
│                                         │
│        "轻触，开启今日指引"             │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

### 9.3 安全区

```css
--safe-top: env(safe-area-inset-top, 0px);
--safe-bottom: env(safe-area-inset-bottom, 0px);
```

---

## 十、全息效果 (HoloFoil)

### 10.1 效果等级

| 等级 | 触发条件 | 效果强度 |
|------|----------|----------|
| 普通 | 普通卡 | 微妙光泽 |
| 稀有 | 闪卡 | 明显彩虹 |
| 史诗 | 全息卡 | 强烈全息 |
| 传说 | 限定卡 | 最强光效 |

### 10.2 CSS 变量

```css
--holo-gradient: linear-gradient(
  135deg,
  rgba(224, 123, 90, 0.6) 0%,
  rgba(167, 139, 250, 0.5) 25%,
  rgba(52, 211, 153, 0.4) 50%,
  rgba(251, 191, 36, 0.5) 75%,
  rgba(224, 123, 90, 0.6) 100%
);
```

---

## 十一、可访问性

### 11.1 对比度

- 主文字 (void-200 on void-950): ~14:1 ✅
- 次文字 (void-400 on void-950): ~5.5:1 ✅
- 强调色 (primary-500 on void-950): ~5.2:1 ✅

### 11.2 动画偏好

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 11.3 触摸目标

- 最小点击区域: 44×44px
- 按钮间距: ≥8px

---

## 十二、文件结构

```
src/styles/
├── design-tokens.css      # 设计变量（唯一版本）
└── globals.css            # 全局样式

docs/design/
├── DESIGN-SYSTEM.md       # 本文档
└── INTERACTIVE-CONCEPT.md # 交互概念设计
```

---

## 更新日志

| 版本 | 日期 | 变更 |
|------|------|------|
| v2.0 | 2026-03-18 | 统一为暗夜优雅风格，移除旧版本 |
