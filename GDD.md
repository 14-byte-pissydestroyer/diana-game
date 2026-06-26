# 🗡️ "Путь Дианы" — Game Design Document

## Overview
Interactive pixel-art visual novel / adventure game.
~18 minutes of gameplay. Branching story with 3 endings.
Gift from Seva to Diana.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + custom pixel-art CSS
- **Deployment:** Vercel
- **Repo:** GitHub

## Visual Style
- Pixel art aesthetic (8-bit / 16-bit)
- Dark fantasy palette: deep purples, blues, gold accents
- Font: pixel/retro font (Press Start 2P from Google Fonts)
- UI: dialogue box at bottom, character portrait left, choices as buttons
- Scene transitions: fade/dissolve
- Responsive (works on mobile — Diana will open on phone!)

## Core Mechanics
- **Dialogue system:** text appears with typewriter effect, player clicks to advance
- **Choice system:** 2-4 options appear as buttons below dialogue
- **Inventory:** simple list of collected items (shown as icons)
- **Hidden stat:** "courage" counter — tracks bold vs cautious choices, affects ending
- **No fail states** — bad ending still shows "try again?" screen

---

## CHARACTERS

### 🌸 Diana (Protagonist / Player Character)
- Pixel sprite: young woman, dark hair, adventurer outfit
- Portrait: expressive, shows emotions during dialogue
- She IS the player — all choices are hers

### 💙 Seva (The Beloved)
- Pixel sprite: tall guy, captured/被困 in magical sleep
- Appears in flashbacks and final scene
- Portrait: smiling in memories, sleeping in captivity

### 🧔 Arsenius Macarianus (Арсен Маркарян)
- **Role:** Friendly forest guardian, first ally
- **Sprite:** HUGE pixel character, tall, broad, with mustache
- **Personality:** Kind, speaks simply, a bit confused but loyal
- **Catchphrase:** "А можно друге? Гы гы"
- **Helps with:** Physical obstacles, gives a shield

### 💻 Victorius Golik (Виктор Голик)
- **Role:** Mage-programmer in his tower
- **Sprite:** Slim guy with glowing keyboard/staff
- **Personality:** Fast-talking, mixes magic and tech jargon
- **Catchphrase:** "Ну технически магия — это просто API..."
- **Helps with:** Hacking magical barriers, gives "hacker artifact"

### 🌸 Swapna
- **Role:** Viktor's girlfriend, healer
- **Sprite:** Indian woman with healing aura
- **Personality:** Calm, wise, gentle
- **Helps with:** Healing potion, emotional advice
- **Key line:** "Сирены питаются сомнениями. Если ты уверена в себе — их магия бессильна."

### ⭐ Jotaro Kujo (Джотаро Куджо)
- **Role:** Mysterious wanderer, appears in Chapter 4
- **Sprite:** Tall, hat, school uniform, menacing aura
- **Stand:** Star Platinum — visible as ghostly blue figure behind him
- **Personality:** Stoic, few words, but protective
- **Key line:** "Yare yare daze... Нужна помощь? Ладно."
- **Helps with:** Final battle — Star Platinum can stop time briefly

### 💀 Dio (Дио)
- **Role:** Dark lord, mastermind behind the Sirens
- **Sprite:** Blonde, muscular, vampire aesthetic, menacing
- **Personality:** Arrogant, theatrical, cruel
- **Key line:** "Ты думаешь, ты можешь изменить судьбу? Невежественное дитя..."
- **Appears in:** Chapter 5 — controls the Sirens from the shadows

### 😈 The Sirens (Antagonists)
Three sorceresses who captured Seva:

**Шлюхидзе** — The Seductress
- Beautiful, manipulative, wears revealing outfit
- Power: illusions, mind control
- Line: "Он о тебе и не вспоминал... Здесь ему хорошо."

**Протитутидзе** — The Warrior
- Muscular, aggressive, dark armor
- Power: physical strength, dark magic
- Line: "Слабак! Ты не пройдёшь!"

