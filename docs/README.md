# BlackRice Tarot - 产品文档中心

> 🔮 沉浸式塔罗占卜 Web App - 完整产品与技术文档
>
> 🐈‍⬛ 由神秘的黑猫「黑米」为你解读命运的低语

---

## 📊 开发进度

**[📋 TODO.md - 开发进度清单](./TODO.md)** ← 查看完整开发状态

| 阶段 | 状态 | 说明 |
|:-----|:----:|:-----|
| MVP v1.0 | ✅ | 核心占卜功能 + 78张完整牌组 |
| V1.5 沉浸式 | 🚧 | 3D交互 + 黑米角色 + 音效 |
| V2.0 留存 | 📋 | 每日一卡 + 图鉴收集 + 分享 |

---

## 📁 文档目录

```
docs/
├── README.md                           # 本文件 - 文档索引
├── TODO.md                             # 📊 开发进度清单 ⭐
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
│   ├── API-DESIGN.md                   # API 设计
│   └── MOBILE-RELEASE.md              # 📱 移动端发布指南 ⭐
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
| [MOBILE-RELEASE.md](./technical/MOBILE-RELEASE.md) | 📱 移动端发布 | Capacitor 集成、iOS/Android 上架、CI/CD |

### 快速链接

**开发者**
- [项目目录结构](./technical/TECH-STACK.md#21-目录结构)
- [核心模块设计](./technical/TECH-STACK.md#三核心模块设计)
- [开发规范](./technical/TECH-STACK.md#七开发规范)
- [版本迭代计划](./technical/ROADMAP.md#二mvp-v10---已完成-)
- [V2 功能规划](./technical/ROADMAP.md#五v20---重大升级)
- [数据模型定义](./technical/API-DESIGN.md#五类型定义汇总)

**移动端发布**
- [Capacitor 集成指南](./technical/MOBILE-RELEASE.md#三capacitor-集成)
- [Android 上架流程](./technical/MOBILE-RELEASE.md#72-google-play)
- [iOS 上架流程](./technical/MOBILE-RELEASE.md#71-ios-app-store)
- [CI/CD 自动构建](./technical/MOBILE-RELEASE.md#八cicd-自动构建)

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

### 产品 Slogan
> "聆听宇宙的低语" / "Listen to the whispers of the universe"

### 核心价值
一款**沉浸式塔罗占卜 Web App**，通过仪式感的交互体验，让用户在神秘的氛围中获得内心的指引与启发。

### 核心特点

| 特点 | 说明 |
|------|------|
| 🌙 沉浸仪式 | 完整的洗牌→切牌→抽牌→翻牌仪式流程 |
| ✨ 交互体验 | 3D 动效驱动的沉浸式交互（Three.js） |
| 🌅 每日一卡 | 每日单牌占卜 + 今日运势指引 |
| 🎴 图鉴收集 | 每日占卜开卡，收集闪卡图鉴 |
| 🐈‍⬛ IP 陪伴 | 黑米（占卜者）& 面包（问卜者）角色系统 |
| 📱 跨端适配 | 完美支持 PC 和移动端 |
| 🔮 专业内容 | 基于韦特塔罗 78 张完整牌组 |

### 技术栈

```
Vue 3 + TypeScript + Vite + Tailwind CSS + Vue Router + Three.js
```

---

## 五、版本进度

> 详细清单见 **[TODO.md](./TODO.md)**

### ✅ MVP (v1.0) - 已完成

- [x] 78 张塔罗牌完整数据（22 大 + 56 小阿尔卡纳）
- [x] 三种牌阵：单牌、三牌阵、五牌阵
- [x] 正位/逆位随机机制
- [x] CSS 3D 翻牌动画 + Holofoil 闪卡效果
- [x] 星空背景动画
- [x] 响应式布局（PC/Mobile）
- [x] 牌库浏览功能
- [x] 多牌组支持（Emoji + 韦特）

### 🚧 V1.5 - 沉浸式交互升级

- [ ] 问题输入环节（静心提问）
- [ ] 3D 洗牌动画（Three.js）
- [ ] 切牌交互（手势滑动）
- [ ] 黑米角色 🐈‍⬛ 引入
- [ ] 音效系统

### 🔮 V2.0 - 留存与增长

- [ ] 每日一卡 + 今日运势
- [ ] 图鉴收集系统（稀有度）
- [ ] 闪卡分享卡片
- [ ] AI 解读集成
- [ ] 凯尔特十字牌阵

详细规划见 [ROADMAP.md](./technical/ROADMAP.md) | [TODO.md](./TODO.md)

---

## 六、设计速查

### 颜色

```css
--gold: #FFD700;           /* 主金色 */
--gold-dark: #C9A227;      /* 深金色 */
--bg-primary: #1a1a2e;     /* 主背景 */
--text-primary: #e8d5b7;   /* 主文本 */
```

### 核心流程（沉浸式仪式）

```
提问 → 洗牌 → 切牌 → 抽牌 → 翻牌 → 解读 → 分享/收藏
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
- Agent Skills：`/.agents/skills/`

---

## 九、已安装 Skills

| Skill | 用途 |
|-------|------|
| capacitor-best-practices | Capacitor 最佳实践 |
| capacitor-security | Capacitor 安全指南 |
| project-astrology-tarot-divination | 塔罗占卜知识 |
| ui-ux-pro-max | UI/UX 设计专家 |
| tailwindcss-mobile-first | 移动优先设计 |
| seo-audit | SEO 审计 |

---

*最后更新：2026-03-11*
