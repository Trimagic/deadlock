import { readFileSync, writeFileSync } from "node:fs";

const read = (name) => JSON.parse(readFileSync(new URL(`../data/${name}`, import.meta.url), "utf8"));
const items = read("items.json");
const raw = read("wiki-items-raw.json");
const ru = read("wiki-ru-raw.json");
const clean = (value) => String(value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const result = items.map((item) => {
  const stats = Object.entries(raw[item.id]?.PropertyUpgrades ?? {}).flatMap(([key, rawValue]) => {
    const label = clean(ru[`${key}_label`] ?? ru[`${key}_postvalue_label`]);
    const value = typeof rawValue === "object" && rawValue !== null ? rawValue.Value : rawValue;
    if (!label || typeof value !== "number" && typeof value !== "string") return [];
    const text = String(value);
    if (!/^[+-]?\d+(?:\.\d+)?(?:m|s|%)?$/.test(text)) return [];
    const postfix = clean(ru[`${key}_postfix`]);
    const formatted = text.replace(/m$/, " м").replace(/s$/, " с");
    const unit = postfix && postfix.length < 10 && !/[мс%]$/.test(formatted) ? (postfix === "%" ? "%" : ` ${postfix}`) : "";
    return [{ label, value: `${Number.parseFloat(text) > 0 && !text.startsWith("+") ? "+" : ""}${formatted}${unit}` }];
  });
  return { id: item.id, name: item.name, nameRu: item.nameRu, category: item.category, tier: item.tier, cost: item.cost, icon: item.icon, source: item.source, stats };
}).filter((item) => item.stats.length);

writeFileSync(new URL("../data/item-upgrades.json", import.meta.url), JSON.stringify(result));
console.log(`Saved ${result.length} item upgrade records`);