**Тёлкидзе** — The Enchantress
- Mysterious, floating, magical staff
- Power: time magic, barriers
- Line: "Время здесь работает по моим правилам."

---

## STORY STRUCTURE

### 🔮 CHAPTER 1: "Тревожное свитка"
**Location:** Diana's cottage (pixel room with candles, books, plants)

**SCENE 1.1 — Opening**
*Narrator text (typewriter):*
> Тихий вечер в маленьком домике на краю леса. Свечи мерцают, за окном шумят деревья.
> Ты — Диана, и сегодня что-то не так...

*Diana (thinking):*
> "Что-то тревожное чувство... Как будто что-то случилось."

*A magical scroll appears on the table with a flash.*

*Diana:*
> "Что это?! Свитка... От Севы!"

*She opens it — text is partially corrupted:*
> "Диана... если ты это читаешь... меня увели... на север... замок... помог—"
> *(текст обрывается)*

**CHOICE 1:**
1. 🗡️ "Нужно идти немедленно!" → courage +1, go to Chapter 2 fast
2. 📜 "Подожди, попробую восстановить текст..." → Get extra clue ("Сирены боятся чистой любви"), slower
3. 🏠 "Может, соседи помогут?" → Get a health potion from neighbor, slower

*All paths lead to Chapter 2. Choice affects what items/info Diana has.*

---

### 🌲 CHAPTER 2: "Тёмный лес"
**Location:** Dark pixel forest, glowing mushrooms, fireflies

**SCENE 2.1 — Into the Forest**
*Narrator:*
> Тёмный лес окутывает тебя. Тропинка едва видна в свете луны.
> Ветви скрипят, что-то шуршит в кустах...

*Diana:*
> "Так темно... Но я должна идти дальше."

*Sounds of something big approaching. A HUGE figure emerges from the trees.*

**SCENE 2.2 — Meeting Arsenius**

*Arsenius Macarianus appears — massive, with a gentle smile.*

*Arsenius:*
> "А, мелкая! Ты куда одна-то? В лесу одному нельзя..."
> "Ладно, не бойсь. Я — Арсенеус Макаряниус. Лесной барон."
> "А можно друге? Гы гы."

*Diana:*
> "Я ищу своего... друга. Его увели на север, к замку."

*Arsenius:*
> "К Замку Сирен?! Хм-м-м... Я видел, как три женщины тащили какого-то парня туда. Высокий такой, да?"
> "Ох, мелкая, это опасно. Но я проводу тебя до развилки."

**CHOICE 2:**
1. 🤝 "Пойдём вместе, Арсенеус!" → Arsenius becomes ally, gives Shield of the Baron later
2. ⚡ "Спасибо, но я пойду напрямик через чащу!" → courage +1, mini-game: dodge falling branches
3. 💬 "Расскажи подробнее о Сиренах." → Learn: "Сирены боятся слов, сказанных от сердца"

*Path 2 mini-game: tap/click to dodge branches falling from above. 5 branches. 3+ hits = lose 1 HP (start with 3 HP).*

---

### 🏰 CHAPTER 3: "Башня Кода"
**Location:** Glowing tower in a clearing, screens instead of windows, data streams visible

**SCENE 3.1 — The Tower**

*Narrator:*
> Поляна расступается, и ты видишь... башню. Но не обычную.
> Стены светятся рунами, похожими на... код? Экраны мерцают вместо окон.

*Diana:*
> "Что за место...?"

*A voice from inside:*
> "Ошибка в строке 42... Нет, стоп, это же рекурсия... Ой, подождите!"

**SCENE 3.2 — Meeting Viktor and Swapna**

*Victorius Golik appears — slim, with glowing keyboard.*

*Viktor:*
> "О, Диана! Сева? Его увели? Я тут... ну, я магическую систему переписываю на новый стек."
> "Но могу помочь! У меня тут кое-что есть..."

