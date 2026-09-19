#!/usr/bin/env python3
"""
Convert key images to WebP and AVIF at multiple widths and place them under assets/images/optimized/
Run from repository root.
"""
import os
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMG_DIR = ROOT / 'assets' / 'images'
OUT_DIR = IMG_DIR / 'optimized'
OUT_DIR.mkdir(parents=True, exist_ok=True)

# target patterns — expand as needed
patterns = [
    'p*.jpeg',
    'project-*.jpeg',
    'service-*.jpeg',
    'service-*.png',
    'planthire.png',
    'mining.png',
    'logo.png'
]
# widths to generate
widths = [480, 800, 1200]

created = []
errors = []

for pattern in patterns:
    for src in IMG_DIR.glob(pattern):
        try:
            img = Image.open(src)
            img.load()
            src_name = src.stem  # without suffix
            orig_w, orig_h = img.size
            for w in widths:
                if w > orig_w:
                    continue
                h = int((w / orig_w) * orig_h)
                resized = img.resize((w, h), Image.LANCZOS)

                # webp
                out_webp = OUT_DIR / f"{src_name}-w{w}.webp"
                resized.save(out_webp, 'WEBP', quality=78, method=6)
                created.append(out_webp.relative_to(ROOT))

                # avif — fallback if not supported will raise
                try:
                    out_avif = OUT_DIR / f"{src_name}-w{w}.avif"
                    resized.save(out_avif, 'AVIF', quality=55)
                    created.append(out_avif.relative_to(ROOT))
                except Exception as e:
                    errors.append((src, str(e)))

            # also create a full-size webp fallback if not already
            if orig_w not in widths:
                out_webp = OUT_DIR / f"{src_name}-w{orig_w}.webp"
                img.save(out_webp, 'WEBP', quality=78, method=6)
                created.append(out_webp.relative_to(ROOT))
        except Exception as e:
            errors.append((src, str(e)))

print('Created %d files' % len(created))
for p in created:
    print('  ', p)

if errors:
    print('\nErrors:')
    for src, err in errors:
        print('  ', src, '->', err)
