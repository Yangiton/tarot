# 塔罗牌卡面设计规范

> 更新日期：2026-03-11

---

## 概述

塔罗牌的卡面设计不仅是艺术创作，还需兼顾占卜的功能性。本文档包含：
- **Part A**: 实体塔罗牌设计规范（印刷标准）
- **Part B**: Web App 数字卡片设计规范（前端实现）

---

# Part A: 实体塔罗牌设计规范

## A1. 尺寸与比例规范

### 标准尺寸

| 版本 | 尺寸 | 说明 |
|:---:|:---:|:---|
| **标准版** | 70mm × 120mm | 最通用的标准尺寸 |
| **口袋版** | 57mm × 89mm | 类似扑克牌大小，便于携带 |
| **大型版** | 80mm × 145mm | 适合收藏或大型展示 |

### 印刷规范

| 项目 | 规格 | 说明 |
|:---|:---|:---|
| 比例 | 约 1:1.71 | 标准版基于 70×120mm，本项目图片 199×340px（1:1.709） |
| 出血位 | 2-3mm | 印刷设计时需预留，防止切边偏差 |
| 安全区 | 距边缘 5mm | 重要内容不应超出此区域 |
| 分辨率 | 300 DPI | 印刷品质量标准 |
| 色彩模式 | CMYK | 印刷用色彩模式 |

---

## A2. 正面（牌面）设计规范

正面设计需平衡视觉美感与象征意义的传达。

### 核心元素布局

```
┌─────────────────────────────────┐
│           [编号区]              │  ← 罗马数字 (大阿) / 阿拉伯数字 (小阿)
│                                 │
│                                 │
│                                 │
│          [图像区]               │  ← 占据牌面大部分空间
│      (经典符号与场景)            │     包含对应牌义的象征元素
│                                 │
│                                 │
│                                 │
│         [名称标签]              │  ← 底部，标明牌名
└─────────────────────────────────┘
```

### 设计要素

| 要素 | 规范 | 说明 |
|:---|:---|:---|
| **图像区** | 占牌面 70-80% | 包含对应牌义的经典符号（如皇后牌的麦田、森林、金星符号） |
| **编号** | 上方或下方中心 | 大阿尔卡纳使用罗马数字 (0-XXI)，小阿尔卡纳使用阿拉伯数字 |
| **名称标签** | 底部居中 | 标明牌名（如 "THE FOOL"），建议使用易读的装饰性字体 |
| **边框** | 统一风格 | 建议 3-5mm 宽度，增强视觉完整性 |

### 视觉设计原则

1. **视觉分层**：图形应详细且分组良好，不宜过于杂乱，确保占卜者能一眼识别关键信息
2. **色彩象征**：不同派系对色彩有严格定义，需保持整套牌的色调统一
   - 红色：行动、热情、火元素
   - 蓝色：情感、直觉、水元素
   - 黄色：智慧、思想、风元素
   - 绿色：物质、稳定、土元素
3. **象征一致性**：同一套牌中相同符号的表现应保持一致

---

## A3. 反面（牌背）设计规范

牌背设计的核心在于**隐秘性**与**对称性**。

### 核心要求

| 要求 | 重要性 | 说明 |
|:---|:---:|:---|
| **中心对称** | 必须 | 上下左右完全对称，从背面无法分辨正位/逆位 |
| **无方向性** | 必须 | 不能有任何暗示方向的元素 |
| **统一边框** | 建议 | 增强视觉完整性，防止长期磨损导致牌背特征暴露 |

### 图案选择

适合牌背的设计元素：

- ✅ 几何图形（曼陀罗、六芒星、圆形图案）
- ✅ 星空、宇宙元素
- ✅ 重复的艺术花纹
- ✅ 对称的神秘符号
- ❌ 有明确上下方向的图案
- ❌ 非对称的人物或文字

### 牌背示例结构

```
┌─────────────────────────────────┐
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │      ╔═══════════════╗      │ │
│ │      ║               ║      │ │
│ │      ║   ✦  ★  ✦     ║      │ │
│ │      ║   ★  ◆  ★     ║      │ │  ← 中心对称图案
│ │      ║   ✦  ★  ✦     ║      │ │
│ │      ║               ║      │ │
│ │      ╚═══════════════╝      │ │
│ │                             │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
        ↕ 上下完全对称 ↕
```

---

## A4. 体系契合度

设计时应明确参考的塔罗体系，不同体系的图案逻辑有所差异：

