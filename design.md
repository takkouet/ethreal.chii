# Chiikawa — Design System

> **ACTIVE LOOK: Storefront (chiikawamarket.jp/en).** The site currently implements the
> **market storefront** look — see the "Storefront variant" section below. The
> chiikawaofficial.com brand-site sections that follow are kept as historical reference only;
> where they conflict (background, font, heading color), the storefront variant wins.

---

## Storefront variant — chiikawamarket.jp/en (ACTIVE)

Source: [chiikawamarket.jp/en](https://chiikawamarket.jp/en) (Shopify; specs pulled from its
`cm-common.css` + live render).

### Font (exact, no alternatives)
**M PLUS Rounded 1c** (rounded kawaii) — the real market-site font. Google Fonts, weights
400/500/700/800. Loaded via `next/font/google` in `app/layout.tsx` → `--font-mplus`. Used for
headings, body, nav, buttons. **Do not substitute** (Sen was the brand-site font; replaced).

### Palette
| Role | Hex | Notes |
|------|-----|-------|
| Page background | star tile on `#FFFBEF` | real `bg-ster.png` (yellow stars on cream), tiled 120px, `/public/market/bg-ster.png` |
| Card surface | `#FFFFFF` | white, thin `#ECECEC` border, soft shadow |
| Pink (nav/accents) | `#FFC2CA` | |
| Pink pale (bars/panels) | `#FFEFF2` | nav bar, asides |
| Yellow (section title) | `#FFFBBF` | `.section-title` pill behind headings |
| Coral (sale/CTA) | `#E77277` | **use ink text on coral (5.68:1)**; for white text use `#CC3D44` (`coral-dark`, 4.86:1) |
| Text / heading | `#1D1D1D` | near-black; 16.3:1 on cream |
| Muted | `#475569` | 7.3:1 on cream |

### Layout (homepage, top→bottom)
Announcement bar (coral) → header (logo center-left, Account/Cart **pill buttons**, **pink
nav bar**: Home / All items / By Character / By Series / By Category) → hero banner row (3
real banner images) → character nav strip (round pastel tiles) → **NEW ITEMS** grid (white
cards, 4-up) → footer (white, logo).

### Product card
White card, thin border, `object-contain` image on white, title, price + "(tax incl.)".
Badges (not color-only): gray **"Sold out"** (uses `stock` field), coral **"Sale"** when
applicable. Components: `product-card.tsx`, `announcement-bar.tsx`, `character-nav.tsx`.

### Real assets in `/public/market/`
`bg-ster.png` (page bg), `logo.png` (5th-anniversary logo), `banner1–3.png`, `product1–8.jpg`
(downloaded from chiikawamarket.jp CDN; product photos also wired into seed data).

### Contrast (verified ≥4.5:1)
ink/cream 16.3, muted/cream 7.3, ink/pink 11.1, ink/yellow 15.9, ink/coral 5.68,
white/coral-dark 4.86. Yellow used only as background, never text. Star bg respects
`prefers-reduced-motion` (attachment → scroll).

---

## Brand-site reference — chiikawaofficial.com (historical)

