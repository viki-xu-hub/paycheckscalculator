# 批次 A 事实块：CA / NY / IL / GA with dependents

配合 `scripts/SCENARIO-PAGES-PROMPT.md` 使用：把"## 粘贴区"以下的内容贴在提示词末尾。

生成方式：
- 示例数字来自 `app/lib/payroll.ts` 的 `calculatePaycheck` 和 `app/lib/paycheckExtras.ts` 的 `dependentCreditAnnual`，生成日期 2026-10-26。
- 每一行同时套用联邦 W-4 Step 3（每个 17 岁以下孩子 $2,200）和州 allowance。
- 示例里州 allowance 数 = 孩子数，只计家属，不计本人和配偶。这个约定写进了每个事实块。

## 引擎核实结果（给开发看，不贴进提示词）

| 州 | 引擎怎么处理家属 | 引擎没模拟的部分 |
|---|---|---|
| CA | 每个 DE 4 regular allowance 每年抵减 $168.30 税额；低收入免预扣门槛 $18,896 / $37,791 | estimated deduction allowances（DE 4 第 1b 行） |
| NY | 每个 IT-2104 allowance 从工资里扣 $1,000；NYC 用同一个 allowance 数 | 无 |
| IL | 每个 allowance 扣 $2,925，再乘 4.95% | IL-W-4 第 2 行的 additional allowances（官方金额不同），引擎和第 1 行同样按 $2,925 计 |
| GA | 每个 allowance 扣 $5,000；标准扣除 $15,000，已婚且配偶不工作时 $30,000；税率 2026-05-11 前 5.19%，之后 4.99% | G-4 状态字母只模拟了 B（双职工）和 C（单职工）两种 |

GA 核实：Bloomberg Tax 关于 GA DOR 修订版 2026 Employer's Withholding Tax Guide 的报道，确认了 4.99% 税率、$15,000 / $30,000 标准扣除和 $5,000 dependent allowance，跟引擎一致。没找到来源确认"2026-05-11 起才切换到 4.99%"这个生效日期，所以列为待核实。

页面上线前要做的：
1. 在 GA DOR 的 2026 Employer's Tax Guide 原文里确认 5.19% → 4.99% 的员工预扣生效日期。
2. CA 页面的计算器只提供 regular allowances 输入，文案里 estimated deduction allowances 只做定性说明。
3. IL 页面的计算器把第 2 行 allowance 加成单独输入，或者文案里说明"计算器按第 1 行处理"。

GSC 证据：这 4 个州都没有直接的"with dependents"查询数据，GSC 把长尾词匿名化了。间接依据有两条：
- Texas with dependents 页排第 8.2 名，点击率 1.14%。
- 这 4 个州页本身的曝光：CA 1,627、IL 1,311、GA 838、NY 423。

## 粘贴区

Shared assumptions for every example below: 2026, biweekly pay (26 periods), no 401(k), no pre-tax benefits, federal W-4 Step 2 unchecked, no extra withholding. Each row applies the federal W-4 Step 3 credit ($2,200 per child under 17, $500 per other dependent; credit not applied above $200,000 single / $400,000 married income) AND the same number of state allowances as children (allowances for the employee and spouse are not counted in these rows). "vs 0" shows how much more take-home each paycheck has than the 0-children row, split into federal and state.

### #3 California paycheck calculator with dependents — slug: /california-paycheck-calculator-with-dependents
- Primary keyword: california paycheck calculator with dependents
- Core mechanic: DE 4 has two kinds of allowances, and dependents usually belong in the regular allowances line.
- Rules and numbers for 2026 (as used by the calculator):
  - Each regular withholding allowance on Form DE 4 reduces annual California withholding by $168.30 ($6.47 per biweekly paycheck).
  - California standard deduction used in withholding: $5,706 single, $11,412 married.
  - No California income tax is withheld when annual wages are at or below $18,896 (single) or $37,791 (married).
  - California SDI: 1.3% of all wages, no wage cap. Allowances do not change SDI.
  - Estimated deduction allowances (DE 4 line 1b) are not modeled by the calculator; describe them qualitatively only.
  - Agency: Employment Development Department (EDD) for DE 4 and SDI; Franchise Tax Board for the annual return.
