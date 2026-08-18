#!/usr/bin/env python3
"""Verify that every local src/href in the site resolves to a real file.

Run from anywhere; paths resolve relative to the repository root.
Exits 1 if any local reference is broken.

This exists because `../photos/dp.jpeg` was referenced on all four blog pages
while the file on disk was `dp.png` — five broken images that shipped unnoticed.
"""

import re
import sys
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[2]

REF = re.compile(r'(?:src|href)="([^"]+)"')
SKIP_PREFIXES = ("http://", "https://", "//", "mailto:", "tel:", "data:", "#")


def resolve(page, ref):
    """Map a reference to the path it should point at on disk."""
    clean = unquote(ref.split("#", 1)[0].split("?", 1)[0])
    if ref.startswith("/"):
        target = ROOT / clean.lstrip("/")
    else:
        target = page.parent / clean
    # A directory reference is served as its index.html.
    if target.is_dir():
        target = target / "index.html"
    return target


def show(path):
    try:
        return path.resolve().relative_to(ROOT).as_posix()
    except ValueError:
        return str(path)


def main():
    pages = sorted(p for p in ROOT.rglob("*.html") if ".git" not in p.parts)
    if not pages:
        print("No HTML files found — is this the repository root?")
        return 1

    broken = []
    checked = 0

    for page in pages:
        html = page.read_text(encoding="utf-8")
        for ref in REF.findall(html):
            if not ref.strip() or ref.startswith(SKIP_PREFIXES):
                continue
            checked += 1
            target = resolve(page, ref)
            if not target.exists():
                broken.append((page, ref, target))

    for page, ref, target in broken:
        print(
            "::error file={}::broken local reference '{}' -> {} not found".format(
                show(page), ref, show(target)
            )
        )

    print("\nChecked {} local reference(s) across {} page(s).".format(checked, len(pages)))
    if broken:
        print("FAILED: {} broken reference(s).".format(len(broken)))
        return 1
    print("All local references resolve.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