*Swapna appears — calm, with healing aura.*

*Swapna:*
> "Диана, я дам тебе зелье исцеления. Тебе оно пригодится."
> "И запомни: Сирены питаются сомнениями. Если ты уверена в себе — их магия бессильна."

*Viktor:*
> "А я могу дать тебе Хакерский Артефакт. Он нарушает магические барьеры. Ну, технически магия — это просто API..."

**CHOICE 3:**
1. 💻 "Дай мне Артефакт!" → Get Hacker Artifact (weaken Sirens in final battle)
2. 🌸 "Научи меня заклинанию защиты!" → Get Magic Shield (reduce damage in final battle)
3. 🤷 "Спасибо, но я должна идти!" → courage +1, no items

---

### ⚔️ CHAPTER 4: "Мост и Стенд"
**Location:** Broken bridge over a dark chasm, wind howling

**SCENE 4.1 — The Bridge**

*Narrator:*
> Дорога к замку преграждена. Разрушенный мост над чёрной бездной.
> На другой стороне — огромный тролль-стражник.

*Troll:*
> "Стой! Не пройдёшь без ответов! Три загадки — или назад!"

**SCENE 4.2 — Riddle Game**

**Riddle 1:**
*Troll:*
> "В каком городе родился тот, кого ты ищешь?"

Options:
- Вроцлав
- Майнц
- **Донецк** ✅
- Варшава

*If wrong:* "Ха! Не знаешь даже, откуда он? Попробуй ещё." (can retry)
*If correct:* "Хм... Ладно, первое зачёт."

**Riddle 2:**
*Troll:*
> "Второй вопрос! Реши уравнение: 4x + 16 = 44. Чему равен x?"

Options:
- 5
- **7** ✅
- 10
- 12

*If wrong:* "Думай лучше!" (can retry)
*If correct:* "Ха, неплохо для авантюристки."

**Riddle 3:**
*Troll:*
> "Последний вопрос, путница. Самый важный."
> "Что для тебя Сева?"

*Free text input (ANY answer accepted):*
*Troll:* "Хммм... серьёзно? Ладно, вижу — ты отвечаешь сердцем. Проходи."

*Bridge magically repairs itself. Diana crosses.*

**SCENE 4.3 — Jotaro Encounter**

*After crossing the bridge, a figure leans against a dead tree.*

*A tall man in a school uniform and hat. A ghostly blue figure — Star Platinum — flickers behind him.*

*Jotaro:*
> "Yare yare daze..."
> "Ты тоже идёшь к замку? На Сирен?"

*Diana:*
> "Да! Они забрали моего..."

*Jotaro:*
> "Понял. Я тоже имею счёты кое с кем там."
> "...Дио. Он стоит за всем этим."
> "Ладно. Идём вместе."

**CHOICE 4:**
1. ⭐ "Спасибо, Джотаро! Давай вместе!" → Jotaro joins as ally for final battle
2. 🤔 "Кто такой Дио?" → Learn backstory: Dio is a dark lord who controls the Sirens
3. 💪 "Я справлюсь сама!" → courage +1, fight alone (harder final battle)

*Jotaro gives Diana a "Star Platinum's Blessing" — a glowing star charm.*

---

### 🏰 CHAPTER 5: "Замок Сирен"
**Location:** Dark, beautiful castle with purple glow, stained glass windows

**SCENE 5.1 — Entering the Castle**

*Narrator:*
> Замок Сирен возвышается перед тобой. Чёрные шпили, фиолетовое свечение.
> Внутри — красота и опасность. Зеркала отражают не то, что есть на самом деле.

*Diana:*
> "Сева... Я иду."

**SCENE 5.2 — Confrontation with the Sirens**

*The three Sirens appear in the throne room. Seva is on a pedestal, sleeping, surrounded by magical chains.*

*Шлюхидзе:*
> "О, какая милая гостья! Пришла забрать нашего пленника?"
> "Он о тебе и не вспоминал... Здесь ему хорошо."

