#!/usr/bin/env python3
"""WCAG 2.2 contrast audit for prismUI visual tokens (caso peggiore).

Copied from prismUI-design/contrast.py (Graphic Designer) and adapted to read src/tokens/prism-tokens.css.
Usage: python3 scripts/contrast.py [--report] [--write FILE]. Exit code 1 if a required pair fails.

Metodo
------
* Luminanza relativa e rapporto di contrasto: definizioni WCAG 2.2.
  Nessun arrotondamento verso l'alto (2.999 non passa 3:1).
* Compositing alpha source-over in sRGB: C = α·C_superficie + (1−α)·C_sotto.
* Ogni superficie traslucida è composta su:
    - bianco puro #ffffff
    - nero puro #000000
    - gli stop del gradiente di pagina del tema
    - la rampa di grigi 0–255 (caso peggiore su qualsiasi luminanza)
  Si riporta il minimo. Il blur non migliora il caso peggiore.
* Per l'anello di focus (due anelli opachi affiancati) si usa anche un cubo RGB
  campionato (18 livelli/canale): il contrasto garantito è
  max(contrasto interno, contrasto esterno) sul backdrop peggiore.
* Le superfici decorative (--prism-glass-surface-deco-*) NON sono valutate
  per il testo: non devono contenere testo.
* I bordi dei controlli sono valutati contro le superfici text-bearing a ogni
  livello (composte nel caso peggiore) e contro lo sfondo di pagina documentato
  (--prism-color-bg-*). Soglia WCAG 1.4.11: 3:1. Disabled è esente.
"""
from __future__ import annotations

import itertools
from dataclasses import dataclass, field
from pathlib import Path

# ---------------------------------------------------------------------------
# Colour math (WCAG 2.2)
# ---------------------------------------------------------------------------

def hex_to_rgb(h: str) -> tuple[float, float, float]:
    h = h.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return int(h[0:2], 16) / 255, int(h[2:4], 16) / 255, int(h[4:6], 16) / 255


def rgb8(rgb: tuple[float, float, float]) -> tuple[float, float, float]:
    """0–1 → 0–255 (for composite convenience in reports)."""
    return tuple(c * 255 for c in rgb)  # type: ignore[return-value]


def rgb_to_hex(rgb01: tuple[float, float, float]) -> str:
    r, g, b = [max(0, min(255, int(round(c * 255)))) for c in rgb01]
    return f"#{r:02x}{g:02x}{b:02x}"


def lin(c: float) -> float:
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def luminance(rgb01: tuple[float, float, float]) -> float:
    r, g, b = rgb01
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def contrast(a: tuple[float, float, float], b: tuple[float, float, float]) -> float:
    l1, l2 = luminance(a), luminance(b)
    return (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05)


def composite(
    fg01: tuple[float, float, float], bg01: tuple[float, float, float], alpha: float
) -> tuple[float, float, float]:
    a = alpha
    return tuple(fg01[i] * a + bg01[i] * (1 - a) for i in range(3))  # type: ignore[return-value]


# ---------------------------------------------------------------------------
# Tokens (single source of truth for the audit)
# ---------------------------------------------------------------------------

NEUTRAL = {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
}

PRIMARY = "#2563eb"
PRIMARY_HOVER = {"light": "#1d4ed8", "dark": "#3b82f6"}
PRIMARY_ON = "#ffffff"

SUCCESS, SUCCESS_ON = "#15803d", "#ffffff"
WARNING, WARNING_ON = "#b45309", "#ffffff"
DANGER, DANGER_ON = "#b91c1c", "#ffffff"
INFO, INFO_ON = "#0369a1", "#ffffff"

SUBTLE = {
    "light": {
        "success": ("#f0fdf4", "#14532d"),
        "warning": ("#fffbeb", "#78350f"),
        "danger": ("#fef2f2", "#7f1d1d"),
        "info": ("#f0f9ff", "#0c4a6e"),
        "primary": ("#eff6ff", "#1e3a8a"),  # blue-50 / blue-900; token: --prism-color-on-primary-subtle
    },
    "dark": {
        "success": ("#14532d", "#bbf7d0"),
        "warning": ("#78350f", "#fde68a"),
        "danger": ("#7f1d1d", "#fecaca"),
        "info": ("#0c4a6e", "#bae6fd"),
        "primary": ("#1e3a8a", "#dbeafe"),  # blue-900 / blue-100
    },
}

# ::selection (opaque). Text contrast must be ≥ 4.5:1.
SELECTION = {
    "light": {"bg": "#2563eb", "text": "#ffffff"},
    "dark": {"bg": "#2563eb", "text": "#ffffff"},
}