Source: [chiikawaofficial.com](https://www.chiikawaofficial.com/)

---

## Brand Personality

Kawaii + earnest. "Something small and cute." Childlike wonder with emotional depth. Warm, joyful, approachable. Manga/anime roots — hand-drawn aesthetic meets clean web layout.

---

## Color Palette

| Role | Name | Hex |
|------|------|-----|
| Primary | Soft Pink | `#D5B8D8` |
| Secondary | Teal | `#97A2A6` |
| Accent 1 | Lime Green | `#B5D777` |
| Accent 2 | Peach Orange | `#F8AE6C` |
| **Page background** | **Pastel Pink** | **`#FAC5CE`** |
| Surface (panel) | Pale Lilac | `#EBDDEC` |
| Surface (card) | White | `#FFFFFF` |
| **Heading / accent text** | **Deep Plum** | **`#6B3F6E`** |
| Text Primary | Dark Slate | `#1E293B` |
| Text Muted | Slate 600 | `#475569` |
| Border | Gray 200 | `#E2E8F0` |

Page background `#FAC5CE` and panel lilac `#EBDDEC` are the **exact values from
chiikawaofficial.com's `custom.css`** (`body{background-color:#fac5ce}`, lilac panels).

### Character Identity Colors
Each of the 3 main characters has own accent color. Use for character-specific buttons, badges, and card borders.

### Usage Rules
- **Page background is pastel pink `#FAC5CE`** (matches reference site); content sits on
  **white cards + pale-lilac panels** for two-tone depth. No dark mode.
- Pastel palette dominant — never use saturated primary blues/reds as main color
- **On the pink page, headings/accent text use Deep Plum `#6B3F6E`** — the lighter
  `primary-dark #B88DBD` fails contrast on pink (1.84:1). Plum passes everywhere it's used:
  5.44:1 on pink, 8.20:1 on white, 6.28:1 on lilac. Body text `#1E293B` (9.71:1 on pink)
  and muted `#475569` (5.03:1 on pink) both pass.
- Accent colors for CTAs and interactive highlights only
- Tailwind tokens: `--color-background` (pink), `--color-lilac`, `--color-heading` (plum)
  → use `bg-lilac`, `text-heading` utilities. Set in `app/globals.css`.

---

## Typography

### Font (exact match to chiikawaofficial.com)
The reference site loads custom `@font-face` **Sen-Bold / Sen-ExtraBold** for h1/h3/h4,
body, nav and buttons (plus a proprietary `ChiikawaEnglish.otf` for the h2 logo wordmark
only, which is not redistributable). **Sen** is available free on Google Fonts and is the
faithful match — used site-wide here. Nav + headings are `lowercase` (site style).

| Role | Font | Weights |
|------|------|---------|
| Headings / display | Sen | 800 (ExtraBold) |
| Body / UI | Sen | 400, 700 |

```css
@import url('https://fonts.googleapis.com/css2?family=Sen:wght@400;700;800&display=swap');
```

Loaded via `next/font/google` (`Sen`) in `app/layout.tsx` → CSS var `--font-sen`.
Do **not** substitute Noto, Fredoka, Nunito or any alternative — Sen is the real face.

### Scale
| Token | Size | Usage |
|-------|------|-------|
| `text-xs` | 12px | Labels, captions |
| `text-sm` | 14px | Secondary info |
| `text-base` | 16px | Body (mobile minimum) |
| `text-lg` | 18px | Lead text |
| `text-2xl` | 24px | Section subheadings |
| `text-4xl` | 36px | Section headings |
| `text-6xl` | 60px | Hero display |

### Rules
- Body line-height: 1.6–1.75
- Heading line-height: 1.1–1.3
- Max line length: 65–75 chars
- Serif for display/hero headings; sans for body + UI

---

## Layout

### Pattern: Hero-Centric Single Page
```
[Sticky Header + Nav]
[Full-width Hero — character art + tagline]
[Character Grid — 3 main + expanding cast]
[About / Q&A — alternating image-text]
[Social / News]
[Footer — nav links + subscribe]
```

### Grid
- Max container: `max-w-6xl` (1152px)
- Section padding: `py-16 px-6` desktop, `py-10 px-4` mobile
- Character grid: 3-column desktop → 1-column mobile
- Content blocks: centered, wide lateral margins

### Responsive Breakpoints
| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | 375px | Single column, hamburger nav |
| Tablet | 768px | 2-col grids |
| Desktop | 1024px | Full 3-col, sticky nav |
| Wide | 1440px | Max-width container centered |

### Z-Index Scale
| Layer | Value |
|-------|-------|
| Base content | 0 |
| Cards | 10 |
| Dropdowns | 20 |
| Sticky header | 30 |
| Modals | 50 |

---

## Navigation

- Sticky header — white/translucent background
- Logo left, nav links center/right, cart icon right
- Mobile: hamburger toggle → slide-in or overlay menu
- Smooth scroll to anchor sections
- Footer mirrors primary nav links

---

## Components

### Character Buttons
- Rounded cards with character illustration
- Each has unique accent color border/background
- Hover: `transition-colors duration-200` + slight shadow lift
- `cursor-pointer` always set
- Min touch target: 44×44px

### Hero Section
- Full-width, centered character art
- Large serif heading (48px+)
- CTA button — accent color, `cursor-pointer`, hover state required
- Generous padding, no content crowding

### Q&A / Feature Rows
- Alternating image-left / text-right layout
- Consistent vertical spacing between entries (`gap-16`)
- Images: illustrative, rounded corners, soft shadows

### Cards
- White/`bg-white/90` background
- `border border-gray-200` in light mode
- `rounded-2xl` for kawaii softness
- Hover: `shadow-md transition-shadow duration-200`

### Buttons
- Primary: peach/accent background, dark text
- `rounded-full` — matches soft brand aesthetic
- Padding: `px-6 py-3` minimum
- Disabled state: `opacity-50 cursor-not-allowed`

---

## Imagery

- Hand-drawn / manga illustration style
- Soft, rounded character shapes
- Fantastical world backgrounds (warm, dreamy)
- Consistent pastel color treatment across all arta
- No photography — illustration only
- Format: WebP preferred, lazy loading, explicit `alt` text always

---

## Animation & Interaction

| Type | Duration | Easing | Utility |
|------|----------|--------|---------|
| Hover lift (cards/buttons) | 200ms | `ease-in-out` | `.hover-lift` (translateY only) |
| Hero clouds float | 6s loop | `ease-in-out` | `.animate-float` |
| Hand-drawn wobble (accents) | 4s loop | `ease-in-out` | `.animate-wobble` |
| Sticker bob (badges) | 3.5s loop | `ease-in-out` | `.animate-bob` |
| Sparkle twinkle | 3s loop | `ease-in-out` | `.animate-twinkle` |
| Page section reveal | 500ms | `ease-out` | `.animate-reveal` |

- Use `transform` + `opacity` only — never animate `width`/`height`
- Respect `prefers-reduced-motion`: disable all non-essential animation (handled globally in `globals.css`)
- Large hero sections: animated subtle float (disable if reduced-motion)

### Whimsy toolkit (`globals.css` + `components/decorations.tsx`)
- **Pillowy shadow**: `.shadow-soft` (`--shadow-soft`) — pastel-tinted, soft.
- **Hand-drawn border**: `.border-dashed-soft` — dashed primary-dark.
- **Dotted divider**: `.dotted-divider` / `<DottedDivider />` — echoes the reference cascade rhythm.
- **Background**: layered pastel radial-dot wash on `body` (fixed; scrolls under reduced-motion).
- **`<HeroDecorations />`**: floating pastel clouds + twinkling SVG sparkles (decorative, `aria-hidden`).
- Headings, nav, hero copy: `lowercase` — matches the reference site.

---

## Accessibility

- Color contrast: minimum 4.5:1 for all body text
- All character images: descriptive `alt` text
- All icon-only buttons: `aria-label`
- Tab order follows visual order
- Focus rings visible on all interactive elements
- Cart, hamburger menu: labeled for screen readers

---

## Anti-Patterns — Avoid

- Dark mode / dark backgrounds (off-brand)
- Saturated tech-blue primary palette
- Photography replacing illustrations
- Emoji as UI icons — use SVG (Lucide/Heroicons)
- Scale transforms on hover that shift layout
- `bg-white/10` glass cards (too transparent on white bg)
- Mixed container widths across sections
- Missing `cursor-pointer` on character cards/buttons

---

## Pre-Delivery Checklist

- [ ] Pastel palette used correctly — no saturated primary colors
- [ ] Noto Serif JP for headings, Noto Sans JP for body
- [ ] All character cards have `cursor-pointer` + hover feedback
- [ ] Images: WebP, lazy loading, alt text present
- [ ] Touch targets ≥ 44×44px
- [ ] Contrast 4.5:1 on all text
- [ ] `prefers-reduced-motion` disables animations
- [ ] Responsive at 375, 768, 1024, 1440px
- [ ] No horizontal scroll on mobile
- [ ] Focus states visible (keyboard nav)
- [ ] Sticky nav accounts for content padding below it
