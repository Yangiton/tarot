import type { Directive, DirectiveBinding } from "vue";

/**
 * v-shine 指令 - 3D 闪卡效果
 *
 * 参考：https://codepen.io/Chokcoco/pen/yLwOexQ
 *
 * 功能：
 * 1. 鼠标/触摸跟随的 3D 旋转效果
 * 2. 彩虹反光渐变（mix-blend-mode: color-dodge）
 * 3. 闪烁星点效果（sparkles.gif）
 * 4. 移动端触摸支持
 *
 * 使用方式：
 * <div v-shine>内容</div>
 * <div v-shine="true">启用</div>
 * <div v-shine="false">禁用</div>
 * <div v-shine="{ multiple: 20, glare: false }">仅旋转</div>
 */

interface ShineOptions {
  multiple?: number; // 旋转灵敏度（越大旋转角度越小）
  maxRotation?: number; // 最大旋转角度（度）
  transition?: number; // 过渡时间（ms）
  glare?: boolean; // 彩虹反光
  sparkle?: boolean; // 闪烁效果
  disabled?: boolean; // 禁用效果
  hotspot?: number; // 热区扩展（px）
}

interface ShineState {
  hotspotEl: HTMLElement | null; // 热区元素
  glareEl: HTMLElement | null;
  sparkleEl: HTMLElement | null;
  options: Required<ShineOptions>;
  onMouseMove: (e: MouseEvent) => void;
  onMouseLeave: () => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: () => void;
}

const defaultOptions: Required<ShineOptions> = {
  multiple: 20,
  maxRotation: 15,
  transition: 200,
  glare: true,
  sparkle: true,
  disabled: false,
  hotspot: 35, // 默认扩展 35px 热区
};

const stateMap = new WeakMap<HTMLElement, ShineState>();

function createGlareElement(): HTMLElement {
  const el = document.createElement("div");
  el.className = "shine-glare";
  Object.assign(el.style, {
    position: "absolute",
    inset: "0",
    borderRadius: "inherit",
    pointerEvents: "none",
    zIndex: "100",
    background: `linear-gradient(
      115deg,
      transparent 0%,
      rgba(6, 232, 255, 0.4) var(--shine-per, 50%),
      rgba(255, 171, 46, 0.4) calc(var(--shine-per, 50%) + 20%),
      rgba(255, 34, 18, 0.4) calc(var(--shine-per, 50%) + 40%),
      transparent 100%
    )`,
    mixBlendMode: "color-dodge",
    opacity: "0",
    transition: "opacity 0.3s ease",
  });
  return el;
}

