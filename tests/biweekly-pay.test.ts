// Run: npx tsx --test tests/biweekly-pay.test.ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import editorialRaw from "../app/data/biweekly-pay-editorial.json";
import stateEditorialRaw from "../app/data/biweekly-pay-state-editorial.json";
import hourlyRaw from "../app/data/hourly-rates.json";
import salaryRaw from "../app/data/salary.json";
import {
  BANK_HOLIDAY_FRIDAYS,
  BIWEEKLY_DATES_IMAGE,
  BIWEEKLY_PAGES,
  BIWEEKLY_STATE_PAGES,
  HUB_RATES,
  HUB_SALARIES,
  biweeklyDescription,
  biweeklyFacts,
  biweeklyImages,
  biweeklyPageBySlug,
  biweeklyStateDescription,
  biweeklyStateFacts,
  biweeklyStateImages,
  biweeklyStateTitle,
  biweeklyTitle,
  KFF_FAMILY_PREMIUM,
  KFF_SINGLE_PREMIUM,
  TDK_VARIANT,
  dollars,
  fillTokens,
  fridaySchedule,
  hubChartRows,
  nearbyPay,
  payBenchmarks,
  payPeriodRows,
  rankedStates,
  realCheckRows,
  rentRows,
} from "../app/lib/biweeklyPay";
import { locations } from "../app/lib/locations";
import { biweeklySiblingStates } from "../app/lib/seo/internalLinks";
import { calculatePaycheck, federalWithholding2026 } from "../app/lib/payroll";

type Editorial = {
  hook: string;
  sections: { h2: string; p: string[] }[];
  faqs: { q: string; a: string }[];
  notes: { perCheck: string; bracket: string; month: string[]; state: string; hours?: string };
};
const editorial = editorialRaw as Record<string, Editorial>;

const facts = (slug: string) => {
  const page = biweeklyPageBySlug(slug);
  assert.ok(page, slug);
  return { page, f: biweeklyFacts(page) };
};

for (const page of BIWEEKLY_PAGES) {
  const f = biweeklyFacts(page);
  const copy = editorial[page.slug];

  test(`${page.slug}: the headline net matches what the calculator shows with no deductions`, () => {
    const r = calculatePaycheck({ grossAnnual: page.annual, frequency: "biweekly", status: "single", state: "TX", retirementPercent: 0, preTaxPerPaycheck: 0 });
    assert.equal(f.noTaxNet, Math.round(r.netAnnual / r.periods));
  });

  test(`${page.slug}: figures shown side by side add up in whole dollars`, () => {
    assert.equal(f.twoCheck, f.noTaxNet * 2);
    assert.equal(f.threeCheck, f.noTaxNet * 3);
    assert.equal(f.monthGap, f.avgMonth - f.twoCheck);
    for (const s of f.states) assert.equal(s.tax, f.noTaxNet - s.net, s.short);
    for (const row of f.k401) assert.equal(row.taxSaved, Math.round(row.saved) - Math.round(row.netDrop));
  });

  test(`${page.slug}: hand-written copy resolves every token and carries real depth`, () => {
    assert.ok(copy, "missing editorial");
    const notes = [copy.notes.perCheck, copy.notes.bracket, ...copy.notes.month, copy.notes.state, copy.notes.hours ?? ""];
    const prose = [...copy.sections.flatMap(s => [s.h2, ...s.p]), ...notes].map(t => fillTokens(t, page, f));
    if (page.kind === "hourly") assert.ok(copy.notes.hours, "hourly pages need an hours note");
    copy.faqs.forEach(item => { fillTokens(item.q, page, f); fillTokens(item.a, page, f); });
    assert.ok(prose.join(" ").split(/\s+/).length >= 400, "under 400 hand-written words");
    assert.ok(!prose.join(" ").includes("{{"), "unfilled token");
  });

  test(`${page.slug}: title and description fit the search result`, () => {
    const title = biweeklyTitle(page, f);
    const description = biweeklyDescription(page, f, copy.hook);
    assert.ok(title.length <= 61, `title is ${title.length}`);
    assert.ok(description.length >= 120 && description.length <= 160, `description is ${description.length}`);
    assert.ok(title.startsWith(`${page.label} Is How Much Biweekly?`), title);
    assert.ok(title.includes(dollars(f.noTaxNet)), title);
  });

  test(`${page.slug}: charts carry the current figures (rerun the chart script if this fails)`, () => {
    const images = biweeklyImages(page.slug);
    const read = (path: string) => readFileSync(new URL(`../public${path}`, import.meta.url), "utf8");
    assert.ok(read(images.split).includes(dollars(f.noTaxNet)));
    assert.ok(read(images.split).includes(dollars(f.lowest.net)));
    assert.ok(read(images.states).includes(`keeps ${dollars(f.lowest.net)}`));
    assert.ok(read(images.calendar).includes(dollars(f.threeCheck)));
    assert.ok(readFileSync(new URL(`../public${images.cover}`, import.meta.url)).length > 1000);
  });
}

