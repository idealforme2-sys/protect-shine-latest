# Protect & Shine Detailing - Workspace Memory

## Project Overview
- **Business**: Protect & Shine Detailing (Officer & CDL owned mobile auto and truck detailing in Melissa + McKinney, TX).
- **Primary Pages**:
  - `index.html`: Main landing page (Cars, Commercial Trucks, First Responders).
  - `commercial-truck-detailing/index.html`: Commercial Truck & Fleet detailing specialty page.
  - `first-responder-detailing/index.html`: First Responder unit sanitization specialty page.
- **Styling Architecture**: Vanilla CSS in `styles.css` (high specificity, responsive breakpoints at 820px and 620px).
- **Core Theme**: Navy/slate dark mode (`#04060c`), Tactical Police Blue (`#1678ff`, `#61b7ff`), Alert Red (`#ff4d4d`), Gold (`#f0c479`), Police/Patrol lights (`#1678ff` / `#ff4d4d`). No purple.

## Key Design Principles & User Preferences
1. **Above-the-Fold Sightline on Mobile (`390px × 844px`)**:
   - Initial mobile fold (`scrollY = 0`) must show all primary actions without scrolling.
   - For specialty pages (`/commercial-truck-detailing` and `/first-responder-detailing`): both bottom action buttons must be cleanly in sight at the bottom of the fold.
   - For homepage (`/`): Eyebrow pill, dynamic headline, subtext, Built Different card, 3 action buttons, 3-column proof rail, and animated marquee ribbon must all fit above the fold.
2. **Hero Background Navbar Coverage**:
   - On both desktop and mobile, hero background photos (`POLICECAR.jpg`, `TRUCKSs.jpg`, `policE.jpg`) extend to `Y = 0` behind, above, and around the floating header and patrol lights via `-82px` margin offset and calibrated top padding. Zero empty space or backdrop exposure when header contracts/detracts.
3. **Preloader Behavior**:
   - The tactical preloader (`.preloader`, `initPreloader()`) is present only on the homepage (`index.html`).
   - On homepage reload/visit, it should smoothly display its progress animation and lights sequence (rather than being instantly skipped by sessionStorage or abrupt 100ms cuts).
   - Specialty pages (`/commercial-truck-detailing` and `/first-responder-detailing`) have no preloader markup and open immediately without any delay.
4. **Git as Memory**:
   - Every meaningful update must be committed with structured commit format under Gemini Flash.
5. **Mobile Hero Split 2-Column Layout**:
   - The mobile hero section (`@media (max-width: 820px)`) is split down the middle into 2 parallel columns:
     - Left Column: Eyebrow pill, dynamic rotating headline, and subcopy.
     - Right Column: Compact Built Different tactical badge tile with officer avatar, gold command bar, verified check, and 3 service rank stripes (Police, CDL, Accountability).
     - Full-Width Below: 3 primary action buttons, 3-column proof rail, and marquee ribbon.
     - Desktop version remains 100% untouched.
