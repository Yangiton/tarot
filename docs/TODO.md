# BlackRice Tarot - 开发进度清单

> 更新日期：2026-03-11  
> 版本：v1.0 → v2.0 路线图

---

## ✅ 已完成 (MVP v1.0)

### 占卜核心

- [x] 单牌占卜（今日指引）
- [x] 三牌阵占卜（过去→现在→未来）
- [x] 五牌阵占卜（现状、挑战、过去、未来、建议）
- [x] 正/逆位随机（30% 逆位概率）

### 牌义系统

- [x] 22 张大阿尔卡纳完整数据
  - 关键词、正位解读、逆位解读
  - Emoji 符号映射
- [x] 56 张小阿尔卡纳完整数据
  - 四花色：权杖 🪄、圣杯 🏆、宝剑 ⚔️、金币 🪙
  - 数字牌 (Ace-10) + 宫廷牌 (侍从/骑士/王后/国王)
- [x] 综合指引生成 `generateSummary()`

### 视觉体验

- [x] 星空背景动画 `StarBackground.vue`
- [x] CSS 3D 翻牌动画 `TarotCard.vue`
- [x] Holofoil 闪卡效果 `vHoloFoil` 指令
- [x] motion-v 入场/退场动画

### 功能页面

- [x] 首页 `Home.vue` - 占卜主流程
- [x] 解读页 `Reading.vue` - 牌义详情
- [x] 牌库页 `Library.vue` - 78 张牌浏览
- [x] 设置页 `Settings.vue` - 牌组选择、完整牌组开关

### 系统功能

- [x] 多牌组支持（Emoji 牌组 + 韦特牌组）
- [x] 响应式布局（PC + 移动端）
- [x] 占卜小贴士轮播

### 技术基础

- [x] Vue 3 + TypeScript + Vite
- [x] Vue Router 路由
- [x] Tailwind CSS 样式
- [x] motion-v 动画库

### 产品文档

- [x] PRD.md - 产品需求文档
- [x] UX-DESIGN.md - UX 设计规范
- [x] INFORMATION-ARCHITECTURE.md - 信息架构
- [x] USER-FLOWS.md - 用户流程
- [x] TECH-STACK.md - 技术架构
- [x] ROADMAP.md - 迭代路线图
- [x] API-DESIGN.md - API 设计
- [x] MOBILE-RELEASE.md - 移动端发布指南
- [x] MAJOR-ARCANA.md - 大阿尔卡纳参考
- [x] MINOR-ARCANA.md - 小阿尔卡纳参考
- [x] CARD-DESIGN.md - 卡面设计规范
- [x] SPREADS.md - 牌阵参考

### Agent Skills

- [x] capacitor-best-practices - Capacitor 最佳实践
- [x] capacitor-security - Capacitor 安全指南
- [x] project-astrology-tarot-divination - 塔罗占卜知识
- [x] ui-ux-pro-max - UI/UX 设计专家
- [x] tailwindcss-mobile-first - 移动优先设计
- [x] seo-audit - SEO 审计

---

## 🚧 进行中 (V1.5 沉浸式交互升级)

> 核心目标：从「点击抽牌」升级为「仪式体验」

### 仪式交互 [P0]

- [ ] 问题输入环节 - 静心提问仪式入口
- [ ] 3D 洗牌动画 - Three.js 物理模拟
- [ ] 切牌交互 - 手势滑动切分牌堆
- [ ] 3D 翻牌升级 - 增强现有 CSS 3D 效果

### 角色系统 [P1]

- [ ] 黑米角色引入 🐈‍⬛ - IP 形象 + 欢迎语
- [ ] 角色对话解读 - 拟人化体验

### 氛围增强 [P2]

- [ ] 音效系统 - 洗牌/翻牌/BGM
- [ ] 震动反馈 - 移动端触觉反馈

---

## 🔮 待开发 (V2 功能规划)

### 每日塔罗 [P0] ⭐ 核心留存

- [ ] 每日一卡功能 - 每日单牌 + 今日运势
- [ ] 图鉴收集系统 - 稀有度（普通/闪/全息/限定）
- [ ] 收集进度展示 - 成长可视化
- [ ] 闪卡分享卡片 - 病毒式传播

### 高级牌阵 [P1]

- [ ] 凯尔特十字牌阵 (10 牌)
- [ ] 关系牌阵
- [ ] 自定义牌阵

### AI 解读 [P1]

- [ ] AI 生成个性化解读
- [ ] 多牌组合分析
- [ ] 多模型支持（OpenAI/Anthropic/Moonshot）

### 社交分享 [P1]

- [ ] 分享到社交平台
- [ ] 分享链接追踪

