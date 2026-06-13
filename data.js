/* =========================================================================
   RUST RAID DATA — актуально на 13 июня 2026
   Источники: rustlabs / wiki.rustclash, wikirust.com (рейд-чарт июнь 2026),
   XGamingServer (стоимость серы 2026), tradeit.gg (ближний бой, мягкая сторона).
   Цифры по взрывчатке — для самой выгодной (мягкой) стороны постройки.
   Иконки: набор rostov114/rust-items (shortname), лежат локально в /icons.
   ========================================================================= */

// Сколько СЕРЫ стоит скрафтить одну единицу (полная цепочка крафта)
const SULFUR = {
  satchel: 480,   // Сачель (Satchel Charge)
  c4: 2200,       // С4 (Timed Explosive Charge)
  rocket: 1400,   // Ракета (Rocket)
  beancan: 120,   // Бобовая граната (Beancan)
  ammo: 25        // Взрывной патрон 5.56 (Explosive 5.56)
};

// Удобные подписи методов + иконки
const METHODS = [
  { key: 'satchel', label: 'Сачели', short: 'Сачель',  icon: 'explosive.satchel' },
  { key: 'c4',      label: 'С4',      short: 'С4',      icon: 'explosive.timed' },
  { key: 'rocket',  label: 'Ракеты',  short: 'Ракета',  icon: 'ammo.rocket.basic' },
  { key: 'ammo',    label: 'Взрыв. патроны 5.56', short: 'Патрон', icon: 'ammo.rifle.explosive' }
];

/* Постройки. counts = сколько штук нужно, чтобы РАЗРУШИТЬ объект.
   hp — прочность. beancan указан только там, где это реально применяют.
   icon — имя файла в /icons (без .webp). */
const STRUCTURES = [
  // ---- ДВЕРИ ----
  { id:'wood-door', name:'Деревянная дверь', cat:'Двери', tier:'wood', hp:200, icon:'door.hinged.wood',
    counts:{ satchel:2, c4:1, rocket:1, ammo:18, beancan:9 } },

  { id:'metal-door', name:'Железная дверь', cat:'Двери', tier:'metal', hp:250, icon:'door.hinged.metal',
    counts:{ satchel:4, c4:1, rocket:1, ammo:63 } },

  { id:'garage-door', name:'Гаражная дверь', cat:'Двери', tier:'metal', hp:600, icon:'wall.frame.garagedoor',
    counts:{ satchel:9, c4:2, rocket:3, ammo:152 } },

  { id:'armored-door', name:'Бронированная дверь', cat:'Двери', tier:'hqm', hp:800, icon:'door.hinged.toptier',
    counts:{ satchel:15, c4:3, rocket:5, ammo:251 } },

  { id:'ladder-hatch', name:'Люк под лестницу', cat:'Двери', tier:'metal', hp:200, icon:'floor.ladder.hatch',
    counts:{ satchel:4, c4:1, rocket:1, ammo:64 } },

  // ---- СТЕНЫ ---- (у стен нет иконки-предмета — берём иконку материала тира)
  { id:'twig-wall', name:'Соломенная стена (twig)', cat:'Стены', tier:'twig', hp:10, icon:'wood',
    counts:{ satchel:1, c4:1, rocket:1, ammo:1, beancan:1 } },

  { id:'wood-wall', name:'Деревянная стена', cat:'Стены', tier:'wood', hp:250, icon:'wood',
    counts:{ satchel:3, c4:1, rocket:1, ammo:48, beancan:13 } },

  { id:'stone-wall', name:'Каменная стена', cat:'Стены', tier:'stone', hp:500, icon:'stones',
    counts:{ satchel:10, c4:2, rocket:4, ammo:211 } },

  { id:'metal-wall', name:'Металлическая стена', cat:'Стены', tier:'metal', hp:1000, icon:'metal.fragments',
    counts:{ satchel:23, c4:4, rocket:8, ammo:406 } },

  { id:'armored-wall', name:'Бронированная стена (HQM)', cat:'Стены', tier:'hqm', hp:2000, icon:'metal.refined',
    counts:{ satchel:46, c4:8, rocket:15, ammo:806 } },

  // ---- ВНЕШНИЕ СТЕНЫ / ВОРОТА ----
  { id:'hew-wood', name:'Высокая деревянная стена / ворота', cat:'Внешние стены', tier:'wood', hp:500, icon:'wall.external.high',
    counts:{ satchel:6, c4:1, rocket:2, ammo:93 } },

  { id:'hew-stone', name:'Высокая каменная стена / ворота', cat:'Внешние стены', tier:'stone', hp:500, icon:'wall.external.high.stone',
    counts:{ satchel:10, c4:2, rocket:4, ammo:184 } }
];

/* Ближний бой / soft-side рейд — по МЯГКОЙ (внутренней) стороне деревянной стены.
   250 HP. Мягкая сторона получает заметно больше урона от инструментов. */
