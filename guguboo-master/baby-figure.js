/* Guguboo Master – štylizovaná ilustrácia vývoja bábätka a okrúhle ovocie/zelenina (Samo schválil 13. 11. 2026).
   Vlastné dielo Guguboo (kreslené kódom), žiadne cudzie obrázky. Zámerne orientačné – nie lekársky obrázok:
   žiadne orgány, pupočník ani vzhľad ultrazvuku; oči zatvorené, mäkké tvary, jedno teplé svetlo.
   Pravidlo (Samo): len okrúhle alebo oválne ovocie a zelenina; podlhovasté NHS prirovnania nahrádza APPROX_ROUND v guguchat.js.
   Návrh a zdôvodnenie: docs/master/plod-navrh/index.html. */
(function () {
  "use strict";
  let uid = 0;
  // Parametrický „rig“: 8 ručne doladených štádií, týždne medzi nimi sa dopočítajú; poloha hlavičkou dole skokom od 36. týždňa.
  const KEYS = [
    { w: 6, s: .34, head: 1.28, limb: 0, curl: 1, fat: 0, face: 0, tail: 1, rot: -12 },
    { w: 10, s: .46, head: 1.22, limb: .42, curl: .85, fat: .08, face: .35, tail: .3, rot: -10 },
    { w: 14, s: .58, head: 1.08, limb: .78, curl: .55, fat: .22, face: .75, tail: 0, rot: -6 },
    { w: 20, s: .71, head: .99, limb: .92, curl: .5, fat: .4, face: 1, tail: 0, rot: -4 },
    { w: 24, s: .79, head: .96, limb: 1, curl: .6, fat: .55, face: 1, tail: 0, rot: -6 },
    { w: 28, s: .86, head: .94, limb: 1, curl: .75, fat: .7, face: 1, tail: 0, rot: -8 },
    { w: 32, s: .93, head: .91, limb: 1, curl: .9, fat: .85, face: 1, tail: 0, rot: -10 },
    { w: 36, s: .95, head: .88, limb: 1, curl: 1, fat: 1, face: 1, tail: 0, rot: 168 }
  ];
  function paramsFor(week) {
    const w = Math.max(6, Math.min(40, Number(week) || 6));
    if (w >= 36) return { ...KEYS[7], w };
    const i = KEYS.findIndex((k, j) => KEYS[j + 1] && w >= k.w && w < KEYS[j + 1].w);
    const a = KEYS[i], b = KEYS[i + 1], t = (w - a.w) / (b.w - a.w), p = { w, rot: a.rot };
    for (const k of ["s", "head", "limb", "curl", "fat", "face", "tail"]) p[k] = a[k] + (b[k] - a[k]) * t;
    return p;
  }
  function babySvg(week, night) {
    const p = paramsFor(week), id = "gb" + (++uid), f = n => n.toFixed(1);
    const LINE = "#dc9d90", LIMB = "#f8cfc3", EYE = "#9a5f63", BLUSH = "#f29a9f";
    const r = 24 * p.head, rx = 14 + 13 * p.fat, ry = 25 + 7 * p.fat;
    const hx = -6 - 6 * p.curl - (r - 24) * .2, hy = -24 - r * .55 + 4 * p.curl;
    const L = p.limb, aw = 8 + 4 * p.fat, lw = 10 + 6 * p.fat;
    const S = [-6, -6], E = [S[0] - 10 * L, S[1] + 14 * L], H = [E[0] - 6 * L, E[1] - 16 * L];
    const P = [14, 22], K = [P[0] - 30 * L, P[1] - (4 + 6 * p.curl) * L], F = [K[0] + 8 * L, K[1] + 22 * L];
    const limb = (pts, w) => { const d = "M" + pts.map(q => f(q[0]) + " " + f(q[1])).join(" L"); return "<path d='" + d + "' fill='none' stroke='" + LINE + "' stroke-width='" + f(w + 3) + "' stroke-linecap='round' stroke-linejoin='round'/><path d='" + d + "' fill='none' stroke='" + LIMB + "' stroke-width='" + f(w) + "' stroke-linecap='round' stroke-linejoin='round'/>"; };
    let g = "";
    if (p.tail > .02) {
      const d = "M12 " + f(14 + ry * .5) + " Q4 " + f(22 + ry * .75) + " -9 " + f(16 + ry * .6);
      g += "<path d='" + d + "' fill='none' stroke='" + LINE + "' stroke-width='" + f(12 * p.tail + 3) + "' stroke-linecap='round'/><path d='" + d + "' fill='none' stroke='#f6c7ba' stroke-width='" + f(12 * p.tail) + "' stroke-linecap='round'/>";
    }
    g += "<ellipse cx='6' cy='6' rx='" + f(rx) + "' ry='" + f(ry) + "' transform='rotate(-18 6 6)' fill='url(#" + id + "s)' stroke='" + LINE + "' stroke-width='1.5'/>";
    if (L > .02) g += limb([P, K, F], lw);
    g += "<circle cx='" + f(hx) + "' cy='" + f(hy) + "' r='" + f(r) + "' fill='url(#" + id + "s)' stroke='" + LINE + "' stroke-width='1.5'/>";
    if (L > .02) g += limb([S, E, H], aw);
    if (p.face > .02) {
      const ex = hx - r * .42, ey = hy + r * .04;
      g += "<g opacity='" + f(p.face) + "'><path d='M" + f(ex - 4) + " " + f(ey) + " q4 3.4 8 0' fill='none' stroke='" + EYE + "' stroke-width='1.8' stroke-linecap='round'/>" +
        "<circle cx='" + f(hx - r * .46) + "' cy='" + f(hy + r * .38) + "' r='" + f(r * .16) + "' fill='" + BLUSH + "' opacity='.4'/>" +
        "<path d='M" + f(hx + r * .2) + " " + f(hy - r * .02) + " q" + f(r * .22) + " " + f(r * .16) + " 0 " + f(r * .34) + "' fill='none' stroke='" + LINE + "' stroke-width='1.5' stroke-linecap='round'/></g>";
    }
    const sac = night ? ["#4a3f63", "#3a3150", "#2f2842"] : ["#fffaf6", "#fbeef3", "#eee6fb"];
    return "<svg class='g2-baby-fig' viewBox='0 0 200 200' role='img' aria-label='Orientačná ilustrácia bábätka okolo " + Math.round(p.w) + ". týždňa'>" +
      "<defs><radialGradient id='" + id + "s' cx='.38' cy='.32' r='.75'><stop offset='0' stop-color='#fff0e8'/><stop offset='.6' stop-color='#fad3c7'/><stop offset='1' stop-color='#f3bfb2'/></radialGradient>" +
      "<radialGradient id='" + id + "v' cx='.42' cy='.36' r='.7'><stop offset='0' stop-color='" + sac[0] + "'/><stop offset='.65' stop-color='" + sac[1] + "'/><stop offset='1' stop-color='" + sac[2] + "'/></radialGradient></defs>" +
      "<circle cx='100' cy='100' r='90' fill='url(#" + id + "v)' stroke='" + (night ? "#5a4f78" : "#e6dcf8") + "' stroke-width='2'/>" +
      "<circle cx='100' cy='100' r='80' fill='none' stroke='#fff' stroke-opacity='" + (night ? .06 : .6) + "' stroke-width='6'/>" +
      "<circle cx='58' cy='54' r='5' fill='#fff' opacity='" + (night ? .12 : .7) + "'/><circle cx='148' cy='146' r='3.5' fill='#fff' opacity='" + (night ? .1 : .6) + "'/>" +
      "<clipPath id='" + id + "c'><circle cx='100' cy='100' r='86'/></clipPath><g clip-path='url(#" + id + "c)'><g class='g2-baby-breath'><g transform='translate(100 " + (p.rot > 90 ? 96 : 104) + ") rotate(" + p.rot + ") scale(" + f(p.s * 1.22 * 100) / 100 + ")'>" + g + "</g></g></g></svg>";
  }

  // ——— Okrúhle ovocie a zelenina (viewBox 48) ———
  const LEAF = "<path d='M25 13c3-6 10-7 13-5-2 4-8 7-13 5Z' fill='#a9d68f' stroke='#7fae6a' stroke-width='1.5' stroke-linejoin='round'/>";
  const SHINE = (x, y) => "<ellipse cx='" + x + "' cy='" + y + "' rx='4' ry='3' fill='#fff' opacity='.45'/>";
  const round = (fill, line, r = 15, extra = "", leaf = true) => "<circle cx='24' cy='27' r='" + r + "' fill='" + fill + "' stroke='" + line + "' stroke-width='1.5'/>" + extra + SHINE(18, 22) + (leaf ? LEAF : "");
  const spokes = (n, rr, color) => Array.from({ length: n }, (_, i) => { const a = i * 2 * Math.PI / n; return "<path d='M24 24L" + (24 + rr * Math.cos(a)).toFixed(1) + " " + (24 + rr * Math.sin(a)).toFixed(1) + "'/>"; }).join("").replace(/^/, "<g stroke='" + color + "' stroke-width='1.6' stroke-linecap='round'>") + "</g>";
  const FRUIT = {
    pea: "<circle cx='24' cy='27' r='13' fill='#9fd486' stroke='#7fae6a' stroke-width='1.5'/><ellipse cx='19.5' cy='22.5' rx='3.6' ry='2.6' fill='#fff' opacity='.5'/><path d='M24 14c2-5 8-6 11-4-2 4-7 6-11 4Z' fill='#cbe9b0' stroke='#7fae6a' stroke-width='1.5' stroke-linejoin='round'/>",
    grape: "<path d='M24 12v-4' stroke='#7f8f4e' stroke-width='2.4' stroke-linecap='round'/>" + [[24, 18], [17, 24], [31, 24], [24, 30], [17, 36], [31, 36], [24, 42]].map(c => "<circle cx='" + c[0] + "' cy='" + c[1] + "' r='6.5' fill='#c7b4ee' stroke='#8e74c9' stroke-width='1.5'/>").join(""),
    raspberry: round("#f2a0b4", "#d06c87", 14, [[18, 24], [24, 22], [30, 24], [20, 30], [28, 30], [24, 35]].map(c => "<circle cx='" + c[0] + "' cy='" + c[1] + "' r='2.4' fill='#e7869e'/>").join("")),
    strawberry: "<path d='M24 42C13 36 8 24 13 18c4-4 9-3 11-1 2-2 7-3 11 1 5 6 0 18-11 24Z' fill='#f59a9a' stroke='#d76a6a' stroke-width='1.5' stroke-linejoin='round'/>" + [[18, 24], [24, 26], [30, 24], [21, 32], [27, 32], [24, 37]].map(c => "<ellipse cx='" + c[0] + "' cy='" + c[1] + "' rx='1' ry='1.6' fill='#fff3c4'/>").join("") + "<path d='M15 17c4 2 6 0 9-4 3 4 5 6 9 4-2 4-6 5-9 3-3 2-7 1-9-3Z' fill='#a9d68f' stroke='#7fae6a' stroke-width='1.5' stroke-linejoin='round'/>",
    apricot: "<circle cx='24' cy='27' r='15' fill='#ffc690' stroke='#e39a5f' stroke-width='1.5'/><path d='M24 13c-3 6-3 18 0 28' fill='none' stroke='#e39a5f' stroke-width='1.5' stroke-linecap='round'/>" + LEAF + SHINE(18, 22),
    fig: "<path d='M24 12c-2 6-12 10-12 20 0 7 6 11 12 11s12-4 12-11c0-10-10-14-12-20Z' fill='#b99ad6' stroke='#8a69b0' stroke-width='1.5' stroke-linejoin='round'/><path d='M24 12v-4' stroke='#7f8f4e' stroke-width='2.4' stroke-linecap='round'/>" + SHINE(19, 28),
    plum: round("#a99be0", "#7563b8", 15, "<path d='M24 13c-3 6-3 18 0 28' fill='none' stroke='#8f80cf' stroke-width='1.5' stroke-linecap='round'/>"),
    peach: round("#ffc2a6", "#ec9677", 16, "<path d='M24 12c-3 6-3 19 0 30' fill='none' stroke='#ec9677' stroke-width='1.5' stroke-linecap='round'/>"),
    kiwi: "<circle cx='24' cy='24' r='17' fill='#bcdc8c' stroke='#9a7b5a' stroke-width='3'/><circle cx='24' cy='24' r='6.5' fill='#f4f7dd'/>" + Array.from({ length: 8 }, (_, i) => { const a = i * 45, x = (24 + 10 * Math.cos(a * Math.PI / 180)).toFixed(1), y = (24 + 10 * Math.sin(a * Math.PI / 180)).toFixed(1); return "<ellipse cx='" + x + "' cy='" + y + "' rx='1.3' ry='2.2' fill='#5b4a3a' transform='rotate(" + (a + 90) + " " + x + " " + y + ")'/>"; }).join(""),
    apple: "<path d='M24 17c-4-3-14-3-15 8-1 9 6 17 11 17 2 0 3-1 4-1s2 1 4 1c5 0 12-8 11-17-1-11-11-11-15-8Z' fill='#f6a3a3' stroke='#d77070' stroke-width='1.5' stroke-linejoin='round'/><path d='M24 17v-6' stroke='#8a6d33' stroke-width='2' stroke-linecap='round'/>" + LEAF + SHINE(16, 24),
    orange: round("#ffc27a", "#e8994a", 16, "<g fill='#f2ad62'><circle cx='20' cy='31' r='1'/><circle cx='28' cy='33' r='1'/><circle cx='30' cy='25' r='1'/><circle cx='22' cy='37' r='1'/></g>"),
    pomegranate: "<circle cx='24' cy='28' r='15' fill='#f39aa8' stroke='#cf6879' stroke-width='1.5'/><path d='M19 14l2-5 3 3 3-3 2 5Z' fill='#f39aa8' stroke='#cf6879' stroke-width='1.5' stroke-linejoin='round'/>" + SHINE(18, 24),
    pepper: "<path d='M24 15c-6-3-15 0-15 11 0 9 5 16 10 16 2 0 3-2 5-2s3 2 5 2c5 0 10-7 10-16 0-11-9-14-15-11Z' fill='#9fd486' stroke='#6f9e5a' stroke-width='1.5' stroke-linejoin='round'/><path d='M24 15c0-4 2-6 5-7' fill='none' stroke='#6f8a3e' stroke-width='3' stroke-linecap='round'/>" + SHINE(16, 24),
    tomato: round("#f59a8a", "#d4685a", 16, "", false) + "<path d='M16 14c4 2 6 1 8-2 2 3 4 4 8 2-2 4-5 5-8 4-3 1-6 0-8-4Z' fill='#9fd486' stroke='#6f9e5a' stroke-width='1.5' stroke-linejoin='round'/>",
    grapefruit: "<circle cx='24' cy='24' r='17' fill='#ffd2c2' stroke='#ef9576' stroke-width='3'/><circle cx='24' cy='24' r='13.5' fill='#ffbfa8'/>" + spokes(8, 13, "#fff3ee") + "<circle cx='24' cy='24' r='2.4' fill='#fff3ee'/>",
    pomelo: "<circle cx='24' cy='24' r='18' fill='#e6f3b4' stroke='#b4cc6e' stroke-width='3'/><circle cx='24' cy='24' r='14.5' fill='#fbd3c4'/>" + spokes(9, 14, "#fff3ee") + "<circle cx='24' cy='24' r='2.4' fill='#fff3ee'/>",
    lettuce: "<circle cx='24' cy='25' r='16' fill='#d9efb9' stroke='#7fae6a' stroke-width='1.5'/><g fill='none' stroke='#9fc77f' stroke-width='1.5' stroke-linecap='round'><path d='M14 20c5-6 15-7 21-1'/><path d='M12 28c6-5 18-6 24 0'/><path d='M24 12c-3 8-3 18 1 28'/></g><path d='M9 32c4 8 12 10 15 9-3-4-9-7-15-9Z' fill='#9fd486' stroke='#7fae6a' stroke-width='1.5' stroke-linejoin='round'/><path d='M39 32c-4 8-12 10-15 9 3-4 9-7 15-9Z' fill='#a9d68f' stroke='#7fae6a' stroke-width='1.5' stroke-linejoin='round'/>",
    cabbage: "<circle cx='24' cy='25' r='17' fill='#cfe7b0' stroke='#7fae6a' stroke-width='1.5'/><g fill='none' stroke='#a4c886' stroke-width='1.5' stroke-linecap='round'><path d='M24 9c-6 6-6 26 0 32'/><path d='M24 9c6 6 6 26 0 32'/><path d='M10 22c8 3 20 3 28 0'/></g>" + SHINE(17, 19),
    cauliflower: "<path d='M7 30c4 10 13 13 17 12-3-6-9-10-17-12Z' fill='#9fd486' stroke='#7fae6a' stroke-width='1.5' stroke-linejoin='round'/><path d='M41 30c-4 10-13 13-17 12 3-6 9-10 17-12Z' fill='#a9d68f' stroke='#7fae6a' stroke-width='1.5' stroke-linejoin='round'/>" + [[24, 15, 7], [15, 21, 6.5], [33, 21, 6.5], [19, 29, 7], [29, 29, 7], [24, 23, 6.5]].map(c => "<circle cx='" + c[0] + "' cy='" + c[1] + "' r='" + c[2] + "' fill='#fbf3dc' stroke='#d6c08e' stroke-width='1.5'/>").join(""),
    coconut: "<circle cx='24' cy='26' r='16' fill='#c9a27e' stroke='#946b4a' stroke-width='1.5'/><g fill='#7a5638'><circle cx='20' cy='20' r='1.6'/><circle cx='27' cy='20' r='1.6'/><circle cx='23.5' cy='25' r='1.6'/></g><g stroke='#b18a66' stroke-width='1.2' stroke-linecap='round'><path d='M13 30l3 1M33 33l2-2M18 37l2 1'/></g>",
    hokkaido: "<ellipse cx='24' cy='27' rx='18' ry='14' fill='#ffb26b' stroke='#e0874a' stroke-width='1.5'/><g fill='none' stroke='#e8955a' stroke-width='1.5' stroke-linecap='round'><path d='M24 14c-5 6-5 20 0 27'/><path d='M15 16c-5 6-4 18 1 23'/><path d='M33 16c5 6 4 18-1 23'/></g><path d='M23 14c0-4 2-6 5-7' fill='none' stroke='#7f8f4e' stroke-width='3' stroke-linecap='round'/><ellipse cx='15' cy='22' rx='3' ry='4' fill='#fff' opacity='.35'/>",
    pumpkin: "<ellipse cx='24' cy='28' rx='19' ry='14' fill='#ffc073' stroke='#e39444' stroke-width='1.5'/><g fill='none' stroke='#eda55a' stroke-width='1.5' stroke-linecap='round'><path d='M24 15c-6 6-6 20 0 27'/><path d='M24 15c6 6 6 20 0 27'/><path d='M13 18c-5 6-4 17 1 22'/><path d='M35 18c5 6 4 17-1 22'/></g><path d='M23 15c0-4 2-6 5-7' fill='none' stroke='#7f8f4e' stroke-width='3' stroke-linecap='round'/>",
    honeydew: "<ellipse cx='24' cy='25' rx='18' ry='16' fill='#e4f2bd' stroke='#a9c46f' stroke-width='1.5'/><g fill='none' stroke='#c9df93' stroke-width='1.5' stroke-linecap='round'><path d='M24 10c-6 7-6 23 0 30'/><path d='M24 10c6 7 6 23 0 30'/></g><ellipse cx='16' cy='19' rx='4' ry='3' fill='#fff' opacity='.55'/><path d='M24 9.5v-3' stroke='#8a9b52' stroke-width='2.4' stroke-linecap='round'/>",
    cantaloupe: "<ellipse cx='24' cy='25' rx='18' ry='16' fill='#f3d29a' stroke='#c99a52' stroke-width='1.5'/><g fill='none' stroke='#dcb878' stroke-width='1.2'><path d='M10 18l28 14M10 32l28-14M14 12l20 26M34 12L14 38'/></g><ellipse cx='16' cy='19' rx='4' ry='3' fill='#fff' opacity='.45'/>",
    watermelon: "<ellipse cx='24' cy='25' rx='19' ry='16' fill='#9fd486' stroke='#5f9450' stroke-width='1.5'/><g fill='none' stroke='#6aa55a' stroke-width='2.4' stroke-linecap='round'><path d='M24 9c-4 6-4 26 0 32'/><path d='M15 11c-5 6-5 22 0 28'/><path d='M33 11c5 6 5 22 0 28'/></g><ellipse cx='15' cy='19' rx='4' ry='3' fill='#fff' opacity='.4'/>"
  };
  const MATCH = [["hrášok", "pea"], ["hrozn", "grape"], ["malin", "raspberry"], ["jahod", "strawberry"], ["marhuľ", "apricot"], ["fig", "fig"], ["slivk", "plum"], ["broskyň", "peach"], ["kiwi", "kiwi"], ["granát", "pomegranate"], ["jablk", "apple"], ["pomaranč", "orange"], ["grapefruit", "grapefruit"], ["pomel", "pomelo"], ["paprik", "pepper"], ["paradajk", "tomato"], ["šalát", "lettuce"], ["karfiol", "cauliflower"], ["kapust", "cabbage"], ["kokos", "coconut"], ["hokkaido", "hokkaido"], ["vodový melón", "watermelon"], ["cantaloupe", "cantaloupe"], ["medový", "honeydew"], ["melón", "honeydew"], ["tekvic", "pumpkin"]];
  function fruitKey(comparison) {
    const text = String(comparison || "").toLowerCase();
    return (MATCH.find(([word]) => text.includes(word)) || [, "pea"])[1];
  }
  function fruitSvg(comparison, cls) {
    return "<svg class='g2-fruit " + (cls || "") + "' viewBox='0 0 48 48' aria-hidden='true'>" + FRUIT[fruitKey(comparison)] + "</svg>";
  }
  window.GugubooBabyFigure = { babySvg, fruitSvg, fruitKey, paramsFor };
})();
