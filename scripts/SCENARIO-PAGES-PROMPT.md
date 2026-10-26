# 场景页提示词：第一批 10 个验证页（2026-10）

来源：`seo-plans/gsc-review-2026-10.md` 的场景页拓展清单。

## 为什么只做 10 个

四个方向全铺开的话：1099 × 50 州 + dependents × 6 州 + weekly × 50 州 + CA 城市若干，总共 110 个以上。按哥飞"先验证再批量"的思路，第一批每个方向只挑 GSC 里已经出现需求、而且计算逻辑确实不同的页面，最多 10 个。上线 2–3 周后，哪个方向有页面进了前 20，再把它扩到更多州。

| # | URL | 主关键词 | 跟同组其他页的根本区别 |
|---|---|---|---|
| 1 | `/texas-1099-tax-calculator` | texas 1099 tax calculator / texas self employed tax calculator | 没有州税：全部是 SE 税 + 联邦税，重点讲季度预缴 |
| 2 | `/california-1099-tax-calculator` | california 1099 tax calculator | 有州税：CA 540-ES 不均等的预缴比例、自雇者不交 SDI、LLC 的 $800 |
| 3 | `/california-paycheck-calculator-with-dependents` | california paycheck calculator with dependents | DE 4 的两种 allowance（regular / estimated deduction） |
| 4 | `/new-york-paycheck-calculator-with-dependents` | new york paycheck calculator with dependents | IT-2104 allowance 是扣减额（$1,000/个），NYC / Yonkers 叠加 |
| 5 | `/illinois-paycheck-calculator-with-dependents` | illinois paycheck calculator with dependents | 单一税率：每个 allowance 每年省多少钱是一个固定数 |
| 6 | `/georgia-paycheck-calculator-with-dependents` | georgia paycheck calculator with dependents | G-4 的 dependent allowance 和婚姻状态代码 |
| 7 | `/weekly/florida-paycheck-calculator` | florida weekly paycheck calculator | 没有州税；时薪服务业、FL 最低工资按周算 |
| 8 | `/weekly/illinois-paycheck-calculator` | weekly paycheck calculator illinois | 单一税率按周算、芝加哥最低工资 |
| 9 | `/weekly/georgia-paycheck-calculator` | hourly paycheck calculator georgia weekly | 时薪输入为默认，加班计入周薪 |
| 10 | `/san-jose-paycheck-calculator`（标题用 "San Jose Take Home Pay Calculator"） | san jose take home pay calculator | 没有市税：重点是科技岗位的 RSU / 奖金补充预扣、SDI、圣何塞最低工资 |

不做的：
- **PA dependents**：宾州是 3.07% 单一税率，没有 allowance，填了家属也不改变州预扣，页面会很薄。
- **NJ dependents**：放到第二批。
- **with-bonus 扩到其他州**：Texas 这个页面曝光才 32 次，需求还没被验证。

## 动手前要先确认

1. **引擎支持：** 每个页面的示例数字都必须由 `app/lib/payroll.ts` 算出来。CA、NY、IL 已经支持 `stateAllowances`；GA 先确认 `dependentAllowances` 的逻辑，不支持就先补引擎，再写页面。
2. **页面结构：** 计算器放首屏，文案在计算器下面；结构参考 `app/texas-paycheck-calculator-with-dependents/page.tsx`。
3. **内链：**
   - 每个页面都要从父页链进来：对应的州页、`/self-employment-tax-calculator`、`/weekly-paycheck-calculator`。
   - 同一组的兄弟页之间互相链接。
   - 页面都要加进 `app/lib/indexableRoutes.ts`。
4. **事实块：** 每个页面都要按下面"事实块模板"生成一份，并从引擎导出数字，再交给提示词。

## 怎么用

- 分 3 次对话，每次开新对话：
  - 批次 A：#3–#6（dependents）
  - 批次 B：#7–#9（weekly）
  - 批次 C：#1、#2、#10
- 同类页放在同一批，模型才能主动避开彼此的写法。
- 把横线以下的内容粘进去，再在末尾贴上这一批的事实块。
- 收回 JSON 后，交给我接进页面。我会跑一遍相似度检查：任意两页不能有超过 8 个连续相同的单词，标题结构也不能重复。

---

You are a senior US payroll writer and a search-intent editor. You are writing the
editorial copy for single-purpose calculator pages on paycheckscalculator.org. Each page
already has a working calculator at the top; you write what goes underneath it.

## How these pages win (read first)

These pages exist because Google Search Console shows real people searching an exact,
narrow need, for example "texas paycheck calculator with dependents" or
"florida weekly paycheck calculator". The site cannot outrank ADP or SmartAsset on the
head term, but it can be the best answer to the narrow one. So:

1. **One page = one need.** The page answers its primary keyword's question and nothing
   broader. If a paragraph would be equally true on the plain state paycheck page, it does
   not belong here.
2. **Answer in the first screen.** The `intro` states the specific mechanism of this
   scenario (what changes on the paycheck and roughly by how much, using an example
   figure) in the first sentence. No warm-up.
3. **The page earns its existence through its mechanics.** Each page in this batch has a
   different "core mechanic" listed in its brief. Build the whole page around that
   mechanic. Two pages that would read the same once you swap the state name are a
   failure, even if every sentence is reworded.
4. **Searchers' follow-up questions, not generic advice.** FAQs are what someone with
   this exact need asks next (for example "Do I claim my kids on the DE 4 or the W-4?"), not
   "What is take-home pay?".

## Hard rules on facts (most important)

1. Use ONLY the numbers in the fact block for that page: rates, allowance values, credit
   amounts, thresholds, due dates, minimum wages, and the engine-computed examples. Quote
   example figures exactly, to the cent.
2. Do NOT invent or recall any other number. If a sentence needs a number you were not
   given, describe the mechanism without it.
3. Structural facts you know but were not given (for example "California's self-employed do not pay
   SDI unless they buy elective coverage") are allowed without numbers, but each one goes
   into `needsVerification`.
4. Tax year is 2026. Never contradict the fact block.
5. Never say "the engine", "fact block", "supplied", or comment on what you were given.
   Say "the calculator" and "at $75,000 married".

## Page briefs

Write only the pages whose fact blocks are pasted below. Each brief fixes the core
mechanic and the H2 skeleton; you write the headings in your own words, but you must
cover these angles in this order and no others.

**#1 Texas 1099 tax calculator.** Core mechanic: with no state income tax, a Texas
freelancer's whole bill is self-employment tax plus federal income tax, paid through
quarterly estimates. Angles: (a) SE tax on 92.35% of net earnings and the half-SE
deduction, walked through one example; (b) the quarterly 1040-ES calendar and what
"safe harbor" protects; (c) the 1099 rate vs a W-2 salary in Texas: what gross W-2 salary
gives the same take-home (use the example's "W-2 equivalent"); (d) what Texas does and
does not tax a sole proprietor (franchise tax is structural, needs verification).

**#2 California 1099 tax calculator.** Core mechanic: California adds state income tax
on top of SE tax, with an uneven estimated-payment schedule. Angles: (a) one example split
into SE tax, federal and California tax; (b) the 540-ES payment schedule and why the June
payment is the big one; (c) SDI: employees pay it, self-employed don't unless they opt in;
(d) the LLC / $800 franchise tax question, kept qualitative unless it is in the fact block.
Must not reuse any heading pattern from #1.

**#3 California with dependents.** Core mechanic: DE 4 has two kinds of allowances,
and dependents usually belong in the regular allowances line. Angles: (a) DE 4 vs W-4 Step 3,
showing which form changes which line; (b) an example table of 0–4 allowances; (c) when
estimated-deduction allowances make sense; (d) what happens if you only fill out the federal W-4.

**#4 New York with dependents.** Core mechanic: each IT-2104 allowance lowers taxable
wages by a fixed amount, and NYC/Yonkers withholding moves with it. Angles: (a) how the
allowance amount works in one example; (b) NYC resident example vs upstate example; (c) the
Empire State child credit arrives at filing, not in the paycheck (needs verification);
(d) the IT-2104 worksheet lines people get wrong.

**#5 Illinois with dependents.** Core mechanic: Illinois is flat, so every allowance is
worth exactly the same dollar amount per year and per paycheck. Angles: (a) the arithmetic
of one allowance (allowance value × 4.95%) using the fact-block number; (b) basic vs
additional allowances on IL-W-4 (line 1 vs line 2); (c) combined federal + state change for
2 kids in one example; (d) two-earner households splitting allowances.

**#6 Georgia with dependents.** Core mechanic: G-4 dependent allowances plus the
marital-status code. Angles: (a) the G-4 status letters and what each does; (b) the
dependent allowance value in one example; (c) Georgia's flat rate in 2026 and why
allowances still matter under a flat rate; (d) Georgia exemption from withholding.

**#7 Florida weekly.** Core mechanic: 52 pay periods and no state tax, so a weekly check
is gross minus federal and FICA; built for hourly service and tipped work. Angles:
(a) a 40-hour week at Florida minimum wage, line by line; (b) weekly vs biweekly federal
withholding (same year, different per-check shape); (c) tips and overtime weeks; (d) why
Florida weekly checks still are not 100% of gross.

**#8 Illinois weekly.** Core mechanic: the flat 4.95% applied per week, with allowance
value prorated over 52 weeks. Angles: (a) one weekly example with the per-week allowance
deduction shown; (b) Chicago vs rest-of-state minimum wage week (only if in the fact block);
(c) Illinois pay-frequency rules (structural, needs verification); (d) converting a weekly
check to annual for a loan or apartment application.

**#9 Georgia weekly (hourly).** Core mechanic: hourly worker paid weekly; overtime
weeks change withholding for that week only. Angles: (a) hourly × hours → weekly check
example; (b) a 50-hour week vs a 40-hour week; (c) the federal "no tax on overtime"
deduction, which is claimed at filing and does not show up in the weekly check (use only
what the fact block says); (d) Georgia withholding on a weekly table.

**#10 San Jose take-home pay.** Core mechanic: San Jose has no city income tax; what
makes a San Jose paycheck different is high tech salaries, supplemental withholding on
RSUs/bonuses, and California SDI. Angles: (a) one San Jose salary example from the fact
block; (b) RSU vest / bonus: federal and California supplemental rates vs regular
withholding; (c) SDI with no wage cap at high incomes; (d) San Jose minimum wage week
(if in the fact block). Must open by answering "Is there a San Jose city income tax?"
(no), in one clause, then move on.

## What to return for each page

- `slug`: as in the table.
- `title`: ≤60 characters, starts with the primary keyword in natural word order, ends
  with "2026" where it fits.
- `metaDescription`: 140–160 characters. Lead with the mechanic and one example number.
  Do not put the full answer in it; leave a reason to open the calculator (state choice,
  your own salary).
- `h1`: the primary keyword, natural casing.
- `intro`: 2 sentences, ≤50 words, first sentence states the core mechanic with an example
  figure.
- `sections`: exactly 4 `{h2, p}` blocks following the brief's angles in order, 110–170
  words each. Headings are specific to this page ("How an Illinois allowance cuts $X a year"),
  never generic ("Understanding your paycheck").
- `exampleCaption`: one sentence describing the example table the page renders.
- `faqs`: 4 `{q, a}`, answers 40–80 words. At least one uses an example number. Questions
  must be ones a person with this exact need searches next.
- `internalLinks`: 3–5 `{anchor, href}` chosen from: the state paycheck page, the matching
  biweekly/weekly page, `/self-employment-tax-calculator`, `/hourly-paycheck-calculator`,
  `/w4v-form`, `/no-tax-on-overtime`, and sibling pages in this batch. Anchors are descriptive,
  never "click here".
- `needsVerification`: every structural claim made from memory.

## Anti-duplication rules (apply across the whole batch)

- No two pages share an h2 pattern, an opening sentence, a FAQ question, or a closing line.
- No sequence of 8+ identical words between any two pages (state names excluded).
- Banned phrases: "it's important to note", "whether you're a", "in today's economy",
  "take-home pay, also called net pay", "results may vary", "consult a tax professional"
  (you may say once per page which form or agency settles the answer, naming it).
- Do not restate what a W-4 is, what FICA is, or what gross pay is. Link instead.
- Total per page: 650–850 words across all fields.

## Self-check before you answer

- Every dollar figure appears verbatim in that page's fact block.
- Each page's intro would be false on every other page in the batch.
- No banned phrase, no shared heading pattern, no 8-word overlap.
- Output valid JSON only: one array, one object per page, no markdown fences, no commentary.

## Output schema

[
  {
    "slug": "/illinois-paycheck-calculator-with-dependents",
    "title": "string",
    "metaDescription": "string",
    "h1": "string",
    "intro": "string",
    "sections": [ { "h2": "string", "p": "string" } ],
    "exampleCaption": "string",
    "faqs": [ { "q": "string", "a": "string" } ],
    "internalLinks": [ { "anchor": "string", "href": "string" } ],
    "needsVerification": [ "string" ]
  }
]

## Fact block template (one per page, generated from the engine)

### #N <Page name> — slug: /<slug>
- Primary keyword: <...>; GSC evidence: <query, impressions, position>
- Core mechanic: <one line, copied from the brief>
- Rules and numbers for 2026 (each with its official source): <allowance value, rate,
  credit, schedule, minimum wage, SDI rate…>
- Engine-computed examples (state the frequency, filing status, and assumptions):
  - <scenario> → gross … → federal … → SS … → Medicare … → state … → [SE tax / SDI / local] … → net …
  - <3–5 rows that vary only the scenario's own variable: allowances 0–4, hours 40/50, 1099 income levels, RSU vest size>
- Calculator method label: "<label from payroll.ts>"

## Fact blocks for this batch

<paste the fact blocks for this batch here>
