"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import upgrades from "@/data/item-upgrades.json";
import { GuideHeader } from "@/components/site-nav";
import { Input } from "@/components/ui/input";

const filters = [
  { id: "all", label: "Все" },
  { id: "weapon", label: "Оружие" },
  { id: "vitality", label: "Живучесть" },
  { id: "spirit", label: "Спиритизм" },
] as const;

export default function UpgradesPage() {
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => upgrades.filter((item) =>
    (category === "all" || item.category === category) &&
    `${item.nameRu} ${item.name} ${item.stats.map((stat) => stat.label).join(" ")}`.toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru"))
  ).sort((a, b) => a.cost - b.cost || a.nameRu.localeCompare(b.nameRu, "ru")), [category, query]);

  return <main className="app-shell guide-shell">
    <GuideHeader current="/upgrades" />
    <section className="guide-intro"><span className="eyebrow">03 / ОТДЕЛЬНЫЕ ДАННЫЕ</span><h1>Улучшения <em>предметов.</em></h1><p>Значения из поля <code>PropertyUpgrades</code> в данных Deadlock Wiki. Это прибавки отдельного улучшения, а не характеристики, которые даёт обычная покупка в магазине.</p></section>
    <div className="upgrade-note"><strong>Как читать</strong><p>«+15% вероятность отражения» у «Латной брони» относится к улучшению. У купленного предмета базовая вероятность отражения — 30%. Эти значения не показаны вместе в обычном каталоге.</p></div>
    <section className="upgrade-section" aria-label="Список улучшений"><div className="upgrade-toolbar"><div><span className="eyebrow">ДАННЫЕ WIKI</span><h2>Найти улучшение <small>{visible.length}</small></h2></div><label className="search upgrade-search"><Search size={18} aria-hidden="true" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Предмет или характеристика..." aria-label="Поиск улучшений" /></label></div>
      <div className="upgrade-filters" role="group" aria-label="Категории улучшений">{filters.map((filter) => <button key={filter.id} type="button" aria-pressed={category === filter.id} onClick={() => setCategory(filter.id)}>{filter.label}</button>)}</div>
      {visible.length ? <div className="upgrade-grid">{visible.map((item) => <article className={`upgrade-card ${item.category}`} key={item.id}><div className="upgrade-card-top"><img src={item.icon} alt="" /><div><span>◈ {item.cost.toLocaleString("ru-RU")} · УР. {item.tier}</span><h3>{item.nameRu}</h3><small>{item.name}</small></div></div><div className="upgrade-stats">{item.stats.map((stat, index) => <div key={`${stat.label}-${index}`}><span>{stat.label}</span><strong>{stat.value}</strong></div>)}</div><a href={item.source} target="_blank" rel="noreferrer">Страница предмета на Wiki ↗</a></article>)}</div> : <p className="empty-state">По этому запросу улучшений нет.</p>}
    </section>
  </main>;
}
