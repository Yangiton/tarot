# 塔罗牌图片资源

## 牌组列表

| 牌组ID | 名称 | 描述 |
|--------|------|------|
| emoji | Emoji 牌组 | 内置虚拟牌组，使用 Emoji 符号表示，无需下载图片 |
| chinese | 中国人塔罗牌 | The Wisdom of Tao，以中国道家神话人物及十二生肖为主轴，水墨国画风格 |
| rider | 莱德·韦特塔罗牌 | Rider-Waite Tarot，1909 年由亚瑟·韦特设计，帕梅拉·科尔曼·史密斯绘制，最经典的塔罗牌版本（**默认**） |

## 参考文献

- 孙云华 (2019). 中国历史神话于塔罗牌之图像脉络研究——以 The Wisdom of Tao 为例. 国立台湾师范大学设计学系硕士论文. https://doi.org/10.6345/NTNU201900261

## 目录结构

```
tarot/
├── README.md
└── {牌组ID}/
    ├── cover.jpg            # 牌组封面
    ├── 00-fool.jpg          # 大阿尔卡纳 0-21
    ├── 01-magician.jpg
    ├── ...
    ├── 21-world.jpg
    ├── 22-ace-wands.jpg     # 权杖 22-35
    ├── ...
    ├── 35-king-wands.jpg
    ├── 36-ace-cups.jpg      # 圣杯 36-49
    ├── ...
    ├── 49-king-cups.jpg
    ├── 50-ace-swords.jpg    # 宝剑 50-63
    ├── ...
    ├── 63-king-swords.jpg
    ├── 64-ace-pentacles.jpg # 星币 64-77
    ├── ...
    └── 77-king-pentacles.jpg
```

## 下载命令

### 默认：tarot.com 源 (dl:tarot)

```bash
pnpm dl:tarot <牌组名> [--local-id <本地ID>]

# 示例
pnpm dl:tarot chinese                      # 下载中国人塔罗牌
pnpm dl:tarot rider                        # 下载韦特塔罗牌
pnpm dl:tarot --list                       # 列出预设牌组

# 图片来源
# 卡牌: https://gfx.tarot.com/images/site/decks/{deck_name}/full_size/{0-77}.jpg
# 封面: https://gfx.tarot.com/images/decks/deck-image/{deck_name}.jpg
# 牌组列表: https://www.tarot.com/tarot/decks
```

### 备用：8s8s.com 源 (dl:tarot:8s8s)

```bash
pnpm dl:tarot:8s8s <牌组号>

# 示例
pnpm dl:tarot:8s8s 178
```

## 文件命名规则

- 格式：`{序号}-{英文名}.jpg`
- 序号：00-77，两位数字补零
- 英文名：小写，连字符连接

### 大阿尔卡纳（0-21）

| 序号 | 英文名 | 中文名 |
|------|--------|--------|
| 00 | fool | 愚者 |
| 01 | magician | 魔术师 |
| 02 | high-priestess | 女祭司 |
| 03 | empress | 女皇 |
| 04 | emperor | 皇帝 |
| 05 | hierophant | 教皇 |
| 06 | lovers | 恋人 |
| 07 | chariot | 战车 |
| 08 | strength | 力量 |
| 09 | hermit | 隐士 |
| 10 | fortune-wheel | 命运之轮 |
| 11 | justice | 正义 |
| 12 | hanged-man | 倒吊人 |
| 13 | death | 死神 |
| 14 | temperance | 节制 |
| 15 | devil | 恶魔 |
| 16 | tower | 塔 |
| 17 | stars | 星星 |
| 18 | moon | 月亮 |
| 19 | sun | 太阳 |
| 20 | judgement | 审判 |
| 21 | world | 世界 |

### 小阿尔卡纳（22-77）

**数字牌命名：** `{数字}-{花色}`

| 数字 | 英文 | 说明 |
|------|------|------|
| 1 | ace | 王牌 |
| 2-10 | two ~ ten | 数字牌 |
| 11 | page | 侍从 |
| 12 | knight | 骑士 |
| 13 | queen | 王后 |
| 14 | king | 国王 |

**花色顺序：**

| 范围 | 花色 | 英文 |
|------|------|------|
| 22-35 | 权杖 | wands |
| 36-49 | 圣杯 | cups |
| 50-63 | 宝剑 | swords |
| 64-77 | 星币 | pentacles |
