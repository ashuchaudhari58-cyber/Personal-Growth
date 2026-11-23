/* ============================================================
   Portfolio content — Design Engineer
   Confidentiality rule: owners named only; no project codes,
   EPC/contractor names, coordinates or commercial values.
   All visuals are hand-built SVG (no image assets).
   ============================================================ */

/* ---------- Shared SVG helpers (engineering-drawing look; colours come from CSS classes) ----------
   s-ink / s-mute / s-acc / s-ground  -> stroke colours
   f-ink / f-acc / f-card / f-fill / f-water / f-paper -> fills
   t / t-acc -> annotation text                                                                    */
function svgFrame(uid, inner, defs = "") {
  return `<svg class="viz" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid-${uid}" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20 0H0V20" fill="none" class="s-grid" stroke-width="0.6"/>
      </pattern>
      <marker id="ar-${uid}" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7z" class="f-acc"/></marker>
      <marker id="ai-${uid}" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6z" class="f-ink"/></marker>
      ${defs}
    </defs>
    <rect width="400" height="250" class="f-paper"/>
    <rect width="400" height="250" fill="url(#grid-${uid})"/>
    ${inner}
  </svg>`;
}
const T = (x, y, t, acc = false, anchor = "start") => `<text x="${x}" y="${y}" class="${acc ? "t t-acc" : "t"}" text-anchor="${anchor}">${t}</text>`;
const AR = (uid) => `marker-end="url(#ar-${uid})"`;
const AI = (uid) => `marker-end="url(#ai-${uid})"`;
// horizontal dimension line with end ticks and centred value
const dimH = (x1, x2, y, txt) => `<g class="s-mute" stroke-width="0.8"><path d="M${x1} ${y}H${x2}"/><path d="M${x1} ${y - 4}v8M${x2} ${y - 4}v8"/></g>${T((x1 + x2) / 2, y - 4, txt, false, "middle")}`;
const strata = () => [160, 190, 220].map((y) => `<path d="M0 ${y} Q100 ${y - 5} 200 ${y} T400 ${y}" fill="none" class="s-ground" stroke-dasharray="2 5" stroke-width="0.8"/>`).join("");
const titleBlock = (code, name) => `<g><rect x="296" y="218" width="96" height="24" class="f-card s-ink" stroke-width="0.8"/><path d="M328 218V242" class="s-ink" stroke-width="0.8"/>${T(302, 234, code, true)}${T(334, 234, name)}</g>`;

