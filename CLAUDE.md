# CLAUDE.md — Novel Apps Corp. Product Suite Website
# Read this entire file before doing anything. Do not rush.
# This is a complex multi-phase build. Quality over speed.

---

## PROJECT FILE STRUCTURE

```
/docs
  /motiq        ← ALL MotIQ files: PDFs, briefs, flyers, AND .glb 3D models
  /eht          ← ALL EHT files: PDFs, briefs, flyers, AND .glb 3D models
CLAUDE.md
```

**There is no separate /models folder.** 3D model files (.glb) live inside
`/docs/motiq/` and `/docs/eht/` alongside the PDFs. When you inventory the
project at startup, list ALL files in both folders and note which are `.glb`
(models) vs `.pdf` (documents). Copy `.glb` files into `/src/assets/models/`
as part of the build setup.

---

## COMPANY & PRODUCT CONTEXT

**Company:** Novel Apps Corp. — ON, Canada. Contact: Sales@Novelapps.ca
**Brand logo:** A waveform inside a rounded square (used on both products)
**Brand voice:** Professional, credible, industrial, confident. Outcome-first, not tech-first.
  Every technical feature must be connected to a business outcome.
  Avoid academic language. Lead with: uptime, savings, reliability, visibility, protection.

**Two products — one suite:**

### MotIQ — Intelligent Motor Health & Power Monitoring System
- **Tagline:** Electrical · Thermal · Operational Insight in One Device
- **Core positioning:** Makes hidden electrical and mechanical motor problems visible early
- **What it does:** Combines Motor Current Signature Analysis (CSA), 3-phase power/energy
  monitoring, optional infrared thermal monitoring of contactors, and motor control —
  all in one compact industrial device with an 800×480 LCD, BMS/SCADA integration via
  Modbus RTU / BACnet TCP-IP
- **Three tiers:**
  - Pro: CSA + power/energy monitoring + local display + BMS integration
  - Ultra: Pro + infrared thermal monitoring (8×8 array) of contactors/connections
  - Premier: Ultra + motor control (Start/Stop/Auto, remote dry contact, automation)
- **Key monitored parameters:**
  Broken rotor bar, eccentricity (static/dynamic), electrical & load unbalance, slip frequency,
  torque hunting, misalignment (CSA-indicative), bearing-related signatures, stator anomalies,
  active power, reactive power, apparent power, power factor, voltage/current harmonics,
  frequency stability, run hours, energy (kWh), motor contactor temperature (thermal),
  start/stop frequency, predictive alarms, active alarms, health score (0-100%)
- **Typical applications:** Pumps, HVAC fans/AHUs, compressors, conveyors, critical MCC-fed
  motors in industrial and commercial facilities, water/wastewater, oil & gas, manufacturing
- **Hero headline options from docs:**
  "Predict. Prevent. Protect." /
  "Smarter Motor Monitoring for Reliable Operations" /
  "Reduce Downtime. Improve Efficiency. Protect Critical Motors."
- **Key ROI examples (illustrative, not guaranteed):**
  - 5% energy loss on a 30kW motor × 6,000h/yr = $1,080/yr × 10 motors = $10,800/yr
  - Early bearing warning: $1,500 planned repair vs $20,000 emergency downtime event
  - Avoiding one emergency service + starter replacement: ~$6,000 saved
  - Contactor hotspot caught early: hundreds vs thousands in emergency repairs
- **Physical product appearance:** A dark rectangular device with an industrial LCD screen
  mounted to a wall panel, showing metrics like Health Score 100%, Running status, Voltage,
  Current, Active Power, Temperature. Screen has a dark navy/charcoal UI with blue and
  orange accent data.

### EHT — Equipment Health Tracker
- **Full name:** Equipment Health Tracker
- **Tagline:** Intelligent Condition Monitoring and Early Fault Detection for Rotating Equipment
- **Slogan:** "Making hidden machine behavior visible" / "Making motor health visible before failure"
- **Core positioning:** A compact wireless sensor bolted directly onto rotating equipment
  that uses ML to detect faults BEFORE thresholds are breached
