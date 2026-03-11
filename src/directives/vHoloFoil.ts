import type { Directive, DirectiveBinding } from "vue";

/**
 * v-holo-foil 指令 - 全息卡片效果
 *
 * 参考：https://github.com/simeydotme/pokemon-cards-css
 * Demo：https://poke-holo.simey.me/
 *
 * 支持的效果类型：
 * - normal: 普通全息（彩虹条纹）
 * - cosmos: 宇宙全息（星空背景）
 * - rainbow: 彩虹全息（彩虹渐变）
 * - galaxy: 银河全息（深空效果）
 * - radiant: 光辉全息（放射状）
 * - pixel: 像素全息（点阵效果）
 */

// 全息效果类型
export type HoloType =
  | "normal"
  | "cosmos"
  | "rainbow"
  | "galaxy"
  | "radiant"
  | "pixel";

interface HoloFoilOptions {
  type?: HoloType; // 全息效果类型
  intensity?: number; // 效果强度 (0-1)
  disabled?: boolean; // 禁用效果
}

interface HoloFoilState {
  shineEl: HTMLElement | null;
  glareEl: HTMLElement | null;
  options: Required<HoloFoilOptions>;
  onPointerMove: (e: MouseEvent | TouchEvent) => void;
  onPointerLeave: () => void;
  rafId: number | null;
}

const defaultOptions: Required<HoloFoilOptions> = {
  type: "normal",
  intensity: 0.8, // 降低默认强度，更柔和
  disabled: false,
};

const stateMap = new WeakMap<HTMLElement, HoloFoilState>();

// 彩虹色变量
const RAINBOW_COLORS = {
  red: "hsl(2, 100%, 73%)",
  orange: "hsl(32, 100%, 69%)",
  yellow: "hsl(53, 100%, 69%)",
  green: "hsl(93, 100%, 69%)",
  cyan: "hsl(176, 100%, 76%)",
  blue: "hsl(228, 100%, 74%)",
  purple: "hsl(283, 100%, 73%)",
  pink: "hsl(326, 100%, 73%)",
};

// 不同全息效果的 CSS 配置
const HOLO_EFFECTS: Record<
  HoloType,
  {
    shine: Record<string, string>;
    glare: Record<string, string>;
  }