# Modal scrim. Surface of the dialog is solid-4 (ux-spec § modal anatomy).
# RGB + alpha; light slate-900 @ 0.5, dark black @ 0.65.
SCRIM = {
    "light": {"rgb": hex_to_rgb("#0f172a"), "alpha": 0.50},
    "dark": {"rgb": hex_to_rgb("#000000"), "alpha": 0.65},
}
MODAL_SURFACE = "solid-4"  # --prism-glass-surface-solid-4

TEXT = {
    "light": {
        "primary": NEUTRAL[900],
        "secondary": NEUTRAL[700],
        "muted": NEUTRAL[600],
        "link": "#1d4ed8",
    },
    "dark": {
        "primary": NEUTRAL[50],
        "secondary": NEUTRAL[200],
        "muted": NEUTRAL[300],
        "link": "#60a5fa",
    },
}

GRADIENT = {
    "light": {"start": "#f8fafc", "end": "#dbeafe"},
    "dark": {"start": "#0f172a", "end": "#1e1b4b"},
}

GLASS_TINT = {
    "light": hex_to_rgb("#ffffff"),
    "dark": hex_to_rgb("#0f172a"),
}

# Text-bearing surfaces: α ≥ 0.85 light, ≥ 0.90 dark
SOLID_ALPHA = {
    "light": {0: 0.85, 1: 0.88, 2: 0.91, 3: 0.95, 4: 0.98},
    "dark": {0: 0.90, 1: 0.92, 2: 0.94, 3: 0.97, 4: 1.00},
}
SLAB_ALPHA = {"light": 0.85, "dark": 0.90}

# Decorative / no-text (kept for documentation; NOT audited for text)
DECO_ALPHA = {
    "light": {0: 0.15, 1: 0.28, 2: 0.40, 3: 0.55, 4: 0.70},
    "dark": {0: 0.38, 1: 0.50, 2: 0.60, 3: 0.72, 4: 0.85},
}

OPAQUE = {
    "light": hex_to_rgb("#ffffff"),
    "dark": hex_to_rgb("#0f172a"),
}

# Control borders (opaque). Disabled is 1.4.11-exempt.
CONTROL_BORDER = {
    "light": {
        "default": "#64748b",  # slate-500
        "hover": "#475569",    # slate-600
        "focus": "#0f172a",    # slate-900
        "disabled": "#94a3b8", # slate-400
    },
    "dark": {
        "default": "#cbd5e1",  # slate-300
        "hover": "#e2e8f0",    # slate-200
        "focus": "#ffffff",
        "disabled": "#475569", # slate-600
    },
}

FOCUS_INNER = "#ffffff"
FOCUS_OUTER = "#000000"

# ---------------------------------------------------------------------------
# prismUI repo adaptation: the values above are the Grafico's reference copy; they are REPLACED
# here by the values parsed from src/tokens/prism-tokens.css (top-level :root and dark rules),
# so the audit always checks the tokens that ship. Run: npm run tokens:contrast
# ---------------------------------------------------------------------------
import re
import sys

TOKENS_CSS = Path(__file__).resolve().parent.parent / "src" / "tokens" / "prism-tokens.css"


def _top_level_blocks(css: str) -> dict[str, dict[str, str]]:
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    out: dict[str, dict[str, str]] = {"light": {}, "dark": {}}
    depth, start, selector = 0, 0, ""
    for i, ch in enumerate(css):
        if ch == "{":
            if depth == 0:
                selector = css[start:i].strip()
                body_start = i + 1
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                sels = [x.strip() for x in selector.split(",")]
                theme = "light" if ":root" in sels and ".dark" not in sels else "dark" if ".dark" in sels and ":root" not in sels else None
                if theme:
                    for m in re.finditer(r"(--prism-[\w-]+)\s*:\s*([^;]+);", css[body_start:i]):
                        out[theme][m.group(1)] = m.group(2).strip()
                start = i + 1
    return out


def _resolver(theme: str, blocks: dict[str, dict[str, str]]):
    merged = {**blocks["light"], **(blocks["dark"] if theme == "dark" else {})}

    def get(name: str) -> str:
        v = merged[name]
        for _ in range(10):
            m = re.fullmatch(r"var\((--prism-[\w-]+)\)", v)
            if not m:
                break
            v = merged[m.group(1)]
        return v

    return get


def _rgba(v: str) -> tuple[tuple[float, float, float], float]:
    if v.startswith("#"):
        return hex_to_rgb(v), 1.0
    nums = [float(x) for x in re.findall(r"[\d.]+", v)]
    return (nums[0] / 255, nums[1] / 255, nums[2] / 255), (nums[3] if len(nums) > 3 else 1.0)