/* ---------- Visual builders ---------- */
function vizHDD(uid) {
  return svgFrame(uid, `
    ${strata()}
    <path d="M146 97 Q172 120 200 120 Q228 120 254 97 Z" class="f-water"/>
    <path d="M0 92 H140 Q170 124 200 124 Q230 124 260 92 H400" fill="none" class="s-ink" stroke-width="1.4"/>
    <path d="M30 92 L95 148 Q200 222 305 148 L370 92" fill="none" class="s-acc" stroke-width="2.6"/>
    <rect x="12" y="82" width="36" height="9" class="f-ink"/>
    ${T(12, 74, "RIG · ENTRY")}${T(388, 80, "EXIT", false, "end")}
    <path d="M200 124 V180" class="s-mute" stroke-width="0.8" stroke-dasharray="3 2"/>${T(206, 160, "cover ≥ scour")}
    <path d="M352 112 l-16 -12" class="s-acc" stroke-width="1.6" ${AR(uid)}/>${T(330, 132, "pullback", true)}
    ${dimH(30, 370, 34, "L horizontal")}
    ${titleBlock("HDD", "profile")}`);
}
function vizOutfall(uid) {
  return svgFrame(uid, `
    <path d="M150 62 H400 V122 H232 Z" class="f-water"/>
    <path d="M0 92 H150 L232 122 H400" fill="none" class="s-ink" stroke-width="1.4"/>
    <path d="M150 62 H400" class="s-mute" stroke-width="0.8" stroke-dasharray="6 3"/>${T(392, 56, "MSL", false, "end")}
    <path d="M30 92 L90 140 Q190 198 300 150 L362 122" fill="none" class="s-acc" stroke-width="4" stroke-linecap="round"/>
    ${[110, 150, 190, 230, 270].map((x) => `<path d="M${x} 210 v-12" class="s-ink" stroke-width="1" ${AI(uid)}/>`).join("")}
    ${T(20, 236, "buoyancy · ballast fill")}${T(20, 80, "HDPE STRING")}
    ${titleBlock("HDD", "outfall")}`);
}
function vizMT(uid) {
  let pipes = "";
  for (let i = 0; i < 8; i++) pipes += `<rect x="${88 + i * 25}" y="140" width="23" height="24" class="f-card s-ink" stroke-width="1"/>`;
  return svgFrame(uid, `
    ${strata()}
    <path d="M0 70 H40 M84 70 H316 M358 70 H400" class="s-ink" stroke-width="1.4"/>
    <path d="M40 70 V182 H84 V70 M316 70 V182 H358 V70" fill="none" class="s-ink" stroke-width="1.4"/>
    <rect x="44" y="134" width="7" height="36" class="f-acc"/>
    ${pipes}
    <path d="M290 140 h16 l8 12 l-8 12 h-16 z" class="f-ink"/>
    <path d="M56 152 h28" class="s-acc" stroke-width="1.8" ${AR(uid)}/>${T(88, 132, "jacking force F", true)}
    ${T(40, 198, "LAUNCH")}${T(358, 198, "RECEPTION", false, "end")}
    ${dimH(88, 316, 108, "drive length")}
    ${titleBlock("MT", "drive")}`);
}
function vizSettle(uid) {
  let d = "M20 78";
  for (let x = 20; x <= 380; x += 6) d += ` L${x} ${(78 + 40 * Math.exp(-Math.pow((x - 200) / 58, 2) / 2)).toFixed(1)}`;
  return svgFrame(uid, `
    <path d="M0 78 H400" class="s-mute" stroke-width="0.8" stroke-dasharray="4 3"/>
    <path d="${d}" fill="none" class="s-acc" stroke-width="2"/>
    <circle cx="200" cy="180" r="22" class="f-card s-ink" stroke-width="1.4"/>
    <path d="M200 122 v36" class="s-mute" stroke-width="0.8" stroke-dasharray="2 3"/>
    ${dimH(142, 258, 62, "2 i")}${T(208, 112, "S max", true)}${T(230, 186, "z0")}
    <rect x="300" y="46" width="40" height="32" fill="none" class="s-ink" stroke-width="1"/>${T(300, 40, "building")}
    ${T(20, 236, "Vl = face + shield + tail")}
    ${titleBlock("MT", "settle")}`);
}
function vizDP(uid) {
  return svgFrame(uid, `
    <path d="M170 68 H400 V128 H240 Z" class="f-water"/>
    <path d="M0 94 H170 L240 128 H400" fill="none" class="s-ink" stroke-width="1.4"/>
    <rect x="14" y="84" width="58" height="12" class="f-ink"/>${T(14, 76, "PIPE THRUSTER")}
    <path d="M72 90 L120 118 Q230 184 330 140" fill="none" class="s-acc" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M326 134 l18 -6 l2 14 z" class="f-ink"/>${T(300, 162, "MTBM")}
    <path d="M30 112 h40" class="s-acc" stroke-width="1.8" ${AR(uid)}/>${T(16, 128, "thrust vs capacity", true)}
    ${T(20, 236, "face + friction + capstan")}
    ${titleBlock("DP", "landfall")}`);
}
function vizSheet(uid) {
  return svgFrame(uid, `
    <path d="M0 88 H196" class="s-ink" stroke-width="1.4"/>
    <path d="M204 140 H400" class="s-ink" stroke-width="1.4"/>
    <path d="M200 66 V214" class="s-ink" stroke-width="4"/>
    <path d="M200 88 L150 140 L200 140 Z" fill="none" class="s-mute" stroke-width="1"/>
    <path d="M200 140 L286 214 L200 214 Z" fill="none" class="s-acc" stroke-width="1.2"/>
    <path d="M60 76 H192" class="s-acc" stroke-width="2" ${AR(uid)}/>${T(40, 66, "rig reaction (pull)", true)}
    ${T(156, 156, "Ka")}${T(258, 200, "Kp", true)}
    ${T(20, 236, "LE + Winkler springs")}
    ${titleBlock("STR", "anchor")}`);
}
function vizStress(uid) {
  return svgFrame(uid, `
    <defs><linearGradient id="st-${uid}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#2c5f8a"/><stop offset=".45" stop-color="#4f9a8a"/><stop offset=".72" stop-color="#e3b23c"/><stop offset="1" stop-color="#d9480f"/>
    </linearGradient></defs>
    <path d="M60 116 q140 56 280 0" fill="none" stroke="url(#st-${uid})" stroke-width="16"/>
    <path d="M60 116 H340" class="s-mute" stroke-width="0.8" stroke-dasharray="4 3"/>
    <path d="M52 126 l8 -10 l8 10 z M332 126 l8 -10 l8 10 z" fill="none" class="s-ink" stroke-width="1.2"/>
    <path d="M200 52 v40" class="s-acc" stroke-width="2" ${AR(uid)}/>${T(208, 62, "W rated", true)}
    <rect x="20" y="212" width="84" height="7" fill="url(#st-${uid})"/>${T(20, 236, "σ von Mises")}
    ${titleBlock("FEA", "beam")}`);
}
function vizFrame(uid) {
  const cols = [92, 150, 208, 266, 324].map((x) => `<path d="M${x} 62 V186" class="s-ink" stroke-width="3.2"/>`).join("");
  return svgFrame(uid, `
    <rect x="72" y="50" width="272" height="12" class="f-card s-ink" stroke-width="1.2"/>
    <rect x="72" y="186" width="272" height="12" class="f-card s-ink" stroke-width="1.2"/>
    ${cols}
    <path d="M92 62 L150 186 M150 62 L208 186 M208 62 L266 186 M266 62 L324 186" class="s-mute" stroke-width="0.8"/>
    ${[110, 208, 306].map((x) => `<path d="M${x} 14 v30" class="s-acc" stroke-width="2" ${AR(uid)}/>`).join("")}
    ${T(20, 236, "CHS columns · AISC 360")}
    ${titleBlock("STR", "frame")}`);
}
function vizClamp(uid) {
  return svgFrame(uid, `
    <defs><linearGradient id="cl-${uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d9480f"/><stop offset=".45" stop-color="#e3b23c"/><stop offset="1" stop-color="#4f9a8a"/>
    </linearGradient></defs>
    <rect x="30" y="108" width="340" height="34" class="f-card s-ink" stroke-width="1.2"/>
    <path d="M30 125 H370" class="s-mute" stroke-width="0.6" stroke-dasharray="8 3 2 3"/>
    <path d="M120 70 h160 l-14 38 h-132 z" fill="url(#cl-${uid})" class="s-ink" stroke-width="1"/>
    <path d="M120 180 h160 l-14 -38 h-132 z" fill="url(#cl-${uid})" class="s-ink" stroke-width="1" opacity="0.85"/>
    <path d="M200 28 v36" class="s-acc" stroke-width="2" ${AR(uid)}/><path d="M200 222 v-36" class="s-acc" stroke-width="2" ${AR(uid)}/>
    <path d="M300 125 h56" class="s-ink" stroke-width="1.6" ${AI(uid)}/>
    ${T(208, 40, "clamping", true)}${T(304, 100, "thrust")}
    ${T(20, 236, "frictional contact")}
    ${titleBlock("FEA", "clamp")}`);
}
function vizVenturi(uid) {
  return svgFrame(uid, `
    <path d="M36 88 H150 L200 110 H250 L362 78 V172 L250 140 H200 L150 162 H36 Z" class="f-card s-ink" stroke-width="1.4"/>
    <path d="M36 125 H362" class="s-mute" stroke-width="0.6" stroke-dasharray="8 3 2 3"/>
    <path d="M60 125 H192" class="s-acc" stroke-width="2.2" ${AR(uid)}/>
    <path d="M176 36 V98" class="s-ink" stroke-width="1.4" ${AI(uid)}/>
    ${T(60, 116, "motive jet", true)}${T(184, 34, "slurry suction")}
    ${T(276, 70, "diffuser")}${T(206, 158, "throat")}
    ${dimH(200, 250, 196, "Lth")}
    ${titleBlock("R&amp;D", "jet pump")}`);
}
function vizPush(uid) {
  let w = "";
  for (let x = 120; x <= 360; x += 6) w += `${x === 120 ? "M" : "L"}${x} ${(125 + 12 * Math.sin((x - 120) / 14)).toFixed(1)} `;
  return svgFrame(uid, `
    <rect x="20" y="112" width="70" height="26" class="f-ink"/>${T(20, 104, "THRUSTER")}
    <path d="M120 98 H370 M120 152 H370" class="s-ink" stroke-width="1.2"/>
    <path d="M90 125 H120" class="s-acc" stroke-width="6"/>
    <path d="${w}" fill="none" class="s-acc" stroke-width="5" stroke-linecap="round"/>
    ${T(245, 180, "sinusoidal → helical", true, "middle")}
    ${T(20, 236, "Dawson–Paslay · Gao")}
    ${titleBlock("HDD", "buckling")}`);
}
function vizHeader(uid) {
  return svgFrame(uid, `
    <rect x="36" y="104" width="170" height="42" class="f-card s-ink" stroke-width="1.2"/>${T(36, 96, "HDPE PIPE")}
    <rect x="198" y="94" width="72" height="62" class="f-fill s-ink" stroke-width="1.2"/>
    ${[110, 125, 140].map((y) => [212, 234, 256].map((x) => `<circle cx="${x}" cy="${y}" r="3.2" class="f-ink"/>`).join("")).join("")}
    <path d="M270 125 h40" class="s-ink" stroke-width="5"/><circle cx="320" cy="125" r="10" fill="none" class="s-ink" stroke-width="3"/>
    <path d="M334 125 h40" class="s-acc" stroke-width="2.2" ${AR(uid)}/>${T(334, 112, "pull", true)}
    ${T(20, 236, "bolt groups · sleeve · lug")}
    ${titleBlock("R&amp;D", "header")}`);
}
function vizHydro(uid) {
  return svgFrame(uid, `
    <path d="M30 196 H370 M30 196 V36" class="s-ink" stroke-width="1"/>
    <path d="M30 175 Q200 -20 370 175" fill="none" class="s-ink" stroke-width="1.8"/>
    <path d="M30 160 L370 140" fill="none" class="s-acc" stroke-width="2"/>
    <circle cx="52" cy="159" r="6" fill="none" class="s-acc"/><circle cx="352" cy="141" r="6" fill="none" class="s-acc"/>
    ${T(200, 64, "allowable  Pmax / FOS", false, "middle")}${T(200, 170, "required mud pressure", true, "middle")}
    ${T(36, 212, "chainage →")}${T(36, 32, "p")}
    ${titleBlock("HDD", "frac-out")}`);
}

