export interface TarotCard {
  id: number
  number: string
  name: string
  nameEn: string
  symbol: string
  uprightMeaning: string
  reversedMeaning: string
}

export interface DrawnCard {
  card: TarotCard
  isReversed: boolean
}

/** 逆位出现概率 (0-1)，默认 0.3 即 30% */
export const REVERSED_PROBABILITY = 0.3

export const majorArcana: TarotCard[] = [
  {
    id: 0,
    number: '0',
    name: '愚者',
    nameEn: 'The Fool',
    symbol: '🃏',
    uprightMeaning: '新的开始、冒险、自由、无限可能',
    reversedMeaning: '鲁莽、冲动、缺乏方向'
  },
  {
    id: 1,
    number: 'I',
    name: '魔术师',
    nameEn: 'The Magician',
    symbol: '✨',
    uprightMeaning: '创造力、意志力、技能、新机遇',
    reversedMeaning: '操纵、欺骗、潜能未发挥'
  },
  {
    id: 2,
    number: 'II',
    name: '女祭司',
    nameEn: 'The High Priestess',
    symbol: '🌙',
    uprightMeaning: '直觉、神秘、内在智慧、潜意识',
    reversedMeaning: '隐藏的动机、忽视直觉'
  },
  {
    id: 3,
    number: 'III',
    name: '女皇',
    nameEn: 'The Empress',
    symbol: '👑',
    uprightMeaning: '丰饶、母性、创造、自然之美',
    reversedMeaning: '依赖、停滞、创意受阻'
  },
  {
    id: 4,
    number: 'IV',
    name: '皇帝',
    nameEn: 'The Emperor',
    symbol: '🏛️',
    uprightMeaning: '权威、结构、稳定、领导力',
    reversedMeaning: '专制、僵化、控制欲过强'
  },
  {
    id: 5,
    number: 'V',
    name: '教皇',
    nameEn: 'The Hierophant',
    symbol: '🔑',
    uprightMeaning: '传统、信仰、教导、精神指引',
    reversedMeaning: '打破常规、挑战传统、自我探索'
  },
  {
    id: 6,
    number: 'VI',
    name: '恋人',
    nameEn: 'The Lovers',
    symbol: '💕',
    uprightMeaning: '爱情、和谐、选择、价值观',
    reversedMeaning: '不和谐、价值观冲突、艰难抉择'
  },
  {
    id: 7,
    number: 'VII',
    name: '战车',
    nameEn: 'The Chariot',
    symbol: '⚡',
    uprightMeaning: '意志力、决心、胜利、克服障碍',
    reversedMeaning: '失去方向、缺乏控制、受阻'
  },
  {
    id: 8,
    number: 'VIII',
    name: '力量',
    nameEn: 'Strength',
    symbol: '🦁',
    uprightMeaning: '内在力量、勇气、耐心、慈悲',
    reversedMeaning: '自我怀疑、软弱、缺乏信心'
  },
  {
    id: 9,
    number: 'IX',
    name: '隐士',
    nameEn: 'The Hermit',
    symbol: '🏔️',
    uprightMeaning: '内省、寻找真理、独处、智慧',
    reversedMeaning: '孤立、逃避、拒绝帮助'
  },
  {
    id: 10,
    number: 'X',
    name: '命运之轮',
    nameEn: 'Wheel of Fortune',
    symbol: '🎡',
    uprightMeaning: '转变、机遇、命运、周期',
    reversedMeaning: '厄运、抗拒改变、失去控制'
  },
  {
    id: 11,
    number: 'XI',
    name: '正义',
    nameEn: 'Justice',
    symbol: '⚖️',
    uprightMeaning: '公平、真理、因果、责任',
    reversedMeaning: '不公、逃避责任、偏见'
  },
  {
    id: 12,
    number: 'XII',
    name: '倒吊人',
    nameEn: 'The Hanged Man',
    symbol: '🔄',
    uprightMeaning: '暂停、牺牲、新视角、放手',
    reversedMeaning: '拖延、抗拒、无谓牺牲'
  },
  {
    id: 13,
    number: 'XIII',
    name: '死神',
    nameEn: 'Death',
    symbol: '🦋',
    uprightMeaning: '结束、转变、新生、放下过去',
    reversedMeaning: '抗拒改变、停滞、恐惧'
  },
  {
    id: 14,
    number: 'XIV',
    name: '节制',
    nameEn: 'Temperance',
    symbol: '🏺',
    uprightMeaning: '平衡、耐心、调和、适度',
    reversedMeaning: '失衡、过度、缺乏耐心'
  },
  {
    id: 15,
    number: 'XV',
    name: '恶魔',
    nameEn: 'The Devil',
    symbol: '⛓️',
    uprightMeaning: '束缚、诱惑、物质主义、阴暗面',
    reversedMeaning: '解脱、打破束缚、觉醒'
  },
  {
    id: 16,
    number: 'XVI',
    name: '塔',
    nameEn: 'The Tower',
    symbol: '🗼',
    uprightMeaning: '突变、崩塌、启示、解放',
    reversedMeaning: '逃避灾难、恐惧改变、延迟'
  },
  {
    id: 17,
    number: 'XVII',
    name: '星星',
    nameEn: 'The Star',
    symbol: '⭐',
    uprightMeaning: '希望、灵感、平静、信心',
    reversedMeaning: '绝望、失去信心、脱节'
  },
  {
    id: 18,
    number: 'XVIII',
    name: '月亮',
    nameEn: 'The Moon',
    symbol: '🌕',
    uprightMeaning: '幻觉、直觉、潜意识、不确定',
    reversedMeaning: '困惑消除、恐惧释放、真相浮现'
  },
  {
    id: 19,
    number: 'XIX',
    name: '太阳',
    nameEn: 'The Sun',
    symbol: '☀️',
    uprightMeaning: '快乐、成功、活力、光明',
    reversedMeaning: '暂时受阻、乐观过度、延迟满足'
  },
  {
    id: 20,
    number: 'XX',
    name: '审判',
    nameEn: 'Judgement',
    symbol: '📯',
    uprightMeaning: '觉醒、重生、召唤、反思',
    reversedMeaning: '自我怀疑、逃避召唤、错失机会'
  },
  {
    id: 21,
    number: 'XXI',
    name: '世界',
    nameEn: 'The World',
    symbol: '🌍',
    uprightMeaning: '完成、圆满、成就、新循环',
    reversedMeaning: '未完成、缺乏结局、拖延'
  }
]

function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function drawCards(count: number): DrawnCard[] {
  const shuffled = shuffle(majorArcana)
  return shuffled.slice(0, count).map(card => ({
    card,
    isReversed: Math.random() < REVERSED_PROBABILITY
  }))
}