def _load_from_css(path: Path = TOKENS_CSS) -> None:
    g = globals()
    blocks = _top_level_blocks(path.read_text(encoding="utf-8"))
    L, D = _resolver("light", blocks), _resolver("dark", blocks)
    both = {"light": L, "dark": D}
    g["NEUTRAL"] = {k: L(f"--prism-color-neutral-{k}") for k in NEUTRAL}
    g["PRIMARY"] = L("--prism-color-primary")
    g["PRIMARY_HOVER"] = {t: f("--prism-color-primary-hover") for t, f in both.items()}
    g["PRIMARY_ON"] = L("--prism-color-primary-on")
    for intent in ("success", "warning", "danger", "info"):
        g[intent.upper()] = L(f"--prism-color-{intent}")
        g[intent.upper() + "_ON"] = L(f"--prism-color-{intent}-on")
    g["SUBTLE"] = {
        t: {
            **{i: (f(f"--prism-color-{i}-subtle"), f(f"--prism-color-{i}-on-subtle")) for i in ("success", "warning", "danger", "info")},
            "primary": (f("--prism-color-primary-subtle"), f("--prism-color-on-primary-subtle")),
        }
        for t, f in both.items()
    }
    g["SELECTION"] = {t: {"bg": f("--prism-selection-bg"), "text": f("--prism-selection-text")} for t, f in both.items()}
    g["SCRIM"] = {t: dict(zip(("rgb", "alpha"), _rgba(f("--prism-scrim")))) for t, f in both.items()}
    g["TEXT"] = {
        t: {k: f(f"--prism-color-text-{k}") for k in ("primary", "secondary", "muted")} | {"link": f("--prism-color-link")}
        for t, f in both.items()
    }
    g["GRADIENT"] = {t: {"start": f("--prism-color-bg-start"), "end": f("--prism-color-bg-end")} for t, f in both.items()}
    g["GLASS_TINT"] = {t: _rgba("rgb(" + f("--prism-glass-tint") + ")")[0] for t, f in both.items()}
    g["SOLID_ALPHA"] = {t: {i: float(f(f"--prism-glass-surface-solid-{i}-alpha")) for i in range(5)} for t, f in both.items()}
    g["SLAB_ALPHA"] = {t: float(f("--prism-glass-slab-alpha")) for t, f in both.items()}
    g["DECO_ALPHA"] = {t: {i: float(f(f"--prism-glass-surface-deco-{i}-alpha")) for i in range(5)} for t, f in both.items()}
    g["OPAQUE"] = {t: hex_to_rgb(f("--prism-surface-opaque-0")) for t, f in both.items()}
    g["CONTROL_BORDER"] = {
        t: {k: f("--prism-control-border" + ("" if k == "default" else f"-{k}")) for k in ("default", "hover", "focus", "disabled")}
        for t, f in both.items()
    }
    g["FOCUS_INNER"] = L("--prism-focus-ring-inner")
    g["FOCUS_OUTER"] = L("--prism-focus-ring-outer")


_load_from_css()


WHITE = hex_to_rgb("#ffffff")
BLACK = hex_to_rgb("#000000")
GRAYS = [(v / 255, v / 255, v / 255) for v in range(256)]
LEVELS = [i * 15 / 255 for i in range(18)]  # 0, 15, …, 255
CUBE = list(itertools.product(LEVELS, LEVELS, LEVELS))


def named_backdrops(theme: str) -> list[tuple[str, tuple[float, float, float]]]:
    g = GRADIENT[theme]
    return [
        ("#ffffff", WHITE),
        ("#000000", BLACK),
        (f"grad-start {g['start']}", hex_to_rgb(g["start"])),
        (f"grad-end {g['end']}", hex_to_rgb(g["end"])),
    ]


def all_backdrops(theme: str) -> list[tuple[str, tuple[float, float, float]]]:
    named = named_backdrops(theme)
    grays = [(f"gray-{v}", (v / 255,) * 3) for v in range(256)]
    return named + grays


def page_bgs(theme: str) -> list[tuple[str, tuple[float, float, float]]]:
    """Documented page backgrounds (not the opposite-theme extreme)."""
    g = GRADIENT[theme]
    if theme == "light":
        return [
            ("#ffffff", WHITE),
            (g["start"], hex_to_rgb(g["start"])),
            (g["end"], hex_to_rgb(g["end"])),
        ]
    return [
        ("#000000", BLACK),
        (g["start"], hex_to_rgb(g["start"])),
        (g["end"], hex_to_rgb(g["end"])),
    ]


# ---------------------------------------------------------------------------
# Rows
# ---------------------------------------------------------------------------

@dataclass
class Row:
    category: str  # text | semantic | subtle | opaque | control-border | focus
    theme: str
    pair: str
    fg: str
    surface: str
    worst_backdrop: str
    ratio: float
    threshold: float
    pass_: bool
    exempt: bool = False
    extra: dict = field(default_factory=dict)