const validHrefs = new Set([
  ...BIWEEKLY_PAGES.map(p => `/biweekly-pay/${p.slug}`),
  ...(salaryRaw as { slug: string }[]).map(s => `/salary/${s.slug}`),
  ...(hourlyRaw as { slug: string }[]).map(h => `/hourly/${h.slug}`),
]);

for (const page of BIWEEKLY_PAGES) {
  const f = biweeklyFacts(page);

  test(`${page.slug}: pay periods agree with the headline figures`, () => {
    const rows = payPeriodRows(page, f.single.netAnnual);
    const net = (perYear: number) => rows.find(r => r.perYear === perYear)?.net ?? 0;
    assert.equal(Math.round(net(26)), f.noTaxNet);
    assert.equal(Math.round(net(12)), f.avgMonth);
    assert.equal(Math.round(net(24)), f.semiNet);
    assert.equal(net(1), f.single.netAnnual);
  });

  test(`${page.slug}: the next-dollar rate matches what the engine withholds from a raise`, () => {
    for (const [status, net, rates] of [["single", f.single.net, f.rates.single], ["married", f.married.net, f.rates.married], ["head", f.head.net, f.rates.head]] as const) {
      const raised = calculatePaycheck({ grossAnnual: page.annual + 26, frequency: "biweekly", status, state: "TX" });
      const kept = raised.netAnnual / raised.periods - net;
      assert.ok(Math.abs(1 - kept - rates.nextDollar) < 0.001, `${status}: kept ${kept} of $1, rate says ${rates.nextDollar}`);
      assert.ok(Math.abs(rates.effective - (1 - net / f.single.gross)) < 1e-9, status);
    }
  });

  test(`${page.slug}: the full state table covers all 52 places, best first`, () => {
    const ranked = rankedStates(f);
    assert.equal(ranked.length, 52);
    ranked.forEach((s, i) => {
      if (i) assert.ok(s.net <= ranked[i - 1].net, s.short);
      assert.equal(s.tax, f.noTaxNet - s.net, s.short);
    });
    assert.equal(ranked[0].rank, 1);
    assert.equal(ranked.find(s => s.short === f.lowest.short)?.net, f.lowest.net);
  });

  test(`${page.slug}: nearby pay shows two amounts each side and every link resolves`, () => {
    const rows = nearbyPay(page);
    assert.equal(rows.length, 5);
    assert.equal(rows[2].current, true);
    assert.equal(rows[2].diff, 0);
    assert.equal(rows[2].net, f.noTaxNet);
    rows.forEach((row, i) => {
      assert.ok(validHrefs.has(row.href), row.href);
      if (i) assert.ok(row.page.annual > rows[i - 1].page.annual);
    });
  });
}

