import type { CatomonType } from "./types";
import type { Lang } from "./i18n";

export interface LangGameData {
  prefixes: Record<CatomonType, string[]>;
  suffixes: string[];
  moves: Record<CatomonType, string[]>;
  descriptions: Record<CatomonType, string[]>;
  abilities: Record<CatomonType, string[]>;
  titles: string[];
  cm: string;
  kg: string;
}

/* ------------------------------- RUSSIAN ------------------------------- */
const ru: LangGameData = {
  cm: "см",
  kg: "кг",
  prefixes: {
    fire: ["Мур", "Пыр", "Рыж", "Огне", "Жар", "Плам", "Искр", "Уголь"],
    water: ["Кап", "Буль", "Мок", "Плыв", "Аква", "Ныр", "Плюх", "Вод"],
    grass: ["Лист", "Трав", "Мят", "Пухн", "Лоз", "Цвет", "Зелен", "Мохн"],
    electric: ["Искр", "Ток", "Молн", "Вольт", "Шок", "Электро", "Пискл"],
    psychic: ["Загад", "Мысл", "Телеп", "Гипн", "Медит", "Пси", "Зен"],
    normal: ["Мурл", "Пуш", "Кис", "Мурч", "Шерст", "Лапк", "Хвост", "Усат"],
    dark: ["Сумр", "Тен", "Ноч", "Мрак", "Черн", "Дымн", "Ворон", "Скрыт"],
    fairy: ["Звёзд", "Лун", "Сахар", "Нежн", "Роз", "Блест", "Мечт", "Эльф"],
    fighting: ["Бокс", "Кулак", "Громил", "Сил", "Борц", "Мускул", "Драк"],
    ghost: ["Призр", "Фантом", "Привид", "Страш", "Дух", "Заклин", "Тенейш"],
    ice: ["Льдин", "Снеж", "Мороз", "Холод", "Лед", "Зимн", "Сосуль"],
    rock: ["Камн", "Скал", "Валун", "Кремен", "Твёрд", "Гранит", "Бугай"],
  },
  suffixes: ["ий", "ыч", "от", "ун", "ян", "арь", "уш", "ик", "ыш", "икс", "экс", "он", "орис", "ан", "эль", "ен", "ита", "ица", "ушка", "янка", "ята", "ище", "ачи", "яй"],
  moves: {
    fire: ["Огнемяу", "Пламехлёст", "Искромёт", "Углепых", "Жаромурлык", "Факелопрыг"],
    water: ["Бульбоплюх", "Водопад-хвост", "Рыбопрыг", "Каплешлёп", "Гидролапа", "Лужеплюх"],
    grass: ["Травопрыг", "Листорез", "Мяуакация", "Семяплюй", "Когтекуст", "Пыльцехлоп"],
    electric: ["Токомёт", "Шерстеток", "Молниепрыг", "Вольтомяу", "Статический шок", "Вискер-разряд"],
    psychic: ["Телепорт к миске", "Гипномяу", "Пси-лапа", "Усамирение", "Вещий мурлык", "Телепорт-диван"],
    normal: ["Когтецарап", "Мяусиный рык", "Пухопрыг", "Усатый удар", "Шерстелёт", "Клубок"],
    dark: ["Ночной прыжок", "Теневой коготь", "Подкрад к миске", "Дымовая завеса", "Скрытый укус"],
    fairy: ["Блестящий мурч", "Звездопрыг", "Сладкий укус", "Обнимашки", "Искренний взгляд", "Волшебный сон"],
    fighting: ["Кулакопрыг", "Бокс-лапки", "Удар хвостом", "Мышцецарап", "Борцовский бросок", "Тяжёлый мурч"],
    ghost: ["Проклятый мурлык", "Сквозьстенопроход", "Призрачный прыжок", "Испуг с разбега", "Теневой шар"],
    ice: ["Льдомяу", "Снежок-хвост", "Морозный коготь", "Ледяной прыжок", "Снежная буря"],
    rock: ["Камнепад с полки", "Скальный бросок", "Крепколап", "Землетряс мурчанием", "Гранитная лапа"],
  },
  descriptions: {
    fire: [
      "Этот котомон настолько горяч, что может вскипятить себе молоко одним мурчанием. Любит спать на батарее.",
      "Его шерсть слегка дымится, когда он видит птицу в окне. Опасен для носков и коробок.",
      "Искрит от злости, если корм в миске не той температуры. Любимая атака — горячий пых в лицо спящему хозяину.",
    ],
    water: [
      "Обожает сидеть в раковине и пить из-под крана. После душа бегает по квартире как сумасшедший.",
      "Не боится пылесоса, но очень боится пульверизатора с водой. Парадокс.",
      "Опрокидывает стаканы одним ударом лапы. Владеет техникой «пролил — не признаю».",
    ],
    grass: [
      "Питается исключительно цветами с подоконника. Любит вздремнуть в цветочном горшке.",
      "Его шерсть всегда полна листьев после прогулки на балконе. Умеет притворяться кустом.",
      "Способность: съесть паука и не поморщиться. Лучший друг фикуса.",
    ],
    electric: [
      "Разгоняется по квартире со скоростью 50 км/ч в 3 часа ночи. Бьёт хозяина статикой при ласке.",
      "Шерсть стоит дыбом от избытка энергии. Бегает по стенам. Эффективен против тапочек.",
      "Может разрядить телефон, мурлыкая на нём. Очень любит грызть провода.",
    ],
    psychic: [
      "Знает, когда хозяин идёт за колбасой, из любой точки квартиры. Телепортируется на колени ровно в тот момент, когда вы решили встать.",
      "Читает мышиные мысли. Гипнотизирует взглядом «покорми меня», сопротивляться невозможно.",
      "Предсказывает землетрясения и приход ветеринара. Обычно прячется под диван.",
    ],
    normal: [
      "Самый обычный котомон. Ест, спит, орёт, переворачивает лоток. Ничего особенного.",
      "Любит колбасу, коробки и сидеть на газете, которую вы читаете. Классика.",
      "Эволюционирует в «голодного кота» ровно в 5 утра. Слабость только к пакетику корма.",
    ],
    dark: [
      "Активен исключительно ночью. Идеально чёрен (если бы не шерсть на сером ковре).",
      "Скрывается в тёмных углах, чтобы неожиданно выпрыгнуть на ваши ноги. Любит шкафы.",
      "Его глаза светятся в темноте. Приносит вам мёртвых мух как подарок и очень гордится.",
    ],
    fairy: [
      "Мягчайший розовый нос и невероятно пушистый хвост. Мурлычет так сладко, что у соседей течёт чай.",
      "Его шерсть буквально сверкает на солнце. Не царапается, но может загипнотизировать обнимашками.",
      "Оставляет за собой след из блёсток. Спит на вашей подушке и ваших мечтах.",
    ],
    fighting: [
      "Мышцы на лапках крепче бетона. Прыгает на двери и открывает шкафы головой.",
      "Его когти точатся об диван 24/7. Бьётся с собственным хвостом вничью.",
      "Может нокаутировать муху с одного удара. Немного боится пылесоса, но не показывает вида.",
    ],
    ghost: [
      "Проходит сквозь закрытые двери (на самом деле умеет их открывать). Появляется из ниоткуда и требует еды.",
      "В полночь его глаза светятся под кроватью. Приходит, только когда сам захочет.",
      "Может исчезнуть из переноски. Оставляет после себя лишь комочки шерсти и загадки.",
    ],
    ice: [
      "Обожает спать на подоконнике в мороз. Его шерсть холодна как лёд, особенно утром на вашем одеяле.",
      "Его мокрый нос примерзает к окну зимой. Не любит, когда его накрывают одеялом.",
      "Любит лежать на холодной плитке в жару. Создаёт ледяные шары из слюней на кухне.",
    ],
    rock: [
      "Настолько тяжёлый, что продавливает диван. Невозможно согнать с коленей. Батарея ему не нужна — сам грелка.",
      "Спит ровно 22 часа в сутки в позе камня. Когти точит об асфальт на балконе.",
      "Когда прыгает со шкафа — дрожит потолок у соседей. Удар хвостом по ноге равен кирпичу.",
    ],
  },
  abilities: {
    fire: ["Пламенная шерсть", "Огнемёт", "Батареепоклонник", "Жаркое мурчание"],
    water: ["Пловец", "Кранолак", "Брызги из усов", "Раковиноуют"],
    grass: ["Фотосинтез на окошке", "Листорез", "Травяной покров", "Цветкопожиратель"],
    electric: ["Статический удар", "Молниеносный бег", "Ночной заряд", "Проводогрыз"],
    psychic: ["Телепорт к миске", "Гипновзгляд", "Предчувствие кормёжки", "Блок от расчёски"],
    normal: ["Пуховой покров", "Суперсон", "Обнимашки", "Мяусиный рёв"],
    dark: ["Скрытность", "Ночной охотник", "Пакостник", "Бесшумный прыг"],
    fairy: ["Блестящая шерсть", "Умиление", "Сладкий мурч", "Блёсточная атака"],
    fighting: ["Крепкие лапы", "Боксёрские рефлексы", "Удар хвостом", "Когтеборьба"],
    ghost: ["Сквозьстены", "Исчезновение", "Призрачный прыг", "Связь с холодильником"],
    ice: ["Морозное дыхание", "Снежная шерсть", "Ледяные коготки", "Зимоспячка"],
    rock: ["Кремнелап", "Камнепад", "Тяжёлая поступь", "Давящий взгляд"],
  },
  titles: [
    "Мурлыкающий воин", "Повелитель подушек", "Разоритель горшков", "Хранитель холодильника",
    "Царь дивана", "Пожиратель пауков", "Любитель 5 утра", "Повелитель коробок",
    "Властелин лазера", "Истребитель мух", "Король подоконника", "Бог батареи",
    "Полуночный спринтер", "Тот-кто-смотрит", "Сброситель стаканов", "Сонный мурчатель",
    "Охотник на носки", "Властелин вискаса", "Прыгун на занавески", "Когтеточ-дестроер",
  ],
};

