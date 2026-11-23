/* ============================================================
   Hero "plate viewer": four engineering drawings that draw
   themselves on (stroke-dashoffset), cycling automatically.
   Plates: HDD crossing · microtunnel drive · FE model · frame.
   Colours come from CSS classes (.viz .s-ink etc.), so the
   drawings follow the light/dark theme. Respects reduced motion.
   ============================================================ */
(function () {
  const canvas = document.getElementById("plateCanvas");
  if (!canvas) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $no = document.getElementById("plateNo"), $name = document.getElementById("plateName"),
        $cap = document.getElementById("plateCaption"), $nav = document.getElementById("plateNav");

  let k = 0; // running delay index for staggered drawing
  const D = (step = 0.12) => `style="animation-delay:${(k++ * step).toFixed(2)}s"`;
  // line that draws on
  const L = (d, cls = "s-ink", w = 1.2, extra = "") => `<path d="${d}" fill="none" class="${cls} draw" stroke-width="${w}" pathLength="1" ${extra} ${D()}/>`;
  // element that fades in
  const F = (el) => el.replace(/^<(\w+)/, `<$1 ${D(0.05)}`).replace(/class="/, 'class="fade ');
  const TX = (x, y, t, acc, anchor = "start") => F(`<text x="${x}" y="${y}" class="t${acc ? " t-acc" : ""}" text-anchor="${anchor}">${t}</text>`);
  const dim = (x1, x2, y, t) => L(`M${x1} ${y}H${x2}M${x1} ${y - 5}v10M${x2} ${y - 5}v10`, "s-mute", 0.8) + TX((x1 + x2) / 2, y - 6, t, false, "middle");
  const arrow = (x1, y1, x2, y2) => {
    const a = Math.atan2(y2 - y1, x2 - x1), h = 7;
    const p1 = [x2 - h * Math.cos(a - 0.4), y2 - h * Math.sin(a - 0.4)], p2 = [x2 - h * Math.cos(a + 0.4), y2 - h * Math.sin(a + 0.4)];
    return L(`M${x1} ${y1}L${x2} ${y2}`, "s-acc", 1.8) + F(`<path d="M${x2} ${y2}L${p1[0].toFixed(1)} ${p1[1].toFixed(1)}L${p2[0].toFixed(1)} ${p2[1].toFixed(1)}Z" class="f-acc"/>`);
  };
  const wrap = (inner) => `<svg class="viz" viewBox="0 0 440 300" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
      <rect width="440" height="300" class="f-paper"/>${inner}</svg>`;

  const PLATES = [
    {
      name: "Crossing profile", caption: "HDD: entry/exit tangents, sag bend, cover below scour",
      draw() {
        return wrap(
          F(`<path d="M150 112 Q185 146 220 146 Q255 146 290 112 Z" class="f-water"/>`) +
          L("M10 108 H146 Q183 150 220 150 Q257 150 294 108 H430", "s-ink", 1.5) +
          L("M10 200 Q120 194 220 200 T430 200", "s-ground", 0.8, 'stroke-dasharray="2 5"') +
          L("M10 240 Q120 234 220 240 T430 240", "s-ground", 0.8, 'stroke-dasharray="2 5"') +
          L("M36 108 L104 166 Q220 262 336 166 L404 108", "s-acc", 2.6) +
          F(`<rect x="16" y="97" width="40" height="10" class="f-ink"/>`) +
          L("M220 150 V214", "s-mute", 0.8, 'stroke-dasharray="3 3"') + TX(228, 190, "min. cover") +
          L("M36 108 H86 M36 108 L78 144", "s-mute", 0.8) + TX(88, 122, "α entry") +
          L("M404 108 H356", "s-mute", 0.8) + TX(352, 122, "β exit", false, "end") +
          TX(220, 232, "R ≥ Rmin", true, "middle") +
          dim(36, 404, 54, "horizontal length L") +
          TX(16, 90, "RIG") + TX(424, 90, "PIPE SIDE", false, "end") + arrow(392, 140, 372, 124)
        );
      }
    },
    {
      name: "Microtunnel drive", caption: "MT: launch shaft, thrust wall, jacking string, settlement trough",
      draw() {
        let pipes = "";
        for (let i = 0; i < 9; i++) pipes += L(`M${104 + i * 24} 182 h22 v26 h-22 Z`, "s-ink", 1);
        let trough = "M10 70";
        for (let x = 10; x <= 430; x += 8) trough += ` L${x} ${(70 + 22 * Math.exp(-Math.pow((x - 230) / 60, 2) / 2)).toFixed(1)}`;
        return wrap(
          L("M10 70 H430", "s-mute", 0.8, 'stroke-dasharray="4 3"') + L(trough, "s-acc", 1.6) + TX(236, 104, "S max", true) +
          L("M10 120 H52 M100 120 H362 M404 120 H430", "s-ink", 1.5) +
          L("M52 120 V232 H100 V120", "s-ink", 1.5) + L("M362 120 V232 H404 V120", "s-ink", 1.5) +
          F(`<rect x="56" y="176" width="8" height="40" class="f-acc"/>`) +
          pipes +
          F(`<path d="M322 182 h18 l10 13 l-10 13 h-18 z" class="f-ink"/>`) +
          arrow(68, 195, 98, 195) + TX(60, 250, "LAUNCH · THRUST WALL") + TX(404, 250, "RECEPTION", false, "end") +
          dim(104, 350, 160, "drive length") +
          TX(14, 62, "SURFACE SETTLEMENT")
        );
      }
    },
    {
      name: "FE model", caption: "FEA: meshed part, boundary conditions, von Mises contour",
      draw() {
        let mesh = "";
        for (let x = 90; x <= 350; x += 20) mesh += `M${x} 100V200`;
        for (let y = 100; y <= 200; y += 20) mesh += `M90 ${y}H350`;
        const g = `<defs><linearGradient id="pl-fe" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#2c5f8a"/><stop offset=".4" stop-color="#4f9a8a"/><stop offset=".7" stop-color="#e3b23c"/><stop offset="1" stop-color="#d9480f"/></linearGradient></defs>`;
        return wrap(g +
          F(`<rect x="90" y="100" width="260" height="100" fill="url(#pl-fe)" class="fe" opacity="0.85"/>`) +
          L("M90 100 H350 V200 H90 Z", "s-ink", 1.6) + L(mesh, "s-ink", 0.5) +
          L("M70 96 V204 M62 104 l8 -8 M62 124 l8 -8 M62 144 l8 -8 M62 164 l8 -8 M62 184 l8 -8 M62 204 l8 -8", "s-ink", 1) +
          arrow(380, 60, 352, 98) + arrow(400, 150, 354, 150) +
          TX(366, 56, "P", true) + TX(404, 146, "F", true) + TX(70, 224, "fixed support") +
          F(`<rect x="90" y="246" width="120" height="8" fill="url(#pl-fe)"/>`) + TX(90, 270, "σ von Mises") + TX(210, 270, "max", true, "end") +
          TX(350, 224, "SOLID186 · nonlinear contact", false, "end")
        );
      }
    },
    {
      name: "Structural frame", caption: "Steel frame: loads, supports, deflected shape, member checks",
      draw() {
        return wrap(
          L("M90 230 V90 H350 V230", "s-ink", 3) + L("M220 90 V230", "s-ink", 2) +
          L("M90 230 L220 90 M220 230 L350 90", "s-mute", 0.9) +
          L("M78 230 h24 M208 230 h24 M338 230 h24", "s-ink", 1.6) +
          L("M84 240 l6 -10 l6 10 M214 240 l6 -10 l6 10 M344 240 l6 -10 l6 10", "s-ink", 1) +
          arrow(130, 34, 130, 86) + arrow(220, 34, 220, 86) + arrow(310, 34, 310, 86) + arrow(20, 110, 86, 110) +
          L("M90 230 Q84 160 100 96 Q220 112 340 96 Q356 160 350 230", "s-acc", 1.4, 'stroke-dasharray="5 4"') +
          TX(140, 30, "W", true) + TX(18, 102, "H", true) + TX(226, 128, "δ") +
          TX(220, 268, "AISC 360 · IS 800 · FOS ≥ 2.0", false, "middle")
        );
      }
    }
  ];

  // nav buttons
  PLATES.forEach((p, i) => {
    const b = document.createElement("button");
    b.className = "plate__dot"; b.type = "button"; b.textContent = String(i + 1).padStart(2, "0");
    b.setAttribute("role", "tab"); b.setAttribute("aria-label", p.name);
    b.addEventListener("click", () => { show(i); restart(); });
    $nav.appendChild(b);
  });

  let idx = 0, timer = null;
  function show(i) {
    idx = i; k = 0;
    const p = PLATES[i];
    canvas.innerHTML = p.draw();
    if (reduce) canvas.querySelectorAll(".draw, .fade").forEach((el) => el.classList.remove("draw", "fade"));
    $no.textContent = `PL ${String(i + 1).padStart(2, "0")} / ${String(PLATES.length).padStart(2, "0")}`;
    $name.textContent = p.name;
    $cap.textContent = p.caption;
    [...$nav.children].forEach((b, j) => { b.classList.toggle("is-active", j === i); b.setAttribute("aria-selected", String(j === i)); });
  }
  function restart() {
    clearInterval(timer);
    if (!reduce) timer = setInterval(() => show((idx + 1) % PLATES.length), 7000);
  }
  const plate = document.getElementById("plate");
  plate.addEventListener("mouseenter", () => clearInterval(timer));
  plate.addEventListener("mouseleave", restart);
  document.addEventListener("visibilitychange", () => (document.hidden ? clearInterval(timer) : restart()));

  show(0);
  restart();
})();