- **What it does:** Measures vibration (triaxial), sound (acoustic), and temperature simultaneously.
  Performs on-device ML analysis. Sends actionable maintenance insights — not raw data —
  to BMS. Detects: bearing wear, misalignment, unbalance, cavitation in pumps, and more.
- **Key differentiator vs MotIQ:** EHT is a physical sensor mounted ON the machine (bearing
  housing). MotIQ is a panel-mounted monitoring device working from electrical signals.
  They are COMPLEMENTARY — EHT for mechanical/acoustic health ON the asset,
  MotIQ for electrical/power/thermal health from the panel.
- **What EHT detects:**
  Bearing wear, misalignment, unbalance, cavitation (pumps), looseness, early-stage
  mechanical faults — detected through pattern analysis across vibration + sound + temperature
  together over time, not just fixed threshold alarms.
- **Typical applications:** Induction motors, pumps, fans/blowers, air blowers, compressors —
  installed directly on the machine near the bearing housing
- **Ideal customers:** Facilities with multiple motors/pumps/air handlers; environments where
  downtime impacts production or safety; maintenance teams without vibration experts on site;
  BMS-driven sites needing actionable insights, not raw sensor data
- **Physical product appearance:** A compact cylindrical sensor — stainless steel body with
  a white domed top (looks like a puck/bolt), cable out the side. Mounts on top of motors.
  Clean, industrial, minimal.
- **Benefits:** Reduce downtime, boost efficiency, enhance safety, simplify maintenance,
  BMS integration for centralized condition data

---

## WEBSITE ARCHITECTURE

**One site. Two products. One brand.**

### URL / Page Structure
```
/                    ← Company hero + product suite overview + split to products
/motiq               ← Full MotIQ product page
/eht                 ← Full EHT product page
/contact             ← Single contact/demo page (shared)
```

All four pages share the same nav, footer, design system, and font/color tokens.
Build as a Vite multi-page app (separate HTML entry points per route) or use
hash-based routing in a single HTML — your choice, but nav links must work.

---

## DESIGN SYSTEM

### Palette
```css
--color-bg:           #F7F7F5;   /* warm off-white — dominant */
--color-surface:      #FFFFFF;
--color-surface-2:    #F0F0EE;   /* subtle card backgrounds */
--color-text-primary: #0C0C0C;
--color-text-secondary: #5A5A5A;
--color-text-muted:   #9A9A9A;
--color-accent:       #1E3A5F;   /* deep navy — primary accent, from brand blue */
--color-accent-warm:  #E07B2A;   /* orange — from brand, use sparingly for highlights */
--color-border:       rgba(0,0,0,0.08);
--color-dark-section: #0D0F14;   /* for stats bar only */
```

**Rules:**
- White/warm-white is DOMINANT throughout. The site breathes.
- Navy (`--color-accent`) for headlines, active states, key UI elements
- Orange (`--color-accent-warm`) only for: one highlight word per headline,
  key stat numbers, hover states on CTAs. Never as a background.
- ONE dark section allowed: the stats/impact bar. Everything else is light.
- No gradients on backgrounds. No glow effects. No neon.
- Glass cards: `background: rgba(255,255,255,0.75); backdrop-filter: blur(16px);`
  with a `1px solid rgba(0,0,0,0.06)` border.

### Typography
- **Display/Headings:** `Syne` (Google Fonts) — weight 700 for headlines,
  400 for large subtext. Architectural, precise, distinctive.
- **Body:** `DM Sans` (Google Fonts) — weight 400/500. Clean, readable.
- **Monospace/Data:** `JetBrains Mono` or `IBM Plex Mono` — for metric values,
  health scores, parameter readings in the dashboard/widget sections.
- Scale: Hero headline 72-96px (desktop), section headlines 40-56px, body 16-18px.
- Never use Inter, Roboto, or Arial.

