import type { Metadata } from "next";
import Link from "next/link";
import { GuideHeader } from "@/components/site-nav";

export const metadata: Metadata = {
  title: "Герои Deadlock — гайды и контрпики",
  description: "Подробные сборки, способности и противодействие героям Deadlock: Виндикта, Дрём и Виктор.",
};

export default function HeroesPage() {
  return <main className="app-shell guide-shell hero-index">
    <GuideHeader current="/heroes" />
    <section className="guide-intro"><span className="eyebrow">ГЕРОИ / СПРАВОЧНИК</span><h1>Герои <em>Deadlock</em></h1><p>Сборки и противодействие с объяснением, зачем нужен каждый предмет и когда менять план.</p></section>
    <Link href="/heroes/vindicta" className="hero-index-card"><div className="hero-index-art"><img src="/heroes/vindicta/portrait.png" alt="Виндикта" /></div><div className="hero-index-copy"><span className="eyebrow">01 / СНАЙПЕР · ПОЛЁТ</span><h2>Виндикта</h2><p>Полный разбор способностей, покупок по этапам матча и игры против неё.</p><span className="hero-index-cta">Открыть руководство ↗</span></div></Link>
    <Link href="/heroes/rem" className="hero-index-card rem-index-card"><div className="hero-index-art rem-index-art" aria-hidden="true"><span>☾</span><strong>REM</strong></div><div className="hero-index-copy"><span className="eyebrow">02 / ОРУЖИЕ · ЭКОНОМИКА</span><h2>Дрём</h2><p>Атакующая сборка: как превратить раннее преимущество по душам в урон и когда сохранить полезность для команды.</p><span className="hero-index-cta">Открыть руководство ↗</span></div></Link>
    <Link href="/heroes/victor" className="hero-index-card victor-index-card"><div className="hero-index-art victor-index-art"><img src="/heroes/victor/card.png" alt="Виктор" /></div><div className="hero-index-copy"><span className="eyebrow">03 / БРУЗЕР · ВТОРАЯ ЖИЗНЬ</span><h2>Виктор</h2><p>Как давить аурой и переживать затяжные бои; как остановить его лечение, выйти из ауры и разыграть реанимацию.</p><span className="hero-index-cta">Открыть руководство ↗</span></div></Link>
  </main>;
}