def worst_text_on_surface(
    fg01: tuple[float, float, float],
    tint: tuple[float, float, float],
    alpha: float,
    theme: str,
) -> tuple[float, str, tuple[float, float, float], dict]:
    """Return (worst_ratio, worst_backdrop_label, worst_surface, named_ratios)."""
    named = {}
    worst_r, worst_label, worst_surf = 99.0, "?", WHITE
    for label, bg in all_backdrops(theme):
        surf = composite(tint, bg, alpha)
        r = contrast(fg01, surf)
        if label.startswith("#") or label.startswith("grad-"):
            key = label.split()[0]
            named[key] = r
        if r < worst_r:
            worst_r, worst_label, worst_surf = r, label, surf
    return worst_r, worst_label, worst_surf, named


def fmt_ratio(r: float) -> str:
    return f"{r:.2f}:1"


def audit() -> list[Row]:
    rows: list[Row] = []

    for theme in ("light", "dark"):
        tint = GLASS_TINT[theme]
        texts = TEXT[theme]

        # --- Text on text-bearing solid surfaces + slab ---
        surfaces = {**{f"solid-{e}": a for e, a in SOLID_ALPHA[theme].items()}, "slab": SLAB_ALPHA[theme]}
        for surf_name, alpha in surfaces.items():
            for role in ("primary", "secondary", "muted", "link"):
                fg = hex_to_rgb(texts[role])
                r, lab, surf, named = worst_text_on_surface(fg, tint, alpha, theme)
                rows.append(
                    Row(
                        category="text",
                        theme=theme,
                        pair=f"text-{role} on {surf_name} (α={alpha:.2f})",
                        fg=texts[role],
                        surface=f"{rgb_to_hex(surf)} (α={alpha:.2f} su {lab})",
                        worst_backdrop=lab,
                        ratio=r,
                        threshold=4.5,
                        pass_=r >= 4.5,
                        extra=named,
                    )
                )

        # --- Text on opaque fallback surfaces (α = 1, independent of backdrop) ---
        opaque = OPAQUE[theme]
        for role in ("primary", "secondary", "muted", "link"):
            r = contrast(hex_to_rgb(texts[role]), opaque)
            rows.append(
                Row(
                    category="opaque",
                    theme=theme,
                    pair=f"text-{role} on surface-opaque (α=1)",
                    fg=texts[role],
                    surface=rgb_to_hex(opaque),
                    worst_backdrop="— (opaca)",
                    ratio=r,
                    threshold=4.5,
                    pass_=r >= 4.5,
                )
            )

        # --- Solid semantic fills (backdrop-independent) ---
        for name, fill, on in (
            ("success", SUCCESS, SUCCESS_ON),
            ("warning", WARNING, WARNING_ON),
            ("danger", DANGER, DANGER_ON),
            ("info", INFO, INFO_ON),
            ("primary", PRIMARY, PRIMARY_ON),
        ):
            r = contrast(hex_to_rgb(on), hex_to_rgb(fill))
            rows.append(
                Row(
                    category="semantic",
                    theme=theme,
                    pair=f"on-{name} on {name} fill (α=1.00)",
                    fg=on,
                    surface=fill,
                    worst_backdrop="— (solido)",
                    ratio=r,
                    threshold=4.5,
                    pass_=r >= 4.5,
                )
            )

        for name, (fill, on) in SUBTLE[theme].items():
            r = contrast(hex_to_rgb(on), hex_to_rgb(fill))
            rows.append(
                Row(
                    category="subtle",
                    theme=theme,
                    pair=f"on-{name}-subtle on {name}-subtle",
                    fg=on,
                    surface=fill,
                    worst_backdrop="— (solido)",
                    ratio=r,
                    threshold=4.5,
                    pass_=r >= 4.5,
                )
            )

        # --- primary-subtle on solid surfaces (fill is opaque; AA unchanged on any solid/slab/opaque) ---
        fill_hex, on_hex = SUBTLE[theme]["primary"]
        r_fill = contrast(hex_to_rgb(on_hex), hex_to_rgb(fill_hex))
        rows.append(
            Row(
                category="subtle-on-solid",
                theme=theme,
                pair="on-primary-subtle on primary-subtle over solid-0…4 / slab / opaque",
                fg=on_hex,
                surface=fill_hex,
                worst_backdrop="— (subtle opaca α=1; indipendente dalla superficie sottostante)",
                ratio=r_fill,
                threshold=4.5,
                pass_=r_fill >= 4.5,
            )
        )

        # --- ::selection ---
        sel = SELECTION[theme]
        r_sel = contrast(hex_to_rgb(sel["text"]), hex_to_rgb(sel["bg"]))
        rows.append(
            Row(
                category="selection",
                theme=theme,
                pair="selection-text on selection-bg",
                fg=sel["text"],
                surface=sel["bg"],
                worst_backdrop="— (solido)",
                ratio=r_sel,
                threshold=4.5,
                pass_=r_sel >= 4.5,
            )
        )

        # --- Modal scrim: text on solid-4 composited over scrim over worst-case backdrops ---
        scrim_rgb, scrim_a = SCRIM[theme]["rgb"], SCRIM[theme]["alpha"]
        modal_alpha = SOLID_ALPHA[theme][4]
        for role in ("primary", "secondary", "muted", "link"):
            fg = hex_to_rgb(texts[role])
            worst_r, worst_lab, worst_surf = 99.0, "?", None
            named: dict = {}
            for blabel, bg in all_backdrops(theme):
                scrimed = composite(scrim_rgb, bg, scrim_a)
                surf = composite(tint, scrimed, modal_alpha)
                r = contrast(fg, surf)
                if blabel in ("#ffffff", "#000000") or blabel.startswith("gradient"):
                    named[blabel] = r
                if r < worst_r:
                    worst_r, worst_lab, worst_surf = r, blabel, surf
            rows.append(
                Row(
                    category="scrim-text",
                    theme=theme,
                    pair=f"text-{role} on {MODAL_SURFACE} (α={modal_alpha:.2f}) over scrim (α={scrim_a:.2f})",
                    fg=texts[role],
                    surface=f"{rgb_to_hex(worst_surf)} (solid-4 su scrim su {worst_lab})",
                    worst_backdrop=worst_lab,
                    ratio=worst_r,
                    threshold=4.5,
                    pass_=worst_r >= 4.5,
                    extra=named,
                )
            )

        # Boundary: composited modal surface vs the scrimmed backdrop (aim ≥ 3:1; else border/shadow)
        worst_edge, worst_edge_lab, worst_edge_surf, worst_scrimed = 99.0, "?", None, None
        named_edge: dict = {}
        for blabel, bg in all_backdrops(theme):
            scrimed = composite(scrim_rgb, bg, scrim_a)
            surf = composite(tint, scrimed, modal_alpha)
            r = contrast(surf, scrimed)
            if blabel in ("#ffffff", "#000000") or blabel.startswith("gradient"):
                named_edge[blabel] = r
            if r < worst_edge:
                worst_edge, worst_edge_lab, worst_edge_surf, worst_scrimed = r, blabel, surf, scrimed
        rows.append(
            Row(
                category="scrim-edge",
                theme=theme,
                pair=f"{MODAL_SURFACE} (α={modal_alpha:.2f}) vs scrim (α={scrim_a:.2f})",
                fg=rgb_to_hex(worst_edge_surf),
                surface=f"scrim {rgb_to_hex(worst_scrimed)} su {worst_edge_lab}",
                worst_backdrop=worst_edge_lab,
                ratio=worst_edge,
                threshold=3.0,
                pass_=worst_edge >= 3.0,
                extra=named_edge,
            )
        )

        # --- Control borders vs text-bearing surfaces (worst composite) + page bg ---
        # Adjacent colors: each solid/slab composited over all backdrops, plus page bgs, plus opaque.
        adj: list[tuple[str, tuple[float, float, float]]] = []
        for label, bg in page_bgs(theme):
            adj.append((f"page {label}", bg))
        adj.append((f"opaque {rgb_to_hex(opaque)}", opaque))
        for e, a in SOLID_ALPHA[theme].items():
            for blabel, bg in all_backdrops(theme):
                adj.append((f"solid-{e} α{a:.2f} su {blabel}", composite(tint, bg, a)))
        a = SLAB_ALPHA[theme]
        for blabel, bg in all_backdrops(theme):
            adj.append((f"slab α{a:.2f} su {blabel}", composite(tint, bg, a)))

        for state, hexcol in CONTROL_BORDER[theme].items():
            border = hex_to_rgb(hexcol)
            worst_r, worst_lab = 99.0, "?"
            for lab, adj_c in adj:
                r = contrast(border, adj_c)
                if r < worst_r:
                    worst_r, worst_lab = r, lab
            exempt = state == "disabled"
            rows.append(
                Row(
                    category="control-border",
                    theme=theme,
                    pair=f"control-border-{state}",
                    fg=hexcol,
                    surface=worst_lab,
                    worst_backdrop=worst_lab,
                    ratio=worst_r,
                    threshold=3.0,
                    pass_=True if exempt else worst_r >= 3.0,
                    exempt=exempt,
                )
            )

    # --- Focus double ring: any backdrop (grays + cube) ---
    inner = hex_to_rgb(FOCUS_INNER)
    outer = hex_to_rgb(FOCUS_OUTER)
    worst_r, worst_lab = 99.0, "?"
    for i, B in enumerate(GRAYS):
        r = max(contrast(inner, B), contrast(outer, B))
        if r < worst_r:
            worst_r, worst_lab = r, f"gray-{i} {rgb_to_hex(B)}"
    for B in CUBE:
        r = max(contrast(inner, B), contrast(outer, B))
        if r < worst_r:
            worst_r, worst_lab = r, rgb_to_hex(B)
    pair_r = contrast(inner, outer)
    rows.append(
        Row(
            category="focus",
            theme="both",
            pair="focus-ring max(inner #ffffff, outer #000000)",
            fg=f"{FOCUS_INNER} + {FOCUS_OUTER}",
            surface="qualsiasi backdrop",
            worst_backdrop=worst_lab,
            ratio=worst_r,
            threshold=3.0,  # 1.4.11; the pair is designed to stay ≥ 4.23
            pass_=worst_r >= 3.0,
            extra={"pair_ratio": pair_r},
        )
    )
    return rows