*Протитутидзе:*
> "Слабак! Ты не пройдёшь через нас!"

*Тёлкидзе:*
> "Время здесь работает по моим правилам. Ты уже опоздала."

*Diana:*
> "Отпустите его! Это не ваше право!"

**SCENE 5.3 — Dio Appears**

*A dark figure materializes behind the Sirens. Blonde, muscular, with a menacing smile.*

*Dio:*
> "Хо-хо... Ты пришла? Какая храбрая маленькая девочка."
> "Ты думаешь, ты можешь изменить судьбу? Невежественное дитя..."
> "Этот мир принадлежит МНЕ. И этот юноше — тоже."

*Diana:*
> "Нет! Сева — не твой!"

*Dio:*
> "THE WORLD!" *(time freezes briefly)*

**CRITICAL CHOICE 5 (determines ending!):**
1. 💔 "Может, Сирены правы... Может, ему здесь лучше..." → BAD ENDING PATH
2. 🔥 "Я буду сражаться!" → COMBAT PATH (depends on items/allies)
3. 💬 Обратиться к Севе напрямую → "Сева! Сикс сэвен!" → BEST ENDING PATH

---

### 🌟 CHAPTER 6: "Финал"

#### ENDING A — 💔 Плохая концовка (Choice 5.1)
*Diana turns away, tears in her eyes.*

*Narrator:*
> Диана отвернулась. Сомнения заполнили её сердце.
> Она покинула замок, но обещала себе — однажды она вернётся.

*Screen fades to black.*
> "Но Диана поклялась: это ещё не конец..."
> *"Хочешь попробовать ещё раз?"* → [Да] [Нет]

#### ENDING B — 🔥 Средняя концовка (Choice 5.2, combat)
*Diana fights the Sirens. Combat is a series of quick-choice sequences:*

**Round 1 vs Шлюхидзе:**
- Иллюзия: "Сева улыбается другому человеку"
- Choice: Ударить / Закрыть глаза и идти вперёд
- Correct: "Закрыть глаза" → ilusions break

**Round 2 vs Протитутидзе:**
- She charges at Diana
- If has Arsenius's Shield: blocks attack automatically
- If no shield: dodge mini-game (tap at right moment)

**Round 3 vs Тёлкидзе:**
- Time freeze attack
- If has Hacker Artifact: breaks the time loop
- If has Jotaro: "Star Platinum: THE WORLD!" — counters time freeze
- Otherwise: must solve a quick puzzle under time pressure

*If Diana wins:*
*The Sirens are defeated, but Dio escapes. Castle starts collapsing.*

*Diana grabs sleeping Seva. Arsenius (if ally) helps carry him. They escape as the castle crumbles.*

*Final scene: Diana and Seva sitting on a hill, sunrise. Seva is awake but groggy.*

*Seva:*
> "Диана...? Где я...?"
> "Ты... спасла меня?"

*Diana:*
> "Конечно, дурачок."

*They hug. Roll credits:*
> "Сделано с любовью, Севой для Дианы 💜"

#### ENDING C — 💜 Лучшая концовка (Choice 5.3)
*Diana screams:*
> "СЕВА! СИКС СЭВЕН!"

*Seva's eyes snap open. The magical chains shatter.*

*Seva:*
> "Д... Диана?!"
> "Сикс сэвен... Я помню..."

*Dio:*
> "ЧТО?! Невозможно! Как ты—"

*Jotaro (if ally) steps forward:*
> "Yare yare daze. Твой номерок кончился, Дио."
> "STAR PLATINUM: THE WORLD!"

*Time stops. Jotaro's Star Platinum shatters Dio's dark magic.*

*The Sirens lose their power and flee. Dio is defeated.*

*Seva stands up, walks to Diana.*

*Seva:*
> "Ты пришла за мной... через всё это..."
> "А можно друге? Гы гы."

*Diana:*
> "...Выйдэс?"

*Seva:*
> "Выйдэс. Навсегда."

