# 批次 D 事实块：州汽车销售税计算器（AR / TN / MO / OH / TX）

配合 `scripts/SCENARIO-PAGES-PROMPT.md` 使用：把"## 页面说明"和"## 粘贴区"两部分贴在提示词末尾。生成日期 2026-10-26。

## 为什么做这一批

来源：Semrush 关键词导出（2026-10）。每个州的同义词合并成一个页面。

| # | URL | 合并的词数 | 月搜索量 | KD |
|---|---|---|---|---|
| 11 | `/missouri-vehicle-sales-tax-calculator` | 11 | 5,960 | 18–30 |
| 12 | `/arkansas-vehicle-sales-tax-calculator` | 9 | 3,780 | 14–22 |
| 13 | `/tennessee-vehicle-sales-tax-calculator` | 9 | 2,700 | 14–21 |
| 14 | `/texas-vehicle-sales-tax-calculator` | 5 | 1,100 | 19–30 |
| 15 | `/ohio-vehicle-sales-tax-calculator` | 3 | 510 | 13–18 |

## 核实状态（给开发看，不贴进提示词）

| 州 | 已用官方来源核实 | 待核实 |
|---|---|---|
| AR | DFA：Act 1013 的三档（低于 $4,000 不收、$4,000–$9,999 用 3.5%、$10,000 及以上用 6.5%），地方税不适用减免税率 | 低于 $4,000 时地方税是否也免；置换车抵扣；地方税单笔上限 |
| TN | TN DOR：州税 7% 按全价征收；地方税只对前 $1,600 征收（Hamblen、Hancock 的计税基数更低）；州 single article tax 2.75% 只对 $1,600–$3,200 这一段征收；Davidson 县 $30,000 的官方示例 | 地方税率区间（第三方来源有说 1.5%–2.75%，也有说 2.25%–2.75%）；置换车抵扣 |
| MO | MO DOR：4.225% + 地方税，按扣除置换车后的价格计税；30 天内办理过户并缴税；逾期从第 31 天起罚 $25，每多 30 天再加 $25，最高 $200 | 地方税率按哪个地址确定（第三方来源说按买家住址，官方页面没写）；私人之间买卖能否抵扣置换车 |
| OH | ODT：按买家居住县的税率，在 clerk of courts 缴纳；置换车只在向持牌经销商买新车时抵扣；私人之间买卖也征税 | 无 |
| TX | Comptroller：6.25%，扣除置换车；私人买卖按 SPV（官方推定车价）计税；新居民 $90，even exchange $5，赠与 $10；30 天缴纳 | **80% SPV 规则**：第三方来源说按"成交价和 80% SPV 两者取高"，TxDMV 的说法是"成交价和 SPV 两者取高"。上线前必须到 Comptroller 的 Motor Vehicle Tax Guide 确认 |

计算器需要的数据：
- **OH：** 直接复用 `app/data/ohio-sales-tax.json`，88 个县加上交通区，生效期 2026-10-01 至 2026-12-31。
- **MO、AR、TN：** 站上没有地方税率表。先让用户自己输入地方税率，并链接到各州官方的税率查询页面；以后再考虑导入税率表。
- **TX：** 没有地方机动车税（结构性事实，待核实），不需要地方税率输入。

官方来源：
- AR DFA — Recent Changes in the Law: https://www.dfa.arkansas.gov/office/motor-vehicle/recent-changes-in-the-law/
- TN DOR — Single Article Special Tax Rates: https://www.tn.gov/revenue/taxes/sales-and-use-tax/single-article-special-tax-rates.html；County Clerk Sales and Use Tax Manual (June 2025)：https://www.tn.gov/content/dam/tn/revenue/documents/tax_manuals/june-2025/County-Clerk-Tax-Manual.pdf
- MO DOR — Motor Vehicle Titling and Registration: https://dor.mo.gov/motor-vehicle/titling-registration/
- OH ODT — Motor Vehicles: https://tax.ohio.gov/business/sales-and-use-tax/motor-vehicles；Casual Sale FAQ：https://tax.ohio.gov/help-center/faqs/vehicle-taxability-compliance-casual-sale/motor-vehicle-taxability-casual-sale
- TX Comptroller — Motor Vehicle Sales and Use Tax: https://comptroller.texas.gov/taxes/motor-vehicle/sales-use.php；TxDMV SPV：https://www.txdmv.gov/standard-presumptive-calculator