/* ------------------------------ UKRAINIAN ------------------------------ */
const uk: LangGameData = {
  cm: "см",
  kg: "кг",
  prefixes: {
    fire: ["Мур", "Пир", "Руд", "Вогне", "Жар", "Полум", "Іскр", "Вугл"],
    water: ["Крап", "Буль", "Мок", "Плив", "Аква", "Пірн", "Хлюп", "Вод"],
    grass: ["Лист", "Трав", "М'ят", "Пухн", "Лоз", "Квіт", "Зелен", "Мохн"],
    electric: ["Іскр", "Струм", "Блиск", "Вольт", "Шок", "Електро", "Писк"],
    psychic: ["Загад", "Думк", "Телеп", "Гіпн", "Медит", "Псі", "Дзен"],
    normal: ["Мурл", "Пух", "Кис", "Мурк", "Шерст", "Лапк", "Хвост", "Вусат"],
    dark: ["Сутін", "Тін", "Ніч", "Морок", "Чорн", "Димн", "Ворон", "Прихов"],
    fairy: ["Зірк", "Місяч", "Цукр", "Ніжн", "Троянд", "Блиск", "Мрій", "Ельф"],
    fighting: ["Бокс", "Кулак", "Здоров", "Сил", "Борц", "М'яз", "Бійк"],
    ghost: ["Примар", "Фантом", "Привид", "Страх", "Дух", "Закляt", "Тіньов"],
    ice: ["Крижин", "Сніж", "Мороз", "Холод", "Лід", "Зим", "Бурульк"],
    rock: ["Камін", "Скел", "Валун", "Кремін", "Тверд", "Граніт", "Бугай"],
  },
  suffixes: ["ій", "ич", "от", "ун", "ян", "ар", "уш", "ик", "иш", "ікс", "екс", "он", "оріс", "ан", "ель", "ен", "іта", "иця", "ушка", "янка", "ята", "ище", "ачі", "яй"],
  moves: {
    fire: ["Вогнем'яу", "Полум'яхльост", "Іскромет", "Вуглепих", "Жаромуркіт", "Смолоскипострибок"],
    water: ["Бульбохлюп", "Водоспад-хвіст", "Рибостриб", "Крапльошльоп", "Гідролапа", "Калюжохлюп"],
    grass: ["Травостриб", "Листоріз", "М'яуакація", "Насінняплюй", "Кігтекущ", "Пилкохлоп"],
    electric: ["Струмомет", "Шерстострум", "Блискавкостриб", "Вольтом'яу", "Статичний шок", "Вусорозряд"],
    psychic: ["Телепорт до миски", "Гіпном'яу", "Псі-лапа", "Вусоприборкання", "Віщий муркіт", "Телепорт-диван"],
    normal: ["Кігтедряп", "М'явкий рик", "Пухостриб", "Вусатий удар", "Шерстепіт", "Клубок"],
    dark: ["Нічний стрибок", "Тіньовий кіготь", "Підкрад до миски", "Димова завіса", "Прихований укус"],
    fairy: ["Блискучий муркіт", "Зорестриб", "Солодкий укус", "Обіймашки", "Щирий погляд", "Чарівний сон"],
    fighting: ["Кулакостриб", "Бокс-лапки", "Удар хвостом", "М'язодряп", "Борцівський кидок", "Важкий муркіт"],
    ghost: ["Проклятий муркіт", "Крізьстінопрохід", "Примарний стрибок", "Переляк з розбігу", "Тіньова куля"],
    ice: ["Льодом'яу", "Сніжка-хвіст", "Морозний кіготь", "Крижаний стрибок", "Снігова буря"],
    rock: ["Камнепад з полиці", "Скельний кидок", "Міцнолап", "Землетрус муркотінням", "Гранітна лапа"],
  },
  descriptions: {
    fire: [
      "Цей котомон настільки гарячий, що може закип'ятити собі молоко одним муркотінням. Любить спати на батареї.",
      "Його шерсть трохи димить, коли він бачить пташку у вікні. Небезпечний для шкарпеток і коробок.",
      "Іскрить від злості, якщо корм у мисці не тієї температури. Улюблена атака — гарячий пих в обличчя сплячому хазяїну.",
    ],
    water: [
      "Обожнює сидіти в раковині й пити з-під крана. Після душу бігає квартирою як навіжений.",
      "Не боїться пилососа, але дуже боїться пульверизатора. Парадокс.",
      "Перекидає склянки одним ударом лапи. Володіє технікою «розлив — не зізнаюсь».",
    ],
    grass: [
      "Харчується виключно квітами з підвіконня. Любить подрімати в квітковому горщику.",
      "Його шерсть завжди повна листя після прогулянки на балконі. Уміє прикидатися кущем.",
      "Здібність: з'їсти павука і не скривитися. Найкращий друг фікуса.",
    ],
    electric: [
      "Розганяється квартирою до 50 км/год о 3 ночі. Б'є хазяїна статикою під час ласки.",
      "Шерсть стоїть дибки від надлишку енергії. Бігає по стінах. Ефективний проти капців.",
      "Може розрядити телефон, муркочучи на ньому. Дуже любить гризти дроти.",
    ],
    psychic: [
      "Знає, коли хазяїн іде по ковбасу, з будь-якої точки квартири. Телепортується на коліна саме тоді, коли ви вирішили встати.",
      "Читає мишачі думки. Гіпнотизує поглядом «погодуй мене», опиратися неможливо.",
      "Передбачає землетруси й прихід ветеринара. Зазвичай ховається під диван.",
    ],
    normal: [
      "Найзвичайніший котомон. Їсть, спить, горлає, перевертає лоток. Нічого особливого.",
      "Любить ковбасу, коробки й сидіти на газеті, яку ви читаєте. Класика.",
      "Еволюціонує в «голодного кота» рівно о 5 ранку. Слабкість лише до пакетика корму.",
    ],
    dark: [
      "Активний виключно вночі. Ідеально чорний (якби не шерсть на сірому килимі).",
      "Ховається в темних кутках, щоб несподівано стрибнути вам на ноги. Любить шафи.",
      "Його очі світяться в темряві. Приносить вам мертвих мух як подарунок і дуже пишається.",
    ],
    fairy: [
      "Найм'якіший рожевий ніс і неймовірно пухнастий хвіст. Муркоче так солодко, що в сусідів тече чай.",
      "Його шерсть буквально виблискує на сонці. Не дряпається, але може загіпнотизувати обіймами.",
      "Залишає по собі слід із блискіток. Спить на вашій подушці й ваших мріях.",
    ],
    fighting: [
      "М'язи на лапках міцніші за бетон. Стрибає на двері й відчиняє шафи головою.",
      "Його кігті гострить об диван 24/7. Б'ється з власним хвостом внічию.",
      "Може нокаутувати муху з одного удару. Трохи боїться пилососа, але не показує вигляду.",
    ],
    ghost: [
      "Проходить крізь зачинені двері (насправді вміє їх відчиняти). З'являється нізвідки й вимагає їжі.",
      "Опівночі його очі світяться під ліжком. Приходить, лише коли сам захоче.",
      "Може зникнути з переноски. Залишає по собі тільки грудочки шерсті та загадки.",
    ],
    ice: [
      "Обожнює спати на підвіконні в мороз. Його шерсть холодна як лід, особливо вранці на вашій ковдрі.",
      "Його мокрий ніс примерзає до вікна взимку. Не любить, коли його вкривають ковдрою.",
      "Любить лежати на холодній плитці в спеку. Створює крижані кульки зі слини на кухні.",
    ],
    rock: [
      "Настільки важкий, що продавлює диван. Неможливо зігнати з колін. Батарея йому не потрібна — сам грілка.",
      "Спить рівно 22 години на добу в позі каменя. Кігті гострить об асфальт на балконі.",
      "Коли стрибає з шафи — тремтить стеля в сусідів. Удар хвостом по нозі дорівнює цеглині.",
    ],
  },
  abilities: {
    fire: ["Полум'яна шерсть", "Вогнемет", "Батареєпоклонник", "Спекотне муркотіння"],
    water: ["Плавець", "Кранолиз", "Бризки з вусів", "Раковинозатишок"],
    grass: ["Фотосинтез на вікні", "Листоріз", "Трав'яний покрив", "Квітопожирач"],
    electric: ["Статичний удар", "Блискавичний біг", "Нічний заряд", "Дротогриз"],
    psychic: ["Телепорт до миски", "Гіпнопогляд", "Передчуття годівлі", "Блок від гребінця"],
    normal: ["Пуховий покрив", "Суперсон", "Обіймашки", "М'явкий рев"],
    dark: ["Прихованість", "Нічний мисливець", "Капосник", "Безшумний стриб"],
    fairy: ["Блискуча шерсть", "Розчулення", "Солодкий муркіт", "Блискіткова атака"],
    fighting: ["Міцні лапи", "Боксерські рефлекси", "Удар хвостом", "Кігтеборство"],
    ghost: ["Крізьстіни", "Зникнення", "Примарний стриб", "Зв'язок з холодильником"],
    ice: ["Морозне дихання", "Снігова шерсть", "Крижані кігтики", "Зимосплячка"],
    rock: ["Кременелап", "Каменепад", "Важка хода", "Тиснучий погляд"],
  },
  titles: [
    "Муркотливий воїн", "Володар подушок", "Нищитель горщиків", "Охоронець холодильника",
    "Цар дивана", "Пожирач павуків", "Любитель 5 ранку", "Володар коробок",
    "Повелитель лазера", "Винищувач мух", "Король підвіконня", "Бог батареї",
    "Опівнічний спринтер", "Той-хто-дивиться", "Скидач склянок", "Сонний муркотун",
    "Мисливець на шкарпетки", "Володар віскасу", "Стрибун на штори", "Кігтеточ-дестроєр",
  ],
};