### Motion
- Slow, confident. Ease-out. Nothing bounces.
- Page load: staggered fade-up of hero elements, 80ms apart
- Scroll reveals: `opacity 0 → 1`, `translateY(24px) → 0`, duration 600ms
- 3D animations: smooth, scrubbed to scroll. Never jittery.
- Hover: subtle lift `translateY(-2px)` + shadow increase, 200ms ease

---

## PHASE 1 — PARALLEL DOCUMENT ANALYSIS

Use the Task tool to spawn subagents — one per document group.

**You already have significant pre-loaded context from the documents provided.
Use it. Do not re-read documents to extract information you already have.**

Instead, use Phase 1 to fill any gaps. Assign subagents to read any additional
documents found in `/docs/motiq/` and `/docs/eht/` that were NOT included in
your initial context.

**File structure is:**
```
/docs
  /motiq        ← all MotIQ PDFs + .glb models
  /eht          ← all EHT PDFs + .glb models
```
When loading 3D models, look for `.glb` files inside `/docs/motiq/` and `/docs/eht/`
respectively — not in a separate `/models/` folder. Copy them into `/src/assets/models/`
at build time (add to vite config as static assets).

For each document a subagent reads, return:
```json
{
  "source": "<filename>",
  "product": "motiq | eht | both",
  "new_information": ["<facts not already in CLAUDE.md>"],
  "copy_gems": ["<exact phrases worth using or adapting in website copy>"],
  "stats_or_numbers": ["<any specific figures>"],
  "suggested_use": "<which website section this content serves best>"
}
```

Wait for ALL subagents before Phase 2.

---

## PHASE 2 — CONTENT BRIEF GENERATION

Write `content-brief.json` to the project root. Structure:

```json
{
  "company": {
    "name": "Novel Apps Corp.",
    "email": "Sales@Novelapps.ca",
    "tagline": "Intelligent Monitoring for Critical Assets",
    "suite_hero_headline": "See What Others Miss",
    "suite_hero_sub": "Two intelligent monitoring systems. One mission: keep your equipment running."
  },
  "motiq": {
    "hero_headline": "Predict. Prevent. Protect.",
    "hero_sub": "MotIQ makes hidden electrical and mechanical motor problems visible — early enough to act.",
    "tiers": ["Pro", "Ultra", "Premier"],
    "parameters": [...],
    "roi_cases": [...],
    "features": [...],
    "sections": [...]
  },
  "eht": {
    "hero_headline": "Making Hidden Machine Behavior Visible",
    "hero_sub": "EHT detects developing faults in rotating equipment before they become failures.",
    "sensors": ["Vibration", "Sound (Acoustic)", "Temperature"],
    "fault_types": [...],
    "benefits": [...],
    "sections": [...]
  },
  "shared_stats": [
    { "value": "$18,500", "label": "avg. avoided downtime cost per bearing event" },
    { "value": "$10,800", "label": "potential annual energy savings across 10 motors" },
    { "value": "24/7", "label": "continuous monitoring" },
    { "value": "3-in-1", "label": "vibration · sound · temperature (EHT)" }
  ]
}
```

Populate all fields from your document knowledge. Save the file.

---

## PHASE 3 — BUILD

### Stack
- **Framework:** Vite (vanilla JS, no framework)
- **3D:** Three.js r160+ with GLTFLoader, DRACOLoader, RGBELoader
- **Animation:** GSAP 3 + ScrollTrigger + SplitText (or manual char splitting)
- **Fonts:** Google Fonts (`Syne`, `DM Sans`, `JetBrains Mono`)
- **CSS:** Custom properties only — no Tailwind, no Bootstrap
- **Build:** `npm run build` must complete clean

Install all dependencies via npm before writing any code.

---

### PAGE 1: HOME (`index.html`)

#### Section 1.1 — COMPANY HERO (full viewport, light)
- Background: `--color-bg` with a very subtle grain texture overlay (CSS noise)
- Center: Company name "Novel Apps Corp." in small caps, muted, above the main headline
- Main headline: Large `Syne` — e.g. **"See What Others Miss"**
  One word in `--color-accent-warm` (orange), rest in `--color-text-primary`