| 体系 | 特点 | 适合人群 |
|:---|:---|:---|
| **伟特体系 (Rider-Waite)** | 侧重具象的人物故事场景，画面叙事性强 | 最适合初学者，易于理解牌义 |
| **托特体系 (Thoth)** | 充满几何美学，大量占星、炼金术、卡巴拉符号 | 进阶用户，需要神秘学知识 |
| **马赛体系 (Marseille)** | 风格古典，小牌多为花纹而非故事场景 | 传统派，偏好简洁风格 |

### 本项目采用体系

**BlackRice Tarot 基于 Rider-Waite（伟特/韦特）体系**，原因：
1. 最广泛使用，资料丰富
2. 图像直观，易于数字化呈现
3. 牌义解读有标准参考

---

# Part B: Web App 数字卡片设计规范

以下为 BlackRice Tarot 应用中数字卡片的前端实现规范。

---

## B1. 数字卡片尺寸

### 标准比例

本项目使用图片尺寸 **199×340px**，比例为 **1:1.709**

```
宽 : 高 = 199 : 340 ≈ 1 : 1.709
```

> 注：实体塔罗牌标准尺寸为 70×120mm（比例 1:1.71），本项目图片比例与之接近

### 响应式尺寸

| 屏幕 | 卡片宽度 | 卡片高度 | 场景 |
|------|----------|----------|------|
| Mobile (< 640px) | 80px | 137px | 首页占卜 |
| SM (640-768px) | 100px | 171px | 首页占卜 |
| MD (768-1024px) | 110px | 188px | 首页占卜 |
| LG (1024-1280px) | 120px | 205px | 首页占卜 |
| XL (> 1280px) | 140px | 239px | 首页占卜 |
| 牌库缩略图 | 60px | 103px | 牌库浏览 |
| 详情弹窗 | 199px | 340px | 牌详情（原图） |

### CSS 实现

```css
.tarot-card {
  --card-width: 80px;
  --card-ratio: 1.709; /* 340/199 */
  
  width: var(--card-width);
  height: calc(var(--card-width) * var(--card-ratio));
}

/* 或使用 aspect-ratio */
.tarot-card-image {
  aspect-ratio: 199 / 340;
}

@media (min-width: 640px) {
  .tarot-card { --card-width: 100px; }
}

@media (min-width: 768px) {
  .tarot-card { --card-width: 110px; }
}

@media (min-width: 1024px) {
  .tarot-card { --card-width: 120px; }
}

@media (min-width: 1280px) {
  .tarot-card { --card-width: 140px; }
}
```

---

## B2. 数字卡片结构

### 卡片背面

```
┌──────────────────────────┐
│ ┌──────────────────────┐ │
│ │                      │ │
│ │    ╔═══════════╗     │ │
│ │    ║           ║     │ │
│ │    ║   ✦ ✧ ✦   ║     │ │
│ │    ║   ✧ ★ ✧   ║     │ │
│ │    ║   ✦ ✧ ✦   ║     │ │
│ │    ║           ║     │ │
│ │    ╚═══════════╝     │ │
│ │                      │ │
│ │   神秘图案/纹理      │ │
│ │                      │ │
│ └──────────────────────┘ │
└──────────────────────────┘
```

**设计元素**
- 外边框：金色渐变 2-3px
- 内边框：金色细线 1px
- 背景：深紫色渐变 + 神秘纹理
- 中心：几何图案或星阵
- 装饰：角落装饰花纹

### 卡片正面

```
┌──────────────────────────┐
│ ┌──────────────────────┐ │
│ │ ┌────┐               │ │
│ │ │ 0  │               │ │  数字/编号
│ │ └────┘               │ │
│ │                      │ │
│ │        🃏            │ │  符号/图像区
│ │     (大符号)         │ │
│ │                      │ │
│ │                      │ │
│ │    ─────────         │ │  分隔线
│ │                      │ │
│ │      愚者            │ │  中文名
│ │    The Fool          │ │  英文名
│ │                      │ │
│ └──────────────────────┘ │
└──────────────────────────┘
```

**设计元素**
- 外边框：金色渐变
- 编号：左上角或顶部居中
- 符号区：占据主要空间
- 名称区：底部 20%
- 背景：深色渐变

### 位置标签（占卜时）

```
┌──────────────────────────┐
│                          │
│       (卡片内容)          │
│                          │
├──────────────────────────┤
│        过去               │  位置标签
└──────────────────────────┘
```

---

## B3. 视觉样式

### 边框样式

```css
.card-border {
  /* 外边框 - 金色渐变 */
  border: 3px solid transparent;
  border-image: linear-gradient(
    135deg,
    var(--gold) 0%,
    var(--gold-light) 50%,
    var(--gold) 100%
  ) 1;
  
  /* 圆角 */
  border-radius: 12px;
  
  /* 阴影 */
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.4),
    0 0 30px rgba(255, 215, 0, 0.1);
}
```

