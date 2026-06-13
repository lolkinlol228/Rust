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

  { id:'wood-double-door', name:'Двойная деревянная дверь', cat:'Двери', tier:'wood', hp:200, icon:'door.hinged.wood',
    counts:{ satchel:2, c4:1, rocket:1, ammo:18, beancan:9 } },

  { id:'metal-door', name:'Железная дверь', cat:'Двери', tier:'metal', hp:250, icon:'door.hinged.metal',
    counts:{ satchel:4, c4:1, rocket:1, ammo:63 } },

  { id:'metal-double-door', name:'Двойная железная дверь', cat:'Двери', tier:'metal', hp:250, icon:'door.hinged.metal',
    counts:{ satchel:4, c4:1, rocket:1, ammo:63 } },

  { id:'garage-door', name:'Гаражная дверь', cat:'Двери', tier:'metal', hp:600, icon:'wall.frame.garagedoor',
    counts:{ satchel:9, c4:2, rocket:3, ammo:152 } },

  { id:'armored-door', name:'Бронированная дверь', cat:'Двери', tier:'hqm', hp:800, icon:'door.hinged.toptier',
    counts:{ satchel:15, c4:3, rocket:5, ammo:251 } },

  { id:'armored-double-door', name:'Двойная бронированная дверь (МВК)', cat:'Двери', tier:'hqm', hp:800, icon:'door.hinged.toptier',
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

/* Ближний бой по ДЕРЕВЯННОЙ СТЕНЕ (250 HP) — мягкая и твёрдая сторона.
   soft = удары по мягкой (внутренней) стороне; hard = по твёрдой (внешней).
   Инструменты по мягкой бьют ~в 10× сильнее. Оружием твёрдую бить бессмысленно. */
const MELEE_WALL = {
  target: 'Деревянная стена (250 HP)',
  note: 'Мягкая (внутренняя) сторона — та, где НЕТ диагональных опор по краям. Инструменты наносят по ней примерно в 10 раз больше урона, чем по твёрдой (внешней). Оружием (копья, ножи, мачете) твёрдую сторону бить вообще не стоит. Вывод: всегда ищи мягкую сторону.',
  rows: [
    { tool:'Бензопила (Chainsaw)',     icon:'chainsaw',     soft:3,   hard:'~30',       need:'низкосорт. топливо',      note:'Быстро, очень громко' },
    { tool:'Сальважный топор',         icon:'axe.salvaged', soft:6,   hard:'~60',       need:'1 шт',                    note:'Лучший инструмент' },
    { tool:'Кирка (Pickaxe)',          icon:'pickaxe',      soft:11,  hard:'~110',      need:'1 шт',                    note:'Хороший вариант' },
    { tool:'Топор (Hatchet)',          icon:'hatchet',      soft:12,  hard:'~120',      need:'1 шт',                    note:'Дёшево и доступно' },
    { tool:'Мачете (Machete)',         icon:'machete',      soft:14,  hard:'невыгодно', need:'1 шт',                    note:'Оружие, не инструмент' },
    { tool:'Отбойный молоток',         icon:'jackhammer',   soft:22,  hard:'~220',      need:'низкосорт. топливо',      note:'Электро-инструмент' },
    { tool:'Боевой нож',               icon:'knife.combat', soft:37,  hard:'невыгодно', need:'1 шт',                    note:'Тихо' },
    { tool:'Деревянное копьё',         icon:'spear.wooden', soft:59,  hard:'невыгодно', need:'≈5 копий (≈1500 дерева)', note:'Самый дешёвый, тихий' },
    { tool:'Каменное копьё',           icon:'spear.stone',  soft:65,  hard:'невыгодно', need:'≈4 копья (≈1200 дерева + 80 камня)', note:'Прочнее деревянного' },
    { tool:'Камень (Rock)',            icon:'rock',         soft:368, hard:'невыгодно', need:'1 шт',                    note:'Очень долго' }
  ]
};

/* Деревянная ДВЕРЬ (200 HP) — мягкой стороны нет, ломается куча инструментов.
   Полный арсенал. «Расход» = сколько инструментов сточишь / ударов. */
const MELEE_DOOR = {
  target: 'Деревянная дверь (200 HP)',
  rows: [
    { tool:'Сальважный топор',     icon:'axe.salvaged',     spend:'≈7 топоров',  note:'Лучший вариант' },
    { tool:'Сальважный меч',       icon:'salvaged.sword',   spend:'≈9 мечей',    note:'Быстрый' },
    { tool:'Сальважная кирка',     icon:'icepick.salvaged', spend:'≈9 кирок',    note:'' },
    { tool:'Длинный меч',          icon:'longsword',        spend:'≈9 мечей',    note:'' },
    { tool:'Топор (Hatchet)',      icon:'hatchet',          spend:'≈12 топоров', note:'' },
    { tool:'Мачете (Machete)',     icon:'machete',          spend:'≈15 мачете',  note:'~6.5 мин' },
    { tool:'Кирка (Pickaxe)',      icon:'pickaxe',          spend:'≈15 кирок',   note:'~80 ударов' },
    { tool:'Каменный топор',       icon:'stonehatchet',     spend:'≈50 топоров', note:'Слабее обычного' },
    { tool:'Бензопила (Chainsaw)', icon:'chainsaw',         spend:'~67 топлива', note:'~67 ударов, ~4 мин' },
    { tool:'Боевой нож',           icon:'knife.combat',     spend:'≈50 ножей',   note:'Очень долго' },
    { tool:'Костяной нож',         icon:'knife.bone',       spend:'≈67 ножей',   note:'' },
    { tool:'Камень (Rock)',        icon:'rock',             spend:'200 ударов',  note:'Не ломается, но вечность' },
    { tool:'Деревянное копьё',     icon:'spear.wooden',     spend:'≈100 копий (≈30000 дерева)',  note:'Бессмысленно' }
  ],
  tip:'У двери нет «мягкой» стороны, поэтому миллить её дорого — стачивается куча инструментов. Почти всегда выгоднее проломить мягкую (внутреннюю) сторону деревянной стены рядом с дверью (таблица выше) либо открыть дверь взрывчаткой.'
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