- Subheadline: Single sentence, `DM Sans`, secondary text color
- Below: Two product entry cards side-by-side (or stacked mobile):
  ```
  [ MotIQ card ]          [ EHT card ]
  Intelligent Motor       Equipment Health
  Health & Power          Tracker
  Monitoring              →  Explore EHT
  →  Explore MotIQ
  ```
  Cards: white surface, 1px border, subtle shadow. On hover: nav accent underline,
  arrow animates right 4px.
- If 3D models exist in `/docs/motiq/` or `/docs/eht/`: render a subtle, slowly-rotating combined scene
  showing BOTH products together (MotIQ panel device + EHT sensor) in the background,
  very faint, desaturated, as atmosphere — not as the focus. If no models yet,
  use a CSS animated grid/circuit-line background pattern instead.
- Nav slides in after hero animation: `Novel Apps Corp.` left, `MotIQ | EHT | Contact` right.
  Nav is transparent over hero, becomes `rgba(247,247,245,0.92) + blur(12px)` on scroll.

#### Section 1.2 — PRODUCT SUITE OVERVIEW (light)
- Headline: "Two Products. One Mission."
- Two columns: left = MotIQ summary, right = EHT summary
- Each column: product name (large, navy), 2-sentence description, 3 key benefit pills
  (small bordered tags), "Learn More →" link
- A thin vertical dividing line between the columns
- The MotIQ device image and EHT sensor image appear as subtle background
  elements behind each column (very low opacity, ~10%), giving depth

#### Section 1.3 — THE PROBLEM (light, full-width)
- Headline: "Most failures don't happen suddenly."
- Subtext: One paragraph on how problems develop invisibly until they become costly
- Three pain point cards: Unexpected Failures / Unplanned Downtime / Reactive Maintenance
  Each card: minimal — icon (SVG line), title, one sentence
- This section should feel like the moment the visitor recognizes their own problem

