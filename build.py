#!/usr/bin/env python3
"""Subset the four faces to only the glyphs each page uses, bake ./logos,
and inline everything as data URIs. Builds two pages:

    sponsor.html -> sponsor.built.html   (sponsorship prospectus)
    home.html    -> index.html           (site homepage)
"""
import base64, html as htmlmod, io, json, re, sys
from pathlib import Path
from fontTools.subset import Subsetter, Options
from fontTools.ttLib import TTFont
from PIL import Image, ImageChops

HERE = Path(__file__).parent
PAGES = [("sponsor.html", "sponsor.built.html"), ("home.html", "index.html")]

LOGO_DIR = HERE / "logos"
RASTER = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".tif", ".tiff"}
ALIASES = {"nvdia": "nvidia"}          # typo in the supplied filename
TILE_W, TILE_H = 460, 200              # 2x the rendered tile, contained


# ---- fonts ---------------------------------------------------------------

def subset(path, keep, name):
    font = TTFont(str(path))
    opts = Options()
    opts.flavor = "woff2"
    opts.desubroutinize = True
    opts.layout_features = ["kern", "liga", "calt", "ccmp", "locl"]
    opts.notdef_outline = True
    opts.drop_tables += ["DSIG"]
    s = Subsetter(options=opts)
    s.populate(text="".join(sorted(keep)))
    s.subset(font)
    buf = io.BytesIO()
    font.flavor = "woff2"
    font.save(buf)
    raw = buf.getvalue()
    print(f"  {name:10s} {path.stat().st_size/1024:9.1f} KB -> {len(raw)/1024:7.1f} KB  ({len(keep)} glyphs)")
    return "data:font/woff2;base64," + base64.b64encode(raw).decode("ascii")


# ---- logos ---------------------------------------------------------------
# Drop files into ./logos. Filenames are matched loosely against the company
# id and name (case, spaces and punctuation are ignored), so "mistral AI.png"
# and "Openai.png" both land correctly. ALIASES covers outright misspellings.
#
# Sources are usually screenshots with an opaque background rather than clean
# transparent marks, so each image is trimmed to its content, its background
# colour is sampled and handed to the page as the tile colour, and the result
# is downscaled to what the ~180px tile actually needs.

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

def encode(im):
    """Smallest of WebP / PNG, since flat marks and gradients favour different codecs."""
    out = []
    for fmt, kw in (("WEBP", {"quality": 90, "method": 6}), ("PNG", {"optimize": True})):
        buf = io.BytesIO()
        im.save(buf, fmt, **kw)
        out.append((len(buf.getvalue()), fmt.lower(), buf.getvalue()))
    n, fmt, data = min(out)
    return f"data:image/{fmt};base64," + base64.b64encode(data).decode("ascii"), n, fmt

def logo_index():
    index = {}
    if LOGO_DIR.is_dir():
        for p in sorted(LOGO_DIR.iterdir()):
            if p.suffix.lower() in RASTER:
                key = norm(p.stem)
                index.setdefault(ALIASES.get(key, key), p)
    return index


# ---- page build ----------------------------------------------------------

def build(src, out, index):
    html = src.read_text(encoding="utf-8")
    print(f"\n== {src.name} -> {out.name} ==")

    # Strip only <style> — <script> must stay, because pages render copy
    # from JS string literals. Dropping it here silently subsets those
    # glyphs away and the text falls back to a system font.
    body = re.sub(r"<style.*?</style>", " ", html, flags=re.S)
    text = htmlmod.unescape(re.sub(r"<[^>]+>", " ", body))

    chars = set(text)
    chars |= set("+-–—·✓×%$/()[].,:;!?'\"@#&0123456789→←")
    chars |= set("abcdefghijklmnopqrstuvwxyz")
    chars |= set("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    chars = {c for c in chars if c.isprintable() and not c.isspace()}

    latin = {c for c in chars if ord(c) < 0x2500}
    cjk = {c for c in chars if ord(c) >= 0x2E80}

    print("subsetting:")
    # Source HTML references local TTFs so it works unbuilt. Replace each
    # with a quoted subset WOFF2 data URI for the single-file deploy build.
    font_faces = [
        ("Anton.ttf",   latin,        "Anton"),
        ("Plex400.ttf", latin,        "Plex 400"),
        ("Plex600.ttf", latin,        "Plex 600"),
        ("ZCOOL.ttf",   cjk | latin,  "ZCOOL"),
    ]
    for filename, keep, name in font_faces:
        uri = subset(HERE / filename, keep, name)
        needle = f'url("{filename}") format("truetype")'
        if needle not in html:
            sys.exit(f"font src {needle} not found in {src.name}")
        html = html.replace(needle, f'url("{uri}") format("woff2")', 1)

    names = dict(re.findall(r'\{id:"([^"]+)",name:"([^"]+)"', html))
    ids = list(names)

    baked, tiles, missing = {}, {}, []
    print("logos:")
    for cid in ids:
        hit = index.get(norm(cid)) or index.get(norm(names[cid]))
        if not hit:                                    # last resort: prefix match
            hit = next((p for k, p in index.items() if k.startswith(norm(cid))), None)
        if not hit:
            missing.append(cid)
            continue

        im = Image.open(hit).convert("RGB")
        before = hit.stat().st_size
        bg = bg_of(im)
        im = trim(im, bg)
        im.thumbnail((TILE_W, TILE_H), Image.LANCZOS)
        uri, size, fmt = encode(im)

        baked[cid] = uri
        tiles[cid] = "#%02x%02x%02x" % bg
        print(f"  {cid:10s} {hit.name:16s} {before/1024:7.1f} -> {size/1024:5.1f} KB "
              f"{fmt:4s} {im.width}x{im.height:<4d} tile {tiles[cid]}")

    if missing:
        print("  pending: " + ", ".join(missing))
    print(f"  {sum(len(v) for v in baked.values())/1024:.0f} KB of logo data inlined")

    html = html.replace("/*__BAKED__*/{}", json.dumps(baked))
    html = html.replace("/*__TILES__*/{}", json.dumps(tiles))

    out.write_text(html, encoding="utf-8")
    print(f"wrote {out.name}  {out.stat().st_size/1024:.0f} KB total"
          f"  ({len(baked)}/{len(ids)} logos)")


index = logo_index()
for src, out in PAGES:
    build(HERE / src, HERE / out, index)
