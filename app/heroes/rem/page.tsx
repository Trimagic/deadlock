import type { Metadata } from "next";
import Link from "next/link";
import itemData from "@/data/items.json";
import { GuideHeader } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "Дрём (Rem) — атакующая сборка | Deadlock",
  description: "Оружейный Дрём: покупки на линии, в середине и конце матча, способности, условия для агрессивной игры и контрмеры.",
};

type Pick = { name: string; why: string };

const phases: { label: string; title: string; plan: string; picks: Pick[] }[] = [
  { label: "01 / ЛИНИЯ · 800–1600", title: "Получить преимущество", plan: "Добивайте крипов, забирайте ящики и поручайте помощникам грешников. Не расходуйте всю экономику на оружие: без пути отхода Дрём умирает до второй серии выстрелов.", picks: [
    { name: "Extra Stamina", why: "Ещё один рывок для выхода из опасной дистанции." },
    { name: "Extended Magazine", why: "Больше выстрелов до перезарядки короткого базового магазина." },
    { name: "High-Velocity Rounds", why: "Проще попадать и добивать с безопасного расстояния." },
    { name: "Sprint Boots", why: "Быстрее перемещаться между линией, ящиками и командой." },
  ] },
  { label: "02 / СЕРЕДИНА · 1600–3200", title: "Реализовать души", plan: "Здесь проверяется идея оружейного Дрёма: вы должны выигрывать короткие обмены и при этом не терять темп команды. После контроля подходите на дистанцию уверенных попаданий, стреляйте и отходите к союзнику.", picks: [
    { name: "Titanic Magazine", why: "Длиннее серия стрельбы; особенно полезно, если перезарядка обрывает добивание." },
    { name: "Quicksilver Reload", why: "Привяжите к броску подушки: умение обновит магазин перед новой серией." },
    { name: "Opening Rounds", why: "Начальный урон по здоровой цели, если удаётся открывать дуэль первым." },
    { name: "Burst Fire", why: "Сильнее короткое окно, когда цель остановлена или отвлечена." },
    { name: "Heroic Aura", why: "Атакующий предмет с пользой для союзников и помощников, когда команда дерётся вместе." },
  ] },
  { label: "03 / КОНЕЦ · 3200–6400", title: "Закрыть бой, а не сборку", plan: "Покупайте дорогой урон только если регулярно живёте до конца перестрелки. Если враги уже фокусят вас, защитный слот сохранит больше реального урона, чем ещё один множитель.", picks: [
    { name: "Lucky Shot", why: "Позднее усиление обычных попаданий в длинном бою." },
    { name: "Mercurial Magnum", why: "Гибридный переход после Ртутной перезарядки; оставьте привязку на часто применяемом умении." },
    { name: "Vampiric Burst", why: "Активная выживаемость для серии выстрелов, когда можно продолжать бой." },
    { name: "Metal Skin", why: "Ситуативно против сильного фокуса оружием; нажимайте до смертельного урона." },
  ] },
];

const counters: Pick[] = [
  { name: "Disarming Hex", why: "Лишает оружейного Дрёма главного источника урона в момент его входа." },
  { name: "Metal Skin", why: "Пережить серию выстрелов и вынудить его отступить или перезарядиться." },
  { name: "Knockdown", why: "Наказать предсказуемый выход в открытую позицию; особенно ценен при совместном фокусе." },
];

function Item({ pick }: { pick: Pick }) {
  const item = itemData.find((entry) => entry.name === pick.name);
  if (!item) return null;
  return <article className={`hero-item ${item.category}`}><img src={item.icon} alt="" /><div><div className="hero-item-title"><strong>{item.nameRu}</strong><span>{item.cost.toLocaleString("ru-RU")}</span></div><small>{item.name}</small><p>{pick.why}</p></div></article>;
}

function Heading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return <div className="hero-section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