for (const page of BIWEEKLY_PAGES) {
  const f = biweeklyFacts(page);

  test(`${page.slug}: benchmarks place the pay in the right band and name jobs`, () => {
    const b = payBenchmarks(page);
    assert.deepEqual(b.rows.map(r => r.annual), [37590, 50980, 64064, 80520]);
    const expected = page.annual < 50980 ? "below-median" : page.annual < 64064 ? "between-medians" : page.annual < 80520 ? "above-medians" : "top-quarter";
    assert.equal(b.band, expected);
    assert.ok(b.jobs.length >= 2, "should name at least two jobs");
    b.rows.forEach(r => assert.equal(r.diff, page.annual - r.annual));
  });

  test(`${page.slug}: rent and real-check rows follow the engine`, () => {
    const rents = rentRows(f);
    assert.equal(rents[0].monthly, f.rent);
    assert.equal(rents[1].monthly, Math.round(f.twoCheck * 0.3));
    assert.ok(rents[2].monthly <= rents[1].monthly);
    const real = realCheckRows(page, f);
    assert.equal(Math.round(real[0].net), f.noTaxNet);
    assert.equal(Math.round(real[real.length - 1].net), Math.round(f.realWorld.net));
    assert.equal(Math.round(real[1].out), Math.round(KFF_SINGLE_PREMIUM / 26));
    assert.ok(Math.round(real[3].out) > Math.round(KFF_FAMILY_PREMIUM / 26));
    for (let i = 1; i < real.length - 1; i += 1) {
      assert.ok(real[i].net < real[i - 1].net, real[i].label);
      assert.ok(real[i - 1].net - real[i].net < real[i].out - real[i - 1].out, `${real[i].label} should cost less than what comes out`);
    }
  });
}

test("every page is in the title test, with no group more than one page bigger", () => {
  assert.deepEqual(Object.keys(TDK_VARIANT).sort(), BIWEEKLY_PAGES.map(p => p.slug).sort());
  const count = (v: string) => Object.values(TDK_VARIANT).filter(x => x === v).length;
  const sizes = ["A", "B", "C"].map(count);
  assert.ok(Math.max(...sizes) - Math.min(...sizes) <= 1, `${sizes}`);
  for (const v of ["A", "B", "C"]) {
    const kinds = Object.entries(TDK_VARIANT).filter(([, x]) => x === v).map(([slug]) => slug.includes("hour"));
    assert.ok(kinds.includes(true) && kinds.includes(false), `group ${v} should hold salary and hourly pages`);
  }
});

type StateEditorial = { hook: string; sections: { h2: string; p: string[] }[]; faqs: { q: string; a: string }[]; notes: { perCheck: string; compare: string; incomeLabel: string; programLabel: string } };
const stateEditorial = stateEditorialRaw as Record<string, StateEditorial>;

test("the state pilot stays small and has copy for every page", () => {
  assert.equal(BIWEEKLY_STATE_PAGES.length, 2);
  assert.deepEqual(Object.keys(stateEditorial).sort(), BIWEEKLY_STATE_PAGES.map(sp => sp.key).sort());
});

for (const sp of BIWEEKLY_STATE_PAGES) {
  const facts = biweeklyStateFacts(sp);
  const copy = stateEditorial[sp.key];

  test(`${sp.key}: figures add up and match the calculator`, () => {
    const r = calculatePaycheck({ grossAnnual: sp.page.annual, frequency: "biweekly", status: "single", state: sp.loc.short as "TX", retirementPercent: 0, preTaxPerPaycheck: 0 });
    assert.equal(facts.net, Math.round(r.netAnnual / r.periods));
    assert.equal(facts.vsTexas, facts.f.noTaxNet - facts.net);
    const lines = facts.single.federal + facts.single.socialSecurity + facts.single.medicare + facts.single.stateIncome + facts.single.premiums;
    assert.ok(Math.abs(facts.single.gross - lines - facts.single.net) < 0.01);
    assert.equal(facts.places.filter(p => p.current).length, 1);
    assert.ok(facts.places.some(p => p.name === "Texas"));
    assert.equal(facts.nearby.find(n => n.current)?.net, facts.net);
  });

  test(`${sp.key}: copy resolves, has depth, and the search snippet fits`, () => {
    const fill = (t: string) => fillTokens(t, sp.page, facts.f);
    const prose = [...copy.sections.flatMap(s => [s.h2, ...s.p]), copy.notes.perCheck, copy.notes.compare].map(fill);
    copy.faqs.forEach(item => { fill(item.q); fill(item.a); });
    assert.ok(prose.join(" ").split(/\s+/).length >= 250, "under 250 hand-written words");
    const title = biweeklyStateTitle(sp, facts.net);
    const description = biweeklyStateDescription(sp, copy.hook);
    assert.ok(title.length <= 61, `title is ${title.length}`);
    assert.ok(description.length >= 120 && description.length <= 160, `description is ${description.length}`);
  });

  test(`${sp.key}: images carry the current figures`, () => {
    const images = biweeklyStateImages(sp);
    const read = (path: string) => readFileSync(new URL(`../public${path}`, import.meta.url), "utf8");
    assert.ok(read(images.split).includes(dollars(facts.net)));
    assert.ok(readFileSync(new URL(`../public${images.cover}`, import.meta.url)).length > 1000);
  });
}