> = {
  // 普通全息 - 经典彩虹条纹
  normal: {
    shine: {
      backgroundImage: `
        repeating-linear-gradient(
          0deg,
          ${RAINBOW_COLORS.red} 0%,
          ${RAINBOW_COLORS.orange} 7%,
          ${RAINBOW_COLORS.yellow} 14%,
          ${RAINBOW_COLORS.green} 21%,
          ${RAINBOW_COLORS.cyan} 28%,
          ${RAINBOW_COLORS.blue} 35%,
          ${RAINBOW_COLORS.purple} 42%,
          ${RAINBOW_COLORS.pink} 49%,
          ${RAINBOW_COLORS.red} 56%,
          ${RAINBOW_COLORS.orange} 63%,
          ${RAINBOW_COLORS.yellow} 70%,
          ${RAINBOW_COLORS.green} 77%,
          ${RAINBOW_COLORS.cyan} 84%,
          ${RAINBOW_COLORS.blue} 91%,
          ${RAINBOW_COLORS.purple} 100%
        ),
        repeating-linear-gradient(
          133deg,
          #0e152e 0%,
          hsl(180, 10%, 60%) 3.8%,
          hsl(180, 29%, 66%) 4.5%,
          hsl(180, 10%, 60%) 5.2%,
          #0e152e 10%,
          #0e152e 12%
        )
      `,
      backgroundSize: "300% 100%, 200% 700%",
      backgroundBlendMode: "hue, hard-light",
      filter: "brightness(0.85) contrast(2.75) saturate(0.65)",
      mixBlendMode: "color-dodge",
    },
    glare: {
      backgroundImage: `radial-gradient(
        farthest-corner circle at var(--mx) var(--my),
        hsla(0, 0%, 100%, 0.6) 10%,
        hsla(0, 0%, 100%, 0.4) 20%,
        hsla(0, 0%, 0%, 0.5) 90%
      )`,
      mixBlendMode: "overlay",
    },
  },

  // 宇宙全息 - 星空背景
  cosmos: {
    shine: {
      backgroundImage: `
        radial-gradient(
          ellipse 80% 50% at 50% 50%,
          hsla(280, 100%, 90%, 0.25),
          transparent 50%
        ),
        repeating-linear-gradient(
          82deg,
          ${RAINBOW_COLORS.yellow} 4%,
          ${RAINBOW_COLORS.green} 8%,
          ${RAINBOW_COLORS.cyan} 12%,
          ${RAINBOW_COLORS.blue} 16%,
          ${RAINBOW_COLORS.purple} 20%,
          ${RAINBOW_COLORS.pink} 24%,
          ${RAINBOW_COLORS.pink} 28%,
          ${RAINBOW_COLORS.purple} 32%,
          ${RAINBOW_COLORS.blue} 36%,
          ${RAINBOW_COLORS.cyan} 40%,
          ${RAINBOW_COLORS.green} 44%,
          ${RAINBOW_COLORS.yellow} 48%
        ),
        radial-gradient(
          farthest-corner circle at var(--mx) var(--my),
          hsla(180, 100%, 89%, 0.4) 5%,
          hsla(180, 14%, 57%, 0.25) 40%,
          hsl(0, 0%, 0%) 130%
        )
      `,
      backgroundSize: "200% 200%, 400% 900%, cover",
      backgroundBlendMode: "color-burn, multiply",
      filter: "brightness(1) contrast(1) saturate(0.8)",
      mixBlendMode: "color-dodge",
    },
    glare: {
      backgroundImage: `radial-gradient(
        farthest-corner circle at var(--mx) var(--my),
        hsla(204, 100%, 95%, 0.6) 5%,
        hsla(250, 15%, 20%, 0.8) 150%
      )`,
      filter: "brightness(0.75) contrast(2) saturate(2)",
      mixBlendMode: "overlay",
    },
  },

  // 彩虹全息 - 强烈彩虹渐变
  rainbow: {
    shine: {
      backgroundImage: `
        linear-gradient(-45deg, hsl(0, 57%, 37%), hsl(180, 60%, 35%)),
        linear-gradient(-30deg,
          hsl(0, 57%, 37%),
          hsl(40, 53%, 39%),
          hsl(90, 60%, 35%),
          hsl(180, 60%, 35%),
          hsl(210, 57%, 39%),
          hsl(280, 55%, 31%),
          hsl(0, 57%, 37%),
          hsl(40, 53%, 39%),
          hsl(90, 60%, 35%),
          hsl(180, 60%, 35%),
          hsl(210, 57%, 39%),
          hsl(280, 55%, 31%),
          hsl(0, 57%, 37%)
        )
      `,
      backgroundSize: "200% 200%, 400% 400%",
      backgroundBlendMode: "luminosity, soft-light",
      filter: "brightness(0.6) contrast(2.2) saturate(0.75)",
      mixBlendMode: "color-dodge",
    },
    glare: {
      backgroundImage: `radial-gradient(
        farthest-corner circle at var(--mx) var(--my),
        hsla(0, 0%, 80%, 0.7),
        hsla(187, 10%, 85%, 0.2) 30%,
        hsl(197, 6%, 25%) 120%
      )`,
      filter: "brightness(0.9) contrast(1.75)",
      mixBlendMode: "hard-light",
    },
  },

  // 银河全息 - 深空星云
  galaxy: {
    shine: {
      backgroundImage: `
        radial-gradient(
          ellipse 100% 80% at 50% 20%,
          hsla(260, 100%, 80%, 0.3),
          transparent 60%
        ),
        radial-gradient(
          ellipse 80% 100% at 80% 80%,
          hsla(200, 100%, 70%, 0.25),
          transparent 50%
        ),
        repeating-linear-gradient(
          125deg,
          ${RAINBOW_COLORS.purple} 0%,
          ${RAINBOW_COLORS.blue} 8%,
          ${RAINBOW_COLORS.cyan} 16%,
          ${RAINBOW_COLORS.green} 24%,
          ${RAINBOW_COLORS.yellow} 32%,
          ${RAINBOW_COLORS.orange} 40%,
          ${RAINBOW_COLORS.red} 48%,
          ${RAINBOW_COLORS.pink} 56%,
          ${RAINBOW_COLORS.purple} 64%
        )
      `,
      backgroundSize: "200% 200%, 200% 200%, 300% 300%",
      backgroundBlendMode: "screen, screen, normal",
      filter: "brightness(0.65) contrast(2.5) saturate(0.8)",
      mixBlendMode: "color-dodge",
    },
    glare: {
      backgroundImage: `radial-gradient(
        farthest-corner circle at var(--mx) var(--my),
        hsla(260, 100%, 95%, 0.6) 5%,
        hsla(220, 60%, 50%, 0.3) 40%,
        transparent 80%
      )`,
      filter: "brightness(1) contrast(1.5)",
      mixBlendMode: "overlay",
    },
  },

  // 光辉全息 - 放射状金属
  radiant: {
    shine: {
      backgroundImage: `
        radial-gradient(
          farthest-corner ellipse at var(--mx) var(--my),
          hsl(0, 0%, 95%) 20%,
          hsl(45, 100%, 70%) 130%
        ),
        repeating-linear-gradient(
          45deg,
          hsl(0, 0%, 10%) 0%,
          hsl(0, 0%, 50%) 2.4%,
          hsl(0, 0%, 10%) 4.8%
        ),
        repeating-linear-gradient(
          -45deg,
          hsl(0, 0%, 10%) 0%,
          hsl(0, 0%, 50%) 2.4%,
          hsl(0, 0%, 10%) 4.8%
        )
      `,
      backgroundSize: "cover, 210% 210%, 210% 210%",
      backgroundBlendMode: "exclusion, darken, color-dodge",
      filter: "brightness(0.5) contrast(2) saturate(1.75)",
      mixBlendMode: "color-dodge",
    },
    glare: {
      backgroundImage: `radial-gradient(
        farthest-corner circle at var(--mx) var(--my),
        hsla(0, 0%, 100%, 0.33) 0%,
        hsl(0, 0%, 25%) 110%
      )`,
      filter: "brightness(1) contrast(1.5)",
      mixBlendMode: "hard-light",
    },
  },

  // 像素全息 - 点阵效果
  pixel: {
    shine: {
      backgroundImage: `
        repeating-linear-gradient(
          90deg,
          transparent 0px,
          transparent 2px,
          hsla(0, 0%, 100%, 0.08) 2px,
          hsla(0, 0%, 100%, 0.08) 4px
        ),
        repeating-linear-gradient(
          0deg,
          transparent 0px,
          transparent 2px,
          hsla(0, 0%, 100%, 0.08) 2px,
          hsla(0, 0%, 100%, 0.08) 4px
        ),
        repeating-linear-gradient(
          110deg,
          ${RAINBOW_COLORS.red} 0%,
          ${RAINBOW_COLORS.yellow} 15%,
          ${RAINBOW_COLORS.green} 30%,
          ${RAINBOW_COLORS.cyan} 45%,
          ${RAINBOW_COLORS.blue} 60%,
          ${RAINBOW_COLORS.purple} 75%,
          ${RAINBOW_COLORS.red} 90%
        )
      `,
      backgroundSize: "4px 4px, 4px 4px, 250% 250%",
      backgroundBlendMode: "overlay, overlay, normal",
      filter: "brightness(0.85) contrast(2.5) saturate(0.7)",
      mixBlendMode: "color-dodge",
    },
    glare: {
      backgroundImage: `radial-gradient(
        farthest-corner circle at var(--mx) var(--my),
        hsla(0, 0%, 100%, 0.5) 10%,
        transparent 60%
      )`,
      mixBlendMode: "overlay",
    },
  },
};

