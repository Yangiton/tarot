# Tarot Insight - 用户流程图

> 版本：1.0  
> 更新日期：2026-03-11  
> 作者：UX 团队

---

## 一、核心用户流程

### 1.1 完整占卜流程

```mermaid
flowchart TD
    subgraph 进入阶段
        A[用户访问网站] --> B[显示首页]
        B --> C{首次访问?}
        C -->|是| D[展示引导提示]
        C -->|否| E[直接显示界面]
        D --> E
    end

    subgraph 准备阶段
        E --> F[选择牌阵]
        F --> G[单牌/三牌阵/五牌阵]
        G --> H{用户有问题?}
        H -->|是| I[心中默念问题]
        H -->|否| J[保持开放心态]
        I --> K[点击开始抽牌]
        J --> K
    end

    subgraph 抽牌阶段
        K --> L[卡牌入场动画]
        L --> M[显示卡牌背面]
        M --> N[提示点击翻牌]
    end

    subgraph 翻牌阶段
        N --> O[点击第一张牌]
        O --> P[翻牌动画]
        P --> Q[显示牌面]
        Q --> R{还有未翻的牌?}
        R -->|是| O
        R -->|否| S[显示查看解读按钮]
    end

    subgraph 解读阶段
        S --> T[点击查看解读]
        T --> U[进入解读页]
        U --> V[依次展示牌义]
        V --> W[展示综合指引]
        W --> X{用户满意?}
    end

    subgraph 结束阶段
        X -->|是| Y[结束/分享]
        X -->|否| Z[重新抽牌]
        Z --> F
        Y --> AA[返回首页]
        AA --> F
    end
```

### 1.2 简化流程（快速路径）

```mermaid
flowchart LR
    A[访问] --> B[选牌阵] --> C[抽牌] --> D[翻牌] --> E[查看解读]
    
    style A fill:#1a1a2e,color:#ffd700
    style B fill:#1a1a2e,color:#ffd700
    style C fill:#1a1a2e,color:#ffd700
    style D fill:#1a1a2e,color:#ffd700
    style E fill:#1a1a2e,color:#ffd700
```

**关键指标**：从进入到完成解读 < 90秒

---

## 二、页面级用户流程

### 2.1 首页 (HomeView) 流程

```mermaid
flowchart TD
    subgraph 初始状态
        A[页面加载] --> B[显示标题/日期]
        B --> C[显示牌阵选择器]
        C --> D[默认选中三牌阵]
        D --> E[显示开始抽牌按钮]
    end

    subgraph 牌阵选择
        E --> F{点击牌阵按钮}
        F --> G[单牌]
        F --> H[三牌阵]
        F --> I[五牌阵]
        G & H & I --> J[更新选中状态]
        J --> E
    end

    subgraph 抽牌流程
        E --> K{点击开始抽牌}
        K --> L[隐藏抽牌按钮]
        L --> M[禁用牌阵选择]
        M --> N[卡牌依次入场]
        N --> O[显示翻牌提示]
        O --> P[显示重新抽牌按钮]
    end

    subgraph 翻牌流程
        P --> Q{点击卡牌}
        Q --> R[翻牌动画]
        R --> S[显示牌面信息]
        S --> T{全部翻开?}
        T -->|否| Q
        T -->|是| U[显示查看解读按钮]
    end

    subgraph 导航流程
        U --> V{点击查看解读}
        V --> W[跳转到解读页]
        
        P --> X{点击重新抽牌}
        X --> Y[重置所有状态]
        Y --> C
    end
```

### 2.2 解读页 (ReadingView) 流程

```mermaid
flowchart TD
    subgraph 进入检查
        A[进入解读页] --> B{有占卜数据?}
        B -->|否| C[重定向到首页]
        B -->|是| D[渲染页面]
    end

    subgraph 内容展示
        D --> E[显示头部导航]
        E --> F[依次展示牌义卡片]
        F --> G[Card 1 动画入场]
        G --> H[Card 2 动画入场]
        H --> I[Card N 动画入场...]
        I --> J[显示综合指引]
    end

    subgraph 用户交互
        J --> K{用户操作}
        K --> L[滚动浏览内容]
        K --> M[点击返回]
        K --> N[点击重新抽牌]
        
        L --> K
        M --> O[返回首页/保持数据]
        N --> P[清空数据/返回首页]
    end
```

### 2.3 牌库 (LibraryView) 流程

```mermaid
flowchart TD
    subgraph 页面加载
        A[进入牌库] --> B[显示大阿尔卡纳区块]
        B --> C[渲染22张牌卡片]
        C --> D[显示小阿尔卡纳区块]
        D --> E[显示即将推出]
    end

    subgraph 浏览交互
        E --> F{用户交互}
        F --> G[滚动浏览]
        F --> H[悬停卡片]
        F --> I[点击卡片 V2]
        
        G --> F
        H --> J[卡片上浮动效]
        J --> F
        I --> K[显示详情弹窗 V2]
        K --> F
    end
```

---

## 三、交互状态流转