/* ---------- About ---------- */
const ABOUT = [
  `I'm a <strong>Design Engineer at Trenchless Engineering Services Pvt. Ltd.</strong> (since July 2024), working across <strong>horizontal directional drilling (HDD)</strong>, <strong>microtunnelling (MTBM / pipe jacking)</strong> and <strong>Direct Pipe</strong> for oil, gas, crude, water-intake, sewer, marine-outfall and cable-landfall crossings in India and abroad — including packages for <strong>ADNOC</strong>, <strong>Saudi Aramco</strong>, <strong>IOCL</strong>, <strong>GAIL</strong>, <strong>BPCL</strong> and <strong>HPCL</strong>.`,
  `My work sits where geometry, soil and pipe mechanics meet: I lay out the crossing, then prove it — pullback, push and buckling for steel and HDPE pipe; jacking force, face pressure and settlement for microtunnels; launch shafts, thrust walls and sheet-pile anchorages; and the installation methodology that ties it together. I've prepared <strong>70+ HDD and MT profiles</strong> with assembly drawings and answered client and EPCM comment cycles through to approval.`,
  `I also design the equipment: pipe-thruster clamps, MTBM thrust frames, lifting beams and a Venturi jet pump for slurry circuits, verified with hand calculations and <strong>ANSYS FEA</strong>. A mechanical background (M.Tech CAD/CAM, MNNIT Allahabad) and three years as a machinist apprentice at L&amp;T keep my designs buildable.`
];

/* ---------- Capabilities ---------- */
const CAPABILITIES = [
  {
    code: "HDD",
    title: "Horizontal Directional Drilling",
    lede: "Crossing design and installation analysis for steel and HDPE product pipe, 8\"–48\".",
    points: [
      "Profile geometry: entry/exit angles, tangents, bend radius vs Rmin, cover below scour",
      "Pullback & push forces — capstan on curves, buoyancy control, drag (steel & HDPE)",
      "Installation stress, combined-load and buckling checks; HDPE collapse (short & long term)",
      "Hydrofracture / annular-pressure check along the bore",
      "Pilot survey processing (ParaTrack / DigiTrack), as-built profiles, reamer sizing",
      "Onshore, onshore-to-offshore and offshore-to-offshore methodologies"
    ],
    codes: ["PRCI PR-227-9424", "ASTM F1962", "ASCE MOP 108", "ASME B31.4/B31.8", "API 5L", "ISO 21225-1"]
  },
  {
    code: "MT",
    title: "Microtunnelling & pipe jacking",
    lede: "Straight and curved drives in RCC, steel and GRP jacking pipe up to 2,400 mm ID.",
    points: [
      "Jacking force: face, slurry-film and weight friction, curved-drive capstan, IJS layout",
      "Ground settlement (Gaussian trough, O'Reilly & New) and building-damage screening",
      "Face-pressure window and face stability",
      "RCC jacking-pipe design and joint stress (IS 458), launch/reception shafts",
      "Structural integrity and stress reports for crude-line sleeve crossings"
    ],
    codes: ["ATV A 161", "IS 458", "IS 456", "O'Reilly & New", "BS 6282", "ASCE 36-15"]
  },
  {
    code: "DP",
    title: "Direct Pipe",
    lede: "Shore crossings and landfalls with a pipe thruster pushing a pre-welded string behind an MTBM.",
    points: [
      "Thrust calculation by NEN 3650 (Schrijvers Sigma) and Rabiei; thruster capacity check",
      "Pipe buckling (sinusoidal and helical onset) and stress/strain checks",
      "Pipe-lift, roller and clamp design for the string",
      "Risk-assessed comparison against curved MTBM and HDD alternatives"
    ],
    codes: ["NEN 3650", "Schrijvers Sigma", "DNV-OS-F101", "Rabiei 2018", "Gao & Miska"]
  },
  {
    code: "STR",
    title: "Structural & temporary works",
    lede: "The steel and concrete that holds the rig, the shaft and the thrust.",
    points: [
      "Thrust walls and launch shafts (limit state, IS 456 / IS 3370)",
      "Sheet-pile walls for HDD rig anchorage — limit equilibrium and Winkler beam",
      "MTBM thrust frames — column buckling to AISC 360 and FEA",
      "Lifting beams, frames and lugs to AISC 360 / IS 800"
    ],
    codes: ["IS 456", "IS 800", "AISC 360-16", "EN 1997-1", "USACE EM 1110-2"]
  },
  {
    code: "R&D",
    title: "Equipment design & FEA",
    lede: "Mechanical design of trenchless installation equipment, from load case to fabrication drawing.",
    points: [
      "Hydraulic pipe-thruster clamp and pusher (750 t class) — loads, jaw contact, cam & roller",
      "Thruster-clamp and thrust-frame FEA in ANSYS Mechanical (nonlinear contact)",
      "Venturi jet pump for MTBM slurry circuits — 1D design calculator + CFD",
      "BoMs, SOPs, fabrication data; wear-material selection study"
    ],
    codes: ["ANSYS Mechanical", "SolidWorks", "SpaceClaim", "AISC 360", "Hertz contact"]
  },
  {
    code: "DOC",
    title: "Engineering deliverables",
    lede: "Complete, reviewable packages that get approved.",
    points: [
      "Proposed / approved / as-built profiles and assembly drawings (AutoCAD, ZWCAD)",
      "Calculation reports with revision control (R0 → approved)",
      "Comment-response registers with client and EPCM reviewers",
      "Method statements, risk assessments, QAP/ITP inputs, pipe books"
    ],
    codes: ["AutoCAD", "ZWCAD", "AutoLISP", "Excel/VBA", "MS Project"]
  }
];