/* -------------------------------- ENGLISH ------------------------------- */
const en: LangGameData = {
  cm: "cm",
  kg: "kg",
  prefixes: {
    fire: ["Pyro", "Blaze", "Ember", "Flare", "Scorch", "Cinder", "Fla", "Ash"],
    water: ["Aqua", "Splash", "Drip", "Mist", "Puddle", "Wave", "Hydro", "Rain"],
    grass: ["Leaf", "Sprout", "Vine", "Bloom", "Petal", "Moss", "Fern", "Ivy"],
    electric: ["Volt", "Zap", "Spark", "Static", "Bolt", "Buzz", "Zip"],
    psychic: ["Psy", "Mind", "Zen", "Mystic", "Trance", "Aura", "Gaze"],
    normal: ["Purr", "Fluff", "Mew", "Whisk", "Paw", "Tail", "Fuzz", "Meow"],
    dark: ["Shadow", "Noct", "Umbra", "Dusk", "Raven", "Void", "Sable"],
    fairy: ["Star", "Luna", "Sugar", "Glitter", "Rose", "Dream", "Pixie"],
    fighting: ["Box", "Punch", "Brawl", "Muscle", "Grap", "Fist", "Slam"],
    ghost: ["Spook", "Phantom", "Wraith", "Boo", "Spirit", "Haunt", "Fade"],
    ice: ["Frost", "Snow", "Chill", "Glaci", "Icicle", "Blizz", "Frigi"],
    rock: ["Boulder", "Granite", "Flint", "Crag", "Stone", "Pebble", "Rubble"],
  },
  suffixes: ["mew", "paw", "cat", "puss", "meow", "kit", "purr", "on", "ix", "ax", "eon", "ito", "ella", "ina", "us", "or", "ara", "zar", "oth", "ino"],
  moves: {
    fire: ["Flame Meow", "Ember Swipe", "Blaze Pounce", "Scorch Purr", "Fireball Nap", "Cinder Claw"],
    water: ["Splash Paw", "Tail Tsunami", "Sink Dive", "Droplet Slap", "Hydro Purr", "Puddle Flop"],
    grass: ["Leaf Pounce", "Vine Whisker", "Petal Nibble", "Seed Spit", "Bush Ambush", "Pollen Sneeze"],
    electric: ["Static Shock", "Zoomie Bolt", "Volt Meow", "Cable Chew", "Whisker Spark", "Thunder Zoom"],
    psychic: ["Teleport to Bowl", "Hypno Stare", "Psy Paw", "Mind Nap", "Precog Purr", "Couch Warp"],
    normal: ["Claw Scratch", "Mega Meow", "Fluff Pounce", "Whisker Slap", "Shedding Cloud", "Loaf Mode"],
    dark: ["Midnight Zoomies", "Shadow Claw", "Bowl Stalk", "Smoke Screen", "Sneak Bite"],
    fairy: ["Sparkle Purr", "Star Pounce", "Sweet Nibble", "Cuddle Attack", "Innocent Eyes", "Dream Nap"],
    fighting: ["Boxing Paws", "Tail Whip", "Muscle Scratch", "Wrestle Slam", "Door Kick", "Heavy Purr"],
    ghost: ["Cursed Purr", "Wall Phase", "Spectral Pounce", "Jump Scare", "Shadow Ball"],
    ice: ["Ice Meow", "Snowball Tail", "Frost Claw", "Glacier Pounce", "Blizzard Fluff"],
    rock: ["Shelf Avalanche", "Boulder Toss", "Rock Paw", "Purrquake", "Granite Slam"],
  },
  descriptions: {
    fire: [
      "This catomon is so hot it can boil its own milk with a single purr. Sleeps exclusively on radiators.",
      "Its fur slightly smokes whenever it spots a bird outside. Extremely dangerous to socks and boxes.",
      "Sparks with rage if the food in the bowl is the wrong temperature. Signature move: hot breath on a sleeping owner's face.",
    ],
    water: [
      "Loves sitting in the sink and drinking from the tap. After a bath it sprints across the flat like it's possessed.",
      "Not afraid of the vacuum cleaner, but terrified of a spray bottle. A true paradox.",
      "Knocks glasses over with a single paw tap. Master of the 'I spilled it but I deny everything' technique.",
    ],
    grass: [
      "Feeds exclusively on the plants on your windowsill. Enjoys naps inside flower pots.",
      "Its fur is always full of leaves after a balcony trip. Can convincingly pretend to be a shrub.",
      "Special ability: eating a spider without flinching. Best friend of the ficus.",
    ],
    electric: [
      "Reaches 50 km/h across the apartment at 3 AM. Delivers static shocks during cuddles.",
      "Fur stands on end from excess energy. Runs on walls. Super effective against slippers.",
      "Can drain a phone battery just by purring on it. Deeply in love with chewing cables.",
    ],
    psychic: [
      "Knows when you head to the kitchen for sausage from anywhere in the house. Teleports onto your lap the instant you decide to stand up.",
      "Reads mouse thoughts. Hypnotises with a 'feed me' stare — resistance is futile.",
      "Predicts earthquakes and vet visits. Usually found hiding under the sofa.",
    ],
    normal: [
      "The most ordinary catomon. Eats, sleeps, yells, flips the litter box. Nothing special.",
      "Loves sausage, boxes, and sitting on the newspaper you're reading. A classic.",
      "Evolves into 'Hungry Cat' precisely at 5 AM. Only weakness: the sound of a treat bag.",
    ],
    dark: [
      "Active exclusively at night. Perfectly black — except for all the fur on your grey carpet.",
      "Lurks in dark corners to ambush your ankles. Has a deep bond with wardrobes.",
      "Its eyes glow in the dark. Brings you dead flies as gifts and is extremely proud of it.",
    ],
    fairy: [
      "The softest pink nose and an impossibly fluffy tail. Purrs so sweetly the neighbours get emotional.",
      "Its fur literally sparkles in sunlight. Never scratches, but can hypnotise you with cuddles.",
      "Leaves a trail of glitter behind. Sleeps on your pillow and on your dreams.",
    ],
    fighting: [
      "Paw muscles harder than concrete. Jumps at doors and opens cupboards with its head.",
      "Sharpens claws on the sofa 24/7. Fights its own tail to a draw every single time.",
      "Can knock out a fly in one hit. Slightly afraid of the vacuum, but would never admit it.",
    ],
    ghost: [
      "Walks through closed doors (actually just knows how to open them). Materialises from nowhere and demands food.",
      "At midnight its eyes glow from under the bed. Only ever comes when it feels like it.",
      "Can vanish from a carrier. Leaves nothing behind but fur tumbleweeds and unanswered questions.",
    ],
    ice: [
      "Adores sleeping on the windowsill in freezing weather. Its fur is ice-cold, especially on your duvet at dawn.",
      "Its wet nose freezes to the window in winter. Strongly objects to being covered with a blanket.",
      "Lies on cold kitchen tiles all summer. Manufactures ice spheres out of drool.",
    ],
    rock: [
      "So heavy it permanently dents the sofa. Impossible to remove from your lap. Doesn't need a radiator — it IS the radiator.",
      "Sleeps exactly 22 hours a day in perfect loaf formation. Sharpens claws on balcony concrete.",
      "When it jumps off the wardrobe, the neighbours' ceiling trembles. A tail whack feels like a brick.",
    ],
  },
  abilities: {
    fire: ["Flaming Coat", "Flamethrower", "Radiator Worship", "Hot Purr"],
    water: ["Swimmer", "Tap Licker", "Whisker Splash", "Sink Comfort"],
    grass: ["Windowsill Photosynthesis", "Leaf Blade", "Grass Coat", "Flower Devourer"],
    electric: ["Static Strike", "Lightning Zoomies", "Night Charge", "Cable Chewer"],
    psychic: ["Bowl Teleport", "Hypno Gaze", "Feeding Precognition", "Brush Resistance"],
    normal: ["Down Coat", "Super Sleep", "Cuddle Mode", "Mega Meow"],
    dark: ["Stealth", "Night Hunter", "Mischief Maker", "Silent Pounce"],
    fairy: ["Sparkling Fur", "Adorability", "Sweet Purr", "Glitter Burst"],
    fighting: ["Iron Paws", "Boxing Reflexes", "Tail Strike", "Claw Wrestling"],
    ghost: ["Wall Phasing", "Vanishing Act", "Spectral Leap", "Fridge Telepathy"],
    ice: ["Frost Breath", "Snow Coat", "Ice Claws", "Hibernation"],
    rock: ["Flint Paw", "Rockslide", "Heavy Steps", "Crushing Stare"],
  },
  titles: [
    "Purring Warrior", "Lord of Pillows", "Destroyer of Flower Pots", "Guardian of the Fridge",
    "King of the Sofa", "Spider Devourer", "Enjoyer of 5 AM", "Master of Boxes",
    "Ruler of the Laser Dot", "Fly Exterminator", "Monarch of the Windowsill", "God of the Radiator",
    "Midnight Sprinter", "The One Who Stares", "Knocker of Glasses", "Sleepy Purr Machine",
    "Sock Hunter", "Overlord of Kibble", "Curtain Climber", "Scratching Post Destroyer",
  ],
};

export const GAME_DATA: Record<Lang, LangGameData> = { ru, uk, en };