#### Section 1.4 — STATS BAR (dark — the ONE dark section)
- Background: `--color-dark-section` (#0D0F14)
- Full-width, 4 stats from `content-brief.json` shared_stats
- Numbers count up from 0 when scrolled into view (GSAP counter)
- Monospaced numbers (`JetBrains Mono`), white, large
- Labels in muted grey beneath
- A very subtle horizontal scan-line animation across the bar (CSS, 4s loop)

#### Section 1.5 — CLOSING CTA (light)
- Simple. Large centered headline, one CTA button (outlined, fills on hover)
- "Ready to see what your equipment is telling you?"
- Button: "Contact Sales" → `/contact`

---

### PAGE 2: MOTIQ (`motiq.html`)

#### Section 2.1 — MOTIQ HERO (full viewport, light)
- Large headline: **"Predict. Prevent. Protect."**
  The word "Prevent" in orange.
- Subheadline: "MotIQ continuously monitors the electrical, mechanical, and operational
  behavior of motor-driven assets — so you can act before failure costs you."
- If MotIQ `.glb` model exists in `/docs/motiq/`: render it centered, dramatic top-left
  lighting, rotating slowly, stops at 3/4 angle. The device LCD screen should face the viewer.
  Use `THREE.RectAreaLight` to create a subtle screen-glow effect on the device face.
  If no model: use a high-quality CSS/SVG illustration of the device with animated data
  lines flowing into it.
- Staggered character-by-character reveal of the headline on load (split by word, not char)
- Below hero: Three tier badges in a row — Pro / Ultra / Premier — with a brief descriptor each

#### Section 2.2 — PRODUCT ASSEMBLY / SCROLL SEQUENCE (pinned)
- ScrollTrigger `pin: true` for the full scroll duration
- If multiple MotIQ model parts exist in `/docs/motiq/`:
  Animate parts from exploded positions assembling into the final device.
  Each assembled part triggers a floating label callout line.
  Callouts to show: CSA Sensor Inputs / LCD Display / Thermal Array / BMS Output / Power Input
- If only one model file: do a camera orbit + zoom sequence instead, with different
  faces of the device highlighting as scroll progresses, with labels appearing per face.
- Label style: thin 1px line from point to a small frosted-glass card.
  Card shows: parameter name + one-line business value.
  Example: "Thermal Array → Catches overheating contactors before panel failures"

#### Section 2.3 — WHAT MOTIQ MONITORS (light)
- Headline: "MotIQ Monitors the Conditions That Matter Most"
- Intro: One sentence connecting monitoring to business outcomes
- Two-column parameter grid:
  **Left: Electrical & Power**           **Right: Condition & Fault**
  Low Power Factor                        Broken Rotor Bar Indication
  Active / Reactive Power                 Eccentricity
  Power Quality                           Misalignment (CSA)
  Voltage & Current Unbalance             Bearing Issue Indication
  Harmonic Distortion                     Start/Stop Frequency
  Energy (kWh)                            Motor Contactor Temperature
                                          Health Score (0–100%)
                                          Predictive & Active Alarms
- Each parameter: clicking/hovering expands an inline tooltip explaining the
  BUSINESS VALUE (not the technical definition). Pull exact language from the
  website brief doc.
- Do NOT show raw technical definitions. Always frame as: "Why does this matter to you?"

#### Section 2.4 — LIVE DASHBOARD PREVIEW (light, interactive feel)
- Inspired by the reference digital twin screenshots: an animated mock of the MotIQ
  device screen showing live-style data updating
- Build a CSS/JS animated replica of the MotIQ LCD display:
  - Dark navy background, monospaced readings
  - Health Score: animated from 72% → 100% on scroll-in
  - Current, Active Power, Temperature: numbers tick/update every 2-3 seconds
  - Status badge: "RUNNING" in green
  - A small 8×8 thermal grid (colored squares) animates hot → cool
- This is HTML/CSS — NOT Three.js. Position it as a floating device mockup
  (angled 10° with CSS perspective) next to explanatory text.
- Left text panel: "From Raw Signals to Actionable Insight"
  Describe predictive alarms vs active alarms. Pull copy from the website brief doc.

#### Section 2.5 — BUSINESS IMPACT / ROI (light)
- Headline: "Why Early Detection Matters to the Bottom Line"
- Four ROI scenario cards (accordion — closed by default, opens on click):
  1. Energy savings from power factor & unbalance
  2. Downtime avoidance from early bearing warning
  3. Frequent starts & equipment wear
  4. Contactor overheating risk
- Each card header: scenario title + "~$X,XXX potential impact" teaser
- Expanded: full scenario explanation from the website brief, framed as illustrative examples
- Add disclaimer: "Scenarios are illustrative examples. Results vary by facility and asset."

#### Section 2.6 — THREE TIERS (light)
- Headline: "Choose the Right Level of Intelligence"
- Three columns: Pro | Ultra | Premier
- Each: name, tagline, feature checklist (checkmarks), a "Learn More" or "Request Demo" CTA
- Pro is the baseline. Ultra adds thermal. Premier adds control.
- Use subtle visual hierarchy — Premier slightly elevated/highlighted with a thin accent border

#### Section 2.7 — APPLICATIONS (light)
- Headline: "Where MotIQ Works"
- Six application tiles: Pumps / HVAC Fans & AHUs / Compressors / Conveyors /
  Water & Wastewater / Manufacturing MCC Feeders
- Each tile: minimal SVG line icon + name + one sentence
- Hover: tile background shifts to `--color-accent` (navy), text inverts to white

#### Section 2.8 — CLOSING CTA
- "MotIQ is valuable because it creates time to respond before failure affects operations."
- CTA: "Request a Demo" → `/contact`

---

### PAGE 3: EHT (`eht.html`)

#### Section 3.1 — EHT HERO (full viewport, light)
- Headline: **"Making Hidden Machine Behavior Visible"**
  "Hidden" in orange.
- Subheadline: "EHT combines vibration, sound, and temperature analysis with machine
  learning to detect developing faults in rotating equipment — long before traditional
  alarms trigger."
- If EHT `.glb` model exists in `/docs/eht/`: render the sensor puck mounted on top
  of a simplified motor geometry (box mesh if no motor model). Animate: three signal waves
  (vibration wave, sound rings, temperature glow) emanating from the sensor on loop.
  These should be particle/shader effects or CSS animations positioned via 3D projection.
- If no model: use an SVG animation of the sensor with signal rings radiating outward.

#### Section 3.2 — THE THREE SIGNALS (scroll sequence, pinned)
- ScrollTrigger pinned section
- Three phases as user scrolls:
  **Phase 1 — Vibration:** Camera/view focuses on the sensor, a sine wave animation
    appears. Label: "Triaxial Vibration — Detects imbalance, misalignment, looseness"
  **Phase 2 — Sound:** Acoustic waveform visualization appears around the sensor.
    Label: "Acoustic Analysis — Catches cavitation, bearing noise, early wear"
  **Phase 3 — Together:** All three signals combine into a single "Machine Health Index"
    value. Label: "Combined ML Analysis — Pattern recognition across all signals over time"
- This tells the EHT story visually: it's not just threshold alarms, it's pattern intelligence.

#### Section 3.3 — WHAT EHT DETECTS (light)
- Headline: "Faults EHT Identifies Early"
- Six fault cards in a 3×2 grid:
  Bearing Wear / Misalignment / Unbalance /
  Cavitation (pumps) / Looseness / Early-Stage Mechanical Faults
- Each card: SVG line icon, fault name, short description of how EHT detects it and why
  catching it early matters. Pull from the EHT docs' "Making the Invisible Visible" slide.

#### Section 3.4 — HOW EHT IS DIFFERENT (light)
- Headline: "Not Just Alarms. Intelligence."
- Two-column contrast layout:
  **Traditional monitoring:** Fixed thresholds. Alarms only when it's too late.
  **EHT:** Analyses how signals evolve together over time. Catches patterns.
- Three real examples from the docs (pull exactly these scenarios):
  1. Sound + vibration indicate pump cavitation — even when vibration within limits
  2. High-frequency sound + rising temp = developing bearing issue — before alarms trigger
  3. Vibration pattern changes at running speed = misalignment/unbalance — via trend, not threshold
- Visual: a timeline showing fault development → EHT detection point → traditional alarm point
  (EHT catches it significantly earlier on the timeline)

#### Section 3.5 — DASHBOARD / BMS INTEGRATION (light)
- Headline: "Actionable Insights, Not Raw Data"
- Animate a mock of the EHT BMS dashboard (from the slide showing "Pump Status" table):
  - Table rows: Pump 1–8, status indicators (green = Good, orange = warning)
  - One row (e.g. Pump 4) shows "Misalignment Detected" in amber
  - This animates in: rows load one by one, then the warning row flashes subtly
- Left text: "EHT sends processed diagnostic results directly to your BMS.
  No specialist required to interpret raw vibration data."

#### Section 3.6 — WHO NEEDS EHT (light)
- Headline: "Built for Facilities That Can't Afford Surprises"
- Four customer profile cards (from the docs):
  1. Facilities with multiple motors, pumps, and air handlers
  2. Environments where downtime impacts production or safety
  3. Maintenance teams without vibration experts on site
  4. BMS-driven sites needing actionable insights, not raw sensor data
- Each card: a simple geometric icon, title, one clarifying sentence

#### Section 3.7 — APPLICATIONS (light)
- Headline: "Where EHT Is Installed"
- Six application tiles: Induction Motors / Pumps / Fans & Blowers /
  Air Blowers / Compressors / Air Handlers
- Same style as MotIQ applications section

#### Section 3.8 — CLOSING CTA
- "Every facility is different. Every rotating asset has its own operating profile and risks."
- "EHT is designed to adapt to your application."
- CTA: "Contact Us" → `/contact`

---

### PAGE 4: CONTACT (`contact.html`)

- Simple, clean, centered layout
- Company name + logo mark
- "Let's Talk About Your Monitoring Needs"
- Email: Sales@Novelapps.ca (large, clickable mailto link)
- Short form: Name / Company / Email / Message / Which product interests you (MotIQ / EHT / Both)
