#!/usr/bin/env python3
"""Generate the static assets the Next.js app serves:

    public/fonts/{anton,plex400,plex600,zcool}.woff2   subset fonts
    public/logos/<id>.webp                              trimmed, downscaled marks
    lib/logo-tiles.json                                 per-logo tile background

Rerun after copy changes (the ZCOOL subset only carries the CJK glyphs the
site actually uses) or after adding a logo. Requires fonttools, brotli, Pillow.
"""
import html as htmlmod, io, json, re
from pathlib import Path
from fontTools.subset import Subsetter, Options
from fontTools.ttLib import TTFont
from PIL import Image, ImageChops

ROOT = Path(__file__).parent.parent
FONT_OUT = ROOT / "public" / "fonts"
LOGO_OUT = ROOT / "public" / "logos"
LOGO_SRC = ROOT / "logos"
TILES_OUT = ROOT / "lib" / "logo-tiles.json"

RASTER = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".tif", ".tiff"}
ALIASES = {"nvdia": "nvidia"}          # typo in the supplied filename
TILE_W, TILE_H = 460, 200              # 2x the rendered tile, contained


# ---- glyph collection ----------------------------------------------------
# CJK glyphs come from every place site copy lives: the React sources and the
# prospectus source. Latin faces get the full printable-ASCII set so English
# copy edits never need a regeneration.

def site_text():
    text = []
    for pattern in ("app/**/*.tsx", "app/**/*.ts", "components/**/*.tsx", "lib/**/*.ts"):
        for p in ROOT.glob(pattern):
            text.append(p.read_text(encoding="utf-8"))
    sponsor = (ROOT / "sponsor.html").read_text(encoding="utf-8")
    body = re.sub(r"<style.*?</style>", " ", sponsor, flags=re.S)
    text.append(htmlmod.unescape(re.sub(r"<[^>]+>", " ", body)))
    return "".join(text)


def subset(src, keep, out):
    font = TTFont(str(src))
    opts = Options()
    opts.flavor = "woff2"
    opts.desubroutinize = True
    opts.layout_features = ["kern", "liga", "calt", "ccmp", "locl"]
    opts.notdef_outline = True
    opts.drop_tables += ["DSIG"]
    s = Subsetter(options=opts)
    s.populate(text="".join(sorted(keep)))
    s.subset(font)
    font.flavor = "woff2"
    font.save(str(out))
    print(f"  {out.name:14s} {src.stat().st_size/1024:9.1f} KB -> {out.stat().st_size/1024:7.1f} KB  ({len(keep)} glyphs)")


# ---- logos ---------------------------------------------------------------

def norm(s):
    return re.sub(r"[^a-z0-9]", "", s.lower())

def bg_of(im):
    """Most common colour around the border — the background these were cut from."""
    w, h = im.size
    edge = [im.getpixel(p) for p in
            [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
             (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]]
    return max(set(edge), key=edge.count)

def trim(im, bg, tol=18):
    solid = Image.new("RGB", im.size, bg)
    diff = ImageChops.difference(im, solid).convert("L").point(lambda v: 255 if v > tol else 0)
    box = diff.getbbox()
    if not box:
        return im
    pad = 4
    return im.crop((max(box[0] - pad, 0), max(box[1] - pad, 0),
                    min(box[2] + pad, im.width), min(box[3] + pad, im.height)))


# ---- run -----------------------------------------------------------------

text = site_text()
chars = set(text)
chars |= set("+-–—·✓×%$/()[].,:;!?'\"@#&0123456789→←")
chars = {c for c in chars if c.isprintable() and not c.isspace()}

latin = {chr(c) for c in range(0x20, 0x7F)} | {c for c in chars if 0x7F <= ord(c) < 0x2500}
cjk = {c for c in chars if ord(c) >= 0x2E80}

FONT_OUT.mkdir(parents=True, exist_ok=True)
print("fonts:")
for src, keep, out in [
    ("Anton.ttf",   latin,        "anton.woff2"),
    ("Plex400.ttf", latin,        "plex400.woff2"),
    ("Plex600.ttf", latin,        "plex600.woff2"),
    ("ZCOOL.ttf",   cjk | latin,  "zcool.woff2"),
]:
    subset(ROOT / src, keep, FONT_OUT / out)

ids = dict(re.findall(r"id: '([^']+)', name: '([^']+)'", (ROOT / "lib" / "data.ts").read_text(encoding="utf-8")))

index = {}
for p in sorted(LOGO_SRC.iterdir()):
    if p.suffix.lower() in RASTER:
        key = norm(p.stem)
        index.setdefault(ALIASES.get(key, key), p)

LOGO_OUT.mkdir(parents=True, exist_ok=True)
tiles, missing = {}, []
print("logos:")
for cid, name in ids.items():
    hit = index.get(norm(cid)) or index.get(norm(name)) \
        or next((p for k, p in index.items() if k.startswith(norm(cid))), None)
    if not hit:
        missing.append(cid)
        continue
    im = Image.open(hit).convert("RGB")
    bg = bg_of(im)
    im = trim(im, bg)
    im.thumbnail((TILE_W, TILE_H), Image.LANCZOS)
    out = LOGO_OUT / f"{cid}.webp"
    im.save(out, "WEBP", quality=90, method=6)
    tiles[cid] = "#%02x%02x%02x" % bg
    print(f"  {cid:10s} {hit.name:16s} -> {out.stat().st_size/1024:5.1f} KB  {im.width}x{im.height:<4d} tile {tiles[cid]}")

if missing:
    print("  pending: " + ", ".join(missing))

TILES_OUT.write_text(json.dumps(tiles, indent=2) + "\n", encoding="utf-8")
print(f"wrote {TILES_OUT.relative_to(ROOT)}")
