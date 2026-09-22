// Merge ChatGPT-written state editorial batches into app/data/state-editorial.json.
// Usage: node scripts/merge-state-editorial.mjs <facts.md> <batch1.json> [batch2.json ...]
// Every $ amount / percentage in a batch must appear in that state's fact block, or the run fails.
import { readFileSync, writeFileSync } from "node:fs";

const [factsPath, ...batchPaths] = process.argv.slice(2);
const facts = readFileSync(factsPath, "utf8");
const blocks = {};
for (const b of facts.split(/\n(?=### )/)) { const m = b.match(/^### .*\((\w+)\)/); if (m) blocks[m[1]] = b; }

// ChatGPT refers to the "engine" and "supplied" fact sheet; readers only see a calculator.
const rewrites = [
  [/\bthe engine's\b/gi, "the calculator's"],
  [/\bengine examples\b/gi, "examples"],
  [/\bengine (method|result|output|calculation)\b/gi, "calculator $1"],
  [/\bthe engine\b/gi, "the calculator"],
  [/\bsupplied (engine )?/gi, ""],
  [/\bcalculator facts\b/gi, "calculator"],
  [/\b(\w+) engine\b/gi, "$1 calculator"],
];
const clean = s => rewrites.reduce((t, [re, to]) => t.replace(re, to), s).replace(/\s{2,}/g, " ").trim();

const banned = ["depends on your income level, filing status, allowances", "transparent estimate", "gross pay is your earnings before", "also called take-home pay", "annualizes your wages", "recent pay stub provides", "refer to your pay stub", "compare your take-home pay across states"];

const out = [];
let failed = false;
for (const path of batchPaths) {
  for (const s of JSON.parse(readFileSync(path, "utf8"))) {
    const fb = blocks[s.code];
    if (!fb) { console.error(`${s.code}: no fact block`); failed = true; continue; }
    const ed = {
      code: s.code,
      intro: clean(s.intro),
      taxSummary: clean(s.taxSummary),
      sections: s.sections.map(x => ({ h3: clean(x.h3), p: clean(x.p) })),
      faqs: s.faqs.map(x => ({ q: clean(x.q), a: clean(x.a) })),
    };
    const text = [ed.intro, ed.taxSummary, ...ed.sections.flatMap(x => [x.h3, x.p]), ...ed.faqs.flatMap(x => [x.q, x.a])].join("\n");
    const nums = [...new Set([...text.matchAll(/\$[\d,]*\d(?:\.\d+)?|\b\d+(?:\.\d+)?%/g)].map(m => m[0]))];
    const missing = nums.filter(n => n !== "100%" && !(n === "0.00%" && fb.includes("state income tax $0.00")) && !fb.includes(n)); // "100%" = plain English ("not 100% of gross"); "0.00%" is allowed for no-income-tax states
    const hits = banned.filter(b => text.toLowerCase().includes(b));
    const leftover = text.match(/\b(engine|supplied|fact block)\b/gi) || [];
    const words = text.split(/\s+/).length;
    console.log(`${s.code}: ${words} words, ${ed.sections.length} sections, ${ed.faqs.length} faqs` + (missing.length ? ` — UNVERIFIED: ${missing.join(" ")}` : "") + (hits.length ? ` — BANNED: ${hits.join("; ")}` : "") + (leftover.length ? ` — leftover meta words: ${leftover.join(",")}` : ""));
    if (missing.length || hits.length || leftover.length) failed = true;
    if (s.needsVerification?.length) console.log(`   needsVerification: ${s.needsVerification.join(" | ")}`);
    out.push(ed);
  }
}
if (failed) { console.error("FAILED — fix the batch before merging"); process.exit(1); }
out.sort((a, b) => a.code.localeCompare(b.code));
writeFileSync("app/data/state-editorial.json", JSON.stringify(out, null, 2) + "\n");
console.log(`wrote app/data/state-editorial.json (${out.length} states)`);
