# Tarot Web App - 项目上下文

## 项目概述

基于 Vite + Vue3 + TypeScript 的塔罗牌 Web App，支持一键部署到 GitHub Pages。

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.4+ | 响应式 UI 框架 |
| Vite | 5.x | 构建工具 |
| TypeScript | 5.x | 类型安全 |
| gh-pages | 6.x | GitHub Pages 部署 |

## 项目结构

```
tarot/
├── .cursor/
│   └── context.md          # 项目上下文（本文件）
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions 自动部署
├── public/
│   └── favicon.svg         # 网站图标
├── src/
│   ├── components/
│   │   └── TarotCard.vue   # 塔罗牌卡片组件
│   ├── utils/
│   │   └── tarot.ts        # 塔罗牌数据和抽牌逻辑
│   ├── App.vue             # 主应用组件
│   ├── main.ts             # 入口文件
│   ├── style.css           # 全局样式
│   └── vite-env.d.ts       # Vite 类型声明
├── index.html              # HTML 入口
├── package.json            # 依赖配置
├── tsconfig.json           # TypeScript 配置
├── tsconfig.node.json      # Node TypeScript 配置
└── vite.config.ts          # Vite 配置
```

## SOP：开发与部署流程

### 1. 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 访问 http://localhost:5173
```

### 2. 构建测试

```bash
# 构建生产版本
pnpm build

# 本地预览构建结果
pnpm preview
```

### 3. 部署到 GitHub Pages

#### 方式 A：自动部署（推荐）

1. 将代码推送到 GitHub 仓库的 `main` 分支
2. 进入仓库 Settings → Pages
3. Source 选择 "GitHub Actions"
4. 推送代码后自动触发部署

#### 方式 B：手动部署

```bash
pnpm deploy
```

### 4. 配置仓库名

如果仓库名不是 `tarot`，需要修改 `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [vue()],
  base: '/你的仓库名/',  // 改成你的仓库名
})
```

## 核心功能

### 当前实现

- [x] 22 张大阿卡纳牌数据
- [x] 单牌占卜模式
- [x] 三牌阵（过去-现在-未来）
- [x] 正位/逆位随机
- [x] 卡牌翻转动画
- [x] 响应式布局
- [x] GitHub Pages 一键部署

### 扩展方向

- [ ] 添加 56 张小阿卡纳牌
- [ ] 更多牌阵（凯尔特十字等）
- [ ] 牌面图片资源
- [ ] 抽牌历史记录（LocalStorage）
- [ ] 每日一牌功能
- [ ] 深度解读页面
- [ ] PWA 离线支持
- [ ] 多语言支持

## 设计原则

### 塔罗牌呈现

- 将塔罗作为反思和自我探索的工具，而非命运预测
- 正向引导：即使是"困难"牌也提供建设性解读
- 明确 AI 定位：娱乐和自我反思，不提供决策建议

### UI/UX

- 深色主题，营造神秘氛围
- 紫色渐变为主色调
- 简洁交互，专注核心体验
- 移动端优先的响应式设计

## 常见问题

### Q: 部署后页面空白？

检查 `vite.config.ts` 中的 `base` 是否与仓库名匹配。

### Q: 如何添加新牌？

编辑 `src/utils/tarot.ts`，在 `majorArcana` 数组中添加新牌数据。

### Q: 如何修改逆位概率？

在 `src/utils/tarot.ts` 的 `drawCards` 函数中，修改 `Math.random() > 0.7` 的阈值。

## 相关资源

- [Vue 3 文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