test("claims in the state pages still hold", () => {
  const nycPage = BIWEEKLY_STATE_PAGES.find(sp => sp.key === "75000-a-year/nyc");
  const caPage = BIWEEKLY_STATE_PAGES.find(sp => sp.key === "22-an-hour/california");
  assert.ok(nycPage && caPage);
  const nyc = biweeklyStateFacts(nycPage);
  const ca = biweeklyStateFacts(caPage);
  assert.equal(nyc.rank, 52);
  assert.ok(nyc.single.premiums * 26 < 411.91, "75k should be under the NY PFL cap");
  assert.ok(Math.abs(nyc.single.premiums - (75000 * 0.00432) / 26) < 0.01);
  const drop = (annual: number, state: "NYC" | "TX" | "CA") => {
    const run = (retirementPercent: number) => calculatePaycheck({ grossAnnual: annual, frequency: "biweekly", status: "single", state, retirementPercent }).netAnnual / 26;
    return run(0) - run(5);
  };
  assert.ok(drop(75000, "NYC") < drop(75000, "TX"), "a 401(k) should cost less take-home in the city");
  assert.ok(ca.single.premiums > ca.single.stateIncome / 2, "SDI should be over half of income tax");
  assert.ok(Math.abs(ca.single.premiums - (45760 * 0.013) / 26) < 0.01);
  const netIn = (code: string) => ca.f.states.find(s => s.short === code)?.net ?? 0;
  for (const code of ["NV", "AZ", "WA"]) assert.ok(netIn(code) > ca.net, code);
  assert.ok(netIn("OR") < ca.net);
  // California's 6.6% rate starts at $41,452 of taxable wages, after the $5,706 standard deduction.
  assert.ok(45760 - 5706 < 41452 && 45760 - 5706 > 26264, "$22 should be in the 4.4% row");
  assert.ok(47840 - 5706 > 41452, "$23 should reach the 6.6% row");
  assert.equal(41452 + 5706, 47158);
});

test("claims in the $60,000 and $80,000 copy still hold", () => {
  const sixty = facts("60000-a-year").f;
  const eighty = facts("80000-a-year").f;
  const net = (x: typeof sixty, code: string) => x.states.find(s => s.short === code)?.net ?? 0;
  assert.equal(sixty.position.under, 6500);
  assert.equal(sixty.position.current.rate, 0.12);
  assert.ok(sixty.single.federal > sixty.single.socialSecurity + sixty.single.medicare);
  assert.equal(sixty.lowest.short, "NYC");
  assert.ok(sixty.lowestFive[1].short === "OR" && sixty.lowestFive[2].short === "CT");
  assert.ok(sixty.head.net - sixty.single.net < sixty.married.net - sixty.single.net);
  assert.equal(federalWithholding2026(70000, "single") - federalWithholding2026(66500, "single"), 770);
  assert.equal(eighty.position.over, 13500);
  assert.equal(eighty.position.current.rate, 0.22);
  assert.ok(80000 * 0.1 < eighty.position.over, "10% should stay inside the 22% slice");
  assert.ok(net(eighty, "CA") < net(eighty, "NY"), "California should have fallen behind New York State");
  assert.ok(Math.abs(net(eighty, "MA") - net(eighty, "NY")) <= 5, "Massachusetts should be about level with New York");
  assert.equal(eighty.lowest.short, "NYC");
  assert.ok(80000 < 81000);
  assert.ok(80000 - 4000 + 5000 === 81000, "the raise room in the copy");
});