/* ---------- Case studies ---------- */
const PROJECTS = [
  {
    id: "adnoc-mt", cat: "mt",
    tag: "MT · Crude pipeline · UAE",
    title: "Microtunnelled sleeve crossings on a 48\" ADNOC crude line",
    desc: "Twelve 1,800 mm RCC sleeve drives under roads and utilities — jacking force, settlement and structural-integrity packages taken through client review.",
    tools: ["Excel calc suite", "AutoCAD", "ATV A 161"],
    outcome: "Design packages for a dozen microtunnel drives on a major ADNOC crude pipeline, each covering jacking force, settlement and sleeve structural integrity, with comment cycles closed through revision.",
    snapshot: { Owner: "ADNOC", Method: "Microtunnelling", Pipe: "1,800 mm ID RCC sleeve for 48\" line", Drives: "12" },
    problem: "A 48\" crude oil pipeline had to pass beneath roads and existing services at a series of chainages, each needing a microtunnelled RCC sleeve. Every drive required a calculation package acceptable to the owner's EPCM reviewers.",
    objective: "Prepared the profile, jacking-force and settlement calculations and the structural-integrity/stress report for each drive, then drafted the comment-response registers and revised the packages through review.",
    approach: [
      "Drive-by-drive profile from borelogs and existing-utility data.",
      "Jacking force from face resistance plus skin friction, with lubrication factor and permissible thrust on the RCC pipe (ATV A 161).",
      "Surface settlement by the Gaussian trough (O'Reilly & New / Peck) per the local NDRC manual, checked against utility and road tolerances.",
      "Structural integrity of the RCC sleeve under earth and traffic load; joint stress under eccentric jacking."
    ],
    figures: [["Drives designed", "12"], ["Sleeve ID", "1,800 mm"], ["Product pipe", "48\" crude"], ["Review cycles", "Rev A → Rev B"]],
    results: [
      "Packages issued and revised in response to owner/EPCM comments.",
      "Comment-response registers used as the audit trail for each change.",
      "Reusable straight-drive calculation template carried into later MT work."
    ],
    codes: ["ATV A 161", "O'Reilly & New", "Peck (1969)", "IS 458", "NDRC manual"],
    visual: vizMT
  },
  {
    id: "dp-landfall", cat: "dp",
    tag: "Direct Pipe · Gas landfall · Taiwan",
    title: "Direct Pipe thrust & buckling for a 36\" subsea gas landfall",
    desc: "Shore crossing for twin 36\" gas lines to a power plant: thrust to NEN 3650 and Rabiei, buckling and strain checks, and risk-assessed alternatives.",
    tools: ["Schrijvers Sigma", "Excel", "AutoCAD"],
    outcome: "Showed the planned thruster had adequate margin for the design thrust, and prepared a three-option risk comparison (Direct Pipe vs curved MTBM vs HDD) for the owner's decision.",
    snapshot: { Owner: "Taiwan Power Company", Method: "Direct Pipe", Pipe: "2 × 36\" steel, 3LPE", Length: "~800 m + 400 m seabed push" },
    problem: "Two 36\" gas lines had to be installed from shore to a seabed exit for a coastal power plant. The Direct Pipe thrust needed to stay inside thruster capacity without buckling the string, and recovering the MTBM at sea carried real risk.",
    objective: "Built the thrust calculation and comparative report, checked buckling and bending strain, and authored the alternative methodologies (curved MTBM and HDD) with a risk and schedule comparison.",
    approach: [
      "Thrust by NEN 3650 in Schrijvers Sigma (face, slurry-film and weight friction, capstan on the curve) cross-checked with two Rabiei (2018) variants.",
      "Buckling onset by Dawson–Paslay and Gao & Miska; bending strain to DNV-OS-F101.",
      "Thruster utilisation check against the specified unit, including overlength seabed push.",
      "Alternatives: curved MTBM building a 2.4 m RCC tunnel with gyro guidance, and HDD with staged reaming and a barge-mounted winch."
    ],
    figures: [["Design thrust", "3,390 kN"], ["Thruster capacity", "5,000 kN"], ["Factor of safety", "1.48"], ["Pipe OD", "914 mm"]],
    results: [
      "Design thrust within thruster capacity at FOS ≈ 1.48.",
      "Buckling and strain checks passed for the governing case.",
      "Three-option risk-assessed method comparison delivered for decision."
    ],
    codes: ["NEN 3650-2", "Schrijvers Sigma", "Rabiei 2018", "DNV-OS-F101", "Gao & Miska 2010"],
    visual: vizDP
  },
  {
    id: "river-hdd", cat: "hdd",
    tag: "HDD · Oil & gas · India",
    title: "River and highway HDD crossings for cross-country pipelines",
    desc: "Profiles, pullback and stress calculations for 8\"–36\" steel lines under major rivers, rail and national highways.",
    tools: ["Excel calc suite", "AutoCAD", "ZWCAD", "AutoLISP"],
    outcome: "Approval-ready crossing designs for owners including IOCL, GAIL, BPCL, HPCL and NTPC — profile, calculation, comment response and as-built.",
    snapshot: { Owners: "IOCL · GAIL · BPCL · HPCL · NTPC", Method: "HDD", Pipe: "8\"–36\" API 5L steel", Crossings: "Rivers · rail · NH · canals" },
    problem: "Cross-country oil and gas pipelines needed trenchless crossings of large rivers, railways, highways and canals, each with its own geotech, scour depth and approval authority.",
    objective: "Designed the crossing profiles and prepared the design calculation for each, revised through owner/consultant comments, and processed pilot survey data into as-built profiles.",
    approach: [
      "Profile from topography and borelogs: entry/exit angles, tangents, bend radius at or above the 1,000 × OD-based minimum, cover below computed scour depth.",
      "Pullback force by PRCI (segmental, capstan on curves, buoyancy with/without ballast) and ASTM F1962 cross-check.",
      "Tensile, bending, hoop and combined stress checks to ASME B31.4/B31.8 with API 5L grade properties.",
      "Hydrofracture check of required vs allowable mud pressure along the bore.",
      "Pilot-hole survey (ParaTrack / DigiTrack) reduced by the average-angle method into as-built profiles."
    ],
    figures: [["Pipe range", "8\" – 36\""], ["Grades", "API 5L X52–X70"], ["Typical length", "0.5 – 2 km"], ["Profiles (all methods)", "70+"]],
    results: [
      "Standardised calc package (pullback, stress, buoyancy, hydrofracture) reused across crossings.",
      "AutoLISP routines automate profile drawing and tables — roughly 60% faster drafting.",
      "As-built profiles generated straight from survey data."
    ],
    codes: ["PRCI PR-227-9424", "ASTM F1962", "ASME B31.4", "ASME B31.8", "API 5L", "ASCE MOP 108"],
    visual: vizHDD
  },
  {
    id: "hdpe-intake", cat: "hdd",
    tag: "HDD · HDPE intake/outfall · Egypt & India",
    title: "Large-diameter HDPE intakes and outfalls by HDD",
    desc: "1,200 mm HDPE twin seawater intakes (~1.1 km) and 900 mm outfalls — pullback with buoyancy control, collapse checks and a 500 t pulling head.",
    tools: ["Excel", "AutoCAD", "SolidWorks"],
    outcome: "Pullback, buoyancy-control and collapse checks for seawater intakes and marine outfalls, plus the bolted pulling-header design that carries the load.",
    snapshot: { Sector: "Desalination · industrial outfalls", Method: "HDD (land-to-sea)", Pipe: "630–1,200 mm HDPE", Length: "~0.8–1.2 km" },
    problem: "Large HDPE strings pulled from the sea side need controlled buoyancy, tensile limits within the safe pull strength, and collapse resistance both during installation and over a 50-year service life.",
    objective: "Prepared the pullback and buckling calculations, buoyancy-control (ballast fill) design and the pulling-header design with its bill of materials.",
    approach: [
      "Pullback by ASTM F1962 for empty and water-ballasted cases, including hydrokinetic drag.",
      "Combined axial + bending check against safe pull strength; Levy collapse during pull and long-term collapse with 50-yr PE100 modulus.",
      "Ballast-fill ratio for near-neutral buoyancy in drilling fluid.",
      "Pulling header: bolt shear/bearing and row load distribution, steel sleeve, welds and lug (γM-factored)."
    ],
    figures: [["HDPE OD", "up to 1,200 mm"], ["Bore length", "~1.1 km"], ["Pulling header", "500 tf"], ["Basis", "ASTM F1962 · PPI Ch.12"]],
    results: [
      "Pull loads kept inside the HDPE safe pull strength with ballast control.",
      "500 t pulling header designed, detailed and issued with BoM.",
      "Template reused for later intake/outfall and creek crossings."
    ],
    codes: ["ASTM F1962", "PPI Handbook Ch.12", "ISO 21225-1", "Levy collapse"],
    visual: vizOutfall
  },
  {
    id: "landfall-cable", cat: "hdd",
    tag: "HDD · Power cable landfall",
    title: "Offshore-wind and HVDC cable landfalls",
    desc: "~1 km HDPE duct landfalls for offshore-wind export cables, and HDPE/OFC bundle crossings of creeks, hills and highways for an HVDC link.",
    tools: ["AutoCAD", "Excel"],
    outcome: "Landfall profiles and risk-assessed method statements for export-cable ducts, and multi-duct bundle crossings for an urban HVDC corridor.",
    snapshot: { Sector: "Offshore wind · HVDC", Method: "HDD (onshore-to-offshore)", Pipe: "630 mm HDPE SDR 11; duct bundles", Length: "~1 km" },
    problem: "Export cables need a duct from a beach joint bay to a seabed exit that clears dunes and nearshore bathymetry; HVDC cables in a dense city corridor need bundled ducts under creeks, hills and highways.",
    objective: "Designed the landfall profiles (two options per cable), prepared the HDD method statement and risk-assessed method statement, and produced bundle-pull calculations.",
    approach: [
      "Profile options balancing exit water depth, bend radius of the duct and cable, and drilling length.",
      "Bundle pull for multiple HDPE ducts plus fibre conduit (ASTM F1962).",
      "Method statement covering barge/winch support at the seabed exit and fluid management."
    ],
    figures: [["Duct", "630 mm HDPE"], ["Landfall length", "~1,000 m"], ["Options studied", "2 per cable"]],
    results: [
      "Method statement issued at Rev 03 with risk assessment.",
      "Bundle calcs and profiles for an HVDC corridor crossing."
    ],
    codes: ["ASTM F1962", "DNV-ST-F121", "ASCE MOP 108"],
    visual: vizOutfall
  },
  {
    id: "push-buckle", cat: "hdd",
    tag: "HDD · Thruster-assisted install",
    title: "Pipe push force & buckling for thruster-assisted installs",
    desc: "Push-force build-up, buckling capacity and clamp-force checks for steel and HDPE pipe driven by a pipe thruster.",
    tools: ["Excel", "MATLAB", "React web app"],
    outcome: "A verified push/buckling method — later turned into a web tool — that tells you when a thruster push is feasible and when pullback is required.",
    snapshot: { Method: "HDD / thruster push", Pipe: "Steel (API 5L) & HDPE", Output: "Push force, buckling, clamp force", Tool: "Push & Buckling Studio" },
    problem: "Pushing a pipe string into a bore (with a thruster, or to assist a stuck pullback) risks buckling inside the hole; the push force has to stay below the onset of sinusoidal and helical buckling.",
    objective: "Developed the calculation (segmental push with capstan on curves), the buckling checks and the HDPE clamp/crush check, and corrected modelling issues found in the legacy sheet.",
    approach: [
      "Segment-by-segment force build-up with Euler–Eytelwein capstan on bends.",
      "Buckling capacity: Dawson–Paslay sinusoidal, Gao & Miska sinusoidal and helical.",
      "Axial stress vs SMYS-based allowable; HDPE clamp force and wall-crush check.",
      "Port to a tested web tool reproducing the workbook to 1e-9."
    ],
    figures: [["Buckling models", "3"], ["Pipe types", "Steel · HDPE"], ["Verification", "matches workbook"]],
    results: [
      "Identified when a long push governs by buckling and pullback must be used instead.",
      "Fixed three formula issues in the legacy workbook (curve radius, exit-curve growth term, entry tension link)."
    ],
    codes: ["Dawson–Paslay 1984", "Gao & Miska 2010", "Maidla 1987", "ASME B31.4/B31.8", "API 5L"],
    visual: vizPush
  },
  {
    id: "hydrofrac", cat: "hdd",
    tag: "HDD · Geotechnical check",
    title: "Hydrofracture and scour assessment for river crossings",
    desc: "Allowable vs required drilling-fluid pressure along the bore, and scour-depth estimates that set minimum cover.",
    tools: ["Excel"],
    outcome: "Pressure curves for multiple river crossings showing where mud pressure approaches the fracture limit, informing profile depth and fluid control.",
    snapshot: { Method: "HDD", Check: "Hydrofracture · scour", Sites: "Rivers in Odisha & Bangladesh", Basis: "Cavity expansion" },
    problem: "Inadvertent drilling-fluid returns under riverbeds are a key HDD risk, and scour sets how deep the pipe must sit.",
    objective: "Built pressure-curve sheets for each crossing and scour-depth calculations from river morphology and discharge data.",
    approach: [
      "Allowable pressure by cavity expansion (shear modulus, limit pressure, plastic radius at 2/3 cover, FOS 1.5).",
      "Required annular pressure from fluid weight and friction loss along the bore.",
      "Scour depth from discharge and bed material to set minimum cover."
    ],
    results: [
      "Identified high-risk chainages near entry/exit for fluid-pressure control.",
      "Cover below scour confirmed for each profile."
    ],
    codes: ["Delft cavity expansion", "ASCE MOP 108"],
    visual: vizHydro
  },
  {
    id: "mt-shaft", cat: "struct",
    tag: "MT · Shafts & thrust walls · India",
    title: "Launch shafts, thrust walls and RCC jacking pipe",
    desc: "Structural design for municipal sewer and seawater-intake microtunnels in 1,600–2,000 mm RCC jacking pipe.",
    tools: ["Excel", "AutoCAD"],
    outcome: "Limit-state designs for thrust walls, shafts and jacking pipe used on sewer trunk-main and seawater-intake microtunnels.",
    snapshot: { Owners: "Municipal corporation · industrial intakes", Method: "Microtunnelling", Pipe: "1,600–2,000 mm RCC", Codes: "IS 456 · IS 458" },
    problem: "The jacking reaction has to be carried by a thrust wall and shaft without overstressing soil or concrete, and the RCC pipe must take both earth load and jacking load.",
    objective: "Designed the thrust walls, launching shafts (including counterfort and rectangular shafts) and checked RCC jacking pipe; prepared drawings, BoMs and back-support frame calculations.",
    approach: [
      "Thrust wall: passive resistance (Rankine) and limit-state RC design to IS 456.",
      "Launch shaft: earth pressure, base bearing (Terzaghi), reinforcement; rectangular shafts to IS 3370-2.",
      "RCC jacking pipe: Marston/ATV A 161 earth load, three-edge-bearing class (IS 458), permissible jacking thrust.",
      "Thrust-frame back-support and lifting arrangements with BoM."
    ],
    figures: [["Pipe ID", "1,600–2,000 mm"], ["Shaft depth", "up to ~7 m"], ["Sewer MT length", "~3.2 km"]],
    results: [
      "Shaft and thrust-wall drawings issued for construction.",
      "Jacking-pipe class and permissible thrust confirmed per drive."
    ],
    codes: ["IS 456", "IS 458:2021", "IS 3370-2", "ATV A 161", "CPHEEO (Marston)"],
    visual: vizMT
  },
  {
    id: "mt-settle", cat: "mt",
    tag: "MT · Sewer · Settlement",
    title: "Settlement & face-stability study for an urban sewer microtunnel",
    desc: "Six GRP jacking drives (~720 m, 1,370 mm ID) under a dense city — jacking force, face pressure, settlement and building damage.",
    tools: ["Excel"],
    outcome: "Combined jacking and settlement assessment showing the drives could be built within building-damage limits, with a defined face-pressure window.",
    snapshot: { Sector: "Municipal sewerage", Method: "Microtunnelling", Pipe: "GRP 1,370 mm ID", Length: "~720 m / 6 drives" },
    problem: "Microtunnelling under narrow streets lined with buildings needs predicted settlement and a face-pressure range that avoids both blow-out and collapse.",
    objective: "Prepared the feasibility and settlement study, combined jacking/settlement calculations and the data-request list for missing geotech.",
    approach: [
      "Volume loss split into face, shield and tail components; Gaussian trough per drive.",
      "Building damage category from angular distortion (Skempton–MacDonald).",
      "Face-pressure window (active–passive) and face stability.",
      "Jacking force per drive for GRP pipe allowable."
    ],
    figures: [["Drives", "6"], ["Total length", "~719 m"], ["Pipe", "GRP 1,500 mm OD"]],
    results: [
      "Settlement predictions and damage categories per drive.",
      "Face-pressure window for operator guidance."
    ],
    codes: ["O'Reilly & New", "BS 6282", "ENV 12808-2", "Skempton–MacDonald"],
    visual: vizSettle
  },
  {
    id: "aramco-mt", cat: "mt",
    tag: "MT · Gas pipeline · Saudi Arabia",
    title: "Jacking-force and settlement checks for a 56\" gas-line crossing",
    desc: "MT crossing on a major Saudi Aramco gas-network expansion.",
    tools: ["Excel"],
    outcome: "Jacking-force and settlement calculations issued for a 56\" gas pipeline microtunnel crossing.",
    snapshot: { Owner: "Saudi Aramco", Method: "Microtunnelling", Pipe: "56\" product pipe", Length: "~59 m" },
    problem: "A large-diameter gas line on a national gas-network expansion required a short microtunnelled crossing with controlled settlement.",
    objective: "Prepared the jacking-force and settlement calculations.",
    approach: [
      "Jacking force from face resistance and skin friction (ATV A 161).",
      "Gaussian settlement trough checked against crossing tolerances."
    ],
    results: ["Calculations issued for the crossing package."],
    codes: ["ATV A 161", "O'Reilly & New"],
    visual: vizSettle
  },
  {
    id: "sheetpile", cat: "struct",
    tag: "Temporary works · HDD rig anchorage",
    title: "Sheet-pile anchorage for a 5,000 kN HDD rig",
    desc: "Back-to-back sheet-pile wall to anchor a large HDD rig for a seawater intake — two independent methods.",
    tools: ["Excel (matrix solver)"],
    outcome: "Showed a back-to-back AU-20 sheet-pile wall could anchor the rig's 5,000 kN pull with a large margin.",
    snapshot: { Load: "5,000 kN rig pull", Section: "AU-20, S355", Pile: "12 m", Methods: "Limit equilibrium + Winkler" },
    problem: "A large HDD rig needs a reaction anchor that won't rotate or slide under full pullback, on reclaimed coastal ground.",
    objective: "Designed the sheet-pile anchorage and documented it in a single-page calculation plus full report.",
    approach: [
      "Method 1: simplified cantilever limit equilibrium with Coulomb/Caquot–Kérisel Kp and Jaky K0.",
      "Method 2: beam on elastic foundation (Winkler springs) solved as a 25×25 stiffness matrix.",
      "Section bending/shear check to AISC 360 with S355 properties."
    ],
    figures: [["Rig force", "5,000 kN"], ["Pile length", "12 m"], ["Factor of safety", "7.45"]],
    results: ["Anchorage adequate with FOS ≈ 7.45; two methods in agreement."],
    codes: ["EN 1997-1", "USACE EM 1110-2-2504", "AISC 360-22", "Das (Ch.16)"],
    visual: vizSheet
  },
  {
    id: "thrust-frame", cat: "struct",
    tag: "Equipment · MTBM thrust frame",
    title: "1,800 t MTBM thrust frame — hand calc + FEA",
    desc: "Column-buckling design of a thrust frame built from high-strength drill pipe, verified in ANSYS Workbench.",
    tools: ["ANSYS Workbench", "Excel"],
    outcome: "Frame capacity far above the 1,800 t applied thrust (unity check ≈ 0.31), confirmed by FEA with FOS ≥ 2.0.",
    snapshot: { Load: "1,800 t thrust", Members: "Ø168.3 × 9.5 CHS", Material: "S-135 drill pipe", Check: "AISC 360-16 Ch. E" },
    problem: "A thrust frame for large MTBM drives had to transmit up to 1,800 t from the jacks to the thrust wall using re-purposed high-strength drill pipe.",
    objective: "Designed the frame members, checked column buckling and plate loads, and ran the FEA for the revised design.",
    approach: [
      "Load share across 16 members and 450 t per bearing plate.",
      "Flexural buckling to AISC 360-16 Chapter E.",
      "ANSYS Workbench static structural model of the frame to confirm stress and FOS."
    ],
    figures: [["Applied thrust", "1,800 t"], ["Frame capacity", "≈ 5,750 t"], ["Unity check", "0.31"], ["FEA FOS", "≥ 2.0"]],
    results: ["Revised frame design accepted for fabrication."],
    codes: ["AISC 360-16", "ANSYS Mechanical"],
    visual: vizFrame
  },
  {
    id: "clamp-fea", cat: "rnd",
    tag: "R&D · Pipe thruster",
    title: "Pipe-thruster clamp design and nonlinear FEA",
    desc: "Clamping-force and jaw-contact design for hydraulic pipe thrusters (150–750 t class), with ANSYS contact analysis in Hardox steel.",
    tools: ["ANSYS Mechanical", "SolidWorks", "AutoCAD"],
    outcome: "Clamp design verified under 150 t thrust and 400 t clamping: peak von Mises ≈ 211 MPa, deformation 0.175 mm.",
    snapshot: { Equipment: "Hydraulic pipe thruster / clamp", Load: "150 t thrust · 400 t clamp", Material: "Hardox", Mesh: "~400k SOLID186/187" },
    problem: "A pipe thruster grips the string through clamp jaws; the clamp must transmit thrust by friction without crushing coated pipe or yielding the jaws.",
    objective: "Calculated clamping force (thrust/μ) and jaw contact pressures, designed the cam & roller details, and ran FEA on the clamp in Hardox.",
    approach: [
      "Required clamp force from thrust and jaw–coating friction; contact pressure vs coating limit.",
      "Cam follower / disc cam: Hertz contact stress, pressure angle, shaft in combined bending + torsion, keys to DIN 6885.",
      "ANSYS Mechanical nonlinear analysis, two load steps (clamp, then thrust), frictional contact."
    ],
    figures: [["Thrust", "150 t"], ["Clamping", "400 t"], ["Peak σvm", "≈ 211 MPa"], ["Max deformation", "0.175 mm"]],
    results: ["Clamp stresses well within Hardox allowable; design released for drawings."],
    codes: ["ANSYS Mechanical", "Hertz contact", "DIN 6885"],
    visual: vizClamp
  },
  {
    id: "lifting", cat: "rnd",
    tag: "R&D · Lifting equipment",
    title: "70 t MTBM lifting beam, frames and lugs",
    desc: "Lifting beam for 1,600–2,100 mm MTBMs and a lifting frame/lug set — AISC checks, SFD/BMD and ANSYS FEA.",
    tools: ["ANSYS Workbench", "SolidWorks", "Excel"],
    outcome: "Lifting beam and frame designs verified by hand calculation and FEA with FOS ≥ 2.0.",
    snapshot: { Capacity: "70 t beam", Section: "W40×324", Use: "MTBM 1,600–2,100 handling", Check: "AISC 360-16" },
    problem: "Heavy MTBMs and mixing tanks must be lifted in and out of shafts safely with certified rigging.",
    objective: "Designed the beam section, lugs and frame; ran ANSYS Workbench models and produced the reports.",
    approach: [
      "Shear-force / bending-moment diagrams and section checks for the lifting beam.",
      "Lug design to AISC 360-16 (tension, block shear, bearing, welds).",
      "FEA of beam and 3.0 × 2.4 m lifting frame to confirm stress and FOS."
    ],
    figures: [["Beam rating", "70 t"], ["FEA FOS", "≥ 2.0"]],
    results: ["Designs issued with ANSYS report and fabrication drawings."],
    codes: ["AISC 360-16", "IS 800", "ANSYS Workbench"],
    visual: vizStress
  },
  {
    id: "venturi", cat: "rnd",
    tag: "R&D · MTBM slurry circuit",
    title: "Venturi jet pump for MTBM slurry circuits",
    desc: "Design calculator and CFD technical reference for a jet pump assisting slurry return — two design variants compared.",
    tools: ["Excel", "ANSYS / CFD", "SpaceClaim", "Web app"],
    outcome: "Design calculator (geometry, momentum, cavitation, settling) and CFD reference comparing two designs, plus fabrication data for the chosen variant.",
    snapshot: { Application: "MTBM slurry return", Checks: "Momentum · cavitation · Durand", Variants: "Design A vs B", Output: "Calculator + CFD report" },
    problem: "Long MTBM drives lose slurry-circuit head; a jet pump can boost return flow without extra mechanical pumps in the tunnel — if it avoids cavitation and keeps cuttings suspended.",
    objective: "Built the design calculator, ran and reviewed the CFD comparison of two designs, and prepared the fabrication data.",
    approach: [
      "Nozzle, throat and diffuser sizing; 1D momentum balance (Cunningham).",
      "Cavitation index check (σ ≥ 0.20); Durand critical velocity; Swamee–Jain friction.",
      "System match with return line and booster pump.",
      "CFD of both variants to confirm velocity and pressure fields."
    ],
    figures: [["Nozzle velocity", "≈ 33 m/s"], ["Mixture density", "1,080 kg/m³"], ["Variants", "2"]],
    results: ["Selected design documented with fabrication data and a CFD technical reference."],
    codes: ["Cunningham 1957/1970", "Durand", "Swamee–Jain", "ASME B31.3"],
    visual: vizVenturi
  },
  {
    id: "header", cat: "rnd",
    tag: "R&D · Pulling head",
    title: "500 tf bolted HDPE pulling header",
    desc: "Bolted pulling head for 1,200 mm HDPE — bolt groups, sleeve, welds and lug, with fabrication BoM.",
    tools: ["Excel", "AutoCAD"],
    outcome: "Pulling header rated 500 tf, designed, detailed and issued with BoM.",
    snapshot: { Rating: "500 tf", Pipe: "HDPE (SDR-dependent)", Bolts: "Gr 8.8 / 42CrMo4", Material: "API 5L X52 sleeve" },
    problem: "The pulling header is the weak link between the reamer and a large HDPE string — it must take the full pull without tearing out of the pipe wall.",
    objective: "Designed the bolted header and built a reusable designer workbook.",
    approach: [
      "Bolt shear and bearing; row-by-row load distribution.",
      "HDPE bearing allowable vs SDR; steel sleeve, welds and pull lug with γM0/γM2 factors."
    ],
    figures: [["Rating", "500 tf"], ["As-drawn OD", "Ø982"]],
    results: ["Header fabricated from the issued drawings and BoM."],
    codes: ["ASTM F1962", "Eurocode 3 (γM factors)"],
    visual: vizHeader
  }
];

