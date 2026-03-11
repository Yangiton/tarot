# BlackRice Tarot - 产品文档中心

> 🔮 轻量级塔罗占卜 Web App - 完整产品与技术文档

---

## 📁 文档目录

```
docs/
├── README.md                           # 本文件 - 文档索引
│
├── product/                            # 📋 产品文档
│   ├── PRD.md                          # 产品需求文档
│   ├── UX-DESIGN.md                    # UX 设计规范
│   ├── INFORMATION-ARCHITECTURE.md     # 信息架构
│   └── USER-FLOWS.md                   # 用户流程图
│
├── technical/                          # 💻 技术文档
│   ├── TECH-STACK.md                   # 技术架构
│   ├── ROADMAP.md                      # 迭代路径
│   └── API-DESIGN.md                   # API 设计
│
└── reference/                          # 📚 参考资料
    ├── MAJOR-ARCANA.md                 # 大阿尔卡纳完整参考
    ├── MINOR-ARCANA.md                 # 小阿尔卡纳完整参考
    ├── SPREADS.md                      # 牌阵参考
    └── CARD-DESIGN.md                  # 卡面设计规范
```

---

## 一、产品文档 (product/)

面向产品经理、设计师、开发者的产品规划与设计文档。

| 文档 | 说明 | 适用角色 |
|------|------|----------|
| [PRD.md](./product/PRD.md) | 产品需求文档 - 定位、用户、功能、指标 | PM、全员 |
| [UX-DESIGN.md](./product/UX-DESIGN.md) | UX 设计规范 - 视觉、组件、动效、响应式 | 设计、前端 |
| [INFORMATION-ARCHITECTURE.md](./product/INFORMATION-ARCHITECTURE.md) | 信息架构 - 站点地图、页面结构、数据模型 | PM、UX、开发 |
| [USER-FLOWS.md](./product/USER-FLOWS.md) | 用户流程图 - 核心流程、状态机、交互 | 全员 |

### 快速链接