### 3.1 卡牌状态机

```mermaid
stateDiagram-v2
    [*] --> Hidden: 页面加载
    Hidden --> Entering: 抽牌
    Entering --> FaceDown: 入场完成
    FaceDown --> Flipping: 点击翻牌
    Flipping --> FaceUp: 动画完成
    FaceUp --> [*]: 重新抽牌
    
    note right of Hidden: 卡牌不可见
    note right of FaceDown: 显示牌背
    note right of FaceUp: 显示牌面
```

#### 状态详情

| 状态 | 视觉表现 | 可交互性 |
|------|----------|----------|
| Hidden | 不显示 | 无 |
| Entering | 入场动画中 | 不可点击 |
| FaceDown | 显示牌背 | 可点击翻牌 |
| Flipping | 翻转动画中 | 不可点击 |
| FaceUp | 显示牌面 | 无需交互 |

### 3.2 按钮状态流转

```mermaid
stateDiagram-v2
    [*] --> 显示抽牌按钮
    显示抽牌按钮 --> 隐藏抽牌按钮: 点击抽牌
    隐藏抽牌按钮 --> 显示重抽按钮: 卡牌入场
    显示重抽按钮 --> 显示解读按钮: 全部翻开
    显示解读按钮 --> 隐藏所有按钮: 进入解读页
    
    显示重抽按钮 --> 显示抽牌按钮: 重新抽牌
    显示解读按钮 --> 显示抽牌按钮: 重新抽牌
```

---

## 四、错误处理流程

### 4.1 网络错误处理

```mermaid
flowchart TD
    A[用户操作] --> B{网络请求}
    B -->|成功| C[正常流程]
    B -->|失败| D[显示错误提示]
    D --> E{重试?}
    E -->|是| B
    E -->|否| F[记录错误]
    F --> G[优雅降级]
```

### 4.2 数据异常处理

```mermaid
flowchart TD
    A[解读页访问] --> B{检查数据}
    B -->|数据存在| C[正常渲染]
    B -->|数据缺失| D[重定向首页]
    
    E[卡牌数据加载] --> F{数据有效?}
    F -->|有效| G[渲染卡牌]
    F -->|无效| H[显示默认占位]
```

---

## 五、V2 功能流程预览

### 5.1 每日塔罗流程

```mermaid
flowchart TD
    A[用户访问] --> B{今日已抽?}
    B -->|否| C[显示每日抽牌入口]
    B -->|是| D[显示今日牌面]
    
    C --> E[点击抽取今日一卡]
    E --> F[随机抽取]
    F --> G[翻牌动画]
    G --> H[显示牌义]
    H --> I[保存到本地]
    I --> D
    
    D --> J[查看详细解读]
    D --> K[分享今日一卡]
```

### 5.2 AI 解读流程

```mermaid
flowchart TD
    A[完成抽牌] --> B[用户输入问题]
    B --> C[提交到 AI]
    C --> D[显示加载状态]
    D --> E{AI 响应}
    E -->|成功| F[流式显示解读]
    E -->|失败| G[回退到规则解读]
    F --> H[显示完整解读]
    G --> H
    H --> I[提供反馈选项]
```

### 5.3 分享流程

```mermaid
flowchart TD
    A[查看解读完成] --> B[点击分享]
    B --> C[生成分享卡片]
    C --> D{选择分享方式}
    D --> E[保存到相册]
    D --> F[分享到微信]
    D --> G[复制链接]
    
    E --> H[显示成功提示]
    F --> H
    G --> H
```

---

## 六、性能关键路径

### 6.1 首屏渲染路径

```mermaid
flowchart LR
    A[HTML] --> B[CSS]
    B --> C[关键JS]
    C --> D[首屏渲染]
    D --> E[交互就绪]
    
    style D fill:#4ade80,color:#000
```

**目标**：FCP < 1.5s, TTI < 3s

### 6.2 占卜完成路径

```mermaid
flowchart LR
    A[点击抽牌] --> B[数据生成]
    B --> C[DOM更新]
    C --> D[动画开始]
    D --> E[交互就绪]
```

**目标**：从点击到动画开始 < 100ms

---

## 七、可访问性流程

### 7.1 键盘导航流程

```mermaid
flowchart TD
    A[Tab进入页面] --> B[焦点到牌阵选择]
    B --> C[Tab切换牌阵]
    C --> D[Enter选择]
    D --> E[Tab到抽牌按钮]
    E --> F[Enter抽牌]
    F --> G[Tab在卡牌间移动]
    G --> H[Enter/Space翻牌]
    H --> I[Tab到查看解读]
    I --> J[Enter进入解读]
```

### 7.2 屏幕阅读器流程

```mermaid
flowchart TD
    A[读取页面标题] --> B[读取当前日期]
    B --> C[读取牌阵选项]
    C --> D[朗读选中牌阵]
    D --> E[读取抽牌按钮]
    E --> F[朗读卡牌状态]
    F --> G[朗读翻牌结果]
    G --> H[读取解读内容]
```