### 背面样式

```css
.card-back {
  background: 
    /* 神秘纹理 */
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(255, 215, 0, 0.03) 10px,
      rgba(255, 215, 0, 0.03) 20px
    ),
    /* 渐变背景 */
    linear-gradient(
      135deg,
      #1a1a2e 0%,
      #16213e 50%,
      #1a1a2e 100%
    );
  
  /* 中心图案 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-back::before {
  content: '✦';
  font-size: 2em;
  color: var(--gold);
  opacity: 0.8;
}
```

### 正面样式

```css
.card-front {
  background: linear-gradient(
    180deg,
    #1a1a2e 0%,
    #0f0f1a 100%
  );
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.card-number {
  font-size: 0.75em;
  color: var(--gold);
  opacity: 0.8;
}

.card-symbol {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3em;
}

.card-name {
  text-align: center;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
}

.card-name-cn {
  font-size: 1em;
  font-weight: 600;
  color: var(--gold);
}

.card-name-en {
  font-size: 0.7em;
  color: var(--text-muted);
  margin-top: 2px;
}
```

### 状态指示器

#### 正位/逆位标识

```css
.card-status {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 0.65em;
  font-weight: 500;
}

.card-status.upright {
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
}

.card-status.reversed {
  background: rgba(248, 113, 113, 0.2);
  color: #f87171;
}
```

#### 逆位卡片旋转

```css
.card.reversed .card-content {
  transform: rotate(180deg);
}
```

---

## B4. 动画规范

### 翻牌动画

```css
.card {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.card-front {
  transform: rotateY(180deg);
}
```

#### 翻牌时序

```
0ms     - 动画开始
0-300ms - 牌背 0° → 90°（视觉消失点）
300ms   - 切换显示牌面
300-600ms - 牌面 90° → 180°（视觉完成）
600ms   - 动画结束
```

### 入场动画

```css
.card-enter {
  animation: cardEnter 0.4s ease-out forwards;
}

@keyframes cardEnter {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(30px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 依次入场延迟 */
.card:nth-child(1) { animation-delay: 0ms; }
.card:nth-child(2) { animation-delay: 100ms; }
.card:nth-child(3) { animation-delay: 200ms; }
/* ... */
```

### 悬停效果

```css
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 8px 30px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(255, 215, 0, 0.2);
}

/* 牌背发光效果 */
.card:not(.flipped):hover .card-back {
  box-shadow: inset 0 0 30px rgba(255, 215, 0, 0.1);
}
```

### 退场动画

```css
.card-exit {
  animation: cardExit 0.3s ease-in forwards;
}

@keyframes cardExit {
  to {
    opacity: 0;
    transform: scale(0.8);
  }
}
```

---

## B5. 交互规范

### 点击区域

整张卡片均为可点击区域（符合 Fitts' Law）

```css
.card {
  cursor: pointer;
}

.card.flipped {
  cursor: default;  /* 已翻开不可再点击 */
}
```

### 焦点状态

```css
.card:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 4px;
}
```

### 禁用状态

```css
.card.disabled {
  opacity: 0.5;
  pointer-events: none;
}
```

### 触摸反馈

```css
.card:active {
  transform: scale(0.95);
}
```

---

## B6. 符号系统

### 大阿尔卡纳符号

| 编号 | 牌名 | 符号 |
|:---:|:---|:---:|
| 0 | The Fool 愚者 | 🃏 |
| 1 | The Magician 魔术师 | 🧙🏻 |
| 2 | The High Priestess 女祭司 | 🌙 |
| 3 | The Empress 女皇 | 👑 |
| 4 | The Emperor 皇帝 | 🏛️ |
| 5 | The Hierophant 教皇 | ⛪ |
| 6 | The Lovers 恋人 | 💞 |
| 7 | The Chariot 战车 | 🐎 |
| 8 | Strength 力量 | 🦁 |
| 9 | The Hermit 隐者 | 🏮 |
| 10 | Wheel of Fortune 命运之轮 | 🎡 |
| 11 | Justice 正义 | ⚖️ |
| 12 | The Hanged Man 倒吊人 | 🙃 |
| 13 | Death 死神 | 💀 |
| 14 | Temperance 节制 | 🏺 |
| 15 | The Devil 恶魔 | 😈 |
| 16 | The Tower 高塔 | 🗼 |
| 17 | The Star 星星 | ⭐ |
| 18 | The Moon 月亮 | 🌙 |
| 19 | The Sun 太阳 | ☀️ |
| 20 | Judgement 审判 | 📯 |
| 21 | The World 世界 | 🌍 |

