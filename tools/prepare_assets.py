#!/usr/bin/env python3
"""Generate the static assets the Next.js app serves.

    logos/*            -> public/logos/<id>.{webp,svg}   trimmed, downscaled marks
                       -> lib/logo-assets.json           src + tile colour per id
    photos/*.jpg       -> public/photos/NN.webp          cropped and downscaled

Rerun after adding a logo or a photo:

    npm run prepare-assets

Requires Pillow (`pip3 install pillow`).

Fonts are NOT handled here any more. The old build.py subset four TTFs and
inlined them as data URIs; next/font/google now downloads and self-hosts
Figtree, Instrument Serif, IBM Plex Mono and the two Noto SC faces at build
time, which gets the same "no external request at runtime" property without
a font pipeline of our own.
"""
import json
import re
from pathlib import Path

from PIL import Image, ImageChops, ImageOps

ROOT = Path(__file__).parent.parent
LOGO_SRC = ROOT / "logos"
LOGO_OUT = ROOT / "public" / "logos"
PHOTO_SRC = ROOT / "photos"
PHOTO_OUT = ROOT / "public" / "photos"
TILES_OUT = ROOT / "lib" / "logo-assets.json"

RASTER = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".tif", ".tiff"}
VECTOR = {".svg"}
ALIASES = {"nvdia": "nvidia"}   # typo in the supplied filename

TILE_W, TILE_H = 460, 200       # 2x the rendered tile, contained
# Sized for the lightbox rather than the thumbnail — the grid caps out around
# 240 CSS px, but a photo opened full-screen is what people actually look at.
PHOTO_W, PHOTO_H, PHOTO_Q = 1200, 900, 72


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


# ---- logos ---------------------------------------------------------------
# Ids come from lib/data.ts. Filenames are matched loosely against the id and
# the display name (case, spaces and punctuation ignored), so "mistral AI.png"
# and "Openai.png" both land correctly; ALIASES covers outright misspellings.

data_ts = (ROOT / "lib" / "data.ts").read_text(encoding="utf-8")
ids = dict(re.findall(r"id: '([^']+)',\s*\n?\s*name: '([^']+)'", data_ts))
if not ids:
    raise SystemExit("no company ids found in lib/data.ts — did the COMPANIES shape change?")

index = {}
# Vectors first, so an .svg wins over a .png of the same company.
for p in sorted(LOGO_SRC.iterdir(), key=lambda q: (q.suffix.lower() not in VECTOR, q.name)):
    if p.suffix.lower() in RASTER | VECTOR:
        key = norm(p.stem)
        index.setdefault(ALIASES.get(key, key), p)

LOGO_OUT.mkdir(parents=True, exist_ok=True)
for stale in list(LOGO_OUT.glob("*.webp")) + list(LOGO_OUT.glob("*.svg")):
    stale.unlink()

# id -> {"src": public path, "tile": background colour}. The page reads this
# manifest rather than guessing an extension, since vectors stay .svg and
# rasters become .webp.
assets, missing = {}, []
print("logos:")
for cid, name in ids.items():
    hit = (index.get(norm(cid)) or index.get(norm(name))
           or next((p for k, p in index.items() if k.startswith(norm(cid))), None))
    if not hit:
        missing.append(cid)
        continue

    if hit.suffix.lower() in VECTOR:
        # Vectors are copied untouched — no trimming, no downscaling, sharp at
        # any size and usually a fraction of the weight.
        out = LOGO_OUT / f"{cid}.svg"
        out.write_bytes(hit.read_bytes())
        assets[cid] = {"src": f"/logos/{cid}.svg", "tile": "#ffffff"}
        print(f"  {cid:10s} {hit.name:18s} -> {out.stat().st_size/1024:6.1f} KB  vector      tile #ffffff")
        continue

    im = Image.open(hit)
    if im.mode in ("RGBA", "LA", "P"):
        # Dropping alpha with a plain convert() leaves whatever RGB sat under
        # the transparent pixels, usually black. Composite onto white — that
        # is what the tile sits on.
        im = im.convert("RGBA")
        im = Image.alpha_composite(Image.new("RGBA", im.size, "white"), im)
    im = im.convert("RGB")

    bg = bg_of(im)
    im = trim(im, bg)
    im.thumbnail((TILE_W, TILE_H), Image.LANCZOS)

    out = LOGO_OUT / f"{cid}.webp"
    im.save(out, "WEBP", quality=90, method=6)
    assets[cid] = {"src": f"/logos/{cid}.webp", "tile": "#%02x%02x%02x" % bg}
    print(f"  {cid:10s} {hit.name:18s} -> {out.stat().st_size/1024:6.1f} KB  "
          f"{im.width}x{im.height:<4d} tile {assets[cid]['tile']}")

if missing:
    print("  pending: " + ", ".join(missing))

TILES_OUT.write_text(json.dumps(assets, indent=2, sort_keys=True) + "\n", encoding="utf-8")
print(f"wrote {TILES_OUT.relative_to(ROOT)}")


# ---- photos --------------------------------------------------------------
# Files in ./photos, in filename order, renumbered 01..NN. These dominate the
# page weight, so keep the count deliberate.

PHOTO_OUT.mkdir(parents=True, exist_ok=True)
for stale in PHOTO_OUT.glob("*.webp"):
    stale.unlink()

print("photos:")
total = 0
for i, ph in enumerate(sorted(p for p in PHOTO_SRC.iterdir() if p.suffix.lower() in RASTER), start=1):
    im = ImageOps.exif_transpose(Image.open(ph)).convert("RGB")
    im = ImageOps.fit(im, (PHOTO_W, PHOTO_H), Image.LANCZOS)
    out = PHOTO_OUT / f"{i:02d}.webp"
    im.save(out, "WEBP", quality=PHOTO_Q, method=6)
    total += out.stat().st_size
    print(f"  {ph.name:10s} {ph.stat().st_size/1024:8.1f} -> {out.stat().st_size/1024:6.1f} KB  {out.name}")
print(f"  {total/1024:.0f} KB of photo data in public/photos")
