# Protect & Shine Navbar and Marquee Transplant - Definitive Handoff

## Mission

Transplant the approved navbar chassis, attached blue/red police-light modules, and homepage marquee from the source visual master into the target site.

Preserve the target site's hero, pages, section layouts, GSAP/ScrollTrigger behavior, preloader, dropdown navigation, quote flow, target CTA appearance and placement, and all unrelated styling. Do not redesign the site. Do not add a marquee to secondary pages unless the owner explicitly asks for that later.

## Exact Paths

| Role | Absolute path |
| --- | --- |
| Source visual master | `C:\Users\SHINIGAMI\Downloads\protect-shine-site-main (1)\protect-shine-site-main` |
| Target to repair | `C:\Users\SHINIGAMI\Downloads\protectshine latest site state\protect shine latest` |
| Source transfer kit | `C:\Users\SHINIGAMI\Downloads\protect-shine-site-main (1)\protect-shine-site-main\FEATURE_TRANSFER` |

## Source of Truth

Read these before editing. They freeze the intended state and are more reliable than previous CSS added to the target.

| File | Use |
| --- | --- |
| `FEATURE_TRANSFER/PLAN.md` | Visual DNA, invariants, allowed tuning values, parity checklist |
| `FEATURE_TRANSFER/reference.html` | Exact source header and homepage marquee markup |
| `FEATURE_TRANSFER/reference.css` | Approved component rules and animation values |
| `FEATURE_TRANSFER/reference.js` | Source-level header behavior reference only |
| `NAVBAR_STATE.md` | Restore-point notes for the approved navbar/light appearance |

Important: `reference.css` is a reference fragment, not a file to paste wholesale. It contains broad source-site layout selectors such as `.section`, `.hero-content`, `.showcase-inner`, `.site-footer`, and `.sticky-book-bar`. Do not import those into the target. They would alter unrelated target layout.

## Non-Negotiable Visual Result

### Navbar chassis

- At page top, the navbar is sticky, full viewport width, and flush with top/left/right viewport edges.
- At `window.scrollY > 20`, it smoothly contracts over 420ms to `min(1200px, calc(100% - 32px))`, with `top: 16px`, `margin-top: 16px`, and `padding: 10px 14px`.
- It is a dark angular glass chassis formed by `::before` and `::after`, with a thin blue-to-silver-to-red rim.
- The chassis remains square-edged. Do not turn it into a rounded card.
- Keep the target's existing navigation links, Specialty dropdown, backdrop behavior, active/section glow behavior, and CTA appearance.
- Keep `Get Quote` and `972-338-5781` exactly as the target presents them, including their target placement, colors, and telephone link.

### Attached police-light modules

- Blue is mounted beneath the left edge of the navbar; red is mounted beneath the right edge.
- They overlap the navbar by 1px using `top: calc(100% - 1px)`. There must be no visible gap.
- Each module is `clamp(130px, 28vw, 520px)` wide and 20px high.
- Blue: `left: 0`, `rotate(2.45deg)`, `transform-origin: top left`.
- Red: `right: 0`, `rotate(-2.45deg)`, `transform-origin: top right`.
- Red is a true mirror: its inner lens uses `scaleX(-1)`.
- Each lens has exactly four equal 25% cells.
- Cell gap is 8px on desktop and 3px at 720px or below.
- Use fine horizontal grid texture every 4px and fine vertical grid texture every 10px.
- Blue stays `#42b9ff`; red stays `#ff3e4f`. They never turn off.
- Motion is restrained: subtle 4.6s brightness/saturation amplification and a 6.8s glass sweep. Red sweep reverses with a `-3.4s` delay.
- Preserve crispness guards: `translate3d(0, 0, 0)`, `backface-visibility: hidden`, `isolation: isolate`, and inset-only frame styling. Do not use blur filters or distorted outer frames.

### Homepage marquee - highest priority

- The outer `.signal-strip` is perfectly horizontal. It never rotates, skews, or changes angle on scroll.
- Only the inner `.signal-band` is inclined: `width: 104%`, `margin-left: -2%`, `transform: rotate(-0.55deg)`.
- Do not rotate text, `.signal-group`, or `.signal-track`.
- The moving track translates only on the X axis from `0` to `-50%` over 24 seconds, linear, infinite.
- Two identical signal groups are required; the second uses `aria-hidden="true"`.
- Text order is fixed:
  1. Mobile service available
  2. Satisfaction guaranteed
  3. Police officer owned
  4. Texas CDL background
  5. Quality products used
  6. Attention to every detail
