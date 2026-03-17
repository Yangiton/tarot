# card.html 3D 翻转卡片 Demo

基于 `hover-tilt` 实现的 3D 翻转 + 放大缩小卡片效果。

## 功能清单

### 1. 双层架构

| 层级 | 元素 | 职责 | CSS 变换 |
|------|------|------|----------|
| **外层** | `.card-wrapper` | 位移到中心 + 层级控制 | `translate3d(--translate-x, --translate-y, 0)` |
| **内层** | `.card-container` | 3D 翻转 + 放大旋转 | `perspective(800px) rotateY() scale()` |

### 2. 状态机

```
'back' → flip() → 'front' → zoomIn() → 'zoom-in' → zoomOut() → 'zoom-out' → 'front'
```

| 状态 | 外层 `.card-wrapper` | 内层 `.card-container` |
|------|---------------------|------------------------|
| `back` | 无变换 | `perspective(800px)` |
| `front` | 无变换 | `perspective(800px) rotateY(180deg)` |
| `zoom-in` | `translate3d(x, y, 0)` + `z-index:99999` | `rotateY(540deg) scale(1.75)` |
| `zoom-out` | `translate3d(0, 0, 0)` + `z-index:99999` | `rotateY(180deg)` |

### 3. 交互逻辑

| 触发 | 动作 | 状态变化 |
|------|------|----------|
| 点击 Back 面 | `flip()` | `'back'` → `'front'` |
| 点击 Front 面 | `zoomIn()` | `'front'` → `'zoom-in'` |
| 放大后点击任意位置 | `zoomOut()` | `'zoom-in'` → `'zoom-out'` → `'front'` |
| 放大后按 Escape | `zoomOut()` | `'zoom-in'` → `'zoom-out'` → `'front'` |

### 4. 关键特性

| 特性 | 实现方式 |
|------|----------|
| **平滑过渡** | `transitionend` 事件替代 `setTimeout` |
| **层级最高** | `z-index: 99999` + `isolation: isolate` |
| **立即缩小** | `document.addEventListener('click', handler, { capture: true })` |
| **Tilt 刷新** | `dispatchEvent(new MouseEvent('mousemove'))` 在动画结束后触发 |

### 5. 过渡动画

| 动画 | CSS 变量 | 默认值 | 缓动函数 |
|------|----------|--------|----------|
| 翻转 | `--flip-duration` | `700ms` | `cubic-bezier(0.4, 0.2, 0.2, 1)` |
| 放大/缩小 | `--zoom-duration` | `800ms` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` |

### 6. CSS 变量

| 变量 | 用途 | 默认值 |
|------|------|--------|
| `--card-width` | 卡片宽度 | `200px` |
| `--card-radius` | 圆角半径 | `12px` |
| `--flip-duration` | 翻转动画时长 | `700ms` |
| `--zoom-duration` | 缩放动画时长 | `800ms` |
| `--zoom-scale` | 放大比例 | `1.75` |
| `--translate-x` | 水平位移（动态计算） | `0px` |
| `--translate-y` | 垂直位移（动态计算） | `0px` |

### 7. hover-tilt 配置

| 属性 | Back 面 | Front 面 |
|------|---------|----------|
| `tilt-factor` | `1.5` | `1.5` |
| `scale-factor` | `1.05` | `1.05` |
| `shadow` | `true` | `true` |
| `shadow-blur` | `30` | `30` |
| `glare-intensity` | `0` (无 glare) | `1.2` |
| `glare-hue` | - | `270` |
| `blend-mode` | - | `overlay` |

### 8. DOM 结构

```html
<div class="card-wrapper" id="card">           <!-- 外层：位移 + 层级 -->
  <div class="card-container">                  <!-- 内层：翻转 + 缩放 -->
    <hover-tilt class="back-wrapper">           <!-- Back 面 (glare=0) -->
      <div class="card-face card-back">Back</div>
    </hover-tilt>
    <hover-tilt class="front-wrapper">          <!-- Front 面 (glare=1.2) -->
      <div class="card-face card-front">Front</div>
    </hover-tilt>
  </div>
</div>
```

### 9. 核心 JavaScript 逻辑

```javascript
// 状态管理
let state = 'back' // 'back' | 'front' | 'zoom-in' | 'zoom-out'
let isAnimating = false

// transitionend 替代 setTimeout
const onTransitionEnd = (callback) => {
  const handler = (e) => {
    if (e.propertyName === 'transform') {
      card.removeEventListener('transitionend', handler)
      callback()
    }
  }
  card.addEventListener('transitionend', handler)
}

// 计算居中偏移
const calcCenterOffset = () => {
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--translate-x', `${window.innerWidth / 2 - rect.left - rect.width / 2}px`)
  card.style.setProperty('--translate-y', `${window.innerHeight / 2 - rect.top - rect.height / 2}px`)
}
```

## 已知限制与解决方案

### 1. 层级问题（DOM 顺序）

`isolation: isolate` 只能创建新的堆叠上下文，无法突破兄弟元素的 DOM 顺序限制。

**解决方案**：使用全局 CSS `:has()` 选择器提升父元素层级：

```css
*:has(> .card-wrapper.zoom-in),
*:has(> .card-wrapper.zoom-out) {
  z-index: 99999 !important;
}
```

### 2. hover-tilt glare 被内容遮盖

`hover-tilt` 的 glare 通过 `::part(tilt)::before` 伪元素实现。如果 slot 内容有正的 `z-index` 或创建了堆叠上下文，会遮盖 glare。

**解决方案**：给 slot 内容设置 `z-index: -1`：

```css
.card-face {
  position: relative;
  z-index: -1; /* 确保在 hover-tilt 的 glare (::before) 之下 */
}
```