function createSparkleElement(): HTMLElement {
  const el = document.createElement("div");
  el.className = "shine-sparkle";
  Object.assign(el.style, {
    position: "absolute",
    inset: "0",
    borderRadius: "inherit",
    pointerEvents: "none",
    zIndex: "101",
    background:
      'url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/13471/sparkles.gif")',
    backgroundSize: "150px 150px",
    mixBlendMode: "color-dodge",
    opacity: "0",
    transition: "opacity 0.3s ease",
  });
  return el;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// 创建扩展热区元素
function createHotspotElement(hotspot: number): HTMLElement {
  const el = document.createElement("div");
  el.className = "shine-hotspot";
  Object.assign(el.style, {
    position: "absolute",
    top: `-${hotspot}px`,
    left: `-${hotspot}px`,
    right: `-${hotspot}px`,
    bottom: `-${hotspot}px`,
    pointerEvents: "auto",
    zIndex: "-1",
  });
  return el;
}

function applyTransform(
  el: HTMLElement,
  state: ShineState,
  clientX: number,
  clientY: number,
) {
  if (state.options.disabled) return;

  const box = el.getBoundingClientRect();
  const { multiple, maxRotation } = state.options;

  // 计算相对位置（-0.5 到 0.5）
  const relX = (clientX - box.left) / box.width - 0.5;
  const relY = (clientY - box.top) / box.height - 0.5;

  // 计算旋转角度（CodePen 公式）
  const rotateX = clamp(-relY * multiple, -maxRotation, maxRotation);
  const rotateY = clamp(relX * multiple, -maxRotation, maxRotation);

  // 计算反光位置百分比
  const percentage = Math.round((relX + 0.5) * 100);

  // 应用 3D 旋转
  el.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

  // 更新反光位置
  if (state.glareEl) {
    state.glareEl.style.setProperty("--shine-per", `${percentage}%`);
    state.glareEl.style.opacity = "1";
  }

  // 显示闪烁
  if (state.sparkleEl) {
    state.sparkleEl.style.opacity = "0.5";
  }
}

function resetTransform(el: HTMLElement, state: ShineState) {
  if (state.options.disabled) return;

  // 重置旋转
  el.style.transform =
    "perspective(500px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";

  if (state.glareEl) {
    state.glareEl.style.opacity = "0";
  }

  if (state.sparkleEl) {
    state.sparkleEl.style.opacity = "0";
  }
}

function initShine(el: HTMLElement, options: Required<ShineOptions>) {
  // 确保有定位上下文
  const computedStyle = getComputedStyle(el);
  if (computedStyle.position === "static") {
    el.style.position = "relative";
  }

  // 设置 3D 变换相关样式
  el.style.transformStyle = "preserve-3d";
  el.style.transition = `transform ${options.transition}ms ease-out`;
  el.style.willChange = "transform";

  // 创建热区元素（扩展交互区域）
  let hotspotEl: HTMLElement | null = null;
  if (options.hotspot > 0) {
    hotspotEl = createHotspotElement(options.hotspot);
    el.appendChild(hotspotEl);
  }

  // 创建效果层
  let glareEl: HTMLElement | null = null;
  let sparkleEl: HTMLElement | null = null;

  if (options.glare && !options.disabled) {
    glareEl = createGlareElement();
    el.appendChild(glareEl);
  }

  if (options.sparkle && !options.disabled) {
    sparkleEl = createSparkleElement();
    el.appendChild(sparkleEl);
  }

  // 鼠标事件 - 绑定到父元素以覆盖热区
  const onMouseMove = (e: MouseEvent) => {
    requestAnimationFrame(() => {
      const s = stateMap.get(el);
      if (s && !s.options.disabled) {
        applyTransform(el, s, e.clientX, e.clientY);
      }
    });
  };

  const onMouseLeave = () => {
    requestAnimationFrame(() => {
      const s = stateMap.get(el);
      if (s) resetTransform(el, s);
    });
  };

  // 触摸事件（移动端）
  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      requestAnimationFrame(() => {
        const s = stateMap.get(el);
        if (s && !s.options.disabled) {
          applyTransform(el, s, touch.clientX, touch.clientY);
        }
      });
    }
  };

  const onTouchEnd = () => {
    requestAnimationFrame(() => {
      const s = stateMap.get(el);
      if (s) resetTransform(el, s);
    });
  };

  const state: ShineState = {
    hotspotEl,
    glareEl,
    sparkleEl,
    options,
    onMouseMove,
    onMouseLeave,
    onTouchMove,
    onTouchEnd,
  };
  stateMap.set(el, state);

  // 获取事件绑定目标（优先使用父元素以覆盖热区范围）
  const eventTarget = el.parentElement || el;

  // 绑定事件
  eventTarget.addEventListener("mousemove", onMouseMove);
  eventTarget.addEventListener("mouseleave", onMouseLeave);
  eventTarget.addEventListener("touchmove", onTouchMove, { passive: true });
  eventTarget.addEventListener("touchend", onTouchEnd);
  eventTarget.addEventListener("touchcancel", onTouchEnd);
}

function cleanupShine(el: HTMLElement) {
  const state = stateMap.get(el);
  if (state) {
    // 从父元素移除事件
    const eventTarget = el.parentElement || el;
    eventTarget.removeEventListener("mousemove", state.onMouseMove);
    eventTarget.removeEventListener("mouseleave", state.onMouseLeave);
    eventTarget.removeEventListener("touchmove", state.onTouchMove);
    eventTarget.removeEventListener("touchend", state.onTouchEnd);
    eventTarget.removeEventListener("touchcancel", state.onTouchEnd);

    // 重置样式
    el.style.transform = "";
    el.style.transition = "";
    el.style.willChange = "";

    state.hotspotEl?.remove();
    state.glareEl?.remove();
    state.sparkleEl?.remove();
    stateMap.delete(el);
  }
}

function parseOptions(
  value: ShineOptions | boolean | undefined,
): Required<ShineOptions> {
  if (typeof value === "boolean") {
    return { ...defaultOptions, disabled: !value };
  }
  return { ...defaultOptions, ...value };
}

export const vShine: Directive<
  HTMLElement,
  ShineOptions | boolean | undefined
> = {
  mounted(el, binding: DirectiveBinding<ShineOptions | boolean | undefined>) {
    const options = parseOptions(binding.value);
    if (!options.disabled) {
      initShine(el, options);
    }
  },

  updated(el, binding: DirectiveBinding<ShineOptions | boolean | undefined>) {
    const newOptions = parseOptions(binding.value);
    const state = stateMap.get(el);

    if (newOptions.disabled) {
      cleanupShine(el);
    } else if (!state) {
      initShine(el, newOptions);
    } else {
      state.options = newOptions;
    }
  },

  unmounted(el) {
    cleanupShine(el);
  },
};

export default vShine;