test("the biweekly cluster links to itself in both directions", () => {
  const source = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
  const calculator = source("../app/biweekly-paycheck-calculator/page.tsx");
  assert.ok(calculator.includes("href={`/biweekly/${loc.slug}`}"), "calculator should list every state page");
  assert.ok(calculator.includes('href="/hourly-paycheck-calculator"'), "calculator should link to hourly");
  assert.ok(calculator.includes('href="/biweekly-pay"'), "calculator should link to the chart");
  const hourly = source("../app/hourly-paycheck-calculator/page.tsx");
  assert.ok(hourly.includes('href="/biweekly-paycheck-calculator"'), "hourly should link to the calculator");
  const statePage = source("../app/biweekly/[state]/page.tsx");
  assert.ok(statePage.includes('href="/biweekly-paycheck-calculator"') && statePage.includes('href="/biweekly-pay"'));
  assert.ok(source("../app/[location]/page.tsx").includes("/biweekly/${p.slug}"), "state calculators should link to their biweekly page");
  const slugs = new Set(locations.map(l => l.slug));
  const received = new Map<string, number>();
  for (const loc of locations) {
    const siblings = biweeklySiblingStates(loc.short);
    assert.ok(siblings.length >= 3, loc.short);
    for (const s of siblings) {
      assert.ok(slugs.has(s.slug), s.slug);
      assert.notEqual(s.short, loc.short);
      received.set(s.slug, (received.get(s.slug) ?? 0) + 1);
    }
  }
  const states = locations.filter(l => !l.city);
  assert.ok(states.every(l => (received.get(l.slug) ?? 0) >= 3), "no state should be left out of its neighbours' links");
});

test("no page says employers usually pay early without the caveat", () => {
  const hub = readFileSync(new URL("../app/biweekly-pay/page.tsx", import.meta.url), "utf8");
  assert.ok(!hub.includes("employers usually pay"));
  assert.ok(hub.includes("no federal law requires it"));
});

test("every hub chart row links to a page that exists", () => {
  for (const row of [...hubChartRows("salary"), ...hubChartRows("hourly")]) assert.ok(validHrefs.has(row.href), row.href);
  assert.equal(hubChartRows("salary").length, HUB_SALARIES.length);
  assert.equal(hubChartRows("hourly").length, HUB_RATES.length);
  for (const page of BIWEEKLY_PAGES) assert.ok(page.kind === "salary" ? HUB_SALARIES.includes(page.annual) : HUB_RATES.includes(page.rate as number), page.slug);
});

test("the pay calendar is 14 days apart on Fridays, with the counts the hub states", () => {
  const counts: [2 | 9, number, number][] = [[2, 2026, 26], [9, 2026, 26], [2, 2027, 27], [9, 2027, 26]];
  for (const [first, year, total] of counts) {
    const { dates } = fridaySchedule(first, year);
    assert.equal(dates.length, total, `${first}/${year}`);
    dates.forEach((iso, i) => {
      assert.equal(new Date(`${iso}T00:00:00Z`).getUTCDay(), 5, iso);
      if (i) assert.equal((Date.parse(iso) - Date.parse(dates[i - 1])) / 86400000, 14, iso);
    });
  }
  assert.deepEqual([fridaySchedule(2, 2027).dates[0], fridaySchedule(2, 2027).dates[26]], ["2027-01-01", "2027-12-31"]);
  assert.deepEqual(fridaySchedule(2, 2026).threeCheckMonths, ["January", "July"]);
  assert.deepEqual(fridaySchedule(9, 2026).threeCheckMonths, ["May", "October"]);
  assert.deepEqual(fridaySchedule(2, 2027).threeCheckMonths, ["January", "July", "December"]);
  assert.deepEqual(fridaySchedule(9, 2027).threeCheckMonths, ["April", "October"]);
});

test("the holiday claims on the hub hold", () => {
  for (const iso of BANK_HOLIDAY_FRIDAYS) assert.equal(new Date(`${iso}T00:00:00Z`).getUTCDay(), 5, iso);
  const onCalendar = (first: 2 | 9) => [...fridaySchedule(first, 2026).dates, ...fridaySchedule(first, 2027).dates];
  assert.deepEqual(BANK_HOLIDAY_FRIDAYS.filter(iso => onCalendar(2).includes(iso)), ["2026-06-19", "2027-01-01"]);
  assert.deepEqual(BANK_HOLIDAY_FRIDAYS.filter(iso => onCalendar(9).includes(iso)), ["2026-12-25"]);
  // A Thursday payroll from January 1, 2026 reaches December 31: 27 paydays.
  assert.equal(new Date("2026-01-01T00:00:00Z").getUTCDay(), 4);
  assert.equal((Date.parse("2026-12-31") - Date.parse("2026-01-01")) / 86400000, 26 * 14);
  // Moving the January 1, 2027 check to December 31, 2026 gives December 2026 a third check.
  assert.deepEqual(fridaySchedule(2, 2026).dates.slice(-2), ["2026-12-04", "2026-12-18"]);
  assert.ok(readFileSync(new URL(`../public${BIWEEKLY_DATES_IMAGE}`, import.meta.url)).length > 1000);
});

