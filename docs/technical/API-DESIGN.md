# Tarot Insight - API 设计

> 版本：1.0  
> 更新日期：2026-03-11

---

## 一、当前架构（纯前端）

当前版本为纯静态前端应用，所有数据和逻辑都在客户端处理。

### 1.1 内部 API（函数调用）

```typescript
// 塔罗牌数据操作
drawCards(count: SpreadType): DrawnCard[]
generateSummary(cards: DrawnCard[], spreadType: SpreadType): string

// 状态管理 (useTarot composable)
selectSpread(type: SpreadType): void
drawCards(): void
flipCard(): void
resetReading(): void

// 本地存储 (V1.2+)
saveReading(record: ReadingRecord): void
getHistory(): ReadingRecord[]
getDailyCard(): DailyCard
```

### 1.2 数据存储

| 存储位置 | 数据类型 | 持久性 |
|----------|----------|--------|
| 内存 (ref) | 当前占卜状态 | 会话级 |
| localStorage | 历史记录 | 永久 |
| localStorage | 设置 | 永久 |
| localStorage | 每日卡 | 当日 |

---

## 二、V2.0 后端 API 设计（规划）

### 2.1 API 概览

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/ai/reading` | POST | AI 解读生成 |
| `/api/share` | POST | 生成分享链接 |
| `/api/share/:id` | GET | 获取分享内容 |
| `/api/daily` | GET | 获取每日推荐 |

### 2.2 AI 解读 API

#### 请求

```http
POST /api/ai/reading
Content-Type: application/json

{
  "spreadType": 3,
  "cards": [
    {
      "id": "major-0",
      "name": "愚者",
      "position": "过去",
      "isReversed": false
    },
    {
      "id": "major-1",
      "name": "魔术师",
      "position": "现在",
      "isReversed": true
    },
    {
      "id": "major-2",
      "name": "女祭司",
      "position": "未来",
      "isReversed": false
    }
  ],
  "question": "我的职业发展方向",
  "stream": true
}
```

#### 响应（流式）

```http
HTTP/1.1 200 OK
Content-Type: text/event-stream

data: {"type": "start"}

data: {"type": "chunk", "content": "从你抽到的牌来看，"}

data: {"type": "chunk", "content": "过去的「愚者」正位代表..."}

data: {"type": "done", "usage": {"tokens": 450}}
```

#### 响应（非流式）

```json
{
  "success": true,
  "data": {
    "reading": "从你抽到的牌来看...(完整解读)",
    "highlights": ["新的开始", "内在力量", "直觉引导"],
    "advice": "建议你在做决定时..."
  },
  "usage": {
    "tokens": 450
  }
}
```

### 2.3 分享 API

#### 创建分享

```http
POST /api/share
Content-Type: application/json

{
  "spreadType": 3,
  "cards": [...],
  "summary": "综合指引内容...",
  "question": "可选问题"
}
```

```json
{
  "success": true,
  "data": {
    "shareId": "abc123xyz",
    "shareUrl": "https://tarot.app/s/abc123xyz",
    "expiresAt": "2026-03-18T00:00:00Z"
  }
}
```

#### 获取分享

```http
GET /api/share/abc123xyz
```

```json
{
  "success": true,
  "data": {
    "spreadType": 3,
    "cards": [...],
    "summary": "...",
    "createdAt": "2026-03-11T10:30:00Z"
  }
}
```

### 2.4 每日推荐 API

```http
GET /api/daily?date=2026-03-11
```

```json
{
  "success": true,
  "data": {
    "date": "2026-03-11",
    "card": {
      "id": "major-17",
      "name": "星星",
      "nameEn": "The Star",
      "isReversed": false
    },
    "message": "今日的星星牌为你带来希望的能量...",
    "luckyColor": "#FFD700",
    "luckyNumber": 7
  }
}
```

---

## 三、错误处理规范

### 3.1 错误响应格式

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "请求过于频繁，请稍后再试",
    "details": {
      "retryAfter": 60
    }
  }
}
```

### 3.2 错误码定义

| 错误码 | HTTP 状态 | 说明 |
|--------|-----------|------|
| `INVALID_REQUEST` | 400 | 请求参数错误 |
| `UNAUTHORIZED` | 401 | 未授权 |
| `RATE_LIMIT_EXCEEDED` | 429 | 请求过于频繁 |
| `AI_SERVICE_ERROR` | 503 | AI 服务不可用 |
| `INTERNAL_ERROR` | 500 | 服务器内部错误 |

### 3.3 前端错误处理

