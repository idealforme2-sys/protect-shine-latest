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
3. **Git as Memory**:
   - Every meaningful update must be committed with structured commit format under Gemini Flash.
