// Story data for Путь Дианы
// Complete game content — all 6 chapters with branching paths

export interface DialogueLine {
  speaker: string
  text: string
  emotion?: 'normal' | 'happy' | 'sad' | 'angry' | 'scared' | 'determined' | 'thinking' | 'surprised'
  isNarrator?: boolean
  isThought?: boolean
}

export interface Choice {
  text: string
  emoji: string
  nextScene: string
  effects?: {
    courage?: number
    addItem?: string
    removeItem?: string
    setFlag?: string
    damage?: number
  }
  condition?: {
    hasItem?: string
    minCourage?: number
    hasFlag?: string
  }
}

export interface GameScene {
  id: string
  chapter: number
  background: string
  characters: string[]
  dialogue: DialogueLine[]
  choices?: Choice[]
  next?: string
  ending?: string
}

// Background themes
export const BACKGROUNDS = {
  cottage: 'linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 30%, #1a0a2e 100%)',
  forest: 'linear-gradient(180deg, #0a1a0a 0%, #1a2e1a 30%, #0a1a0a 100%)',
  tower: 'linear-gradient(180deg, #0a0a2e 0%, #1a1a4e 30%, #0a0a2e 100%)',
  bridge: 'linear-gradient(180deg, #1a0a0a 0%, #2e1a1a 30%, #1a0a0a 100%)',
  castle: 'linear-gradient(180deg, #2e0a2e 0%, #4e1a4e 30%, #2e0a2e 100%)',
  throne: 'linear-gradient(180deg, #2e0a1a 0%, #4e1a2e 50%, #2e0a1a 100%)',
  sunrise: 'linear-gradient(180deg, #ff6b35 0%, #ffd700 30%, #87ceeb 60%, #4a90d9 100%)',
  garden: 'linear-gradient(180deg, #87ceeb 0%, #98fb98 30%, #228b22 60%, #2d5016 100%)',
  dark: 'linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
  void: 'linear-gradient(180deg, #1a0000 0%, #330000 50%, #1a0000 100%)',
} as const

