# GSC 复盘与优化方案（2026-10）

数据来源：Google Search Console 导出，过去 3 个月（2026-07-24 至 2026-10-25），网页搜索。

## 结论

应该拓展场景页，但先小批量验证，再铺开。在那之前，先修 hourly 页的点击率，这是成本最低的增量。

## 1. 数据概况

- 合计 60 次点击、48,226 次曝光。
- 每周曝光从 223 涨到 7,964，平均排名从第 48.6 名升到第 17.6 名。站点在上升期，但点击很少。

| 页面类型 | 页面数 | 点击 | 曝光 | 平均排名 |
|---|---|---|---|---|
| 核心页（各州 / 首页 / hourly 主页） | 95 | 17 | 19,311 | 51.0 |
| `hourly/$X` 程序化页 | 52 | 18 | 15,868 | 10.7 |
| `sales-tax` | 16 | 4 | 5,300 | 20.6 |
| `salary/$X` | 42 | 5 | 4,164 | 22.7 |
| `biweekly/州` | 52 | 12 | 3,116 | 22.0 |
| Texas 场景页（`with-xxx`） | 3 | 4 | 467 | 9.0 |

场景页明细：

| 页面 | 点击 | 曝光 | 点击率 | 排名 |
|---|---|---|---|---|
| `/texas-paycheck-calculator-with-dependents` | 3 | 264 | 1.14% | 8.2 |
| `/texas-paycheck-calculator-with-child-support` | 1 | 171 | 0.58% | 7.3 |
| `/texas-paycheck-calculator-with-bonus` | 0 | 32 | 0% | 24.8 |

对照组：`/texas-paycheck-calculator` 排第 50.8 名（504 次曝光，0 点击），`/california-paycheck-calculator` 排第 50.1 名（1,627 次曝光，0 点击）。

## 2. 思路（按哥飞的方法论）

- **新站别去抢大词。** "texas paycheck calculator" 被 ADP、SmartAsset、PaycheckCity 占着。核心页卡在第 50 名，是权重不够，改内容解决不了，只能靠外链慢慢提。
- **长尾"需求词 = 一个页面"已经验证有效。** "州 + 具体场景"竞争小，3 个场景页里有 2 个排进了前 10。这就是该放大的信号。
- **先验证，再批量。** 先做 5–8 个页面，等 2–3 周看 GSC。进了前 20 的场景再复制到更多州，没起色的就停。

## 3. 第一优先级：修 hourly 页的点击率

- hourly 页平均排名约第 10，曝光 1.58 万，点击率只有 0.1%。正常的第 10 名应该有 1–2% 的点击率。
- 原因：标题和描述直接给了答案。例如 `/hourly/13-paycheck-calculator` 的描述是 "$13 an hour is how much a year? $27,040 at 40 hours a week…"，用户在搜索结果页就看到了答案，没必要点进来。
- 改法：标题和描述里的数字改成**税后、按州**的角度，例如 "$13 an Hour After Taxes: Take-Home by State (2026)"，税前年薪那个数不要放进描述。税后金额要选州才能算，用户就有理由点进来。
- "$63k a year is how much an hour" 这类查询有同样的问题：大量查询排在第 7–9 名但没有点击，对应的 salary 页要一起改。
- 预期：点击率到 1%，hourly 这一类就能从 18 次点击涨到约 150 次，不用新建页面。

## 4. 场景页拓展清单（按优先级）

依据都是 GSC 里已经出现的相关查询。

1. **1099 / 自雇 × 州**：例如 texas 1099、texas self-employed paycheck。"self employed tax calculator" 排第 23.4 名，已有曝光。已有 `/self-employment-tax-calculator`，可以接到各州。
2. **with dependents 复制到有州税的大州**：CA、NY、IL、PA、GA、NJ。这些州有自己的州税抵扣额（allowance），每个州的计算真的不一样，不会被判成薄内容。
3. **周薪 / 时薪 × 州**：已出现 "florida weekly paycheck calculator"、"weekly paycheck calculator illinois"、"hourly paycheck calculator georgia weekly"。`biweekly/州` 已经做了，weekly 可以复用同一套模板。
4. **城市页**：已经有人通过 "san jose take home pay calculator" 点进来，`/nyc-paycheck-calculator` 排第 19.6 名。先在 CA 做几个城市页试一下。
5. **暂缓**：`with-bonus` 只有 32 次曝光、排第 24.8 名，需求小，先别铺到各州。

**红线：** 每个页面必须有真正不同的计算或规则，比如州抵扣额、该州自雇怎么处理、有没有地方税。只换州名的模板页会撞上 Google 的"规模化内容滥用"政策，反而拖累全站。

### 第一批验证页面

- Texas 1099 / 自雇 2 个页面
- `california-paycheck-calculator-with-dependents`
- `florida-paycheck-calculator-with-dependents`
- `new-york-paycheck-calculator-with-dependents`

上线后 2–3 周看 GSC：进了前 20 的场景再复制到更多州。

## 5. 内链、外链和技术问题

- **内链**：每个州页都要链到它的场景页。Texas 主页面已经链到了 3 个场景页，新加的场景页也照这样做。
- **外链**：按 backlink plan，把首页和核心州页的权重做上去。不提权重，第 50 名那批页面动不了。
- **技术**：非 www 的旧网址已经 308 跳到 www，没问题。`/hourly-paycheck-calculator.html` 返回 404，要加一条跳转到 `/hourly-paycheck-calculator`。

## 执行顺序

1. 改 hourly 页（和对应 salary 页）的标题和描述。
2. 同时上线第一批验证用的场景页，补好内链。
3. 加 `.html` 的跳转。
4. 2–3 周后复盘 GSC，决定往哪个方向铺开。