- Text is Bebas Neue, uppercase, `clamp(1.1rem, 2.4vw, 1.65rem)`, `letter-spacing: 0.06em`, padding `14px 30px`.
- Each phrase ends with a 24px by 7px blue-white-red capsule separator and 30px left margin.
- The outer strip carries the premium animated blue/red/white siren surface and dark backing.
- The inner band is semi-transparent black: `rgba(3, 5, 11, 0.86)`.
- That transparency may reveal the animated siren layer of the outer strip only. It must never reveal the target hero, page backdrop, grid, or any unrelated global layer.
- The source effect is subtle, glass-like, and continuous. It is not a blinking black bar, a transparent cutout, or a pair of independent pseudo rails.

## Current Target State and Failure History

The target homepage markup already has the correct basic marquee structure:

```html
<section class="signal-strip" aria-label="Protect & Shine service signals">
  <div class="signal-band">
    <div class="signal-track">
      <div class="signal-group">...</div>
      <div class="signal-group" aria-hidden="true">...</div>
    </div>
  </div>
</section>
```

The target header already has the target-specific links, Specialty dropdown, `Get Quote`, `972-338-5781`, and the two `header-patrol-light` spans. Do not replace the whole header with the source fragment. Preserve its existing navigation subtree.

The target commercial and first-responder pages contain the target header/light structure but do not currently contain a `.signal-strip`. Keep that behavior. The marquee transplant is for the homepage unless explicitly expanded later.

The marquee is broken because the target stylesheet has accumulated many competing copies of generic rules. There are original target rules near line 862, then additional transfer/experiment blocks around 5980, 6050, 6206, 6342, 6527, 6598, 7583, 7822, 7887, 7940, 8024, 8068, 8163, 8390, and 8525.

Those blocks redefine the same `.signal-strip`, `.signal-band`, `.signal-track`, pseudo-element, animation, background, transform, width, margin, and `!important` behavior. The attempted fixes added layers over layers instead of establishing one authoritative component. This is the root cause.

Do not assume every `policeSiren` keyframe/use is marquee code. The target uses that animation in unrelated components too. Preserve unrelated users or give the transplanted component uniquely named keyframes.

## Required Implementation Strategy

### 0. Establish a reliable baseline

1. Confirm the local server is actually serving the target directory, not the source directory or a stale process.
2. Capture source and target screenshots at the same desktop viewport (1920px wide) and mobile viewport (375px wide), at page top and after scrolling past 20px.
3. Make a recoverable copy or Git snapshot of the target before CSS cleanup.
4. Inspect the existing target markup and computed styles before changing anything.

### 1. Keep target HTML stable

1. Keep the current target header element, its `data-header`, `data-nav`, and `data-nav-toggle` attributes, nav dropdown markup, CTA elements, and existing light spans.
2. On the homepage only, verify the marquee text, two repeated groups, and `aria-hidden="true"` group match `reference.html` exactly.
3. Do not wrap the header and marquee in a shared parent. They live in different places in the document: the header is before `<main>`, while the marquee follows the hero inside `<main>`.
4. If selector isolation is needed, add direct modifier classes without moving DOM structure:

```html
<header class="site-header ps-header" data-header>
<section class="signal-strip ps-marquee" aria-label="Protect & Shine service signals">
```

Keep the original classes because the existing JavaScript depends on them.

### 2. Clean CSS surgically, not by piling on more overrides

1. Find the previously injected transfer/experiment blocks using their comments and their clustered locations listed above.
2. Remove only the old navbar/light/marquee transfer blocks and duplicate override rules they introduced.
3. Do not delete original target CSS wholesale.
4. Do not delete every `.site-header`, every `policeSiren` usage, or every generic animation definition. Those names are shared by target features.
5. Do not append another generic global "lock" block. The previous end-of-file locks are part of the problem.
6. Add one authoritative, scoped component implementation using `.site-header.ps-header` / `.ps-header` and `.signal-strip.ps-marquee` / `.ps-marquee` selectors.
7. The namespace prevents selector collisions. It does not solve paint order by itself; the marquee still needs an opaque outer base, correct local stacking, and correct child layering.

### 3. Import only the source dependencies that belong to this component

Merge these from `reference.css`, adapted to the target-specific selector scope:

- variables needed by the component: `--line`, `--line-strong`, `--text`, `--muted`, `--silver`, `--blue`, `--red`, `--siren-rail`, `--siren-size`, `--font-display`, and `--font-body`;
- `body { overflow-x: hidden; }` only if not already present;
- navbar chassis and its two pseudo-elements;
- scrolled navbar geometry;
- attached light module rules and their pseudo-elements;
- marquee rules and separator rules;
- only the needed responsive adjustments at 900px and 720px;
- renamed, component-specific keyframes such as `psSignalMove`, `psPoliceSiren`, `psBluePulse`, `psRedPulse`, and `psGlassSweep`.

