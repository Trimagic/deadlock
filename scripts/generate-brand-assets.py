"""Create app icons and a social card from the Deadlock Wiki logo."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
LOGO = Image.open(PUBLIC / "deadlock-logo.png").convert("RGBA")
BACKGROUND = "#101112"
CREAM = "#fff0d6"
GOLD = "#cda468"
MARK = LOGO.crop((0, 0, 300, 300))
MARK.save(PUBLIC / "deadlock-mark.png", optimize=True)


def app_icon(size: int) -> None:
    canvas = Image.new("RGB", (size, size), BACKGROUND)
    # The source logo is 625×324; its round mark occupies the left 300 pixels.
    mark = MARK.copy()
    mark.thumbnail((round(size * 0.74), round(size * 0.74)), Image.Resampling.LANCZOS)
    canvas.paste(mark, ((size - mark.width) // 2, (size - mark.height) // 2), mark)
    canvas.save(PUBLIC / f"pwa-{size}.png", optimize=True)


for dimension in (192, 512):
    app_icon(dimension)

card = Image.new("RGB", (1200, 630), BACKGROUND)
draw = ImageDraw.Draw(card)
draw.rectangle((42, 42, 1157, 587), outline="#4b4033", width=2)
draw.line((82, 82, 1118, 82), fill=GOLD, width=3)

wordmark = LOGO.copy()
wordmark.thumbnail((1000, 390), Image.Resampling.LANCZOS)
card.paste(wordmark, ((1200 - wordmark.width) // 2, 190), wordmark)

font_path = Path("C:/Windows/Fonts/arial.ttf")
font = ImageFont.truetype(str(font_path), 34)
label = "ПРЕДМЕТЫ  ·  КОНТРПИКИ  ·  УЛУЧШЕНИЯ"
bounds = draw.textbbox((0, 0), label, font=font)
draw.text(((1200 - (bounds[2] - bounds[0])) // 2, 441), label, font=font, fill=CREAM)
draw.line((82, 546, 1118, 546), fill=GOLD, width=3)
card.save(PUBLIC / "social-preview.png", optimize=True)