function createShineElement(type: HoloType): HTMLElement {
  const el = document.createElement("div");
  el.className = `holo-foil-shine holo-foil-${type}`;

  const effect = HOLO_EFFECTS[type].shine;

  Object.assign(el.style, {
    position: "absolute",
    inset: "0",
    borderRadius: "inherit",
    pointerEvents: "none",
    zIndex: "10",
    opacity: "0",
    transition: "opacity 0.3s ease",
    ...effect,
  });

  return el;
}

function createGlareElement(type: HoloType): HTMLElement {
  const el = document.createElement("div");
  el.className = `holo-foil-glare holo-foil-${type}`;

  const effect = HOLO_EFFECTS[type].glare;

  Object.assign(el.style, {
    position: "absolute",
    inset: "0",
    borderRadius: "inherit",
    pointerEvents: "none",
    zIndex: "11",
    opacity: "0",
    transition: "opacity 0.3s ease",
    ...effect,
  });

  return el;
}

function updateEffects(
  el: HTMLElement,
  state: HoloFoilState,
  clientX: number,
  clientY: number,
) {
  const rect = el.getBoundingClientRect();
  const { intensity, type } = state.options;

  // 计算相对位置
  const percentX = Math.max(
    0,
    Math.min(100, ((clientX - rect.left) / rect.width) * 100),
  );
  const percentY = Math.max(
    0,
    Math.min(100, ((clientY - rect.top) / rect.height) * 100),
  );

  // 计算中心距离（用于某些效果）
  const centerX = percentX - 50;
  const centerY = percentY - 50;
  const fromCenter = Math.sqrt(centerX * centerX + centerY * centerY) / 50;

  // 计算背景位置
  const bgX = 25 + percentX * 0.5;
  const bgY = 25 + percentY * 0.5;

  // 计算旋转角度
  const rotateX = (centerY / 50) * -12;
  const rotateY = (centerX / 50) * 12;

  // 应用 3D 旋转
  el.style.transform = `
    perspective(600px)
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    scale3d(1.03, 1.03, 1.03)
  `;

  // 更新全息层
  if (state.shineEl) {
    state.shineEl.style.setProperty("--mx", `${percentX}%`);
    state.shineEl.style.setProperty("--my", `${percentY}%`);
    state.shineEl.style.backgroundPosition = getBackgroundPosition(
      type,
      bgX,
      bgY,
      percentX,
      percentY,
    );
    state.shineEl.style.opacity = String(intensity);
  }

  // 更新闪光层
  if (state.glareEl) {
    state.glareEl.style.setProperty("--mx", `${percentX}%`);
    state.glareEl.style.setProperty("--my", `${percentY}%`);
    state.glareEl.style.opacity = String(
      intensity * Math.min(1, fromCenter + 0.3),
    );
  }
}