test("the hub stays off the topics the existing biweekly calculator page owns", () => {
  const source = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
  const headings = (text: string) => [...text.matchAll(/<h[12]>([^<{]+)<\/h[12]>/g)].map(m => m[1].trim().toLowerCase());
  const hub = source("../app/biweekly-pay/page.tsx");
  const existing = source("../app/biweekly-paycheck-calculator/page.tsx");
  const shared = headings(hub).filter(h => headings(existing).includes(h));
  assert.deepEqual(shared, []);
  const hubTitle = hub.match(/const TITLE = "([^"]+)"/)?.[1] ?? "";
  assert.ok(hubTitle.startsWith("Biweekly Pay Chart"), hubTitle);
  assert.ok(!/calculator/i.test(hubTitle), hubTitle);
  assert.ok(hubTitle.length <= 60, `${hubTitle.length}`);
  for (const question of ["What does biweekly pay mean?", "How do you calculate biweekly pay?", "Is biweekly the same as twice a month?"]) {
    assert.ok(!hub.includes(question), question);
  }
  assert.ok(hub.includes('href="/biweekly-paycheck-calculator">what biweekly pay means'), "the definition should point at the existing page");
});

// The hand-written copy states these outright, so a tax-table update must not silently falsify them.
test("claims in the $70,000 copy still hold", () => {
  const { f } = facts("70000-a-year");
  assert.equal(f.lowest.short, "NYC");
  assert.equal(f.position.current.rate, 0.22);
  assert.equal(f.position.over, 3500);
  assert.equal(f.position.nearerLine, "over");
  assert.ok(f.k401[2].taxSaved - f.k401[1].taxSaved < f.k401[1].taxSaved, "the second 5% should save less than the first");
});

test("claims in the $45,000 copy still hold", () => {
  const { f } = facts("45000-a-year");
  assert.equal(f.lowest.short, "OR");
  assert.equal(f.position.next.rate, 0.22);
  assert.equal(f.position.nearerLine, "under");
  assert.ok(f.noTaxGroup.some(s => s.short === "ND"), "North Dakota should withhold $0 here");
  const washington = f.states.find(s => s.short === "WA");
  assert.ok(washington && washington.net < f.noTaxNet);
});

test("claims in the $22 an hour copy still hold", () => {
  const { f } = facts("22-an-hour");
  assert.equal(f.lowest.short, "OR");
  assert.equal(f.position.nearerLine, "under");
  assert.equal(f.position.current.rate, 0.12);
});

test("the lowest-take-home location flips near $50,000, as the $45,000 copy says", () => {
  const lowestAt = (annual: number) =>
    (["OR", "NYC"] as const)
      .map(state => ({ state, net: calculatePaycheck({ grossAnnual: annual, frequency: "biweekly", status: "single", state }).netAnnual }))
      .sort((a, b) => a.net - b.net)[0].state;
  assert.equal(lowestAt(47000), "OR");
  assert.equal(lowestAt(53000), "NYC");
});

test("claims in the $57,000 copy still hold", () => {
  const { f } = facts("57000-a-year");
  const net = (code: string) => f.states.find(s => s.short === code)?.net ?? 0;
  assert.equal(f.lowest.short, "NYC");
  assert.equal(f.position.under, 9500);
  assert.ok(f.noTaxGroup.some(s => s.short === "ND"));
  assert.ok(net("CA") > net("NY"), "California should still beat New York State here");
  const seventy = facts("70000-a-year").f.states;
  assert.ok((seventy.find(s => s.short === "CA")?.net ?? 0) < (seventy.find(s => s.short === "NY")?.net ?? 0), "the order should flip by $70,000");
  assert.equal(federalWithholding2026(12000, "single"), 0);
  assert.equal(federalWithholding2026(69000, "single") - federalWithholding2026(57000, "single"), 1690);
});