*They hug. Magic sparkles everywhere. The castle transforms into a beautiful garden.*

*Credits roll with pixel art montage of their adventures:*
> "Сделано с бесконечной любовью 💜"
> "Сева → Диана"
> "Сикс Сэвен, навсегда."

*After credits:*
*Jotaro walks away into the sunset.*
> "Yare yare daze..."
> *[THE END]*

---

## INVENTORY ITEMS

| Item | How to Get | Effect |
|------|-----------|--------|
| Зелье исцеления | Neighbor (Ch1) or Swapna (Ch3) | Restore 1 HP |
| Подсказка о Сиренах | Path 2/3 in Ch1 | Weakens Siren dialogues |
| Щит Барона | Arsenius ally (Ch2) | Blocks Протитутидзе attack |
| Хакерский Артефакт | Viktor (Ch3) | Breaks Тёлкидзе time loop |
| Заклинание защиты | Swapna (Ch3) | Reduces damage |
| Звезда Платинума | Jotaro ally (Ch4) | Counters Dio's time stop |

## COURAGE SYSTEM
Hidden counter, starts at 0.
- Bold choices: +1 courage
- Cautious choices: 0
- At courage ≥ 4: Extra dialogue options unlock in Chapter 5
- Affects: how Diana delivers the final line (confident vs uncertain)

## TECHNICAL REQUIREMENTS

### Game Engine Structure
- **State machine:** each scene is a state, choices are transitions
- **Save system:** localStorage (auto-save on each choice)
- **Typewriter effect:** text appears letter by letter
- **Responsive:** mobile-first (Diana opens on phone!)
- **Pixel art:** CSS pixel-art rendering, retro font
- **Sound:** optional background music (8-bit style), click sounds

### File Structure
```
diana-game/
├── public/
│   ├── sprites/        # Character pixel sprites (PNG)
│   ├── backgrounds/    # Scene backgrounds (PNG)
│   ├── audio/          # Background music, SFX
│   └── fonts/          # Pixel font
├── src/
│   ├── app/            # Next.js app router
│   ├── components/
│   │   ├── Game.tsx    # Main game component
│   │   ├── Dialogue.tsx # Dialogue box with typewriter
│   │   ├── Choices.tsx  # Choice buttons
│   │   ├── Inventory.tsx # Inventory display
│   │   ├── Scene.tsx   # Scene/background renderer
│   │   └── Character.tsx # Character sprite display
│   ├── data/
│   │   └── story.ts    # All story data (scenes, dialogues, choices)
│   ├── engine/
│   │   ├── gameState.ts # State management
│   │   └── typewriter.ts # Typewriter effect
│   └── styles/
│       └── pixel.css   # Pixel art styling
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

### Story Data Format
```typescript
interface Scene {
  id: string;
  background: string;
  characters: Character[];
  dialogue: DialogueLine[];
  choices?: Choice[];
  next?: string; // auto-advance
}

interface DialogueLine {
  speaker: string;
  text: string;
  emotion?: string;
}

interface Choice {
  text: string;
  nextScene: string;
  effects?: {
    courage?: number;
    addItem?: string;
    removeItem?: string;
    setFlag?: string;
  };
  condition?: {
    hasItem?: string;
    minCourage?: number;
    hasFlag?: string;
  };
}
```

## PIXEL ART STYLE GUIDE
- Resolution feel: 320x180 scaled up (chunky pixels)
- Color palette: limited (32 colors max per scene)
- Characters: 32x48 pixel sprites, 3-4 frames idle animation
- Backgrounds: 320x180 with parallax layers
- UI: Dialogue box semi-transparent dark, text white/light
- Choices: Pixel-art styled buttons with hover glow

## MOBILE OPTIMIZATION
- Touch-friendly: large choice buttons (min 48px height)
- Portrait mode primary
- Dialogue box takes bottom 30% of screen
- Character sprites scale appropriately
- No horizontal scroll