### 用户功能 [P2]

- [ ] 占卜历史记录 (LocalStorage)
- [ ] PWA 离线支持

### 视觉扩展 [P2]

- [ ] 多套卡面风格
- [ ] 多套卡背设计

---

## 📱 移动端发布 (V3 App)

> 技术方案：Capacitor（零代码改动，打包成原生 App）
> 详细指南：[MOBILE-RELEASE.md](./technical/MOBILE-RELEASE.md)
> 
> ⚠️ **策略调整**：iOS 优先上架，Android 后续跟进

### Capacitor 集成 [P0]

- [x] 安装 Capacitor 核心依赖
- [x] 配置 `capacitor.config.ts`
- [ ] 添加 iOS 平台（`npx cap add ios`，需 Mac 或 Codemagic）
- [x] 集成原生插件（震动、分享、本地存储）
- [x] 创建 `useNative.ts` composable
- [x] 添加 Capacitor 构建脚本 (`build:cap`, `app:ios`, `app:android`)

### i18n 国际化 [P0] ⭐ App Store 必需

- [x] 安装 vue-i18n
- [x] 创建语言文件结构 (`src/i18n/locales/zh.json`, `en.json`)
- [x] 提取所有中文文案到语言文件
- [x] 实现语言切换功能
- [x] 翻译牌义内容（22 大 + 56 小阿尔卡纳）
- [x] 翻译 UI 文案
- [x] 设置页添加语言选择
- [x] 重构数据层支持多语言卡牌数据
- [x] generateSummary 中英双语支持

### iOS 发布 [P0] ⭐ 优先

- [ ] 注册 Apple Developer ($99/年)
- [ ] 准备 App 图标 + 启动屏
- [ ] 配置证书和描述文件
- [ ] 使用 Codemagic 云构建（无需 Mac）
- [ ] App Store Connect 填写信息（中英双语）
- [ ] 添加免责声明（娱乐用途）
- [ ] 准备中英文 App 截图
- [ ] 提交审核 → 上架

### CI/CD 自动化 [P1]

- [ ] 配置 Codemagic iOS 自动构建
- [ ] 自动上传到 App Store Connect

### Android 发布 [P2] 后续

- [ ] 添加 Android 平台
- [ ] 注册 Google Play Console ($25)
- [ ] 准备 App 图标套件
- [ ] 生成签名密钥 (keystore)
- [ ] 构建 Release APK/AAB
- [ ] 填写商店信息 + 截图
- [ ] 提交审核 → 上架

---

## 📅 里程碑

| 阶段 | 目标 | 状态 |
|------|------|:----:|
| MVP v1.0 | 核心占卜功能上线 | ✅ |
| V1.5 | 沉浸式交互体验 | 🚧 |
| V2.0 | 每日一卡 + 图鉴系统 | 📋 |
| V2.5 | i18n + iOS App 上架 | 🚧 |
| V3.0 | AI 解读 + Android 上架 | 📋 |

---

## 🎯 建议开发优先级

```
1. 每日一卡 ────────→ 核心留存引擎
       ↓
2. 问题输入环节 ────→ 增加仪式感入口
       ↓
3. 图鉴收集基础 ────→ 配合每日一卡
       ↓
4. 黑米角色引入 ────→ IP 建设开始
       ↓
5. 闪卡分享 ────────→ 病毒式传播
       ↓
6. i18n 国际化 ────→ 中英双语支持 ⭐
       ↓
7. Capacitor + iOS ─→ App Store 上架 ⭐
       ↓
8. 3D 洗牌/翻牌 ────→ 沉浸式体验核心
       ↓
9. AI 解读 ────────→ 智能化升级
       ↓
10. Android 上架 ──→ Google Play 扩展
```

---

## 📝 更新日志

### 2026-03-12

- 完成 i18n 国际化改造（vue-i18n + 中英双语）
- 完成 Capacitor 项目结构集成
- 创建 `useNative.ts` composable（震动、分享、本地存储）
- 重构数据层支持多语言卡牌数据
- 设置页新增语言切换功能
- 78 张塔罗牌英文翻译完成

### 2026-03-11

- 创建开发进度清单
- MVP v1.0 功能已全部完成
- 规划 V1.5 沉浸式交互升级
- 规划 V2 每日一卡 + 图鉴系统
- 新增移动端发布计划（Capacitor 方案）
- 新增 [MOBILE-RELEASE.md](./technical/MOBILE-RELEASE.md) 详细指南
- 新增 i18n 国际化任务（App Store 上架必需）
- 新增 Agent Skills 清单
- 调整移动端策略：iOS 优先，Android 后续