test("claims in the $75,000 copy still hold", () => {
  const { f } = facts("75000-a-year");
  assert.equal(f.lowest.short, "NYC");
  assert.equal(f.position.over, 8500);
  assert.equal(f.position.nearerLine, "over");
  assert.ok(!f.lowestFive.some(s => s.short === "CA"));
});

test("claims in the $100,000 copy still hold", () => {
  const { f } = facts("100000-a-year");
  assert.equal(f.lowest.short, "NYC");
  assert.ok(f.lowestFive.some(s => s.short === "CA"), "California should be in the bottom five");
  assert.ok(!f.lowestFive.some(s => s.short === "MN"), "Minnesota should have left the bottom five");
  assert.equal(f.position.current.rate, 0.22);
  assert.equal(f.position.next.rate, 0.24);
  for (const page of BIWEEKLY_PAGES) assert.ok(biweeklyFacts(page).gapToLowest <= f.gapToLowest, `${page.slug} has a larger gap`);
});

test("claims in the hourly copy still hold", () => {
  assert.equal(facts("23-an-hour").f.lowest.short, "OR");
  const twentyFive = facts("25-an-hour").f;
  assert.equal(twentyFive.lowest.short, "NYC");
  assert.ok(twentyFive.noTaxGroup.some(s => s.short === "ND"));
  const thirtyFive = facts("35-an-hour").f;
  assert.equal(thirtyFive.lowest.short, "NYC");
  assert.equal(thirtyFive.position.over, 6300);
  assert.ok(72 * 35 * 26 < thirtyFive.position.current.startsAt, "a 72-hour check should annualize under the line");
  const keep = (f: typeof thirtyFive) => (f.hours[3].net - f.hours[2].net) / (f.hours[3].gross - f.hours[2].gross);
  assert.equal(Math.round(keep(thirtyFive) * 100), 70);
  assert.equal(Math.round(keep(facts("22-an-hour").f) * 100), 80);
  const hoh = facts("23-an-hour").f.head.federal;
  assert.ok(hoh > 2200 / 26 && hoh < (2 * 2200) / 26, "one child should nearly clear withholding and two should clear it");
});

test("claims in the per-page notes still hold", () => {
  const f = (slug: string) => facts(slug).f;
  const fica = (x: ReturnType<typeof f>) => x.single.socialSecurity + x.single.medicare;
  assert.ok(f("45000-a-year").single.federal < fica(f("45000-a-year")));
  assert.ok(Math.abs(f("57000-a-year").single.federal - fica(f("57000-a-year"))) < 15, "should be nearly level");
  assert.equal(f("57000-a-year").typical.short, "NJ");
  assert.ok(f("70000-a-year").single.federal > fica(f("70000-a-year")));
  assert.ok(f("22-an-hour").single.federal < fica(f("22-an-hour")));
  assert.ok(f("25-an-hour").single.federal > fica(f("25-an-hour")));
  const atTwentyFour = calculatePaycheck({ grossAnnual: 24 * 2080, frequency: "biweekly", status: "single", state: "TX" });
  assert.ok(atTwentyFour.federal < atTwentyFour.socialSecurity + atTwentyFour.medicare, "$25 should be the first rate where federal passes payroll tax");
  const seventyFive = f("75000-a-year");
  assert.ok(seventyFive.married.net - seventyFive.head.net < seventyFive.head.net - seventyFive.single.net);
  assert.ok(75000 * 0.1 < seventyFive.position.over, "10% should stay inside the 22% slice");
  const gain = (x: ReturnType<typeof f>) => x.married.net - x.single.net;
  for (const page of BIWEEKLY_PAGES) if (page.slug !== "100000-a-year") assert.ok(gain(biweeklyFacts(page)) < gain(f("100000-a-year")), page.slug);
  assert.ok(92 * 25 * 26 < f("25-an-hour").position.next.startsAt, "the 88-hour row should stay under the line");
  assert.ok(70000 * 0.05 === f("70000-a-year").position.over, "5% should exactly clear the line at $70,000");
});
