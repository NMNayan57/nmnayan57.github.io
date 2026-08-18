#!/usr/bin/env python3
"""Verify that every application/ld+json block on the site is valid JSON.

Run from anywhere; paths resolve relative to the repository root.
Exits 1 if any block fails to parse.

Structured data fails silently in browsers: an unescaped quote or a trailing
comma means Google simply ignores the entity markup, with no visible symptom.
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

BLOCK = re.compile(r'<script type="application/ld\+json">(.*?)</script>', re.S)


def main():
    pages = sorted(p for p in ROOT.rglob("*.html") if ".git" not in p.parts)
    failures = 0
    total = 0

    for page in pages:
        rel = page.relative_to(ROOT).as_posix()
        blocks = BLOCK.findall(page.read_text(encoding="utf-8"))
        for i, raw in enumerate(blocks, start=1):
            total += 1
            try:
                data = json.loads(raw)
            except json.JSONDecodeError as exc:
                print("::error file={}::JSON-LD block {} is invalid: {}".format(rel, i, exc))
                failures += 1
                continue
            if isinstance(data, dict) and "@context" not in data:
                print("::error file={}::JSON-LD block {} has no @context".format(rel, i))
                failures += 1
        if blocks:
            print("{}: {} JSON-LD block(s)".format(rel, len(blocks)))

    print("\nParsed {} JSON-LD block(s) across {} page(s).".format(total, len(pages)))
    if failures:
        print("FAILED: {} invalid block(s).".format(failures))
        return 1
    print("All JSON-LD blocks are valid.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
