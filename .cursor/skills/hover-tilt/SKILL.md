---
name: hover-tilt
description: 使用 hover-tilt 库实现 3D 倾斜和光泽效果。支持 Svelte 组件和 Web Component（Vue/React/Angular 等）。用于卡片悬停效果、宝可梦闪卡风格、交互式 UI。触发词：tilt, glare, hover effect, 3D card, holographic, foil effect, 倾斜卡片。
---

# hover-tilt

基于 [simeydotme/hover-tilt](https://github.com/simeydotme/hover-tilt) 的 3D 倾斜和光泽效果组件。

## 安装

```bash
npm install hover-tilt
```

## 快速开始

### Svelte 5

```svelte
<script>
  import { HoverTilt } from 'hover-tilt';
</script>

<HoverTilt tiltFactor={1.5} scaleFactor={1.1}>
  <div class="card">Your content here</div>
</HoverTilt>
```

### Vue 3

```vue
<script setup>
import 'hover-tilt/web-component';
</script>

<template>
  <hover-tilt tilt-factor="1.5" scale-factor="1.1">
    <div class="card">Your content here</div>
  </hover-tilt>
</template>
```

### React

```jsx
import 'hover-tilt/web-component';

function MyComponent() {
  return (
    <hover-tilt tilt-factor="1.5" scale-factor="1.1">
      <div className="card">Your content here</div>
    </hover-tilt>
  );
}
```

## 属性命名规则

| 框架 | 命名风格 | 示例 |
|------|----------|------|
| Svelte | camelCase | `tiltFactor={1.5}` |
| Web Component | kebab-case | `tilt-factor="1.5"` |

## 常用 Props 速查

| Prop | 默认值 | 类型 | 说明 |
|------|--------|------|------|
| `tiltFactor` | 1 | number | 倾斜强度，值越大倾斜越明显 |
| `tiltFactorY` | tiltFactor | number | 垂直倾斜强度，用于非对称效果 |
| `scaleFactor` | 1 | number | 悬停缩放比例，>1 放大，<1 缩小 |
| `shadow` | false | boolean | 启用跟随倾斜的动态阴影 |
| `shadowBlur` | 12 | number | 阴影模糊半径（像素） |
| `glareIntensity` | 1 | number | 光泽强度 |
| `glareHue` | 270 | number | 光泽色相（0-360） |
| `enterDelay` | 0 | number | 激活延迟（毫秒） |
| `exitDelay` | 200 | number | 退出延迟（毫秒） |

## 常见配置示例

### 基础倾斜卡片

```svelte
<HoverTilt tiltFactor={1.5} scaleFactor={1.05}>
  <div class="card">Hover me</div>
</HoverTilt>
```

### 带阴影的卡片

```svelte
<HoverTilt shadow shadowBlur={30} scaleFactor={1.1}>
  <div class="card">Card with shadow</div>
</HoverTilt>
```

### 宝可梦闪卡风格

```svelte
<HoverTilt 
  tiltFactor={2} 
  glareIntensity={1.5} 
  glareHue={180}
  blendMode="overlay"
>
  <img src="card.png" alt="Pokemon card" />
</HoverTilt>
```

### 带遮罩的光泽效果

```svelte
<HoverTilt 
  glareMask="url(/foil-pattern.png)" 
  glareMaskMode="alpha"
  glareIntensity={1.2}
>
  <div class="card">Masked glare</div>
</HoverTilt>
```

## CSS 选择器

组件渲染的 DOM 结构：

```
<div class="hover-tilt-container">
  └── <div class="hover-tilt">
        └── slotted content
</div>
```

样式示例：

```css
.my-card .hover-tilt-container {
  perspective: 300px;
}

.my-card .hover-tilt {
  border-radius: 24px;
}
```

## 更多资源

- 完整 Props 参考：[props-reference.md](props-reference.md)
- 高级用法（自定义渐变、阴影、遮罩）：[advanced.md](advanced.md)
- 官方文档：https://hover-tilt.simey.me/