Do not copy source rules for `.section`, `.hero-content`, `.showcase-inner`, `.site-footer`, `.sticky-book-bar`, source nav CTA styling, or source mobile nav styling. The target already owns those areas.

### 4. Rebuild the marquee paint stack correctly

The paint relationship must be intentional and inspectable:

```text
ps-marquee outer box
  1. Fully painted dark base; never transparent to the page
  2. Animated blue/red/white siren background on that same outer box
  3. Thin outer borders and restrained glow
  4. ps-marquee-band semi-transparent black, rotated -0.55deg
  5. moving text and capsule separators above the band
```

Use the reference values first. If the target backdrop remains visible through the inner band, the outer base is not fully covering the component bounds or a stale overlay is still active. Do not make the inner band fully opaque as a shortcut; that removes the approved siren-through-glass appearance.

The band overscan is part of the design. Keep `width: 104%` and `margin-left: -2%` with the exact `-0.55deg` angle before considering any adjustment. Any corner gap should reveal the fully painted local outer strip, never the target page.

### 5. Preserve the target JavaScript

The target already has `updateHeaderState()` and a single target `initHeader()` that handles:

- the 20px scroll threshold;
- mobile nav open/close;
- nav backdrop;
- Escape handling;
- Specialty dropdown behavior.

Keep that target initializer. Do not paste `reference.js` or create another scroll listener. Confirm `initHeader()` is called once and that it still toggles `.is-scrolled` on `[data-header]` at `window.scrollY > 20`.

The source `reference.js` is behavioral documentation, not a replacement for the richer target navigation handler.

### 6. Fonts and cache

The target pages were previously given Bebas Neue and Rajdhani font links in their `<head>`. Verify those existing links load; do not add duplicate `@import` rules.

After the final CSS is complete, update the stylesheet query on all three target HTML pages once, for example:

```html
<link rel="stylesheet" href="./styles.css?v=marquee-transplant-1" />
```

## Verification - Required Before Delivery

Use browser DevTools and screenshots, not only source inspection.

| Check | Required result |
| --- | --- |
| Server root | Localhost serves the target folder and current target `index.html` |
| Header at top | Flush with viewport top/left/right; no unwanted card margin |
| Scrolled header | At >20px, header and both lights contract together over 420ms |
| Target nav | Dropdown, backdrop, CTA styling/content, and section behavior remain intact |
| Light attachment | 1px overlap; no gap under either navbar edge |
| Light optics | Four equal cells, red mirror, crisp frame, no blur/ripples/needle lines |
| Mobile lights | 3px cell gaps at <=720px and no distorted scaling |
| Outer marquee | Computed `transform: none`; stays horizontal on scroll |
| Inner marquee band | Only it has `rotate(-0.55deg)` |
| Marquee paint | No hero/page/backdrop visible anywhere in the marquee bounds |
| Marquee appearance | Full blue/red/white glass siren motion visible through the black band |
| Text loop | Two groups, 24s linear X-axis loop, no broken baseline or jump |
| Motion stability | Scrolling never changes marquee angle, position, or text alignment |
| Responsive parity | Compare source vs target at 1920px and 375px |
| Console | No JavaScript errors and no duplicate scroll behavior |

For the paint check, inspect computed styles for the marquee outer element, inner band, and both pseudo-elements. Check their dimensions, background layers, transforms, opacity, z-index, and stacking contexts. Do not conclude parity from a CSS file read alone.

## Allowed Tuning Only After Source Parity

| Control | Approved default |
| --- | --- |
| `--nav-light-width` | `clamp(130px, 28vw, 520px)` |
| `--nav-light-drop` | `clamp(6px, 1.2vw, 22px)` |
| `--nav-lens-gap` | `8px`, then `3px` at <=720px |
| Light angles | `+/-2.45deg`, always changed symmetrically |
| Marquee inclination | `-0.55deg` |
| Header scroll threshold | `20px` |

Never tune `.signal-track` with any transform other than its horizontal loop. Never independently position red and blue modules. Never use blur filters on the light body. Never add a second header scroll handler.

## Delivery Definition

The work is complete only when source and target look materially identical for the navbar/light/marquee components at matching desktop and mobile viewports, while the target hero, pages, dropdown, CTA presentation, and section effects remain unchanged.

If parity still fails after the clean rebuild, compare computed styles and box geometry source-vs-target for the two component roots and their pseudo-elements. Do not return to appending experimental override blocks.