/* ---------- Methodologies ---------- */
const METHODOLOGIES = [
  { tag: "HDD", title: "Onshore-to-onshore (conventional)", desc: "Rig-to-rig crossing: site set-up, water and fluid systems, ParaTrack steering, soft-ground and rock BHAs, pilot, reaming and pullback.", keys: ["ParaTrack 2", "BHA selection", "Reaming plan"] },
  { tag: "HDD", title: "Thruster push (500–1,000 m)", desc: "Pipe string built onshore and pushed in by a pipe thruster — no rig at the far end.", keys: ["Pipe thruster", "Push/buckling check"] },
  { tag: "HDD", title: "Thruster with offshore winch", desc: "Onshore thruster push with an offshore winch holding back-tension for controlled entry.", keys: ["Winch tension", "Barge spread"] },
  { tag: "HDD", title: "Offshore rig pull (> 1,000 m)", desc: "Second rig on a jack-up barge pulls from the sea side while an onshore thruster pushes.", keys: ["Jack-up barge", "Push-pull"] },
  { tag: "HDD", title: "Onshore-to-offshore (onshore rig pull)", desc: "String fabricated onshore and floated out, or built on a barge, then pulled back by the onshore rig.", keys: ["Float-out", "Barge string"] },
  { tag: "HDD", title: "Offshore-to-offshore", desc: "Both ends at sea: rig anchoring, jack-up operations and marine logistics.", keys: ["DNV-ST-F121", "Marine ops"] },
  { tag: "MT", title: "Microtunnelling onshore-to-onshore", desc: "Slurry MTBM shaft-to-shaft drive: guidance, lubrication, IJS, jacking-force design and reception.", keys: ["Laser guidance", "IJS", "Bentonite"] },
  { tag: "MT", title: "Microtunnelling onshore-to-offshore", desc: "Drive to a seabed exit with gyro/MWD guidance and recovery of the MTBM from the seabed.", keys: ["Gyro / MWD", "Seabed recovery"] },
  { tag: "MT", title: "Curved MTBM (alternative to Direct Pipe)", desc: "Curved 2.4 m RCC tunnel with gyro navigation and IJS — offered as a lower-risk landfall alternative.", keys: ["Curved drive", "Risk comparison"] }
];

