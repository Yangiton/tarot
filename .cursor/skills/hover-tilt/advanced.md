# 高级用法

## CSS 变量

组件暴露以下 CSS 变量用于自定义：

| 变量 | 说明 | 范围 |
|------|------|------|
| `--hover-tilt-x` | 光标 X 位置（归一化） | 0 - 1 |
| `--hover-tilt-y` | 光标 Y 位置（归一化） | 0 - 1 |
| `--hover-tilt-opacity` | 激活状态透明度 | 0 - 1 |
| `--hover-tilt-glare-hue` | 光泽色相 | 0 - 360 |
| `--hover-tilt-glare-intensity` | 光泽强度 | number |

派生变量（容器级别）：

```css
.hover-tilt-container {
  --gradient-x: calc(var(--hover-tilt-x, 0.5) * 100%);
  --gradient-y: calc(var(--hover-tilt-y, 0.5) * 100%);
  --shadow-x: calc(var(--hover-tilt-x, 0.5) - 0.5);
  --shadow-y: calc(var(--hover-tilt-y, 0.5) - 0.5);
}
```

## 自定义渐变

使用 `--hover-tilt-custom-gradient` 覆盖默认光泽渐变：

```css
.my-card {
  --hover-tilt-custom-gradient: radial-gradient(
    circle at var(--gradient-x) var(--gradient-y),
    rgb(255 255 255 / calc(var(--hover-tilt-glare-intensity, 1) * 0.5)) 10%,
    transparent 70%
  );
}
```

### 简单高光

```css
.simple-highlight {
  --hover-tilt-custom-gradient: radial-gradient(
    circle at var(--gradient-x) var(--gradient-y),
    rgb(255 255 255 / 1) 10%,
    transparent 70%
  );
}
```

### 彩虹渐变

```css
.rainbow-glare {
  --hover-tilt-custom-gradient: conic-gradient(
    from calc(var(--hover-tilt-x) * 360deg) at var(--gradient-x) var(--gradient-y),
    hsl(0 80% 60% / 0.5),
    hsl(60 80% 60% / 0.5),
    hsl(120 80% 60% / 0.5),
    hsl(180 80% 60% / 0.5),
    hsl(240 80% 60% / 0.5),
    hsl(300 80% 60% / 0.5),
    hsl(360 80% 60% / 0.5)
  );
}
```

## 自定义阴影

使用 `--hover-tilt-custom-shadow` 覆盖默认阴影（需启用 `shadow` prop）：

```css
.my-card {
  --hover-tilt-custom-shadow:
    calc(var(--shadow-x) * 10px) 
    calc(var(--shadow-y) * 10px + 5px) 
    5px 
    10px 
    hsl(0 0% 0% / calc(var(--hover-tilt-opacity, 0) * 0.5 + 0.2));
}
```

### 基础动态阴影

```css
.basic-shadow {
  --hover-tilt-custom-shadow:
    hsl(210 75% 15% / 0.4) 
    calc(var(--shadow-x) * 4px) 
    calc(var(--shadow-y) * 6px + 6px) 
    calc(10px + var(--hover-tilt-opacity, 0) * 12px) 
    0px;
}
```

### 多层阴影

```css
.multi-layer-shadow {
  --hover-tilt-custom-shadow:
    hsl(210 75% 15% / 0.4) calc(var(--shadow-x) * 4px) calc(var(--shadow-y) * 6px + 6px) calc(10px + var(--hover-tilt-opacity, 0) * 12px) 0px,
    hsl(210 75% 15% / 0.4) calc(var(--shadow-x) * 4px) calc(var(--shadow-y) * 2px + 2px) calc(2px + var(--hover-tilt-opacity, 0) * 4px) 0px;
}
```

## Glare 遮罩

通过 `glareMask` 和 `glareMaskMode` 限制光泽显示区域。

### CSS 渐变遮罩

```svelte
<HoverTilt
  glareMask="repeating-radial-gradient(circle at 30% 30%, #fff, #fff 12px, #fff0 12px, #fff0 24px)"
  glareMaskMode="alpha"
>
  ...
</HoverTilt>
```

### 黑白位图遮罩

白色区域显示光泽，黑色区域隐藏：

```svelte
<HoverTilt 
  glareMask="url(/aztec-pattern.webp)" 
  glareMaskMode="luminance"
>
  ...
</HoverTilt>
```

### 透明 PNG/SVG 遮罩

不透明区域显示光泽，透明区域隐藏：

```svelte
<HoverTilt 
  glareMask="url(/circuit-board.svg)" 
  glareMaskMode="alpha"
>
  ...
</HoverTilt>
```

### 内联 SVG 遮罩

```svelte
<svg width="0" height="0" aria-hidden="true">
  <defs>
    <pattern id="pattern" patternUnits="userSpaceOnUse" width="24" height="24">
      <rect x="0" y="0" width="24" height="24" fill="transparent" />
      <polygon fill="white" points="8 4 12 6 8 8 6 12 4 8 0 6 4 4 6 0 8 4" />
    </pattern>
    <mask id="foil-mask">
      <rect x="0" y="0" width="500" height="500" fill="url(#pattern)" />
    </mask>
  </defs>
</svg>

<HoverTilt glareMask="url(#foil-mask)" glareMaskMode="alpha">
  ...
</HoverTilt>
```

## 静态与动态阴影结合

卡片内容保持静态阴影，悬停时切换为动态阴影：

```svelte
<HoverTilt class="shadow-card" shadow shadowBlur={30}>
  <div class="card">Content</div>
</HoverTilt>

<style>
.shadow-card .card:not(:hover) {
  box-shadow: 0px 10px 15px -3px rgba(0 0 0 / 0.2);
  transition: box-shadow 300ms ease 300ms;
}

.shadow-card:hover .card {
  transition-delay: 0ms;
}
</style>
```

## 常见问题

### 悬停时 z-index 问题

缩放时可能被其他元素遮挡：

```css
.my-card:hover {
  z-index: 10;
}
```

### 圆角处理

容器和内容需要匹配圆角：

```svelte
<HoverTilt class="rounded-3xl">
  <div class="rounded-3xl">Content</div>
</HoverTilt>
```

### 调整透视距离

```css
.my-card {
  perspective: 300px;
}
```