## 页面说明

Write the pages below with the same rules, return schema, and anti-duplication checks as the paycheck pages in this prompt. Replace the paycheck-specific link list with: the state paycheck calculator, `/sales-tax`, the state's city/county sales-tax pages if any, and sibling vehicle pages in this batch. Do not restate how general sales tax works; each page is about that state's vehicle rule only.

**#11 Missouri vehicle sales tax calculator.** Core mechanic: the buyer, not the dealer, pays 4.225% plus local tax at the license office within 30 days, on the price minus the trade-in. Angles: (a) one example walked through, state line plus an entered local rate; (b) the 30-day deadline and the late penalty schedule; (c) trade-ins: what reduces the taxable price; (d) finding your local rate.

**#12 Arkansas vehicle sales tax calculator.** Core mechanic: used-vehicle tax depends on which price band the car falls in. Angles: (a) the three bands with one example each; (b) why a $9,999 and a $10,000 car are taxed so differently (use the example figures); (c) local tax still applies at the full local rate in the reduced band; (d) new vs used: the reduced band is for used vehicles.

**#13 Tennessee vehicle sales tax calculator.** Core mechanic: three layers. State 7% on the full price, local tax only on the first $1,600, and the 2.75% single article tax only on the next $1,600. Angles: (a) the Davidson County $30,000 example line by line; (b) why the local and single-article layers stop growing after $3,200; (c) a cheap-car example ($2,500) where the layers matter more; (d) counties with a lower local base.

**#14 Texas vehicle sales tax calculator.** Core mechanic: 6.25% statewide with no local layer; private sales are taxed on standard presumptive value, not just the price paid. Angles: (a) dealer purchase with a trade-in; (b) private-party purchase and SPV; (c) flat-fee cases: new resident $90, even exchange $5, gift $10; (d) the 30-day deadline for private sales.

**#15 Ohio vehicle sales tax calculator.** Core mechanic: the rate is set by your county of residence, not the dealer's, and trade-ins count only on new vehicles from a licensed new-car dealer. Angles: (a) new car with a trade-in vs used car with a trade-in, same county; (b) same car, two counties (and a transit-area county); (c) private sales are taxed too, paid at the clerk of courts; (d) link to the Ohio sales tax calculator for every county's rate.

## 粘贴区

### #11 Missouri vehicle sales tax calculator — slug: /missouri-vehicle-sales-tax-calculator
- Primary keyword: missouri vehicle sales tax calculator (also: missouri car sales tax calculator, mo vehicle sales tax calculator, calculate missouri sales tax on car)
- Core mechanic: the buyer pays 4.225% plus local tax at titling, on the price minus the trade-in.
- Rules for 2026 (source: Missouri Department of Revenue, Motor Vehicle Titling and Registration):
  - Tax = state tax of 4.225% plus local sales tax, on the purchase price less the trade-in allowance, if any.
  - You have 30 days from the date of purchase to title the vehicle and pay sales tax.
  - Late title penalty: $25 starting on the 31st day, plus $25 for every additional 30 days, up to $200.
  - The local rate varies by location; the calculator asks the user to enter it. Do not state any specific local rate.
- Examples (state portion only; local tax is shown as "plus your local rate × taxable price"):
  - $25,000 vehicle, $5,000 trade-in → taxable $20,000 → state tax $845.00, plus local tax on $20,000
  - $30,000 vehicle, no trade-in → state tax $1,267.50, plus local tax on $30,000
- needsVerification hints: which address sets the local rate; trade-in rules for private sales.

### #12 Arkansas vehicle sales tax calculator — slug: /arkansas-vehicle-sales-tax-calculator
- Primary keyword: arkansas vehicle sales tax calculator (also: arkansas car sales tax calculator, calculate sales tax on car in arkansas)
- Core mechanic: used vehicles are taxed by price band.
- Rules (source: Arkansas DFA, Act 1013, for used vehicles sold on or after January 1, 2022; the date of sale counts, not the date of registration):
  - Price under $4,000: no tax is collected.
  - $4,000 to under $10,000: reduced state rate of 3.5%. Local tax is not reduced; it applies at the full local rate.
  - $10,000 or more: full state rate of 6.5%.
  - The local rate varies by location; the calculator asks the user to enter it.
