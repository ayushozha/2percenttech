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

from PIL import Image, ImageChops, ImageFilter, ImageOps

ROOT = Path(__file__).parent.parent
LOGO_SRC = ROOT / "logos"
LOGO_OUT = ROOT / "public" / "logos"
MQ_OUT = LOGO_OUT / "mq"
PHOTO_SRC = ROOT / "photos"
PHOTO_OUT = ROOT / "public" / "photos"
TILES_OUT = ROOT / "lib" / "logo-assets.json"

RASTER = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".tif", ".tiff"}
VECTOR = {".svg"}
ALIASES = {"nvdia": "nvidia"}   # typo in the supplied filename

TILE_W, TILE_H = 460, 200       # 2x the rendered tile, contained
MQ_H = 120                      # 4x the tallest rendered marquee mark (30 CSS px)
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


def whiten(im, bg, tol=26):
    """Key the background out and repaint what's left flat white.

    For the dark marquee band. Every mark there is a white silhouette rather
    than brand colour, because twelve palettes on one black strip reads as
    noise instead of as a roster. The alpha is stretched from the difference
    against the sampled background so a near-background halo falls away
    instead of leaving a faint grey box around the mark.

    That ramp saturates hard and early on purpose. A gentle one leaves alpha
    tracking how far each brand colour happened to sit from its background, so
    Microsoft's four squares arrive at four different opacities and Circle's
    navy-on-pale-blue turns up grey. Ink is ink: past the tolerance it is
    fully opaque white, and only the antialiased rim stays partial.
    """
    solid = Image.new("RGB", im.size, bg)
    span = max(48 - tol, 1)
    alpha = (ImageChops.difference(im, solid).convert("L")
             .point(lambda v: 0 if v <= tol else min(255, (v - tol) * 255 // span))
             .filter(ImageFilter.GaussianBlur(0.6)))
    out = Image.new("RGBA", im.size, (255, 255, 255, 0))
    out.putalpha(alpha)
    return out


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
MQ_OUT.mkdir(parents=True, exist_ok=True)
for stale in (list(LOGO_OUT.glob("*.webp")) + list(LOGO_OUT.glob("*.svg"))
              + list(MQ_OUT.glob("*.webp")) + list(MQ_OUT.glob("*.svg"))):
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
        # any size and usually a fraction of the weight. The marquee gets the
        # same file and whitens it in CSS, which keeps it a vector all the way
        # down; that filter is a no-op on the white rasters below, so the
        # marquee can apply it to every mark without special-casing.
        out = LOGO_OUT / f"{cid}.svg"
        out.write_bytes(hit.read_bytes())
        (MQ_OUT / f"{cid}.svg").write_bytes(hit.read_bytes())
        assets[cid] = {"src": f"/logos/{cid}.svg", "tile": "#ffffff", "mq": f"/logos/mq/{cid}.svg"}
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

    # Marquee variant first, off the trimmed full-resolution mark — keying the
    # background out of an already-downscaled tile would fringe.
    mq = whiten(im, bg)
    mq.thumbnail((MQ_H * 8, MQ_H), Image.LANCZOS)
    mq_out = MQ_OUT / f"{cid}.webp"
    mq.save(mq_out, "WEBP", quality=90, method=6, lossless=False)

    im.thumbnail((TILE_W, TILE_H), Image.LANCZOS)

    out = LOGO_OUT / f"{cid}.webp"
    im.save(out, "WEBP", quality=90, method=6)
    assets[cid] = {"src": f"/logos/{cid}.webp", "tile": "#%02x%02x%02x" % bg,
                   "mq": f"/logos/mq/{cid}.webp"}
    print(f"  {cid:10s} {hit.name:18s} -> {out.stat().st_size/1024:6.1f} KB  "
          f"{im.width}x{im.height:<4d} tile {assets[cid]['tile']}  "
          f"mq {mq.width}x{mq.height}")

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