function getBackgroundPosition(
  type: HoloType,
  bgX: number,
  bgY: number,
  percentX: number,
  percentY: number,
): string {
  switch (type) {
    case "normal":
      return `${bgX}% ${bgY}%, 0% calc(${bgY}% - 50%)`;
    case "cosmos":
      return `${bgX}% ${bgY}%, ${10 + percentX * 0.8}% ${10 + percentY * 0.8}%, center center`;
    case "rainbow":
      return `${bgX}% ${bgY}%, ${bgX}% ${bgY}%`;
    case "galaxy":
      return `${bgX}% ${bgY}%, ${100 - bgX}% ${100 - bgY}%, ${bgX}% ${bgY}%`;
    case "radiant":
      return `center, ${bgX}% ${bgY}%, ${bgX}% ${bgY}%`;
    case "pixel":
      return `0 0, 0 0, ${bgX}% ${bgY}%`;
    default:
      return `${bgX}% ${bgY}%`;
  }
}

function resetEffects(el: HTMLElement, state: HoloFoilState) {
  el.style.transform =
    "perspective(600px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";

  if (state.shineEl) {
    state.shineEl.style.opacity = "0";
  }

  if (state.glareEl) {
    state.glareEl.style.opacity = "0";
  }
}

function initHoloFoil(el: HTMLElement, options: Required<HoloFoilOptions>) {
  // 确保有定位上下文
  const computedStyle = getComputedStyle(el);
  if (computedStyle.position === "static") {
    el.style.position = "relative";
  }

  // 设置 3D 变换相关样式
  el.style.transformStyle = "preserve-3d";
  el.style.willChange = "transform";
  el.style.transition = "transform 0.15s ease-out";

  // 创建效果层
  const shineEl = createShineElement(options.type);
  const glareEl = createGlareElement(options.type);

  el.appendChild(shineEl);
  el.appendChild(glareEl);

  let rafId: number | null = null;

  // 事件处理
  const onPointerMove = (e: MouseEvent | TouchEvent) => {
    let clientX: number, clientY: number;

    if ("touches" in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ("clientX" in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return;
    }

    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }

    rafId = requestAnimationFrame(() => {
      const s = stateMap.get(el);
      if (s && !s.options.disabled) {
        updateEffects(el, s, clientX, clientY);
      }
      rafId = null;
    });
  };

  const onPointerLeave = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }

    const s = stateMap.get(el);
    if (s) {
      resetEffects(el, s);
    }
  };

  const state: HoloFoilState = {
    shineEl,
    glareEl,
    options,
    onPointerMove,
    onPointerLeave,
    rafId,
  };
  stateMap.set(el, state);

  // 获取事件绑定目标（优先使用父元素以覆盖热区范围）
  const eventTarget = el.parentElement || el;

  // 绑定事件
  eventTarget.addEventListener("mousemove", onPointerMove);
  eventTarget.addEventListener("mouseleave", onPointerLeave);
  eventTarget.addEventListener("touchmove", onPointerMove, { passive: true });
  eventTarget.addEventListener("touchend", onPointerLeave);
  eventTarget.addEventListener("touchcancel", onPointerLeave);
}

