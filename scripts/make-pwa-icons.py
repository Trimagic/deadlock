from pathlib import Path
from PIL import Image, ImageDraw

out = Path(__file__).resolve().parents[1] / "public"
for size in (192, 512):
    image = Image.new("RGB", (size, size), "#101112")
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=size // 5, fill="#101112")
    draw.polygon([(size//2, size//9), (size*8//9, size//2), (size//2, size*8//9), (size//9, size//2)], outline="#d3a66c", width=max(3, size//32))
    draw.polygon([(size//2, size//5), (size*3//5, size*2//5), (size*4//5, size//2), (size*3//5, size*3//5), (size//2, size*4//5), (size*2//5, size*3//5), (size//5, size//2), (size*2//5, size*2//5)], fill="#d3a66c")
    draw.ellipse((size*46//100, size*46//100, size*54//100, size*54//100), fill="#101112")
    image.save(out / f"pwa-{size}.png")