**产品经理**
- [产品定位与目标](./product/PRD.md#一产品概述)
- [目标用户画像](./product/PRD.md#二目标用户)
- [功能规划 MVP & V2](./product/PRD.md#三功能规划)
- [数据指标体系](./product/PRD.md#七数据指标)

**设计师**
- [设计原则](./product/UX-DESIGN.md#一设计原则)
- [色彩规范](./product/UX-DESIGN.md#21-色彩规范)
- [组件设计](./product/UX-DESIGN.md#三组件设计规范)
- [动效设计](./product/UX-DESIGN.md#四动效设计规范)

---

## 二、技术文档 (technical/)

面向开发者的技术架构、实现细节和迭代规划。

| 文档 | 说明 | 内容要点 |
|------|------|----------|
| [TECH-STACK.md](./technical/TECH-STACK.md) | 技术架构 | 技术栈、项目结构、核心模块、开发规范 |
| [ROADMAP.md](./technical/ROADMAP.md) | 迭代路径 | 版本规划、功能清单、技术债务、里程碑 |
| [API-DESIGN.md](./technical/API-DESIGN.md) | API 设计 | 内部 API、后端 API (V2)、本地存储、类型定义 |

### 快速链接

**开发者**
- [项目目录结构](./technical/TECH-STACK.md#21-目录结构)
- [核心模块设计](./technical/TECH-STACK.md#三核心模块设计)
- [开发规范](./technical/TECH-STACK.md#七开发规范)
- [版本迭代计划](./technical/ROADMAP.md#二mvp-v10---已完成-)
- [V2 功能规划](./technical/ROADMAP.md#五v20---重大升级)
- [数据模型定义](./technical/API-DESIGN.md#五类型定义汇总)

---

## 三、参考资料 (reference/)

塔罗牌专业知识和设计资源参考。

| 文档 | 说明 | 内容要点 |
|------|------|----------|
| [MAJOR-ARCANA.md](./reference/MAJOR-ARCANA.md) | 大阿尔卡纳 | 22张大牌完整牌义、象征、正逆位解读 |
| [MINOR-ARCANA.md](./reference/MINOR-ARCANA.md) | 小阿尔卡纳 | 56张小牌、四花色、数字牌、宫廷牌 |
| [SPREADS.md](./reference/SPREADS.md) | 牌阵参考 | 各种牌阵的布局、位置含义、使用场景 |
| [CARD-DESIGN.md](./reference/CARD-DESIGN.md) | 卡面设计 | 尺寸、样式、动画、符号、无障碍 |

### 快速链接

**内容创作**
- [大阿尔卡纳牌义](./reference/MAJOR-ARCANA.md#完整牌义)
- [小阿尔卡纳概览](./reference/MINOR-ARCANA.md#概述)
- [牌阵选择指南](./reference/SPREADS.md#牌阵选择指南)
- [凯尔特十字详解](./reference/SPREADS.md#凯尔特十字-celtic-cross)

**视觉设计**
- [卡片尺寸规范](./reference/CARD-DESIGN.md#一卡片尺寸)
- [卡片视觉样式](./reference/CARD-DESIGN.md#三视觉样式)
- [动画规范](./reference/CARD-DESIGN.md#四动画规范)
- [符号系统](./reference/CARD-DESIGN.md#六符号系统)

---

## 四、产品概览

### 产品名称
**BlackRice Tarot** （黑米塔罗）

### 核心价值
一款**轻量级塔罗占卜 Web App**，用户可以通过抽取塔罗牌获得对问题的启发性解读。

### 核心特点

| 特点 | 说明 |
|------|------|
| 🚀 即开即用 | 无需注册，打开即可使用 |
| 🌙 视觉沉浸 | 神秘感强的深色金色主题 |
| 👆 轻交互 | 简洁的点击/翻牌交互体验 |
| 📱 跨端适配 | 完美支持 PC 和移动端 |
| 🔮 专业内容 | 基于韦特塔罗的专业解读 |

### 技术栈

```
Vue 3 + TypeScript + Vite + Tailwind CSS + Vue Router
```

---

## 五、版本进度

### ✅ MVP (v1.0) - 已完成

- [x] 22张大阿尔卡纳完整数据
- [x] 三种牌阵：单牌、三牌阵、五牌阵
- [x] 正位/逆位随机机制
- [x] 翻牌动画
- [x] 完整解读面板
- [x] 星空背景动画
- [x] 响应式布局（PC/Mobile）
- [x] 牌库浏览功能

### 🚧 V1.1 - 体验优化

- [ ] 问题输入功能
- [ ] 洗牌动画
- [ ] 首次使用引导

### 📋 V1.2 - 功能扩展

- [ ] 每日塔罗
- [ ] 分享功能
- [ ] 抽牌历史

### 🔮 V2.0 - 重大升级

- [ ] 56张小阿尔卡纳
- [ ] 凯尔特十字牌阵
- [ ] AI 解读集成
- [ ] PWA 支持

详细规划见 [ROADMAP.md](./technical/ROADMAP.md)

---

## 六、设计速查

### 颜色

```css
--gold: #FFD700;           /* 主金色 */
--gold-dark: #C9A227;      /* 深金色 */
--bg-primary: #1a1a2e;     /* 主背景 */
--text-primary: #e8d5b7;   /* 主文本 */
```

### 核心流程

```
选择牌阵 → 点击抽牌 → 点击翻牌 → 查看解读
```

### 关键动效时长

| 动效 | 时长 |
|------|------|
| 卡牌入场 | 400ms |
| 翻牌 | 600ms |
| 页面转场 | 250ms |

---

## 七、文档维护

| 项目 | 说明 |
|------|------|
| 更新频率 | 随产品迭代同步更新 |
| 版本控制 | 跟随 Git 仓库 |
| 图表工具 | Mermaid |
| 反馈渠道 | 通过 Issue 提交 |

---

## 八、相关链接

- 项目代码：`/src`
- 项目配置：`/.cursor/context.md`
- 部署配置：`/.github/workflows/deploy.yml`

---

*最后更新：2026-03-11*