def markdown(rows: list[Row]) -> str:
    lines: list[str] = []

    lines.append("## Metodo")
    lines.append("")
    lines.append(
        "Compositing source-over in sRGB. Ogni superficie traslucida è composta su "
        "`#ffffff`, `#000000`, gli stop del gradiente di pagina e la rampa di grigi 0–255; "
        "si riporta il caso peggiore. L'anello di focus è valutato anche su un cubo RGB "
        "campionato (18³). Nessun arrotondamento verso l'alto. "
        "Le superfici decorative (`--prism-glass-surface-deco-*`) **non sono valutate per il testo** "
        "e non devono contenerne."
    )
    lines.append("")

    # Text
    text_rows = [r for r in rows if r.category == "text"]
    lines.append("## Testo su superfici text-bearing (solid + slab) — soglia 4.5:1")
    lines.append("")
    lines.append(
        "| Tema | Coppia | Primo piano | Superficie (caso peggiore) | Backdrop peggiore | Su #fff | Su #000 | AA 4.5:1 |"
    )
    lines.append("|---|---|---|---|---|---:|---:|---|")
    for r in text_rows:
        n = "pass" if r.pass_ else "**FAIL**"
        on_w = r.extra.get("#ffffff")
        on_k = r.extra.get("#000000")
        sw = f"{on_w:.2f}:1" if on_w is not None else "—"
        sk = f"{on_k:.2f}:1" if on_k is not None else "—"
        lines.append(
            f"| {r.theme} | `{r.pair}` | `{r.fg}` | `{r.surface}` | `{r.worst_backdrop}` | {sw} | {sk} | {n} |"
        )
    lines.append("")

    # Opaque
    lines.append("## Testo su superfici opache (`--prism-surface-opaque-*`, fallback) — soglia 4.5:1")
    lines.append("")
    lines.append("| Tema | Coppia | Primo piano | Superficie | Rapporto | AA 4.5:1 |")
    lines.append("|---|---|---|---|---:|---|")
    for r in rows:
        if r.category != "opaque":
            continue
        n = "pass" if r.pass_ else "**FAIL**"
        lines.append(f"| {r.theme} | `{r.pair}` | `{r.fg}` | `{r.surface}` | {r.ratio:.2f}:1 | {n} |")
    lines.append("")

    # Semantic + subtle
    lines.append("## Fill semantici e subtle (solidi, indipendenti dal backdrop) — soglia 4.5:1")
    lines.append("")
    lines.append("| Tema | Coppia | Primo piano | Superficie | Rapporto | AA 4.5:1 |")
    lines.append("|---|---|---|---|---:|---|")
    for r in rows:
        if r.category not in ("semantic", "subtle"):
            continue
        n = "pass" if r.pass_ else "**FAIL**"
        lines.append(f"| {r.theme} | `{r.pair}` | `{r.fg}` | `{r.surface}` | {r.ratio:.2f}:1 | {n} |")
    lines.append("")

    # Selection
    lines.append("## Colori di selezione (`::selection`) — soglia 4.5:1")
    lines.append("")
    lines.append("| Tema | Coppia | Primo piano | Superficie | Rapporto | AA 4.5:1 |")
    lines.append("|---|---|---|---|---:|---|")
    for r in rows:
        if r.category != "selection":
            continue
        n = "pass" if r.pass_ else "**FAIL**"
        lines.append(f"| {r.theme} | `{r.pair}` | `{r.fg}` | `{r.surface}` | {r.ratio:.2f}:1 | {n} |")
    lines.append("")

    # primary-subtle on solids
    lines.append("## Primary-subtle su superfici solide — soglia 4.5:1")
    lines.append("")
    lines.append(
        "`--prism-color-primary-subtle` e `--prism-color-on-primary-subtle` sono tinte piene (α=1). "
        "Il contrasto del testo sul fill subtle è quindi indipendente dalla superficie text-bearing sottostante "
        "(solid-0…4, slab, opaque): si ripete lo stesso rapporto su ciascuna per documentare il caso «incluso sulle solid»."
    )
    lines.append("")
    lines.append("| Tema | Coppia | Primo piano | Superficie | Rapporto | AA 4.5:1 |")
    lines.append("|---|---|---|---|---:|---|")
    for r in rows:
        if r.category != "subtle-on-solid":
            continue
        n = "pass" if r.pass_ else "**FAIL**"
        lines.append(f"| {r.theme} | `{r.pair}` | `{r.fg}` | `{r.surface}` | {r.ratio:.2f}:1 | {n} |")
    lines.append("")

    # Scrim
    lines.append("## Modale sullo scrim (`--prism-scrim`) — testo 4.5:1, confine obiettivo 3:1")
    lines.append("")
    lines.append(
        "Catena di compositing: backdrop (caso peggiore: `#ffffff`, `#000000`, stop del gradiente, rampa di grigi) "
        "→ `--prism-scrim` → superficie della modale `--prism-glass-surface-solid-4` → testo. "
        "Per il confine si confronta la superficie composta con lo sfondo già schermato. "
        "Se il rapporto è < 3:1 il confine visivo si affida a `--prism-control-border` e `--prism-shadow-*` "
        "(non è contato come fail delle coppie obbligatorie nel riepilogo)."
    )
    lines.append("")
    lines.append("| Tema | Coppia | Primo piano | Superficie / adiacente | Backdrop peggiore | Rapporto | Soglia | Esito |")
    lines.append("|---|---|---|---|---|---:|---:|---|")
    for r in rows:
        if r.category not in ("scrim-text", "scrim-edge"):
            continue
        if r.category == "scrim-edge" and not r.pass_:
            n = "sotto 3:1 — bordo/ombra"
        else:
            n = "pass" if r.pass_ else "**FAIL**"
        lines.append(
            f"| {r.theme} | `{r.pair}` | `{r.fg}` | `{r.surface}` | `{r.worst_backdrop}` | {r.ratio:.2f}:1 | {r.threshold}:1 | {n} |"
        )
    lines.append("")

    # Control borders
    lines.append("## Bordi dei controlli (1.4.11, soglia 3:1) vs superfici text-bearing (caso peggiore) e sfondo di pagina")
    lines.append("")
    lines.append(
        "Lo sfondo di pagina è quello documentato (`--prism-color-bg-start/end` e, in light, anche `#ffffff`). "
        "Un bordo unico non è valutato contro un backdrop di tema opposto: i controlli stanno su una superficie "
        "text-bearing o sulla pagina documentata. `--prism-glass-border` è solo decorativo e non è in questa tabella. "
        "Lo stato disabled è esente da 1.4.11 (riportato per completezza)."
    )
    lines.append("")
    lines.append("| Tema | Token | Colore | Adiacente (caso peggiore) | Rapporto | AA 3:1 |")
    lines.append("|---|---|---|---|---:|---|")
    for r in rows:
        if r.category != "control-border":
            continue
        if r.exempt:
            n = "esente"
        else:
            n = "pass" if r.pass_ else "**FAIL**"
        lines.append(
            f"| {r.theme} | `{r.pair}` | `{r.fg}` | `{r.surface}` | {r.ratio:.2f}:1 | {n} |"
        )
    lines.append("")

    # Focus
    lines.append("## Anello di focus doppio — minimo su qualsiasi backdrop")
    lines.append("")
    fr = next(r for r in rows if r.category == "focus")
    pair_r = fr.extra.get("pair_ratio", 0)
    n = "pass" if fr.pass_ else "**FAIL**"
    lines.append(
        f"- Interno `{FOCUS_INNER}` + esterno `{FOCUS_OUTER}` (contrasto reciproco {pair_r:.2f}:1)."
    )
    lines.append(
        f"- Minimo di `max(contrasto interno, contrasto esterno)` su rampa di grigi 0–255 e cubo RGB 18³: "
        f"**{fr.ratio:.3f}:1** (backdrop peggiore: `{fr.worst_backdrop}`)."
    )
    lines.append(
        f"- Soglia 1.4.11: 3:1. Il valore di progetto dichiarato dalla revisione a11y è ≥ 4.23:1. Esito: {n}."
    )
    lines.append("")

    # Decorative note
    lines.append("## Superfici decorative")
    lines.append("")
    lines.append(
        "`--prism-glass-surface-deco-0…4` (light α 0.15/0.28/0.40/0.55/0.70, dark α 0.38/0.50/0.60/0.72/0.85) "
        "**non sono valutate per il testo**. Niente testo, niente valore/etichetta di controllo su queste superfici. "
        "Se serve testo su un cromo decorativo, si mette sotto una lastra `--prism-glass-slab` (α 0.85 light / 0.90 dark)."
    )
    lines.append("")

    # Summary
    # scrim-edge under 3:1 is documented (border/shadow), not a hard fail of required pairs
    counted = [r for r in rows if not r.exempt and r.category != "scrim-edge"]
    fails = [r for r in counted if not r.pass_]
    text = [r for r in rows if r.category in ("text", "opaque", "semantic", "subtle", "subtle-on-solid", "selection", "scrim-text")]
    borders = [r for r in rows if r.category == "control-border" and not r.exempt]
    edges = [r for r in rows if r.category == "scrim-edge"]
    lines.append("## Riepilogo")
    lines.append("")
    lines.append(f"- Coppie valutate (esclusi disabled esenti): **{len(counted)}**")
    lines.append(f"- Fail (sotto soglia della categoria): **{len(fails)}**")
    lines.append(
        f"- Testo (text-bearing + opache + fill semantici/subtle): {len(text)} coppie, "
        f"minimo {min(r.ratio for r in text):.2f}:1, fail {sum(1 for r in text if not r.pass_)}"
    )
    lines.append(
        f"- Bordi controlli (default/hover/focus, 3:1): {len(borders)} coppie, "
        f"minimo {min(r.ratio for r in borders):.2f}:1, fail {sum(1 for r in borders if not r.pass_)}"
    )
    lines.append(f"- Focus ring, minimo su qualsiasi backdrop: **{fr.ratio:.3f}:1** (reciproco {pair_r:.2f}:1)")
    sel = [r for r in rows if r.category == "selection"]
    lines.append(
        f"- Selezione (`::selection`, 2 coppie): minimo {min(r.ratio for r in sel):.2f}:1, fail {sum(1 for r in sel if not r.pass_)}"
    )
    st = [r for r in rows if r.category == "scrim-text"]
    lines.append(
        f"- Testo sulla modale sopra lo scrim ({len(st)} coppie, 4.5:1): minimo {min(r.ratio for r in st):.2f}:1, fail {sum(1 for r in st if not r.pass_)}"
    )
    for e in edges:
        note = "pass ≥ 3:1" if e.pass_ else "sotto 3:1 — confine affidato a bordo/ombra"
        lines.append(
            f"- Confine modale vs scrim ({e.theme}): **{e.ratio:.2f}:1** (caso peggiore `{e.worst_backdrop}`; {note})"
        )
    if fails:
        lines.append("")
        lines.append("Dettaglio fail:")
        for r in fails:
            lines.append(f"  - {r.theme} · {r.pair} · {r.ratio:.3f}:1 (soglia {r.threshold}:1) @ {r.worst_backdrop}")
    else:
        lines.append(
            "- Nessuna coppia obbligatoria sotto soglia. "
            "Il confine dark della modale vs scrim è sotto 3:1 (vedi sopra) e si affida a bordo e ombra."
        )
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    rows = audit()
    md = markdown(rows)
    if "--report" in sys.argv:
        print(md)
    if "--write" in sys.argv:
        out = Path(sys.argv[sys.argv.index("--write") + 1])
        out.write_text(md, encoding="utf-8")
        print(f"\nWritten {out}")

    # Also print compact minima for the parent report
    text = [r for r in rows if r.category in ("text", "opaque", "semantic", "subtle", "subtle-on-solid", "selection", "scrim-text")]
    borders = [r for r in rows if r.category == "control-border" and not r.exempt]
    fr = next(r for r in rows if r.category == "focus")
    edges = [r for r in rows if r.category == "scrim-edge"]
    hard = [r for r in rows if not r.exempt and r.category != "scrim-edge"]
    print("MINIMA", {
        "text": min(r.ratio for r in text),
        "text_pair": min(text, key=lambda r: r.ratio).pair,
        "border": min(r.ratio for r in borders),
        "border_pair": min(borders, key=lambda r: r.ratio).pair,
        "focus": fr.ratio,
        "focus_at": fr.worst_backdrop,
        "selection": min(r.ratio for r in rows if r.category == "selection"),
        "scrim_text": min(r.ratio for r in rows if r.category == "scrim-text"),
        "scrim_edge": {e.theme: round(e.ratio, 3) for e in edges},
        "n": len(hard),
        "fails": sum(1 for r in hard if not r.pass_),
    })
    fails = [r for r in hard if not r.pass_]
    for r in fails:
        print(f"FAIL {r.theme} {r.pair}: {r.ratio:.3f}", file=sys.stderr)
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
