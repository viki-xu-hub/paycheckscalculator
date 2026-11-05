// Run: npx tsx --test tests/biweekly-pay.test.ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import editorialRaw from "../app/data/biweekly-pay-editorial.json";
import hourlyRaw from "../app/data/hourly-rates.json";
import salaryRaw from "../app/data/salary.json";
import {
  BANK_HOLIDAY_FRIDAYS,
  BIWEEKLY_DATES_IMAGE,
  BIWEEKLY_PAGES,
  HUB_RATES,
  HUB_SALARIES,
  biweeklyDescription,
  biweeklyFacts,
  biweeklyImages,
  biweeklyPageBySlug,
  biweeklyTitle,
  dollars,
  fillTokens,
  fridaySchedule,
  hubChartRows,
  nearbyPay,
  payPeriodRows,
  rankedStates,
} from "../app/lib/biweeklyPay";
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
    assert.ok(title.startsWith(`${page.label} Is How Much Biweekly?`));
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
    const rows = payPeriodRows(page, f);
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
    const rows = nearbyPay(page, f);
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
