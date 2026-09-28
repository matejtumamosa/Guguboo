// GUGUBOO V2 – automatický monitoring overených zdrojov (brief body 19–20).
//
//   TRUSTED SOURCES → MONITORING → CHANGE DETECTION → (AI návrh – neskôr) → HUMAN REVIEW → PUBLISH
//
// Čo robí:
//   1. Načíta obsahové moduly (content/*.js) a zozbiera všetky source_url / source_urls.
//   2. Stiahne každý zdroj, odstráni HTML a porovná normalizovaný text s posledným snímkom.
//   3. Bez zmeny → iba aktualizuje last_checked v snímkach (rutinná zmena, commitne sa automaticky).
//   4. Zmena → zapíše report (čo sa zmenilo, ktoré položky Guguboo sa to týka, riziko) do
//      content/changes/ a workflow otvorí PR „CRITICAL CHANGE DETECTED“ na kontrolu človekom.
//
// Beží v GitHub Actions (Node 20+) – lokálne: node guguboo-v2/tools/knowledge-monitor.mjs
// Výstup pre workflow: GITHUB_OUTPUT changed=true|false, report=<cesta>.

import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "content");
const SNAP_DIR = path.join(CONTENT, "snapshots");
const INDEX_FILE = path.join(SNAP_DIR, "index.json");
const CHANGES_DIR = path.join(CONTENT, "changes");
const today = new Date().toISOString().slice(0, 10);

// Rizikové polia: ak sa zmení zdroj položky, ktorá ich obsahuje, zmena je kritická.
const CRITICAL_FIELDS = ["amount", "deadline", "eligibility", "when"];

async function loadContent() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  const files = (await readdir(CONTENT)).filter(name => name.endsWith(".js"));
  for (const file of files) {
    vm.runInContext(await readFile(path.join(CONTENT, file), "utf8"), sandbox, { filename: file });
  }
  return sandbox.window.GugubooContent || {};
}