- Engine-computed examples:
  - $75,000 married filing jointly:
    - 0 children: gross $2,884.62 → federal $178.46, Social Security $178.85, Medicare $41.83, California $53.79, SDI $37.50 → net $2,394.19/paycheck ($62,248.98/year)
    - 1 child: federal $93.85, California $47.32 → net $2,485.28 ($64,617.28/year); vs 0: federal +$84.62, state +$6.47
    - 2 children: federal $9.23, California $40.84 → net $2,576.37 ($66,985.58/year); vs 0: federal +$169.23, state +$12.95
    - 3 children: federal $0.00, California $34.37 → net $2,592.07 ($67,393.88/year); vs 0: federal +$178.46, state +$19.42
    - 4 children: federal $0.00, California $27.90 → net $2,598.55 ($67,562.18/year); vs 0: federal +$178.46, state +$25.89
  - $55,000 single:
    - 0 children: gross $2,115.38 → federal $170.00, Social Security $131.15, Medicare $30.67, California $63.15, SDI $27.50 → net $1,692.91/paycheck ($44,015.72/year)
    - 1 child: federal $85.38, California $56.67 → net $1,784.00 ($46,384.02/year); vs 0: federal +$84.62, state +$6.47
    - 2 children: federal $0.77, California $50.20 → net $1,875.09 ($48,752.32/year); vs 0: federal +$169.23, state +$12.95
    - 4 children: federal $0.00, California $37.25 → net $1,888.80 ($49,108.92/year); vs 0: federal +$170.00, state +$25.89
  - Observation the page can use: the federal credit stops adding take-home once federal withholding reaches $0.00 (the third child at $75,000 married), while each California allowance keeps adding exactly $6.47.
- Calculator method label: "CA Method B + 1.3% SDI"

### #4 New York paycheck calculator with dependents — slug: /new-york-paycheck-calculator-with-dependents
- Primary keyword: new york paycheck calculator with dependents
- Core mechanic: each IT-2104 allowance lowers taxable wages by a fixed amount, and NYC/Yonkers withholding moves with it.
- Rules and numbers for 2026 (as used by the calculator):
  - Each IT-2104 allowance reduces annual wages subject to New York withholding by $1,000.
  - New York withholding deduction before allowances: $7,400 single, $7,950 married.
  - NYC residents: the city table uses the same allowance count; the city deduction is $5,000 single / $5,500 married plus $1,000 per allowance.
  - New York Paid Family Leave: 0.432% of wages, capped at $411.91 for 2026. Allowances do not change PFL.
  - Agency: New York State Department of Taxation and Finance.
- Engine-computed examples:
  - $75,000 married filing jointly, outside NYC:
    - 0 children: gross $2,884.62 → federal $178.46, Social Security $178.85, Medicare $41.83, New York $132.93, PFL $12.46 → net $2,340.09/paycheck ($60,842.40/year)
    - 1 child: federal $93.85, New York $130.85 → net $2,426.78 ($63,096.40/year); vs 0: federal +$84.62, state +$2.08
    - 2 children: federal $9.23, New York $128.77 → net $2,513.48 ($65,350.40/year); vs 0: federal +$169.23, state +$4.15
    - 4 children: federal $0.00, New York $124.62 → net $2,526.86 ($65,698.40/year); vs 0: federal +$178.46, state +$8.31
  - $75,000 married filing jointly, NYC resident (New York State + NYC combined):
    - 0 children: federal $178.46, state + city $234.46, PFL $12.46 → net $2,238.56/paycheck ($58,202.65/year)
    - 1 child: federal $93.85, state + city $230.74 → net $2,326.89 ($60,499.15/year); vs 0: federal +$84.62, state + city +$3.71
    - 2 children: federal $9.23, state + city $227.03 → net $2,415.22 ($62,795.65/year); vs 0: federal +$169.23, state + city +$7.42
    - 4 children: federal $0.00, state + city $219.61 → net $2,431.87 ($63,228.65/year); vs 0: federal +$178.46, state + city +$14.85
  - Observation the page can use: in New York an allowance is a deduction, not a credit, so at $75,000 married one allowance adds only $2.08 per paycheck outside NYC and $3.71 inside NYC. Almost all of the paycheck gain from children comes from the federal W-4.
- Calculator method labels: "NYS-50-T-NYS + 2026 maximum PFL contribution"; NYC: "NYS-50-T-NYS + NYC resident table + 2026 maximum PFL"

### #5 Illinois paycheck calculator with dependents — slug: /illinois-paycheck-calculator-with-dependents
- Primary keyword: illinois paycheck calculator with dependents
- Core mechanic: Illinois is flat, so every allowance is worth exactly the same dollar amount per year and per paycheck.
- Rules and numbers for 2026 (as used by the calculator):
  - Flat rate 4.95%.
  - Each IL-W-4 allowance reduces annual wages subject to withholding by $2,925, which is worth $144.79 a year, or $5.57 per biweekly paycheck, at any income.
  - The calculator applies $2,925 to every allowance entered. IL-W-4 line 2 (additional allowances) has a different official value; describe line 1 vs line 2 qualitatively and do not state a line 2 dollar figure.
  - No state payroll premiums on Illinois paychecks.
  - Agency: Illinois Department of Revenue.