```typescript
async function fetchAIReading(params: ReadingParams) {
  try {
    const response = await fetch('/api/ai/reading', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new APIError(error.error.code, error.error.message)
    }
    
    return response.json()
  } catch (e) {
    if (e instanceof APIError) {
      // 显示用户友好的错误信息
      showToast(e.message)
    } else {
      // 网络错误等
      showToast('网络连接失败，请检查网络')
    }
    // 回退到本地规则解读
    return { data: { reading: generateSummary(params.cards, params.spreadType) } }
  }
}
```

---

## 四、本地存储 API

### 4.1 存储 Schema

```typescript
// localStorage keys
const STORAGE_KEYS = {
  SETTINGS: 'tarot_settings',
  HISTORY: 'tarot_history',
  DAILY_CARD: 'tarot_daily'
} as const

// 设置结构
interface Settings {
  version: number
  darkMode: boolean
  reducedMotion: boolean
  reversedProbability: number
  soundEnabled: boolean
}

// 历史记录结构
interface HistoryStore {
  version: number
  records: ReadingRecord[]
}

// 每日卡结构
interface DailyCardStore {
  date: string
  card: DrawnCard
  viewed: boolean
}
```

### 4.2 存储工具函数

```typescript
// 通用存储工具
function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('Storage failed:', e)
  }
}

// 历史记录管理
const MAX_HISTORY = 50

function addToHistory(record: ReadingRecord): void {
  const history = getStorage<HistoryStore>(STORAGE_KEYS.HISTORY, { version: 1, records: [] })
  history.records.unshift(record)
  if (history.records.length > MAX_HISTORY) {
    history.records = history.records.slice(0, MAX_HISTORY)
  }
  setStorage(STORAGE_KEYS.HISTORY, history)
}
```

### 4.3 数据迁移

```typescript
// 版本迁移
function migrateStorage(): void {
  const settings = getStorage<Settings>(STORAGE_KEYS.SETTINGS, null)
  
  if (settings && settings.version < CURRENT_VERSION) {
    // 执行迁移
    const migrated = migrate(settings, CURRENT_VERSION)
    setStorage(STORAGE_KEYS.SETTINGS, migrated)
  }
}

// 迁移函数映射
const migrations: Record<number, (data: any) => any> = {
  2: (data) => ({ ...data, soundEnabled: true }),
  3: (data) => ({ ...data, language: 'zh-CN' })
}
```

---

## 五、类型定义汇总

```typescript
// types/tarot.ts

// 基础类型
export interface TarotCard {
  id: string
  number: string
  name: string
  nameEn: string
  keywords: string
  symbol: string
  upright: string
  reversed: string
  description?: string
  note?: string
}

export interface DrawnCard extends TarotCard {
  isReversed: boolean
  position: string
}

export type SpreadType = 1 | 3 | 5 | 10

// 小阿尔卡纳扩展
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles'
export type CourtRank = 'page' | 'knight' | 'queen' | 'king'

export interface MinorArcanaCard extends TarotCard {
  suit: Suit
  rank: number | CourtRank
}

// 记录类型
export interface ReadingRecord {
  id: string
  timestamp: number
  spreadType: SpreadType
  question?: string
  cards: DrawnCard[]
  summary: string
  aiReading?: string
}

// API 类型
export interface AIReadingRequest {
  spreadType: SpreadType
  cards: Pick<DrawnCard, 'id' | 'name' | 'position' | 'isReversed'>[]
  question?: string
  stream?: boolean
}

export interface AIReadingResponse {
  reading: string
  highlights?: string[]
  advice?: string
}

export interface ShareRequest {
  spreadType: SpreadType
  cards: DrawnCard[]
  summary: string
  question?: string
}

export interface ShareResponse {
  shareId: string
  shareUrl: string
  expiresAt: string
}
```

---

## 六、安全考虑

### 6.1 API 安全

| 措施 | 说明 |
|------|------|
| Rate Limiting | 限制请求频率，防止滥用 |
| Input Validation | 严格验证输入参数 |
| CORS | 限制允许的来源 |
| HTTPS | 强制加密传输 |

### 6.2 本地存储安全

| 措施 | 说明 |
|------|------|
| 不存储敏感信息 | 无密码、Token 等 |
| 数据校验 | 读取时验证数据格式 |
| 容量限制 | 限制历史记录数量 |

### 6.3 AI Prompt 安全

```typescript
// 防止 Prompt 注入
function sanitizeQuestion(question: string): string {
  return question
    .slice(0, 200)  // 长度限制
    .replace(/[<>{}]/g, '')  // 移除特殊字符
    .trim()
}
```