// Zozbiera { url → [ {module, id, title, critical} ] } zo všetkých modulov.
function collectSources(content) {
  const map = new Map();
  const add = (url, ref) => {
    if (!/^https?:\/\//.test(url || "")) return;
    if (!map.has(url)) map.set(url, []);
    map.get(url).push(ref);
  };
  for (const [country, module] of Object.entries(content.lifeAdmin || {})) {
    for (const item of module.items || []) {
      const critical = CRITICAL_FIELDS.some(field => item[field] !== null && item[field] !== undefined && item[field] !== "");
      const ref = { module: "lifeAdmin." + country, id: item.id, title: item.title, critical };
      [item.source_url, ...(item.source_urls || [])].forEach(url => add(url, ref));
    }
  }
  const weeks = content.pregnancyWeeks?.weeks || {};
  for (const [week, entry] of Object.entries(weeks)) {
    const ref = { module: "pregnancyWeeks", id: "week-" + week, title: week + ". týždeň", critical: false };
    (entry.source_urls || []).forEach(url => add(url, ref));
  }
  return map;
}

// Peňažné sumy a čísla s desatinnou čiarkou z položky (napr. „829,86 €“, „2 254,70“).
function moneyValues(item) {
  const text = [item.amount, item.deadline].filter(Boolean).join(" ");
  return [...new Set((text.match(/\d{1,3}(?:[  ]\d{3})*,\d{2}/g) || []).map(value => value.replace(/[  ]/g, " ")))];
}
const compact = text => text.replace(/,\s+(\d)/g, ",$1").replace(/(\d)[  ](\d{3})/g, "$1 $2");

function normalize(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<(nav|footer|header)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const hash = text => createHash("sha256").update(text).digest("hex");
const snapName = url => hash(url).slice(0, 16) + ".txt";

async function readJson(file, fallback) {
  try { return JSON.parse(await readFile(file, "utf8")); } catch { return fallback; }
}

// Jednoduchý rozdiel viet – stačí na to, aby človek videl, čo sa na stránke zmenilo.
function sentenceDiff(before, after) {
  const split = text => new Set(text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 12));
  const a = split(before), b = split(after);
  return {
    removed: [...a].filter(s => !b.has(s)).slice(0, 15),
    added: [...b].filter(s => !a.has(s)).slice(0, 15)
  };
}

async function main() {
  await mkdir(SNAP_DIR, { recursive: true });
  const content = await loadContent();
  const sources = collectSources(content);
  const index = await readJson(INDEX_FILE, {});
  const changes = [];
  const failures = [];

  for (const [url, refs] of sources) {
    let text;
    try {
      const response = await fetch(url, { headers: { "user-agent": "GugubooKnowledgeMonitor/1.0 (+https://guguboo.com)" }, redirect: "follow", signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error("HTTP " + response.status);
      text = normalize(await response.text());
    } catch (error) {
      failures.push({ url, error: String(error.message || error), refs });
      continue;
    }
    const digest = hash(text);
    const previous = index[url];
    const file = path.join(SNAP_DIR, snapName(url));
    if (previous && previous.hash !== digest) {
      const before = await readFile(file, "utf8").catch(() => "");
      changes.push({ url, refs, diff: sentenceDiff(before, text), critical: refs.some(ref => ref.critical) });
    }
    if (!previous || previous.hash !== digest) await writeFile(file, text, "utf8");
    index[url] = { hash: digest, last_checked: today, first_seen: previous?.first_seen || today, refs: refs.map(ref => ref.module + ":" + ref.id) };
  }

  await writeFile(INDEX_FILE, JSON.stringify(index, null, 2) + "\n", "utf8");

  // Kontrola súm: každá suma v položke musí byť doslova v texte aspoň jedného jej zdroja.
  const mismatches = [];
  for (const [country, module] of Object.entries(content.lifeAdmin || {})) {
    for (const item of module.items || []) {
      const values = moneyValues(item);
      if (!values.length) continue;
      const urls = [...new Set([item.source_url, ...(item.source_urls || [])].filter(Boolean))];
      const texts = await Promise.all(urls.map(url => readFile(path.join(SNAP_DIR, snapName(url)), "utf8").catch(() => "")));
      const haystack = compact(texts.join(" "));
      const missing = values.filter(value => !haystack.includes(value));
      if (missing.length) mismatches.push({ id: country + ":" + item.id, title: item.title, missing });
    }
  }

  let reportPath = "";
  if (changes.length || failures.length || mismatches.length) {
    await mkdir(CHANGES_DIR, { recursive: true });
    reportPath = path.join(CHANGES_DIR, today + ".md");
    const lines = [
      "# " + (changes.some(change => change.critical) || mismatches.length ? "CRITICAL CHANGE DETECTED" : "Zmena v zdrojoch") + " – " + today,
      "",
      "Automatický monitoring Guguboo našiel zmeny na oficiálnych zdrojoch. **Nič sa nezverejnilo automaticky.**",
      "Skontroluj, či sa zmenili pravidlá, sumy alebo termíny, uprav dotknuté položky v `guguboo-v2/content/` a až potom zmerguj.",
      ""
    ];
    for (const change of changes) {
      lines.push("## " + (change.critical ? "🔴 " : "🟡 ") + change.url, "");
      lines.push("**Dotknuté položky:** " + change.refs.map(ref => "`" + ref.id + "` (" + ref.title + ")").join(", "), "");
      if (change.diff.removed.length) lines.push("**Zmizlo zo stránky:**", ...change.diff.removed.map(s => "- ~~" + s + "~~"), "");
      if (change.diff.added.length) lines.push("**Pribudlo na stránke:**", ...change.diff.added.map(s => "- " + s), "");
      lines.push("**Treba skontrolovať:** položky vyššie, súvisiace pripomienky v pláne (Journey Engine) a odpovede GuguChatu k tejto téme.", "");
    }
    if (mismatches.length) {
      lines.push("## 🔴 Sumy, ktoré sa na zdroji už nenachádzajú", "");
      mismatches.forEach(entry => lines.push("- `" + entry.id + "` (" + entry.title + "): " + entry.missing.join(", ")));
      lines.push("", "Suma sa na oficiálnej stránke zmenila alebo zmizla – položku treba skontrolovať skôr, než ju Guguboo ukáže ako istú.", "");
    }
    if (failures.length) {
      lines.push("## ⚠️ Zdroje, ktoré sa nepodarilo načítať", "");
      failures.forEach(failure => lines.push("- " + failure.url + " – " + failure.error + " (položky: " + failure.refs.map(ref => ref.id).join(", ") + ")"));
      lines.push("", "Ak zdroj trvalo nefunguje, položky sa v aplikácii majú označiť ako `stale` (neoverené).");
    }
    await writeFile(reportPath, lines.join("\n") + "\n", "utf8");
  }

  const changed = changes.length > 0 || mismatches.length > 0;
  const critical = changes.some(change => change.critical) || mismatches.length > 0;
  console.log(`Zdrojov: ${sources.size}, zmenených: ${changes.length} (kritických: ${changes.filter(c => c.critical).length}), nesediace sumy: ${mismatches.length}, nedostupných: ${failures.length}`);
  if (process.env.GITHUB_OUTPUT) {
    await writeFile(process.env.GITHUB_OUTPUT, `changed=${changed}\ncritical=${critical}\nreport=${reportPath ? path.relative(path.resolve(ROOT, ".."), reportPath).replace(/\\/g, "/") : ""}\n`, { flag: "a" });
  }
}

main().catch(error => { console.error(error); process.exit(1); });