/* ---------- Software / tools ---------- */
const TOOLS = [
  {
    name: "HDD Profile Studio",
    stack: "HTML/JS · offline PWA · Android",
    desc: "Crossing geometry designer used in the field and office.",
    features: [
      "River / road / rail / canal crossings with setback solved from minimum cover",
      "Rod-by-rod drilling programme and as-drilled logging (average-angle)",
      "API 5L pipe properties, buoyancy, Barlow, bending stress at design radius",
      "CSV and AutoCAD PLINE export; verified against the source workbooks"
    ],
    url: "https://ashuchaudhari58-cyber.github.io/HDD_profile_geometry_calculator/"
  },
  {
    name: "HDD Push & Buckling Studio",
    stack: "React · Vite · unit-tested",
    desc: "Push force, capstan and buckling checks with printable A4 report.",
    features: [
      "Segmental and capstan push-force engines",
      "Dawson–Paslay / Gao buckling and clamp check",
      "Regression-tested against the workbook (1e-9)"
    ],
    url: "https://ashuchaudhari58-cyber.github.io/HDD-Push-Buckling-Calc/"
  },
  {
    name: "Venturi Jet Pump Design Studio",
    stack: "Vanilla JS · PDF report",
    desc: "Jet-pump designer for MTBM slurry circuits.",
    features: [
      "Cell-by-cell port of the design workbook (82/82 values verified)",
      "Schematic, hydraulic profiles, validation and revision compare",
      "Print-ready PDF calculation report"
    ],
    url: "https://ashuchaudhari58-cyber.github.io/VENTURI/"
  },
  {
    name: "AutoCAD HDD profile routines",
    stack: "AutoLISP",
    desc: "Drafting automation for profile drawings.",
    features: [
      "Draws the HDD profile and auto-orients it from design data",
      "Cumulative chainage, labels and curve division",
      "Cuts profile-table drafting time by roughly 60%"
    ],
    url: ""
  }
];

