"""Build the Russian item catalog from Deadlock Wiki's ItemData and Lang_ru exports."""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
assets = json.loads((ROOT / "data/item-icons.json").read_text(encoding="utf-8-sig"))
wiki = json.loads((ROOT / "data/wiki-items-raw.json").read_text(encoding="utf-8-sig"))
ru = json.loads((ROOT / "data/wiki-ru-raw.json").read_text(encoding="utf-8-sig"))
by_name = {value.get("Name"): (key, value) for key, value in wiki.items() if isinstance(value, dict)}

META = {"Name", "Description", "Cost", "Tier", "Activation", "Slot", "Components", "TargetTypes", "ShopFilters", "IsDisabled", "StreetBrawl", "IsImbue", "PropertyUpgrades", "CorruptedUpgrades"}
HIDDEN = {"AbilityUnitTargetLimit", "AbilityCooldownBetweenCharge", "ChannelMoveSpeed", "AbilityCastDelay", "AbilityPostCastDuration", "BuildUpPerShot", "BuildUpDuration", "DamageWindow", "DamageThreshold", "ProcChance", "TickRate"}
DEBUFF_WORDS = ("slow", "stun", "silence", "disarm", "bleed", "healingreduction", "healamp", "armorloss", "resistreduction", "grounddashreduction", "weaken", "debuff", "root", "resistshred", "vulnerability", "reduction")
INLINE_ATTRIBUTES = {
    "SpiritDamage": "спиритический урон", "BonusSpiritDamage": "бонус к спиритическому урону",
    "FireRate": "скорострельность", "Heal": "лечение", "WeaponDamage": "урон от оружия",
    "SpiritIcon": "спиритизм", "MoveSpeed": "скорость передвижения",
    "MeleeDamage": "урон ближнего боя", "BonusWeaponDamage": "бонус к урону от оружия",
    "BonusFireRate": "скорострельность", "BonusMoveSpeed": "скорость передвижения",
    "Spirit": "спиритизм", "SpiritResist": "сопротивляемость спиритизму",
    "Regen": "восстановление здоровья", "Stun": "оглушение",
    "SpiritDPS": "периодический спиритический урон", "BulletResist": "сопротивляемость пулям",
}

def resolve_description_tokens(value, source):
    value = str(value or "")
    def replace_number(match):
        number = source.get(match.group(1))
        if number is None:
            return ""
        if isinstance(number, (int, float)):
            return f"{number:g}"
        return str(number)
    value = re.sub(r"\{s:([^{}]+)\}", replace_number, value)
    value = re.sub(r"\{g:citadel_inline_attribute:'([^']+)'\}", lambda m: INLINE_ATTRIBUTES.get(m.group(1), m.group(1)), value)
    return value

def clean(value):
    value = str(value or "")
    value = re.sub(r"<[^>]+>", " ", value)
    value = re.sub(r"\{g:citadel_binding:'Reload'\}", "клавишу перезарядки", value)
    value = re.sub(r"\{[^{}]+\}", "", value)
    value = re.sub(r"\s+", " ", html.unescape(value)).strip()
    return re.sub(r"\s+([,.!?])", r"\1", value)

def description_parts(value):
    marked = re.sub(r'<span[^>]*class=["\']highlight["\'][^>]*>', '[[H]]', str(value or ""))
    marked = marked.replace("</span>", "[[/H]]")
    marked = re.sub(r"<[^>]+>", "", marked)
    marked = re.sub(r"\{g:citadel_binding:'Reload'\}", "клавишу перезарядки", marked)
    marked = re.sub(r"\{[^{}]+\}", "", marked)
    marked = re.sub(r"\s+", " ", html.unescape(marked)).strip()
    marked = re.sub(r"\s+([,.!?])", r"\1", marked)
    parts, highlighted = [], False
    for token in re.split(r"(\[\[/?H\]\])", marked):
        if token == "[[H]]":
            highlighted = True
        elif token == "[[/H]]":
            highlighted = False
        elif token:
            parts.append({"text": token, "highlight": highlighted})
    return parts

def condition_from(description):
    if not re.match(r"^(Если|Когда|Пока|При|После|Во время|Нанесение|Попадание)\b", description, re.I):
        return None
    clause = description.split(",", 1)[0].strip()
    return clause if len(clause) <= 130 else None

def format_value(value, postfix):
    if isinstance(value, dict):
        value = value.get("Value")
    if value is None or isinstance(value, bool) or value == -1:
        return None
    if isinstance(value, (int, float)):
        text = f"{value:g}"
    elif isinstance(value, str) and re.fullmatch(r"[+-]?\d+(?:\.\d+)?(?:m|s|%)?", value):
        text = value.replace("m", " м").replace("s", " с")
    else:
        return None
    postfix = clean(postfix)
    if postfix and len(postfix) < 10 and not text.endswith(("%", " м", " с")):
        text += postfix if postfix == "%" else " " + postfix
    return text

def make_stat(prop, value, group):
    label = clean(ru.get(f"{prop}_label") or ru.get(f"{prop}_postvalue_label"))
    number = format_value(value, ru.get(f"{prop}_postfix"))
    if not label or not re.search(r"[А-Яа-яЁё]", label) or len(label) > 55 or not number:
        return None
    kind = "debuff" if any(word in prop.lower() for word in DEBUFF_WORDS) else "buff"
    return {"label": label, "value": number, "kind": kind, "group": group}

items = []
for asset in assets:
    key, source = by_name[asset["name"]]
    # PropertyUpgrades describes a separate upgrade path, not the stats of the
    # purchased item. Keep it in the raw export, not in the shop catalog.
    effects = [
        stat for prop, value in source.items()
        if prop not in META | HIDDEN
        and (stat := make_stat(prop, value, "effect"))
    ]
    for stat in effects:
        if source.get("Activation") == "Passive" and source.get("AbilityCooldown") == 1 and stat["label"] == "Перезарядка" and stat["value"] == "1 с.":
            stat["label"] = "Перезарядка пассивного эффекта"
    raw_description = resolve_description_tokens(ru.get(f"{key}_desc") or source.get("Description"), source)
    description = clean(raw_description)
    if not re.search(r"[А-Яа-яЁё]", description):
        description = ""
    if not description:
        description = "Основные свойства: " + ", ".join(stat["label"].lower() for stat in effects[:4]) + "." if effects else "Описание пока отсутствует в данных Deadlock Wiki."
        parts = [{"text": description, "highlight": False}]
    else:
        parts = description_parts(raw_description)
    items.append({
        "id": key,
        "name": asset["name"],
        "nameRu": asset["name_ru"] or asset["name"],
        "availability": asset["availability"],
        "category": asset["category"],
        "tier": asset["tier"],
        "cost": source.get("Cost") or 800 * 2 ** (asset["tier"] - 1),
        "activation": "active" if source.get("Activation") not in (None, "Passive") else "passive",
        "icon": "/" + asset["file"].replace("assets/items/", "items/"),
        "description": description,
        "descriptionParts": parts,
        "condition": condition_from(description),
        "effects": effects,
        "source": asset["source"],
    })

target = ROOT / "data/items.json"
target.write_text(json.dumps(items, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print(f"Saved {len(items)} wiki items to {target}")
print(f"Stats: {sum(len(x['effects']) for x in items)} effects")