export default function RemPage() {
  return <main className="app-shell guide-shell hero-guide rem-guide">
    <GuideHeader current="/heroes/rem" />
    <nav className="hero-breadcrumb" aria-label="Навигация"><Link href="/heroes">Герои</Link><span>/</span><span>Дрём</span></nav>
    <section className="rem-hero"><div className="rem-hero-copy"><span className="eyebrow">ГЕРОЙ 02 / АТАКУЮЩИЙ МАРШРУТ</span><h1>ДРЁМ</h1><p>Оружейная сборка для игрока, который сумел получить преимущество по душам и хочет превратить его в давление. Дрём остаётся героем поддержки: даже в атаке его помощники, спасение союзника и сон выигрывают бои.</p><a className="hero-primary-link" href="#build">Смотреть покупки <span>↓</span></a></div><div className="rem-hero-symbol" aria-hidden="true"><span>☾</span><strong>REM</strong><small>LONG NIGHT</small></div></section>
    <nav className="hero-jump" aria-label="Разделы гайда"><a href="#idea">Когда играть</a><a href="#abilities">Способности</a><a href="#build">Покупки</a><a href="#adapt">Адаптация</a><a href="#against">Против Дрёма</a><a href="#sources">Источники</a></nav>

    <section className="hero-section" id="idea"><Heading eyebrow="01 / ИДЕЯ" title="Атаковать из преимущества" text="Оружейный Дрём — ситуационный маршрут. На форумах его ценят за сильную экономику и раннее давление, но часто критикуют за слабую отдачу в позднем командном бою." /><div className="hero-principles"><article><span>01</span><h3>Помощники кормят темп</h3><p>Отправляйте маленьких помощников за ящиками и к грешникам, пока сами держите линию и помогаете команде. Преимущество по душам нужно реализовать быстро.</p></article><article><span>02</span><h3>Стреляйте из окна контроля</h3><p>Подушка отталкивает противника, сон открывает фокус. Не начинайте длинную дуэль без укрытия и союзника, к которому можно уйти.</p></article><article><span>03</span><h3>Сохраняйте полезность</h3><p>Прыгайте к союзнику для лечения и спасения, даже когда строите урон. Если оружие не пробивает цель, переходите в защиту и командные предметы.</p></article></div><p className="hero-callout"><strong>Проверка маршрута:</strong> если после нескольких покупок оружия вы не выигрываете дуэли и команда проигрывает бои без лечения, не вкладывайте следующие 6400 душ в ещё один атакующий предмет. Помогите союзному керри.</p></section>

    <section className="hero-section" id="abilities"><Heading eyebrow="02 / КНОПКИ" title="Как способности работают в атаке" /><div className="hero-ability-grid"><article className="hero-ability"><h3>1 · Бросок подушки</h3><p>Отталкивает врага, открывает или завершает обмен. С привязанной «Ртутной перезарядкой» служит точкой для новой серии выстрелов.</p></article><article className="hero-ability"><h3>2 · Прыжок к союзнику</h3><p>Лечит вас и союзника. Это путь отхода после агрессии; во время сна на союзнике можно применять предметы. Не оставайтесь далеко от команды ради лишнего фарма.</p></article><article className="hero-ability"><h3>3 · Маленькие помощники</h3><p>Собирают ресурсы и поддерживают героев или крипов. Это причина, по которой атакующий маршрут вообще может получить раннее преимущество.</p></article><article className="hero-ability"><h3>4 · Время спать</h3><p>Замедляет врагов во время применения и усыпляет после него. Используйте для начала совместного фокуса или защиты; в одиночку сон не гарантирует убийства.</p></article></div><div className="hero-skill-note"><strong>Прокачка зависит от матча.</strong><p>Откройте основные инструменты, затем усиливайте помощников для экономики или подушку для постоянных стычек. Не задерживайте доступ к лечению и ультимейту ради чистого оружейного урона.</p></div></section>

    <section className="hero-section" id="build"><Heading eyebrow="03 / СБОРКА" title="Что покупать по этапам" text="Это набор решений, а не список предметов на все слоты. Внутри одного этапа выбирайте то, что решает текущую проблему." /><div className="hero-phases">{phases.map((phase) => <article className="hero-phase" key={phase.label}><div className="hero-phase-heading"><div><span className="eyebrow">{phase.label}</span><h3>{phase.title}</h3></div><p>{phase.plan}</p></div><div className="rem-phase-items">{phase.picks.map((pick) => <Item key={pick.name} pick={pick} />)}</div></article>)}</div></section>

    <section className="hero-section" id="adapt"><Heading eyebrow="04 / ПЕРЕКЛЮЧЕНИЕ" title="Когда менять план" /><div className="hero-principles"><article><span>↗</span><h3>Ведёте по душам</h3><p>Усиливайте оружие, пока противник не успел купить защиту. Ищите бой рядом с союзником: атака Дрёма эффективнее в коротком численном преимуществе.</p></article><article><span>↘</span><h3>Проигрываете темп</h3><p>Прекратите дорогую оружейную цепочку. Оставьте рабочий предмет для добивания крипов и направьте следующие души в выживание, лечение или полезный активный предмет.</p></article><article><span>!</span><h3>Вас обезоруживают</h3><p>Не входите первым и не тратьте все ресурсы в защиту цели. Дождитесь окончания контроля либо играйте через спасение союзника и командный сон.</p></article></div></section>

    <section className="hero-section hero-against" id="against"><Heading eyebrow="05 / ПРОТИВОДЕЙСТВИЕ" title="Если Дрём против вас" text="Отделяйте оружейный урон Дрёма от его командной пользы: выключить его выстрелы недостаточно, если союзник успевает войти под его лечением и контролем." /><div className="hero-weaknesses"><article><span>01</span><h3>Маленький магазин</h3><p>Следите за перезарядкой и использованием подушки. Без окна для второй серии выстрелов ранний урон быстро заканчивается.</p></article><article><span>02</span><h3>Зависит от экономики</h3><p>Оспаривайте ящики и грешников, не оставляйте помощникам бесплатную карту. Без преимущества по душам оружейный план созревает поздно.</p></article><article><span>03</span><h3>Нужен союзник</h3><p>Атакуйте, когда он отошёл от команды и не может прыгнуть к союзнику для лечения и выхода из боя.</p></article><article><span>04</span><h3>Телеграфирует сон</h3><p>Не стойте группой перед направленным ультимейтом. Расходитесь и используйте укрытие, затем отвечайте после его применения.</p></article></div><div className="hero-counter-groups"><article className="hero-counter-group"><div><h3>Против оружейной ветки</h3><p>Берите защиту под реальный тип угрозы, а не против любого Дрёма автоматически.</p></div><div>{counters.map((pick) => <Item key={pick.name} pick={pick} />)}</div></article></div></section>

    <section className="hero-section hero-sources" id="sources"><Heading eyebrow="06 / ПРОВЕРКА" title="Источники и ограничения" /><p>Способности сверены с карточкой героя. Оружейный маршрут опирается на пример сборки и обсуждения игроков; это экспериментальная ветка, а не доказанный лучший билд. Даты патчей и характеристики меняются — перед покупкой проверяйте карточку предмета в игре.</p><div><a href="https://deadlock.wiki/Rem" target="_blank" rel="noreferrer">Deadlock Wiki · Rem ↗</a><a href="https://deadlocklabs.gg/builds/rem-gun-722783/" target="_blank" rel="noreferrer">Deadlock Labs · пример оружейной сборки ↗</a><a href="https://www.reddit.com/r/DeadlockTheGame/comments/1wsmv5u/what_makes_gun_rem_so_appealing/" target="_blank" rel="noreferrer">Reddit · дискуссия об оружейном Дрёме ↗</a><a href="https://www.reddit.com/r/DeadlockTheGame/comments/1u6mzxo/why_is_it_so_common_to_see_people_not_build_any/" target="_blank" rel="noreferrer">Reddit · ограниченный оружейный вклад ↗</a></div></section>
  </main>;
}