const MELEE_WALL = {
  target: 'Деревянная стена — мягкая сторона (250 HP)',
  rows: [
    { tool:'Бензопила (Chainsaw)',        icon:'chainsaw',     hits:3,   need:'топливо',        craft:'низкосортное топливо', note:'Самый быстрый, но очень громкий' },
    { tool:'Сальважный топор (Salvaged Axe)', icon:'axe.salvaged', hits:6, need:'1 шт',          craft:'находится в луте',     note:'Лучший инструмент для рейда' },
    { tool:'Кирка (Pickaxe)',             icon:'pickaxe',      hits:11,  need:'1 шт',            craft:'крафт/лут',            note:'Хороший вариант' },
    { tool:'Топор (Hatchet)',             icon:'hatchet',      hits:12,  need:'1 шт',            craft:'крафт/лут',            note:'Дёшево и доступно' },
    { tool:'Мачете (Machete)',            icon:'machete',      hits:14,  need:'1 шт',            craft:'находится в луте',     note:'Быстро, но тратит прочность' },
    { tool:'Отбойный молоток (Jackhammer)', icon:'jackhammer', hits:22,  need:'топливо',        craft:'низкосортное топливо', note:'Электро-инструмент' },
    { tool:'Боевой нож (Combat Knife)',   icon:'knife.combat', hits:37,  need:'1 шт',            craft:'крафт',                note:'Тихо' },
    { tool:'Деревянное копьё',            icon:'spear.wooden', hits:59,  need:'≈5 копий',        craft:'300 дерева/шт ≈ 1500 дерева', note:'Самый дешёвый, тихий рейд' },
    { tool:'Каменное копьё',              icon:'spear.stone',  hits:65,  need:'≈4 копья',        craft:'1 дер. копьё + 20 камня/шт', note:'Прочнее деревянного' },
    { tool:'Камень (Rock)',               icon:'rock',         hits:368, need:'1 шт',            craft:'стартовый предмет',    note:'Очень долго — на крайний случай' }
  ]
};

/* Деревянная дверь (200 HP) — у двери нет мягкой стороны, бить долго.
   Лучше ломать мягкую сторону стены рядом. */
const MELEE_DOOR = {
  target: 'Деревянная дверь (200 HP) — мягкой стороны нет',
  rows: [
    { tool:'Кирка (Pickaxe)', icon:'pickaxe', hits:80,  note:'Быстрее камня в ~2.5 раза' },
    { tool:'Камень (Rock)',   icon:'rock',    hits:200, note:'Долго и шумно' }
  ],
  tip:'У двери нет «мягкой» стороны, поэтому бить её невыгодно. Эффективнее проломить мягкую (внутреннюю) сторону деревянной стены рядом с дверью — см. таблицу выше.'
};

/* Крафт взрывчатки — стоимость и верстак */
const CRAFTING = [
  { item:'Бобовая граната (Beancan)', icon:'grenade.beancan', wb:'Верстак 1', sulfur:120,
    parts:'60 пороха + 20 металла', note:'Может «не сработать» (осечка). Дёшево для twig/дерева.' },
  { item:'Сачель (Satchel Charge)', icon:'explosive.satchel', wb:'Верстак 1', sulfur:480,
    parts:'4 бобовые гранаты + 1 верёвка + 1 тайник', note:'Тоже бывает осечка. Основа раннего рейда.' },
  { item:'Взрывной патрон 5.56', icon:'ammo.rifle.explosive', wb:'Верстак 2', sulfur:25,
    parts:'за 1 патрон: порох + сера + металл', note:'Нужна винтовка. Очень выгодно по сере на высоких тирах.' },
  { item:'Ракета (Rocket)', icon:'ammo.rocket.basic', wb:'Верстак 3', sulfur:1400,
    parts:'взрывчатка + металл. труба + порох', note:'Нужен ракетомёт. Быстрый рейд камня/металла.' },
  { item:'С4 (Timed Explosive Charge)', icon:'explosive.timed', wb:'Верстак 3', sulfur:2200,
    parts:'20 взрывчатки + 5 тех. мусора + 2 ткани', note:'Самое мощное. Выгодно по сере на металле/HQM.' }
];

/* Стоимость апгрейда стены (за 1 стену 3x3) */
const UPGRADE = [
  { tier:'Соломенная (twig)', icon:'wood',            hp:10,   cost:'бесплатно (ставится сразу)' },
  { tier:'Деревянная',        icon:'wood',            hp:250,  cost:'200 дерева' },
  { tier:'Каменная',          icon:'stones',          hp:500,  cost:'300 камня' },
  { tier:'Металлическая',     icon:'metal.fragments', hp:1000, cost:'200 металла' },
  { tier:'HQM (броня)',       icon:'metal.refined',   hp:2000, cost:'25 высококачественного металла' }
];