### 小阿尔卡纳符号

| 花色 | 符号 | 说明 |
|------|------|------|
| 权杖 | 🪄 | Magic Wand，魔杖 |
| 圣杯 | 🏆 | Trophy，奖杯 |
| 宝剑 | ⚔️ | Crossed Swords，交叉剑 |
| 金币 | 🪙 | Coin，硬币 |

### 符号使用原则

1. **语义贴近**：选择 emoji 名称与牌义最贴近的符号
2. **跨平台一致性**：选择在各平台显示一致的 Emoji
3. **视觉层级**：主要内容区使用大号符号

---

## B7. V2 牌面图片规范

### 图片资源要求

| 属性 | 要求 |
|------|------|
| 格式 | WebP (首选), PNG (降级) |
| 尺寸 | 300×480px @1x |
| 高清 | 600×960px @2x |
| 大小 | < 50KB (WebP) |
| 透明 | 不需要 |

### 图片加载策略

```typescript
// 懒加载配置
const cardImageLoader = {
  // 低分辨率占位
  placeholder: '/images/cards/placeholder.webp',
  
  // 加载优先级
  priority: {
    majorArcana: 'high',
    minorArcana: 'low'
  },
  
  // 预加载当前牌阵
  preloadSpread: (cards: string[]) => {
    cards.forEach(id => {
      const img = new Image()
      img.src = `/images/cards/${id}.webp`
    })
  }
}
```

### 降级方案

```vue
<template>
  <div class="card-image">
    <img 
      v-if="imageLoaded"
      :src="imageSrc"
      :alt="card.name"
      @error="handleImageError"
    />
    <div v-else class="card-symbol-fallback">
      {{ card.symbol }}
    </div>
  </div>
</template>
```

---

## B8. 无障碍设计

### ARIA 属性

```html
<div 
  class="card"
  role="button"
  :aria-label="getCardLabel(card)"
  :aria-pressed="isFlipped"
  tabindex="0"
>
  <div class="card-inner">
    <div class="card-back" aria-hidden="true">
      <!-- 牌背 -->
    </div>
    <div class="card-front">
      <span class="sr-only">{{ card.name }}, {{ card.isReversed ? '逆位' : '正位' }}</span>
      <!-- 牌面内容 -->
    </div>
  </div>
</div>
```

### 屏幕阅读器文本

```typescript
function getCardLabel(card: DrawnCard, isFlipped: boolean): string {
  if (!isFlipped) {
    return `第${index + 1}张牌，点击翻开查看`
  }
  return `${card.name}，${card.isReversed ? '逆位' : '正位'}，${card.position}`
}
```

### 减少动效模式

```css
@media (prefers-reduced-motion: reduce) {
  .card-inner {
    transition: none;
  }
  
  .card-enter {
    animation: none;
  }
  
  .card:hover {
    transform: none;
  }
}
```

---

## B9. 组件 API

### Props

```typescript
interface TarotCardProps {
  card: TarotCard | DrawnCard
  position?: string          // 位置标签
  clickable?: boolean        // 是否可点击
  showStatus?: boolean       // 显示正逆位标签
  size?: 'sm' | 'md' | 'lg'  // 尺寸
}
```

### Events

```typescript
interface TarotCardEmits {
  flip: []                   // 翻牌事件
  click: [card: TarotCard]   // 点击事件
}
```

### Exposed Methods

```typescript
interface TarotCardExposed {
  reset: () => void          // 重置到背面
  flip: () => void           // 翻转
  isFlipped: Ref<boolean>    // 是否已翻开
}
```

---

## B10. 设计资源

### 韦特塔罗官方图像

- **版权状态**：公有领域 (1909年首次出版)
- **获取来源**：维基共享资源
- **使用注意**：某些现代重绘版本可能有版权

### 设计参考

| 风格 | 特点 | 参考 |
|------|------|------|
| 经典韦特 | 传统、庄重 | Rider-Waite 原版 |
| 现代简约 | 几何、扁平 | The Minimalist Tarot |
| 艺术风格 | 插画、独特 | 各艺术家版本 |
| 数字风格 | 科技、未来 | Cyberpunk Tarot |

### 免费资源

- [维基共享资源 - 韦特塔罗](https://commons.wikimedia.org/wiki/Rider-Waite_tarot_deck)
- [Open Tarot Project](https://opentarot.net/)
- [Tarot Card Images API](https://deckofcardsapi.com/)