function cleanupHoloFoil(el: HTMLElement) {
  const state = stateMap.get(el);
  if (state) {
    if (state.rafId !== null) {
      cancelAnimationFrame(state.rafId);
    }

    const eventTarget = el.parentElement || el;
    eventTarget.removeEventListener("mousemove", state.onPointerMove);
    eventTarget.removeEventListener("mouseleave", state.onPointerLeave);
    eventTarget.removeEventListener("touchmove", state.onPointerMove);
    eventTarget.removeEventListener("touchend", state.onPointerLeave);
    eventTarget.removeEventListener("touchcancel", state.onPointerLeave);

    el.style.transform = "";
    el.style.transition = "";
    el.style.willChange = "";

    state.shineEl?.remove();
    state.glareEl?.remove();
    stateMap.delete(el);
  }
}

function parseOptions(
  value: HoloFoilOptions | HoloType | boolean | undefined,
): Required<HoloFoilOptions> {
  if (typeof value === "boolean") {
    return { ...defaultOptions, disabled: !value };
  }
  if (typeof value === "string") {
    return { ...defaultOptions, type: value as HoloType };
  }
  return { ...defaultOptions, ...value };
}

export const vHoloFoil: Directive<
  HTMLElement,
  HoloFoilOptions | HoloType | boolean | undefined
> = {
  mounted(
    el,
    binding: DirectiveBinding<HoloFoilOptions | HoloType | boolean | undefined>,
  ) {
    const options = parseOptions(binding.value);
    if (!options.disabled) {
      initHoloFoil(el, options);
    }
  },

  updated(
    el,
    binding: DirectiveBinding<HoloFoilOptions | HoloType | boolean | undefined>,
  ) {
    const newOptions = parseOptions(binding.value);
    const state = stateMap.get(el);

    if (newOptions.disabled) {
      cleanupHoloFoil(el);
    } else if (!state) {
      initHoloFoil(el, newOptions);
    } else if (state.options.type !== newOptions.type) {
      // 类型变化时重新初始化
      cleanupHoloFoil(el);
      initHoloFoil(el, newOptions);
    } else {
      state.options = newOptions;
    }
  },

  unmounted(el) {
    cleanupHoloFoil(el);
  },
};

// 导出所有可用的全息类型
export const HOLO_TYPES: HoloType[] = [
  "normal",
  "cosmos",
  "rainbow",
  "galaxy",
  "radiant",
  "pixel",
];

export default vHoloFoil;