const CALC_LIBRARY = [
  { group: "HDD", items: [
    ["Steel pullback, push & stress master calc", "PRCI · ASCE MOP 108 · ASME B31.4/8"],
    ["HDPE pullback & buoyancy control", "ASTM F1962 · PPI Ch.12"],
    ["HDPE push + thruster clamp check", "Gao 2010 · wall crush"],
    ["Reamer sizing for curved crossings", "ASCE MOP 108 · σ = E·D/2R"],
    ["Pilot as-built master sheet", "Average angle · DigiTrack TVD"],
    ["Hydrofracture pressure curves", "Cavity expansion"],
    ["Pulling header designer", "Bolt groups · γM factors"]
  ]},
  { group: "Microtunnelling", items: [
    ["MT calculation suite (straight & curved)", "ATV A 161 · NEN 3650 · IS 458"],
    ["RCC jacking pipe with IS 458 lookup", "Marston · three-edge bearing"],
    ["Settlement & building-damage template", "Gaussian trough · Skempton–MacDonald"],
    ["Thrust wall & launch shaft design", "IS 456 · IS 3370 · Terzaghi"],
    ["MTBM thrust frame", "AISC 360 Ch. E"]
  ]},
  { group: "Direct Pipe", items: [
    ["DP thrust calculation (general)", "NEN 3650-2 Annex D · Schrijvers Sigma"],
    ["DP buckling calculator", "Dawson–Paslay · Gao · ASME B31.8"],
    ["Pipe-lift / roller calculation", "IS 800 allowables"]
  ]},
  { group: "Structural & equipment", items: [
    ["Sheet-pile wall (LE + Winkler)", "EN 1997-1 · USACE"],
    ["Lifting lug & frame", "AISC 360-16 §D, J"],
    ["Cam follower / disc cam", "Hertz · DIN 6885"],
    ["Venturi jet pump designer", "Cunningham · Durand"]
  ]}
];

