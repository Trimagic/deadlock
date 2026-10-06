"use client";
import { useEffect, useMemo, useState } from "react";
import { Search, X, SlidersHorizontal, ExternalLink, ChevronRight, Zap, Clock3, ShieldAlert, Activity } from "lucide-react";
import itemData from "@/data/items.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Drawer, DrawerContent, DrawerClose, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { SiteNav } from "@/components/site-nav";

type Item = (typeof itemData)[number];
type Category = "all" | "weapon" | "vitality" | "spirit" | "brawl";
const categories: { id: Category; label: string; icon: string }[] = [
  { id: "all", label: "Все", icon: "/items/Active_Reload.png" },
  { id: "weapon", label: "Оружие", icon: "/items/Berserker.png" },
  { id: "vitality", label: "Живучесть", icon: "/items/Healing_Rite.png" },
  { id: "spirit", label: "Спиритизм", icon: "/items/Boundless_Spirit.png" },
  { id: "brawl", label: "Уличная драка", icon: "/items/Celestial_Blessing.png" },
];
const names: Record<string, string> = { weapon: "Оружие", vitality: "Живучесть", spirit: "Спиритизм" };
const tiers = [0, 800, 1600, 3200, 6400];

export default function Home() {
  const [category, setCategory] = useState<Category>("all");
  const [tier, setTier] = useState(0);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Item | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<(Event & { prompt: () => Promise<void> }) | null>(null);
  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
    const listener = (event: Event) => { event.preventDefault(); setInstallPrompt(event as Event & { prompt: () => Promise<void> }); };
    window.addEventListener("beforeinstallprompt", listener);
    return () => window.removeEventListener("beforeinstallprompt", listener);
  }, []);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 740px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const filtered = useMemo(() => itemData.filter((item) => {
    if (category === "brawl" ? item.availability !== "street_brawl" : item.availability !== "standard" || (category !== "all" && item.category !== category)) return false;
    if (tier && item.cost !== tier) return false;
    const search = query.trim().toLocaleLowerCase("ru");
    return !search || `${item.nameRu} ${item.name} ${item.description} ${item.effects.map((effect) => effect.label).join(" ")} ${item.condition ?? ""}`.toLocaleLowerCase("ru").includes(search);
  }).sort((a, b) => a.cost - b.cost || a.nameRu.localeCompare(b.nameRu, "ru")), [category, tier, query]);
  const count = (id: Category) => id === "brawl" ? itemData.filter((item) => item.availability === "street_brawl").length : itemData.filter((item) => item.availability === "standard" && (id === "all" || item.category === id)).length;

  return <main className="app-shell">
    <header className="masthead"><div className="brand"><img className="brand-mark" src="/deadlock-mark.png" alt="" /><div><span className="brand-name">DEADLOCK</span><span className="brand-sub">ПОЛЕВОЙ СПРАВОЧНИК</span></div></div><div className="header-actions"><span className="edition">АРХИВ ПРЕДМЕТОВ <i /></span>{installPrompt && <Button className="install-button" onClick={() => installPrompt.prompt()}>Установить</Button>}</div></header>
    <SiteNav current="/" />
    <section className="intro"><div className="intro-kicker"><span /> КАТАЛОГ СНАРЯЖЕНИЯ <span /></div><h1>Выбери своё <em>преимущество.</em></h1><p>Предметы обычного магазина Deadlock. Снаряжение «Уличной драки» вынесено в отдельную вкладку.</p><div className="intro-stat"><strong>{count("all")}</strong><span>ПРЕДМЕТОВ<br />ОБЫЧНОГО МАГАЗИНА</span><span className="stat-divider" /><strong>03</strong><span>ОСНОВНЫЕ<br />КАТЕГОРИИ</span></div></section>
    <section className="catalog" aria-label="Каталог предметов"><div className="section-heading"><div><span className="eyebrow">01 / АРСЕНАЛ</span><h2>Предметы</h2></div><span className="result-count">НАЙДЕНО: {filtered.length}</span></div>
      <ToggleGroup className="category-nav" aria-label="Категории предметов" value={[category]} onValueChange={(values) => { if (values[0]) { setCategory(values[0] as Category); setTier(0); } }}>{categories.map((entry) => <ToggleGroupItem key={entry.id} value={entry.id} className={`category-tab ${entry.id}`}><img src={entry.icon} alt="" /><span>{entry.label}</span><small>{count(entry.id)}</small></ToggleGroupItem>)}</ToggleGroup>
      <div className="toolbar"><label className="search"><Search size={18} aria-hidden="true" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Название или эффект..." aria-label="Поиск предметов" />{query && <Button variant="ghost" size="icon-xs" aria-label="Очистить поиск" onClick={() => setQuery("")}><X size={17} /></Button>}</label><div className="filter-label"><SlidersHorizontal size={15} /> ЦЕНА</div></div>
      <ToggleGroup className="tier-list" aria-label="Фильтр по стоимости" value={[String(tier)]} onValueChange={(values) => { if (values[0]) setTier(Number(values[0])); }}>{(category === "brawl" ? [0, 9999] : tiers).map((value) => <ToggleGroupItem key={value} value={String(value)}>{value === 0 ? "Любая" : value.toLocaleString("ru-RU")}</ToggleGroupItem>)}</ToggleGroup>
      {filtered.length ? <div className="item-grid">{filtered.map((item) => <button key={item.id} className={`item-card ${item.category}`} onClick={() => { setSelected(item); setDrawerOpen(true); }}><div className="card-top"><span className="item-type">{item.availability === "street_brawl" ? "Уличная драка" : names[item.category]}</span><span className="item-price">◈ {item.cost.toLocaleString("ru-RU")}</span></div><div className="card-main"><div className="item-icon"><img src={item.icon} alt="" loading="lazy" /></div><div className="item-titles"><h3>{item.nameRu}</h3><span>{item.name}</span></div></div><div className="card-bottom"><span>{item.activation === "active" ? "АКТИВНЫЙ" : "ПАССИВНЫЙ"} · УР. {item.tier}</span><ChevronRight size={17} /></div></button>)}</div> : <div className="empty-state"><span>✦</span><h3>Ничего не найдено</h3><p>Попробуй другое название или убери фильтр стоимости.</p><Button variant="outline" onClick={() => { setQuery(""); setTier(0); setCategory("all"); }}>Сбросить фильтры</Button></div>}
    </section><footer><span>✦ DEADLOCK / ПОЛЕВОЙ СПРАВОЧНИК</span><span>Данные: <a href="https://deadlock.wiki/Items" target="_blank" rel="noreferrer">Deadlock Wiki ↗</a></span></footer>
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} swipeDirection={isMobile ? "down" : "right"} showSwipeHandle={isMobile}>
      {selected && <DrawerContent className={`detail-sheet ${selected.category}`}>
        <DrawerClose className="close-sheet" aria-label="Закрыть"><X size={20} /></DrawerClose>
        <div className="detail-scroll">
          <DrawerHeader className="detail-header">
            <div className="detail-hero"><div className="detail-icon"><img src={selected.icon} alt="" /></div><div><span className="detail-category">{selected.availability === "street_brawl" ? "Уличная драка" : names[selected.category]} / УРОВЕНЬ {selected.tier}</span><DrawerTitle className="detail-title">{selected.nameRu}</DrawerTitle><span className="detail-original">{selected.name}</span></div></div>
            <DrawerDescription className="sr-only">{selected.description}</DrawerDescription>
          </DrawerHeader>
          <div className="detail-meta"><span>◈ {selected.cost.toLocaleString("ru-RU")}</span><span className="activation-label">{selected.activation === "active" ? <><Zap size={15} /> ПО ПРИМЕНЕНИЮ</> : <><Activity size={15} /> ПАССИВНО</>}</span></div>
          <div className="detail-content">
            <div className="detail-section-title">{selected.activation === "active" ? <Zap size={16} /> : <Activity size={16} />}<h3>КАК РАБОТАЕТ</h3></div>
            <p className="rich-description">{selected.descriptionParts.map((part, index) => part.highlight ? <strong key={index}>{part.text}</strong> : <span key={index}>{part.text}</span>)}</p>
            {selected.condition && <div className="condition-note"><ShieldAlert size={19} /><div><span>УСЛОВИЕ СРАБАТЫВАНИЯ</span><strong>{selected.condition}</strong></div></div>}
            {selected.effects.length > 0 && <><div className="detail-section-title"><Clock3 size={16} /><h3>ПАРАМЕТРЫ ЭФФЕКТА</h3></div><div className="effects">{selected.effects.map((effect, index) => <div key={`${effect.label}-${index}`}><span>{effect.label}</span><strong className={effect.kind === "debuff" ? "negative" : ""}>{effect.value}</strong></div>)}</div></>}
            <a className="source-link" href={selected.source} target="_blank" rel="noreferrer">Полное описание на Deadlock Wiki <ExternalLink size={15} /></a>
          </div>
        </div>
      </DrawerContent>}
    </Drawer>
  </main>;
}


