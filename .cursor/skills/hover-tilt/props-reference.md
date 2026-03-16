# Props 完整参考

所有 Props 在 Svelte 中使用 `camelCase`，Web Component 中使用 `kebab-case`。

## 交互类 Props

### tiltFactor

控制水平倾斜强度。

- **默认值**: `1`
- **类型**: `number`

```svelte
<HoverTilt tiltFactor={1.5}>...</HoverTilt>
```

### tiltFactorY

控制垂直倾斜强度，用于创建非对称倾斜效果。

- **默认值**: 继承 `tiltFactor` 的值
- **类型**: `number | undefined`

```svelte
<HoverTilt tiltFactor={1.5} tiltFactorY={0.5}>...</HoverTilt>
```

### scaleFactor

悬停时的缩放倍数。

- **默认值**: `1`
- **类型**: `number`
- `>1` 放大，`<1` 缩小

```svelte
<HoverTilt scaleFactor={1.1}>...</HoverTilt>
```

### springOptions

缩放和透明度动画的物理参数，基于 [Svelte Spring](https://svelte.dev/docs/svelte/svelte-motion#Spring)。

- **默认值**: `{ stiffness: 0.2, damping: 0.8 }`
- **类型**: `{ stiffness?: number, damping?: number }`
- 高 stiffness = 快速响应
- 高 damping = 减少振荡

```svelte
<HoverTilt springOptions={{ stiffness: 0.3, damping: 0.7 }}>...</HoverTilt>
```

### tiltSpringOptions

倾斜动画的独立物理参数，允许倾斜与缩放使用不同的动画感觉。

- **默认值**: 继承 `springOptions`
- **类型**: `{ stiffness?: number, damping?: number } | undefined`

```svelte
<HoverTilt tiltSpringOptions={{ stiffness: 0.4, damping: 0.6 }}>...</HoverTilt>
```

### enterDelay

光标进入后激活组件的延迟（毫秒），防止快速划过时闪烁。

- **默认值**: `0`
- **类型**: `number`

```svelte
<HoverTilt enterDelay={300}>...</HoverTilt>
```

### exitDelay

光标离开后恢复默认状态的延迟（毫秒）。

- **默认值**: `200`
- **类型**: `number`

```svelte
<HoverTilt exitDelay={300}>...</HoverTilt>
```

## 视觉类 Props

### shadow

启用跟随倾斜移动的动态阴影。

- **默认值**: `false`
- **类型**: `boolean | undefined`

```svelte
<HoverTilt shadow>...</HoverTilt>
```

### shadowBlur

阴影模糊半径（像素），仅在 `shadow` 为 `true` 时生效。

- **默认值**: `12`
- **类型**: `number | undefined`

```svelte
<HoverTilt shadow shadowBlur={40}>...</HoverTilt>
```

### blendMode

光泽效果的 CSS 混合模式。

- **默认值**: `"overlay"`
- **类型**: `string | undefined`
- 常用值: `overlay`, `screen`, `multiply`, `plus-lighter`

```svelte
<HoverTilt blendMode="screen">...</HoverTilt>
```

### glareIntensity

光泽效果强度。

- **默认值**: `1`
- **类型**: `number`
- `>1` 增强，`<1` 减弱
- 值超过 4 对默认渐变无明显效果

```svelte
<HoverTilt glareIntensity={1.5}>...</HoverTilt>
```

### glareHue

光泽颜色的色相值（0-360）。

- **默认值**: `270`（淡紫色）
- **类型**: `number | undefined`

```svelte
<HoverTilt glareHue={180}>...</HoverTilt>
```

### glareMask

光泽效果的 [CSS mask-image](https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image)，用于限制光泽显示区域。

- **默认值**: `undefined`（无遮罩）
- **类型**: `string | undefined`

```svelte
<HoverTilt glareMask="url(/foil-pattern.png)">...</HoverTilt>
```

### glareMaskMode

遮罩的解释方式。

- **默认值**: `undefined`（浏览器默认 'match-source'）
- **类型**: `'match-source' | 'luminance' | 'alpha' | 'none' | undefined`
- `luminance`: 黑白图片，白色区域显示光泽
- `alpha`: 透明图片，不透明区域显示光泽

```svelte
<HoverTilt glareMask="url(/mask.png)" glareMaskMode="luminance">...</HoverTilt>
```

### glareMaskComposite

多个遮罩的合成操作。

- **默认值**: `undefined`（浏览器默认 'add'）
- **类型**: `'add' | 'subtract' | 'exclude' | 'intersect' | undefined`

```svelte
<HoverTilt glareMaskComposite="intersect">...</HoverTilt>
```

### class

应用到容器元素的 CSS 类名。

- **默认值**: `undefined`
- **类型**: `string | undefined`

```svelte
<HoverTilt class="my-custom-class">...</HoverTilt>
```

### style

应用到容器元素的内联样式。

- **默认值**: `undefined`
- **类型**: `string | undefined`

```svelte
<HoverTilt style="--my-prop: 50px;">...</HoverTilt>
```