export const SCENES: Record<string, GameScene> = {
  // ========== CHAPTER 1: Тревожный свитка ==========
  ch1_s1: {
    id: 'ch1_s1',
    chapter: 1,
    background: BACKGROUNDS.cottage,
    characters: ['diana'],
    dialogue: [
      { speaker: 'Рассказчик', text: 'Тихий вечер в маленьком домике на краю леса. Свечи мерцают, за окном шумят деревья.', isNarrator: true },
      { speaker: 'Рассказчик', text: 'Ты — Диана, и сегодня что-то не так...', isNarrator: true },
      { speaker: 'Диана', text: 'Что-то тревожное чувство... Как будто что-то случилось.', isThought: true, emotion: 'thinking' },
      { speaker: 'Рассказчик', text: 'На столе вспыхивает магический свет. Появляется свитка!', isNarrator: true, emotion: 'surprised' },
      { speaker: 'Диана', text: 'Что это?! Свитка... От Севы!', emotion: 'surprised' },
      { speaker: 'Рассказчик', text: 'Текст свитки частично повреждён:', isNarrator: true },
      { speaker: 'Свитка', text: '"Диана... если ты это читаешь... меня увели... на север... замок... помог—"', isNarrator: true },
      { speaker: 'Рассказчик', text: '(текст обрывается)', isNarrator: true },
    ],
    choices: [
      {
        text: 'Нужно идти немедленно!',
        emoji: '🗡️',
        nextScene: 'ch2_s1',
        effects: { courage: 1, setFlag: 'rush_choice' },
      },
      {
        text: 'Подожди, попробую восстановить текст...',
        emoji: '📜',
        nextScene: 'ch1_s2a',
        effects: { addItem: 'Подсказка о Сиренах', setFlag: 'restored_text' },
      },
      {
        text: 'Может, соседи помогут?',
        emoji: '🏠',
        nextScene: 'ch1_s2b',
        effects: { addItem: 'Зелье исцеления', setFlag: 'neighbor_help' },
      },
    ],
  },

  ch1_s2a: {
    id: 'ch1_s2a',
    chapter: 1,
    background: BACKGROUNDS.cottage,
    characters: ['diana'],
    dialogue: [
      { speaker: 'Диана', text: 'Подождите... Если я использую магию свечи, может быть...', emotion: 'determined' },
      { speaker: 'Рассказчик', text: 'Диана подносит свитку к пламени. Буквы начинают проявляться...', isNarrator: true },
      { speaker: 'Свитка', text: '"...Сирены боятся чистой любви. Запомни это, Диана..."', isNarrator: true },
      { speaker: 'Диана', text: 'Сирены... Боятся чистой любви... Я запомню!', emotion: 'determined' },
      { speaker: 'Рассказчик', text: 'Получен предмет: Подсказка о Сиренах', isNarrator: true },
      { speaker: 'Рассказчик', text: 'Диана собирает вещи и выходит в ночь.', isNarrator: true },
    ],
    next: 'ch2_s1',
  },

  ch1_s2b: {
    id: 'ch1_s2b',
    chapter: 1,
    background: BACKGROUNDS.cottage,
    characters: ['diana'],
    dialogue: [
      { speaker: 'Диана', text: 'Может, старая Маргарита знает что-нибудь...', emotion: 'thinking' },
      { speaker: 'Рассказчик', text: 'Диана бежит к соседнему домику. Старая Маргарита открывает дверь.', isNarrator: true },
      { speaker: 'Маргарита', text: 'Ох, деточка! Я видела тот свет... Вот, возми это зелье. Оно тебе пригодится.' },
      { speaker: 'Рассказчик', text: 'Получен предмет: Зелье исцеления', isNarrator: true },
      { speaker: 'Диана', text: 'Спасибо, Маргарита! Я должна идти!', emotion: 'determined' },
    ],
    next: 'ch2_s1',
  },

  // ========== CHAPTER 2: Тёмный лес ==========
  ch2_s1: {
    id: 'ch2_s1',
    chapter: 2,
    background: BACKGROUNDS.forest,
    characters: ['diana'],
    dialogue: [
      { speaker: 'Рассказчик', text: 'Тёмный лес окутывает тебя. Тропинка едва видна в свете луны.', isNarrator: true },
      { speaker: 'Рассказчик', text: 'Ветви скрипят, что-то шуршит в кустах...', isNarrator: true },
      { speaker: 'Диана', text: 'Так темно... Но я должна идти дальше.', emotion: 'scared' },
      { speaker: 'Рассказчик', text: 'Раздаётся шум чего-то большого. Из деревьев emerges огромная фигура!', isNarrator: true, emotion: 'surprised' },
    ],
    next: 'ch2_s2',
  },

  ch2_s2: {
    id: 'ch2_s2',
    chapter: 2,
    background: BACKGROUNDS.forest,
    characters: ['diana', 'arsen'],
    dialogue: [
      { speaker: 'Арсенеус', text: 'А, мелкая! Ты куда одна-то? В лесу одному нельзя...', emotion: 'normal' },
      { speaker: 'Арсенеус', text: 'Ладно, не бойсь. Я — Арсенеус Макаряниус. Лесной барон.' },
      { speaker: 'Арсенеус', text: 'А можно друге? Гы гы.', emotion: 'happy' },
      { speaker: 'Диана', text: 'Я ищу своего... друга. Его увели на север, к замку.', emotion: 'sad' },
      { speaker: 'Арсенеус', text: 'К Замку Сирен?! Хм-м-м... Я видел, как три женщины тащили какого-то парня туда. Высокий такой, да?' },
      { speaker: 'Арсенеус', text: 'Ох, мелкая, это опасно. Но я проводу тебя до развилки.' },
    ],
    choices: [
      {
        text: 'Пойдём вместе, Арсенеус!',
        emoji: '🤝',
        nextScene: 'ch3_s1',
        effects: { addItem: 'Щит Барона', setFlag: 'arsen_ally' },
      },
      {
        text: 'Спасибо, но я пойду напрямик через чащу!',
        emoji: '⚡',
        nextScene: 'ch2_branch',
        effects: { courage: 1, setFlag: 'went_alone' },
      },
      {
        text: 'Расскажи подробнее о Сиренах.',
        emoji: '💬',
        nextScene: 'ch2_lore',
        effects: { setFlag: 'asked_sirens' },
      },
    ],
  },

  ch2_branch: {
    id: 'ch2_branch',
    chapter: 2,
    background: BACKGROUNDS.forest,
    characters: ['diana'],
    dialogue: [
      { speaker: 'Диана', text: 'Я пойду напрямик! У меня нет времени!', emotion: 'determined' },
      { speaker: 'Арсенеус', text: 'Ох, мелкая, ну ты даёшь... Удачи!' },
      { speaker: 'Рассказчик', text: 'Диана бросается в чащу. Ветки летят со всех сторон!', isNarrator: true },
      { speaker: 'Рассказчик', text: 'Нужно уворачиваться!', isNarrator: true },
      { speaker: 'Диана', text: 'Ааа! Какие большие ветки!', emotion: 'scared' },
    ],
    next: 'ch3_s1',
  },

  ch2_lore: {
    id: 'ch2_lore',
    chapter: 2,
    background: BACKGROUNDS.forest,
    characters: ['diana', 'arsen'],
    dialogue: [
      { speaker: 'Диана', text: 'Арсенеус, расскажи мне о Сиренах. Кто они?' },
      { speaker: 'Арсенеус', text: 'Ох, мелкая, это три колдуньи. Злые такие...' },
      { speaker: 'Арсенеус', text: 'Но знаешь что? Сирены боятся слов, сказанных от сердца. Настоящих чувств.' },
      { speaker: 'Арсенеус', text: 'Если ты любишь по-настоящему — их магия бессильна!' },
      { speaker: 'Диана', text: 'Я поняла... Спасибо, Арсенеус!', emotion: 'determined' },
      { speaker: 'Арсенеус', text: 'Давай, мелкая. Я проводу тебя. И держи — это тебе пригодится.', emotion: 'happy' },
      { speaker: 'Рассказчик', text: 'Получен предмет: Щит Барона', isNarrator: true },
    ],
    next: 'ch3_s1',
  },

  // ========== CHAPTER 3: Башня Кода ==========
  ch3_s1: {
    id: 'ch3_s1',
    chapter: 3,
    background: BACKGROUNDS.tower,
    characters: ['diana'],
    dialogue: [
      { speaker: 'Рассказчик', text: 'Поляна расступается, и ты видишь... башню. Но не обычную.', isNarrator: true },
      { speaker: 'Рассказчик', text: 'Стены светятся рунами, похожими на... код? Экраны мерцают вместо окон.', isNarrator: true },
      { speaker: 'Диана', text: 'Что за место...?', emotion: 'surprised' },
      { speaker: 'Голос', text: 'Ошибка в строке 42... Нет, стоп, это же рекурсия... Ой, подождите!' },
    ],
    next: 'ch3_s2',
  },

  ch3_s2: {
    id: 'ch3_s2',
    chapter: 3,
    background: BACKGROUNDS.tower,
    characters: ['diana', 'viktor', 'swapna'],
    dialogue: [
      { speaker: 'Виктор', text: 'О, Диана! Сева? Его увели? Я тут... ну, я магическую систему переписываю на новый стек.' },
      { speaker: 'Виктор', text: 'Но могу помочь! У меня тут кое-что есть...' },
      { speaker: 'Свапна', text: 'Диана, я дам тебе зелье исцеления. Тебе оно пригодится.', emotion: 'happy' },
      { speaker: 'Свапна', text: 'И запомни: Сирены питаются сомнениями. Если ты уверена в себе — их магия бессильна.' },
      { speaker: 'Виктор', text: 'А я могу дать тебе Хакерский Артефакт. Он нарушает магические барьеры. Ну, технически магия — это просто API...' },
    ],
    choices: [
      {
        text: 'Дай мне Артефакт!',
        emoji: '💻',
        nextScene: 'ch4_s1',
        effects: { addItem: 'Хакерский Артефакт' },
      },
      {
        text: 'Научи меня заклинанию защиты!',
        emoji: '🌸',
        nextScene: 'ch4_s1',
        effects: { addItem: 'Заклинание защиты' },
      },
      {
        text: 'Спасибо, но я должна идти!',
        emoji: '🤷',
        nextScene: 'ch4_s1',
        effects: { courage: 1 },
      },
    ],
  },

  // ========== CHAPTER 4: Мост и Стенд ==========
  ch4_s1: {
    id: 'ch4_s1',
    chapter: 4,
    background: BACKGROUNDS.bridge,
    characters: ['diana'],
    dialogue: [
      { speaker: 'Рассказчик', text: 'Дорога к замку преграждена. Разрушенный мост над чёрной бездной.', isNarrator: true },
      { speaker: 'Рассказчик', text: 'На другой стороне — огромный тролль-стражник.', isNarrator: true },
      { speaker: 'Тролль', text: 'Стой! Не пройдёшь без ответов! Три загадки — или назад!' },
    ],
    next: 'ch4_riddle1',
  },

  ch4_riddle1: {
    id: 'ch4_riddle1',
    chapter: 4,
    background: BACKGROUNDS.bridge,
    characters: ['diana', 'troll'],
    dialogue: [
      { speaker: 'Тролль', text: 'Первый вопрос, путница!' },
      { speaker: 'Тролль', text: 'В каком городе родился тот, кого ты ищешь?' },
    ],
    choices: [
      {
        text: 'Вроцлав',
        emoji: '🏰',
        nextScene: 'ch4_r1_wrong',
      },
      {
        text: 'Майнц',
        emoji: '🏰',
        nextScene: 'ch4_r1_wrong',
      },
      {
        text: 'Донецк',
        emoji: '✅',
        nextScene: 'ch4_r1_correct',
        effects: { setFlag: 'riddle1' },
      },
      {
        text: 'Варшава',
        emoji: '🏰',
        nextScene: 'ch4_r1_wrong',
      },
    ],
  },

  ch4_r1_wrong: {
    id: 'ch4_r1_wrong',
    chapter: 4,
    background: BACKGROUNDS.bridge,
    characters: ['diana', 'troll'],
    dialogue: [
      { speaker: 'Тролль', text: 'Ха! Не знаешь даже, откуда он? Попробуй ещё.' },
    ],
    next: 'ch4_riddle1',
  },

  ch4_r1_correct: {
    id: 'ch4_r1_correct',
    chapter: 4,
    background: BACKGROUNDS.bridge,
    characters: ['diana', 'troll'],
    dialogue: [
      { speaker: 'Тролль', text: 'Хм... Ладно, первое зачёт. Второй вопрос!' },
      { speaker: 'Тролль', text: 'Реши уравнение: 4x + 16 = 44. Чему равен x?' },
    ],
    choices: [
      {
        text: '5',
        emoji: '🔢',
        nextScene: 'ch4_r2_wrong',
      },
      {
        text: '7',
        emoji: '✅',
        nextScene: 'ch4_r2_correct',
        effects: { setFlag: 'riddle2' },
      },
      {
        text: '10',
        emoji: '🔢',
        nextScene: 'ch4_r2_wrong',
      },
      {
        text: '12',
        emoji: '🔢',
        nextScene: 'ch4_r2_wrong',
      },
    ],
  },

  ch4_r2_wrong: {
    id: 'ch4_r2_wrong',
    chapter: 4,
    background: BACKGROUNDS.bridge,
    characters: ['diana', 'troll'],
    dialogue: [
      { speaker: 'Тролль', text: 'Думай лучше!' },
    ],
    next: 'ch4_r1_correct',
  },

  ch4_r2_correct: {
    id: 'ch4_r2_correct',
    chapter: 4,
    background: BACKGROUNDS.bridge,
    characters: ['diana', 'troll'],
    dialogue: [
      { speaker: 'Тролль', text: 'Ха, неплохо для авантюристки.' },
      { speaker: 'Тролль', text: 'Последний вопрос, путница. Самый важный.' },
      { speaker: 'Тролль', text: 'Что для тебя Сева?' },
    ],
    choices: [
      {
        text: 'Всё',
        emoji: '💜',
        nextScene: 'ch4_r3_answer',
        effects: { setFlag: 'riddle3' },
      },
      {
        text: 'Любовь',
        emoji: '💜',
        nextScene: 'ch4_r3_answer',
        effects: { setFlag: 'riddle3' },
      },
      {
        text: 'Смысл жизни',
        emoji: '💜',
        nextScene: 'ch4_r3_answer',
        effects: { setFlag: 'riddle3' },
      },
      {
        text: 'Мой человек',
        emoji: '💜',
        nextScene: 'ch4_r3_answer',
        effects: { setFlag: 'riddle3' },
      },
    ],
  },

  ch4_r3_answer: {
    id: 'ch4_r3_answer',
    chapter: 4,
    background: BACKGROUNDS.bridge,
    characters: ['diana', 'troll'],
    dialogue: [
      { speaker: 'Тролль', text: 'Хммм... серьёзно? Ладно, вижу — ты отвечаешь сердцем. Проходи.' },
      { speaker: 'Рассказчик', text: 'Мост магически восстанавливается. Диана переходит на другую сторону.', isNarrator: true },
    ],
    next: 'ch4_jotaro',
  },

  ch4_jotaro: {
    id: 'ch4_jotaro',
    chapter: 4,
    background: BACKGROUNDS.forest,
    characters: ['diana', 'jotaro'],
    dialogue: [
      { speaker: 'Рассказчик', text: 'После моста фигура прислонилась к мёртвому дереву.', isNarrator: true },
      { speaker: 'Рассказчик', text: 'Высокий мужчина в школьной форме и шляпе. Призрачная синяя фигура — Star Platinum — мерцает за его спиной.', isNarrator: true },
      { speaker: 'Джотаро', text: 'Yare yare daze...' },
      { speaker: 'Джотаро', text: 'Ты тоже идёшь к замку? На Сирен?' },
      { speaker: 'Диана', text: 'Да! Они забрали моего...', emotion: 'sad' },
      { speaker: 'Джотаро', text: 'Понял. Я тоже имею счёты кое с кем там.' },
      { speaker: 'Джотаро', text: '...Дио. Он стоит за всем этим.' },
      { speaker: 'Джотаро', text: 'Ладно. Идём вместе.' },
    ],
    choices: [
      {
        text: 'Спасибо, Джотаро! Давай вместе!',
        emoji: '⭐',
        nextScene: 'ch5_s1',
        effects: { addItem: 'Звезда Платинума', setFlag: 'jotaro_ally' },
      },
      {
        text: 'Кто такой Дио?',
        emoji: '🤔',
        nextScene: 'ch4_dio_lore',
      },
      {
        text: 'Я справлюсь сама!',
        emoji: '💪',
        nextScene: 'ch5_s1',
        effects: { courage: 1, setFlag: 'went_alone_final' },
      },
    ],
  },

  ch4_dio_lore: {
    id: 'ch4_dio_lore',
    chapter: 4,
    background: BACKGROUNDS.forest,
    characters: ['diana', 'jotaro'],
    dialogue: [
      { speaker: 'Джотаро', text: 'Дио... Тёмный лорд. Он контролирует Сирен.' },
      { speaker: 'Джотаро', text: 'Его сила — остановка времени. "THE WORLD" — так он это называет.' },
      { speaker: 'Джотаро', text: 'Но у меня есть Star Platinum. Он может тоже остановить время.' },
      { speaker: 'Джотаро', text: 'Держи. Звезда Платинума. Она поможет тебе.', emotion: 'normal' },
      { speaker: 'Рассказчик', text: 'Получен предмет: Звезда Платинума', isNarrator: true },
      { speaker: 'Джотаро', text: 'Идём. Время пришло.' },
    ],
    next: 'ch5_s1',
  },

  // ========== CHAPTER 5: Замок Сирен ==========
  ch5_s1: {
    id: 'ch5_s1',
    chapter: 5,
    background: BACKGROUNDS.castle,
    characters: ['diana'],
    dialogue: [
      { speaker: 'Рассказчик', text: 'Замок Сирен возвышается перед тобой. Чёрные шпили, фиолетовое свечение.', isNarrator: true },
      { speaker: 'Рассказчик', text: 'Внутри — красота и опасность. Зеркала отражают не то, что есть на самом деле.', isNarrator: true },
      { speaker: 'Диана', text: 'Сева... Я иду.', emotion: 'determined' },
    ],
    next: 'ch5_s2',
  },

  ch5_s2: {
    id: 'ch5_s2',
    chapter: 5,
    background: BACKGROUNDS.throne,
    characters: ['diana', 'siren1', 'siren2', 'siren3', 'seva'],
    dialogue: [
      { speaker: 'Рассказчик', text: 'Три Сирены появляются в тронном зале. Сева лежит на пьедестале, спящий, окружённый магическими цепями.', isNarrator: true },
      { speaker: 'Шлюхидзе', text: 'О, какая милая гостья! Пришла забрать нашего пленника?' },
      { speaker: 'Шлюхидзе', text: 'Он о тебе и не вспоминал... Здесь ему хорошо.', emotion: 'angry' },
      { speaker: 'Протитутидзе', text: 'Слабак! Ты не пройдёшь через нас!' },
      { speaker: 'Тёлкидзе', text: 'Время здесь работает по моим правилам. Ты уже опоздала.' },
      { speaker: 'Диана', text: 'Отпустите его! Это не ваше право!', emotion: 'angry' },
    ],
    next: 'ch5_dio',
  },

  ch5_dio: {
    id: 'ch5_dio',
    chapter: 5,
    background: BACKGROUNDS.void,
    characters: ['diana', 'dio'],
    dialogue: [
      { speaker: 'Рассказчик', text: 'Тёмная фигура materializes позади Сирен. Блондин, мускулистый, с menacing улыбкой.', isNarrator: true },
      { speaker: 'Дио', text: 'Хо-хо... Ты пришла? Какая храбрая маленькая девочка.' },
      { speaker: 'Дио', text: 'Ты думаешь, ты можешь изменить судьбу? Невежественное дитя...', emotion: 'angry' },
      { speaker: 'Дио', text: 'Этот мир принадлежит МНЕ. И этот юноше — тоже.' },
      { speaker: 'Диана', text: 'Нет! Сева — не твой!', emotion: 'angry' },
      { speaker: 'Дио', text: 'THE WORLD!', emotion: 'angry' },
      { speaker: 'Рассказчик', text: '(время замирает на мгновение)', isNarrator: true },
    ],
    choices: [
      {
        text: 'Может, Сирены правы... Может, ему здесь лучше...',
        emoji: '💔',
        nextScene: 'ending_bad',
        effects: { setFlag: 'bad_path' },
      },
      {
        text: 'Я буду сражаться!',
        emoji: '🔥',
        nextScene: 'ch5_combat',
        effects: { setFlag: 'combat_path' },
      },
      {
        text: 'Обратиться к Севе напрямую: "Сева! Сикс сэвен!"',
        emoji: '💜',
        nextScene: 'ending_best',
        effects: { setFlag: 'best_path', courage: 2 },
      },
    ],
  },

  // ========== CHAPTER 5 — Combat Path ==========
  ch5_combat: {
    id: 'ch5_combat',
    chapter: 5,
    background: BACKGROUNDS.throne,
    characters: ['diana', 'siren1'],
    dialogue: [
      { speaker: 'Диана', text: 'Я буду сражаться! Отдайте Севу!', emotion: 'determined' },
      { speaker: 'Шлюхидзе', text: 'Ха! Ты против МЕНЯ? Посмотрим...' },
      { speaker: 'Рассказчик', text: 'Шлюхидзе создаёт иллюзию! Сева улыбается другому человеку...', isNarrator: true },
    ],
    choices: [
      {
        text: 'Ударить!',
        emoji: '👊',
        nextScene: 'ch5_combat1_fail',
        effects: { damage: 1 },
      },
      {
        text: 'Закрыть глаза и идти вперёд',
        emoji: '✨',
        nextScene: 'ch5_combat2',
        effects: { setFlag: 'broke_illusion' },
      },
    ],
  },

  ch5_combat1_fail: {
    id: 'ch5_combat1_fail',
    chapter: 5,
    background: BACKGROUNDS.throne,
    characters: ['diana'],
    dialogue: [
      { speaker: 'Рассказчик', text: 'Иллюзия была слишком реальной. Удар не попал в цель.', isNarrator: true },
      { speaker: 'Диана', text: 'Нет... Это не настоящий Сева!', emotion: 'scared' },
      { speaker: 'Рассказчик', text: 'Диана понимает — нужно закрыть глаза и верить.', isNarrator: true },
    ],
    next: 'ch5_combat2',
  },

  ch5_combat2: {
    id: 'ch5_combat2',
    chapter: 5,
    background: BACKGROUNDS.throne,
    characters: ['diana', 'siren2'],
    dialogue: [
      { speaker: 'Рассказчик', text: 'Иллюзии рассеиваются! Шлюхидзе отступает.', isNarrator: true },
      { speaker: 'Протитутидзе', text: 'Слабак! Теперь Я!' },
      { speaker: 'Рассказчик', text: 'Протитутидзе бросается в атаку!', isNarrator: true },
    ],
    next: 'ch5_combat3',
  },

  ch5_combat3: {
    id: 'ch5_combat3',
    chapter: 5,
    background: BACKGROUNDS.throne,
    characters: ['diana', 'siren2'],
    dialogue: [
      { speaker: 'Рассказчик', text: 'Протитутидзе наносит удар!', isNarrator: true },
    ],
    choices: [
      {
        text: 'Использовать Щит Барона!',
        emoji: '🛡️',
        nextScene: 'ch5_combat4',
        condition: { hasItem: 'Щит Барона' },
      },
      {
        text: 'Уклониться!',
        emoji: '💨',
        nextScene: 'ch5_combat4',
        effects: { damage: 1 },
      },
    ],
  },

  ch5_combat4: {
    id: 'ch5_combat4',
    chapter: 5,
    background: BACKGROUNDS.throne,
    characters: ['diana', 'siren3'],
    dialogue: [
      { speaker: 'Рассказчик', text: 'Протитутидзе повержена! Осталась последняя — Тёлкидзе.', isNarrator: true },
      { speaker: 'Тёлкидзе', text: 'Время здесь работает по моим правилам!' },
      { speaker: 'Рассказчик', text: 'Тёлкидзе замораживает время! Всё замирает!', isNarrator: true },
    ],
    next: 'ch5_combat5',
  },

  ch5_combat5: {
    id: 'ch5_combat5',
    chapter: 5,
    background: BACKGROUNDS.void,
    characters: ['diana'],
    dialogue: [
      { speaker: 'Диана', text: 'Всё замерло... Что делать?!', emotion: 'scared' },
    ],
    choices: [
      {
        text: 'Использовать Хакерский Артефакт!',
        emoji: '💻',
        nextScene: 'ch5_combat_win',
        condition: { hasItem: 'Хакерский Артефакт' },
        effects: { setFlag: 'broke_timeloop' },
      },
      {
        text: 'Использовать Звезду Платинума!',
        emoji: '⭐',
        nextScene: 'ch5_combat_win',
        condition: { hasItem: 'Звезда Платинума' },
      },
      {
        text: 'Сосредоточиться и разрушить заклинание силой воли!',
        emoji: '💪',
        nextScene: 'ch5_combat_win',
        effects: { courage: 1 },
      },
    ],
  },

  ch5_combat_win: {
    id: 'ch5_combat_win',
    chapter: 5,
    background: BACKGROUNDS.throne,
    characters: ['diana', 'seva'],
    dialogue: [
      { speaker: 'Рассказчик', text: 'Сирены побеждены! Но Дио сбегает.', isNarrator: true },
      { speaker: 'Рассказчик', text: 'Замок начинает рушиться! Диана хватает спящего Севу.', isNarrator: true },
    ],
    next: 'ending_medium',
  },

  // ========== ENDINGS ==========
  ending_bad: {
    id: 'ending_bad',
    chapter: 6,
    background: BACKGROUNDS.dark,
    characters: ['diana'],
    dialogue: [
      { speaker: 'Диана', text: 'Может... Может, они правы...', emotion: 'sad' },
      { speaker: 'Рассказчик', text: 'Диана отвернулась. Сомнения заполнили её сердце.', isNarrator: true },
      { speaker: 'Рассказчик', text: 'Она покинула замок, но обещала себе — однажды она вернётся.', isNarrator: true },
      { speaker: 'Рассказчик', text: '...Но Диана поклялась: это ещё не конец...', isNarrator: true },
    ],
    ending: 'bad',
  },

  ending_medium: {
    id: 'ending_medium',
    chapter: 6,
    background: BACKGROUNDS.sunrise,
    characters: ['diana', 'seva'],
    dialogue: [
      { speaker: 'Рассказчик', text: 'Диана выносила Севу из рушащегося замка. Рассвет окрашивает небо.', isNarrator: true },
      { speaker: 'Рассказчик', text: 'На холме, среди полевых цветов, Сева наконец открывает глаза.', isNarrator: true },
      { speaker: 'Сева', text: 'Диана...? Где я...? Ты... спасла меня?', emotion: 'surprised' },
      { speaker: 'Диана', text: 'Конечно, дурачок.', emotion: 'happy' },
      { speaker: 'Рассказчик', text: '💜 Сделано с любовью, Севой для Дианы 💜', isNarrator: true },
    ],
    ending: 'medium',
  },

  ending_best: {
    id: 'ending_best',
    chapter: 6,
    background: BACKGROUNDS.void,
    characters: ['diana', 'seva', 'dio', 'jotaro'],
    dialogue: [
      { speaker: 'Диана', text: 'СЕВА! СИКС СЭВЕН!', emotion: 'determined' },
      { speaker: 'Рассказчик', text: 'Глаза Севы резко открываются. Магические цепи разлетаются в щепки!', isNarrator: true },
      { speaker: 'Сева', text: 'Д... Диана?! Сикс сэвен... Я помню...', emotion: 'surprised' },
      { speaker: 'Дио', text: 'ЧТО?! Невозможно! Как ты—', emotion: 'angry' },
      { speaker: 'Джотаро', text: 'Yare yare daze. Твой номерок кончился, Дио.', emotion: 'normal' },
      { speaker: 'Джотаро', text: 'STAR PLATINUM: THE WORLD!', emotion: 'angry' },
      { speaker: 'Рассказчик', text: 'Время останавливается. Star Platinum разрушает тёмную магию Дио.', isNarrator: true },
      { speaker: 'Рассказчик', text: 'Сирены теряют силу и обращаются в бегство. Дио побеждён.', isNarrator: true },
    ],
    next: 'ending_best_2',
  },

  ending_best_2: {
    id: 'ending_best_2',
    chapter: 6,
    background: BACKGROUNDS.garden,
    characters: ['diana', 'seva'],
    dialogue: [
      { speaker: 'Рассказчик', text: 'Сева подходит к Диане. Замок превращается в прекрасный сад.', isNarrator: true },
      { speaker: 'Сева', text: 'Ты пришла за мной... через всё это...', emotion: 'happy' },
      { speaker: 'Сева', text: 'А можно друге? Гы гы.', emotion: 'happy' },
      { speaker: 'Диана', text: '...Выйдэс?', emotion: 'happy' },
      { speaker: 'Сева', text: 'Выйдэс. Навсегда.', emotion: 'happy' },
      { speaker: 'Рассказчик', text: '✨ Магические искры повсюду. Замок превращается в прекрасный сад.', isNarrator: true },
      { speaker: 'Рассказчик', text: '💜 Сделано с бесконечной любовью 💜', isNarrator: true },
      { speaker: 'Рассказчик', text: 'Сева → Диана. Сикс Сэвен, навсегда.', isNarrator: true },
      { speaker: 'Джотаро', text: 'Yare yare daze...', emotion: 'normal' },
    ],
    ending: 'best',
  },
}

export const CHAPTER_TITLES: Record<number, string> = {
  1: '🔮 Глава 1: Тревожный свитка',
  2: '🌲 Глава 2: Тёмный лес',
  3: '🏰 Глава 3: Башня Кода',
  4: '⚔️ Глава 4: Мост и Стенд',
  5: '🏰 Глава 5: Замок Сирен',
  6: '🌟 Глава 6: Финал',
}

export const ENDING_TITLES: Record<string, { title: string; subtitle: string; emoji: string }> = {
  bad: {
    title: '💔 Плохая концовка',
    subtitle: 'Сомнения победили... Но это ещё не конец.',
    emoji: '💔',
  },
  medium: {
    title: '🔥 Средняя концовка',
    subtitle: 'Сева спасён, но Дио сбежал. Впереди новые приключения...',
    emoji: '🔥',
  },
  best: {
    title: '💜 Лучшая концовка',
    subtitle: 'Сикс Сэвен навсегда.',
    emoji: '💜',
  },
}