- Engine-computed examples:
  - $75,000 married filing jointly:
    - 0 children: gross $2,884.62 → federal $178.46, Social Security $178.85, Medicare $41.83, Illinois $142.79 → net $2,342.69/paycheck ($60,910.00/year)
    - 1 child: federal $93.85, Illinois $137.22 → net $2,432.88 ($63,254.79/year); vs 0: federal +$84.62, state +$5.57
    - 2 children: federal $9.23, Illinois $131.65 → net $2,523.06 ($65,599.58/year); vs 0: federal +$169.23, state +$11.14
    - 3 children: federal $0.00, Illinois $126.08 → net $2,537.86 ($65,984.36/year); vs 0: federal +$178.46, state +$16.71
    - 4 children: federal $0.00, Illinois $120.51 → net $2,543.43 ($66,129.15/year); vs 0: federal +$178.46, state +$22.27
  - $50,000 single:
    - 0 children: gross $1,923.08 → federal $146.92, Social Security $119.23, Medicare $27.88, Illinois $95.19 → net $1,533.85/paycheck ($39,880.00/year)
    - 1 child: federal $62.31, Illinois $89.62 → net $1,624.03 ($42,224.79/year); vs 0: federal +$84.62, state +$5.57
    - 2 children: federal $0.00, Illinois $84.05 → net $1,691.91 ($43,989.58/year); vs 0: federal +$146.92, state +$11.14
  - Observation the page can use: the state gain per allowance is identical ($5.57) at $50,000 single and $75,000 married. That is the flat tax at work.
- Calculator method label: "4.95% after IL-W-4 allowances"

### #6 Georgia paycheck calculator with dependents — slug: /georgia-paycheck-calculator-with-dependents
- Primary keyword: georgia paycheck calculator with dependents
- Core mechanic: G-4 dependent allowances plus the marital-status code.
- Rules and numbers for 2026 (as used by the calculator):
  - Each G-4 dependent allowance reduces annual wages subject to withholding by $5,000 (raised from $4,000).
  - Standard deduction used in withholding: $15,000 for single and for married with both spouses working (G-4 status B); $30,000 for married filing jointly with one spouse working (G-4 status C).
  - Rate: 5.19% for pay dates through May 10, 2026; 4.99% for pay dates on or after May 11, 2026. (The change date needs verification; describe it as "a mid-2026 rate cut" if unsure.)
  - No state payroll premiums on Georgia paychecks.
  - Agency: Georgia Department of Revenue.
- Engine-computed examples:
  - $75,000 married filing jointly, both spouses work (status B), pay date on or after May 11, 2026:
    - 0 children: gross $2,884.62 → federal $178.46, Social Security $178.85, Medicare $41.83, Georgia $115.15 → net $2,370.33/paycheck ($61,628.50/year)
    - 1 child: federal $93.85, Georgia $105.56 → net $2,464.54 ($64,078.00/year); vs 0: federal +$84.62, state +$9.60
    - 2 children: federal $9.23, Georgia $95.96 → net $2,558.75 ($66,527.50/year); vs 0: federal +$169.23, state +$19.19
    - 4 children: federal $0.00, Georgia $76.77 → net $2,587.17 ($67,266.50/year); vs 0: federal +$178.46, state +$38.38
  - Same salary, one spouse working (status C), on or after May 11, 2026:
    - 0 children: Georgia $86.37 → net $2,399.12/paycheck ($62,377.00/year)
    - 2 children: Georgia $67.17 → net $2,587.54 ($67,276.00/year); vs 0: state +$19.19
    - 4 children: Georgia $47.98 → net $2,615.96 ($68,015.00/year); vs 0: state +$38.38
  - Same salary, status B, pay date before May 11, 2026:
    - 0 children: Georgia $119.77 → net $2,365.71/paycheck
    - 2 children: Georgia $99.81 → net $2,554.90; vs 0: state +$19.96
  - Observation the page can use: in Georgia one dependent allowance ($9.60) moves the state line more than in any other state in this batch, and switching from status B to status C at 0 children ($115.15 → $86.37, a $28.78 drop) moves it about as much as three dependents do ($28.79).
- Calculator method labels: "Georgia withholding rate effective May 11, 2026"; before that date: "Georgia withholding rate effective through May 10, 2026"