- Examples (state portion):
  - Used, $3,500 → state tax $0.00
  - Used, $8,000 → state tax $280.00 (3.5%), plus full local tax on $8,000
  - Used, $25,000 → state tax $1,625.00 (6.5%), plus local tax
  - New, $35,000 → state tax $2,275.00 (6.5%), plus local tax
- needsVerification hints: whether local tax is also waived under $4,000; trade-in credit; any local cap on a single purchase.

### #13 Tennessee vehicle sales tax calculator — slug: /tennessee-vehicle-sales-tax-calculator
- Primary keyword: tennessee vehicle sales tax calculator (also: tn car sales tax calculator, sales tax on cars in tn calculator, tn auto sales tax calculator)
- Core mechanic: state 7% on the full price + local tax on the first $1,600 + state single article tax of 2.75% on the amount from $1,600 to $3,200.
- Rules (source: Tennessee Department of Revenue, Single Article Special Tax Rates; County Clerk Sales and Use Tax Manual, June 2025):
  - The 7% state rate applies to the entire sales price.
  - Local option tax applies only to the first $1,600 in most jurisdictions; Hamblen County uses a $300 base and Hancock County a $375 base.
  - State single article tax: 2.75% of the price between $1,600 and $3,200. Nothing above $3,200 is subject to it, so it never exceeds $44.00.
- Examples:
  - $30,000 car, Davidson County (2.25% local, the Department's own example): state $2,100.00 + local $36.00 + single article $44.00 → total $2,180.00
  - $15,000 car, Davidson County: state $1,050.00 + local $36.00 + single article $44.00 → total $1,130.00
  - $2,500 car, Davidson County: state $175.00 + local $36.00 + single article $24.75 → total $235.75
- needsVerification hints: the range of local rates; trade-in credit.

### #14 Texas vehicle sales tax calculator — slug: /texas-vehicle-sales-tax-calculator
- Primary keyword: texas vehicle sales tax calculator (also: texas car sales tax calculator, tx auto sales tax calculator)
- Core mechanic: 6.25% statewide; private used-vehicle sales are taxed on standard presumptive value (SPV).
- Rules (source: Texas Comptroller, Motor Vehicle Sales and Use Tax):
  - Sales tax: 6.25% of the sales price, minus any trade-in allowance.
  - Dealer purchases: the dealer collects the tax.
  - Private-party used-vehicle purchases: SPV is used to calculate the tax; the buyer pays within 30 calendar days of purchase.
  - New resident tax: $90 in lieu of use tax, for a vehicle previously registered in the new resident's name in another state or country.
  - Even exchange: $5. Gift: $10.
- Examples:
  - Dealer, $30,000 with an $8,000 trade-in → taxable $22,000 → $1,375.00
  - Dealer, $30,000, no trade-in → $1,875.00
  - Private sale, price $6,000, SPV $10,000 → $625.00 if taxed on the SPV. (Third-party sources describe an 80%-of-SPV floor, which would give $500.00. Use only the SPV figure unless the rule is confirmed; do not mention the 80% figure.)
- needsVerification hints: the 80% SPV rule; no local tax on motor vehicles; trade-in rules on private sales.

### #15 Ohio vehicle sales tax calculator — slug: /ohio-vehicle-sales-tax-calculator
- Primary keyword: ohio vehicle sales tax calculator (also: ohio car sales tax calculator, ohio auto sales tax calculator)
- Core mechanic: the buyer's county of residence sets the rate; trade-ins reduce the taxable price only on new vehicles bought from a licensed new-car dealer.
- Rules (source: Ohio Department of Taxation, Motor Vehicles page and casual-sale FAQ; county rates from the ODT table effective October 1 – December 31, 2026):
  - Tax is paid to the clerk of courts at titling, at the rate of the buyer's county of residence.
  - Trade-in credit applies only when a licensed dealer sells a new motor vehicle. Trading in toward a used vehicle gives no reduction.
  - Private (casual) sales of motor vehicles are taxable; the exemption for casual sales does not cover motor vehicles.
  - State base 5.75%; combined county rates run from 6.5% to 8.0%.
- Examples:
  - Franklin County (8.0%), new $35,000 with a $10,000 trade-in at a new-car dealer → taxable $25,000 → $2,000.00
  - Franklin County (8.0%), used $20,000 with a $5,000 trade-in → no trade-in credit → $1,600.00
  - Same $30,000 car: Delaware County (7.0%) → $2,100.00; the Delaware County COTA transit area (8.0%) → $2,400.00
- needsVerification hints: none required from memory; avoid other claims.