/* ---------- Codes & standards ---------- */
const STANDARDS = [
  { area: "HDD — steel & HDPE", items: [
    ["PRCI PR-227-9424", "Pullback, stress & buckling for steel pipe"],
    ["ASTM F1962", "HDPE pullback, collapse"],
    ["ASCE MOP 108", "Pipeline design for HDD"],
    ["ISO 21225-1", "Trenchless replacement / HDPE"],
    ["PPI Handbook Ch.12", "PE pipe for HDD"]
  ]},
  { area: "Pipeline", items: [
    ["ASME B31.4 / B31.8", "Liquid & gas pipeline stress"],
    ["API 5L", "Line pipe grades, SMYS"],
    ["DNV-OS-F101", "Bending strain, subsea"],
    ["DNV-ST-F121", "Marine operations"]
  ]},
  { area: "Microtunnelling & Direct Pipe", items: [
    ["ATV A 161", "Jacking pipe statics & thrust"],
    ["NEN 3650", "Pipeline & DP installation loads"],
    ["IS 458", "RCC pipes"],
    ["BS 6282 / ENV 12808", "Face stability, settlement"]
  ]},
  { area: "Structural & geotechnical", items: [
    ["IS 456 / IS 3370", "RC thrust walls, shafts"],
    ["IS 800 · AISC 360-16", "Steel members, lugs, frames"],
    ["EN 1997-1", "Sheet-pile / retaining design"],
    ["USACE EM 1110-2", "Sheet-pile walls"]
  ]}
];

/* ---------- Skills ---------- */
const SKILL_GROUPS = [
  {
    title: "Trenchless design",
    icon: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M2 8h20v2H2zM4 12c4 6 12 6 16 0l-1.7-1C15 16 9 16 5.7 11z"/></svg>',
    items: [["HDD profile design","core"],["Pullback / push force","core"],["Installation stress & buckling","core"],["Jacking force","core"],["Settlement analysis","core"],["Hydrofracture",""],["Buoyancy control",""],["Pilot survey processing",""],["Method statements","core"]]
  },
  {
    title: "Analysis & simulation",
    icon: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M3 17h2v3H3v-3zm4-6h2v9H7v-9zm4-5h2v14h-2V6zm4 8h2v6h-2v-6zm4-11h2v17h-2V3z"/></svg>',
    items: [["ANSYS Mechanical / Workbench","core"],["Schrijvers Sigma","core"],["FEA (nonlinear contact)","core"],["ANSYS Fluent (CFD)",""],["MATLAB",""],["Structural hand calcs","core"]]
  },
  {
    title: "CAD & drafting",
    icon: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h6v2H7V7zm0 4h10v2H7v-2zm0 4h10v2H7v-2z"/></svg>',
    items: [["AutoCAD","core"],["ZWCAD","core"],["AutoLISP",""],["SolidWorks","core"],["SpaceClaim",""],["GD&T",""]]
  },
  {
    title: "Tools & delivery",
    icon: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M3 5h18v2H3V5zm0 6h12v2H3v-2zm0 6h18v2H3v-2zm15-6l3 3-3 3v-2h-2v-2h2v-2z"/></svg>',
    items: [["Excel calc engineering","core"],["Web calc tools (JS/React)",""],["Comment-response registers","core"],["BoM & SOP",""],["Document control",""]]
  }
];

/* ---------- Analysis & simulation (secondary) ---------- */
const ANALYSIS = [
  { tag: "CFD · External", title: "Ahmed body & car external aerodynamics", desc: "Drag and wake separation; surface-wrap and volume meshing.", tools: ["Fluent", "ANSA"] },
  { tag: "CFD · Internal", title: "Turbocharger & gate-valve flow", desc: "Pressure loss, velocity field and cavitation tendency.", tools: ["Fluent"] },
  { tag: "CFD · Multiphase", title: "Cyclone separator", desc: "Swirling flow, pressure drop and separation efficiency.", tools: ["Fluent"] },
  { tag: "CFD · Thermal", title: "Conjugate heat transfer", desc: "Solid–fluid thermal gradients under varying heat flux.", tools: ["Fluent"] },
  { tag: "CAD · DFMA", title: "DFMA design optimisation", desc: "Part-count reduction and GD&T for manufacturability.", tools: ["SolidWorks", "GD&T"] },
  { tag: "Materials", title: "Wear-resistant materials study", desc: "Comparative selection for cutting/wear parts — Hardox, white cast iron, carbide.", tools: ["Report"] }
];

/* ---------- Experience ---------- */
const EXPERIENCE = [
  {
    current: true,
    period: "Jul 2024 — Present",
    role: "Design Engineer",
    company: "Trenchless Engineering Services Pvt. Ltd.",
    location: "Thane, India",
    points: [
      "Prepared 70+ HDD and microtunnelling profiles with assembly drawings (AutoCAD, ZWCAD) for oil, gas, crude, water-intake, sewer, outfall and cable crossings in India and internationally.",
      "HDD: pullback, push, installation-stress and buckling calculations for steel and HDPE pipe (PRCI PR-227-9424, ASTM F1962, ASME B31.4/B31.8, API 5L); hydrofracture and scour checks; ParaTrack/DigiTrack pilot-survey processing into as-builts.",
      "Microtunnelling: jacking-force, face-pressure and settlement calculations (ATV A 161, O'Reilly & New); RCC jacking-pipe design (IS 458); launch shafts and thrust walls (IS 456); structural-integrity reports for ADNOC crude-line sleeve crossings with comment-response registers.",
      "Direct Pipe: thrust, buckling and pipe-lift calculations to NEN 3650 using Schrijvers Sigma; risk-assessed alternatives (curved MTBM, HDD) for a 36\" gas landfall.",
      "Temporary works: sheet-pile rig anchorage, MTBM thrust frame (AISC 360 + FEA), lifting beams and lugs.",
      "R&D: pipe-thruster clamp design and ANSYS FEA, Venturi jet pump for slurry circuits, EDR and MWD gyro-navigation studies; BoMs and SOPs.",
      "Authored generic HDD and MT installation methodologies (onshore, landfall, offshore) and built browser-based calculation tools from verified workbooks."
    ]
  },
  {
    current: false,
    period: "Sep 2015 — Sep 2018",
    role: "Machinist (pre-degree apprenticeship)",
    company: "Larsen & Toubro",
    location: "India",
    points: [
      "Machined aerospace components for Vikram Sarabhai Space Centre, including PSLV/GSLV fuel-tank parts.",
      "Machined heat-exchanger and baffle components from engineering drawings.",
      "Held tight tolerances on precision parts — experience that keeps my designs buildable."
    ]
  }
];

/* ---------- Education ---------- */
const EDUCATION = [
  { title: "M.Tech — Computer-Aided Design & Manufacturing", sub: "Motilal Nehru National Institute of Technology (MNNIT), Allahabad", year: "2024" },
  { title: "B.E. — Mechanical Engineering", sub: "Lokmanya Tilak College of Engineering", year: "2022" }
];

/* ---------- Training ---------- */
const CERTIFICATIONS = [
  { title: "Computational Fluid Dynamics using ANSYS Fluent", sub: "Skill-Lync", year: "2025" },
  { title: "Geometric Dimensioning & Tolerancing (GD&T)", sub: "Udemy", year: "2025" },
  { title: "Advances in Composite Materials: Design, Manufacturing & Application", sub: "MNNIT Allahabad", year: "2023" },
  { title: "Also: CFD fundamentals, Fusion 360 CAD/CAM, MATLAB Onramp, EV design internship", sub: "Udemy · Coursera · MathWorks · Elite Techno Group", year: "2020–25" }
];

/* ---------- Languages ---------- */
const LANGUAGES = [
  { name: "English", level: "Professional working", pct: 90 },
  { name: "Hindi", level: "Professional working", pct: 92 },
  { name: "Marathi", level: "Native", pct: 100 }
];
