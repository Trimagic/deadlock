import Link from "next/link";

const links = [
  { href: "/", label: "Предметы" },
  { href: "/heroes", label: "Герои" },
  { href: "/counters", label: "Что покупать против" },
  { href: "/upgrades", label: "Улучшения" },
];

export function SiteNav({ current }: { current: string }) {
  return <nav className="site-nav" aria-label="Разделы справочника">
    {links.map((link) => <Link key={link.href} href={link.href} aria-current={current === link.href || (link.href === "/heroes" && current.startsWith("/heroes/")) ? "page" : undefined}>{link.label}</Link>)}
  </nav>;
}

export function GuideHeader({ current }: { current: string }) {
  return <>
    <header className="masthead"><Link className="brand" href="/"><img className="brand-mark" src="/deadlock-mark.png" alt="" /><span><span className="brand-name">DEADLOCK</span><span className="brand-sub">ПОЛЕВОЙ СПРАВОЧНИК</span></span></Link><span className="edition">АРХИВ ПРЕДМЕТОВ <i /></span></header>
    <SiteNav current={current} />
  </>;
}
