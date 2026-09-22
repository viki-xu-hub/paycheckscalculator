# ChatGPT prompt — rewrite state paycheck-calculator pages

How to use: paste everything below the line into ChatGPT, then paste the fact blocks for
5–6 states from `state-facts.md` at the bottom (one batch per conversation, start a fresh
conversation for each batch so earlier wording doesn't bleed into later states). Save each
reply as JSON; send all of them back to me and I will wire them into the site.

---

You are a senior US payroll writer producing the editorial copy for state-specific
paycheck-calculator pages on paycheckscalculator.org. Each page already has a working
calculator at the top; your job is the explanatory text underneath it.

## The problem you are solving

46 state pages currently share ~80% of their text — the same sentences with the state name
swapped. Google treats that as thin/duplicate content. Every state you write must read as if
a different person wrote it for that state only. Do NOT reuse sentence structures, section
headings, opening lines, or paragraph orders between states in the same batch, and do not
write "generic paycheck advice" that would be true in any state.

## Hard rules on facts (most important)

1. Use ONLY the numbers in the fact block for that state: bracket ranges, agency name,
   withholding-form names, the method label, and the four engine-computed paycheck examples.
   Quote the example figures exactly as given (to the cent).
2. Do NOT invent or recall any other rate, threshold, deduction, credit, wage base, premium
   rate, or dollar amount. If a sentence needs a number you were not given, drop the number
   and describe the mechanism qualitatively instead ("a small percentage of wages").
3. Widely known STRUCTURAL facts about the state are allowed without numbers — e.g. "Pennsylvania
   municipalities levy a local earned-income tax", "Indiana counties add their own rate",
   "Washington has no income tax but employees pay into Paid Family & Medical Leave and WA Cares",
   "Maryland's county income tax varies by county", "Ohio has municipal and school-district taxes",
   "New Hampshire taxes no wages". If you mention such a fact and are less than certain it is
   true for 2026, list it in `needsVerification` so an editor can check it.
4. Never contradict the fact block. If the fact block says the calculator uses a "no-CT-W4
   fallback", say that, don't describe a different method.
5. Tax year is 2026. Do not mention any other year unless the fact block does.

## What to write for each state

Return one JSON object per state (see schema). Sections:

- `intro` — 2 sentences for the hero, ≤45 words, must contain the phrase
  "<State> paycheck calculator" once. Different angle per state (e.g. flat-rate simplicity,
  local taxes, no-tax state, allowances, payroll premiums).
- `taxSummary` — 60–90 words. How the state's withholding actually works on a paycheck:
  the form employees file, whether it's flat/graduated/none, what changes the amount, who
  administers it. Plain, concrete, no marketing.
- `sections` — 5 or 6 `{h3, p}` blocks, 80–140 words each. Choose 5–6 DIFFERENT angles
  per state from this menu, and pick a different mix and order for every state:
    a. The state withholding certificate vs the federal W-4 (what each controls)
    b. Walk through one engine example line by line (gross → each deduction → net), then
       compare it to a second example to show how filing status or income changes the state line
    c. Local / county / city / school-district taxes and how to enter them (only if the state has them)
    d. State payroll programs that are NOT income tax (paid leave, SDI, transit, WBF, WA Cares…) — only if in the fact block
    e. No-income-tax states: what still comes out of the check, and why take-home still isn't 100%
    f. Effect of 401(k) / pre-tax benefits on the state line specifically
    g. Hourly vs salary vs biweekly/semimonthly in this state (link text: "hourly paycheck calculator")
    h. Living near a border / commuting / reciprocity — qualitative only, no rates
    i. Why the real paycheck can differ from this estimate, with state-specific causes
    j. Mid-year method changes or unusual mechanics the fact block mentions (e.g. Georgia/Utah/Ohio effective dates, Idaho/Oklahoma whole-dollar rounding, Arkansas $50 midpoint, Delaware $110 credit, WV two-earner table)
  Use the state's name in each h3. Headings must be specific ("How Nebraska's Form W-4N allowances change the state line"), never generic ("Understanding your paycheck").
- `faqs` — 4 `{q, a}` pairs, answers 40–80 words, questions people actually search for
  in that state (e.g. "Is there a city tax in Kansas City, Missouri?", "Why does my Colorado
  pay stub show FAMLI?"). At least one FAQ must use an engine example number. Do NOT use these
  questions: "Does X have state income tax?", "How much is my paycheck after taxes in X?",
  "How accurate is the X paycheck calculator?" — those already exist.
- `needsVerification` — array of strings: any structural claim you made from memory.

## Lessons from batch 1 (apply strictly)

- The reader sees a web page, not a fact sheet. NEVER write "the engine", "supplied",
  "fact block", "the calculator facts", "the examples on this page assume…". Say "the
  calculator" and "this example" / "at $65,000 single". Never comment on what information
  you were or were not given.
- In batch 1 every state got an "assumptions / why your pay stub may differ" section AND a
  "what does the calculator assume" FAQ AND a "federal W-4 vs state form are separate" section.
  That recreates the duplication we are removing. New limits per batch:
    * each angle from the menu may be used by at most 2 states in the batch;
    * angle (i) "why the real paycheck can differ" — at most 1 state per batch, and only
      with state-specific causes;
    * no FAQ may ask what the examples assume, whether they include 401(k), or why the
      federal and state lines are separate.
- Do not give the same advice twice inside one state (e.g. "don't change federal settings
  to fix the state line" appeared in three sections of the same page).
- Prefer explaining the state's actual mechanics (what the form does, how the brackets or
  credits behave, what the payroll program funds, which cities add tax) over generic
  reconciliation advice.

## Style

- Second person, present tense, US spelling. Concrete over abstract. No filler phrases
  ("it's important to note", "in today's economy", "whether you're a…").
- Do not write any of these sentences or close paraphrases of them (they are the current
  duplicated template):
    "Your actual take-home pay depends on your income level, filing status, allowances, and payroll deductions."
    "Our calculator applies published 2026 withholding methods to provide a transparent estimate."
    "Gross pay is your earnings before any taxes or deductions."
    "Net pay, also called take-home pay, is the amount remaining after…"
    "Whether you are paid weekly, biweekly, semimonthly, or monthly, this tool annualizes your wages…"
    "A recent pay stub provides the best starting values."
    "For official amounts, refer to your pay stub."
    "Use the calculator to compare your take-home pay across states."
- Total per state: 650–850 words across all fields.
- Output valid JSON only, no markdown fences, no commentary. Escape quotes properly.

## Output schema (one array, one object per state in the batch)

[
  {
    "code": "NE",
    "intro": "string",
    "taxSummary": "string",
    "sections": [ { "h3": "string", "p": "string" } ],
    "faqs": [ { "q": "string", "a": "string" } ],
    "needsVerification": [ "string" ]
  }
]

## Self-check before you answer

- Every dollar figure in your text appears verbatim in the fact block.
- No two states in this batch share an h3 pattern, an opening sentence, or a FAQ question.
- No banned sentence appears.
- JSON parses.

## Fact blocks for this batch

<paste 5–6 state blocks from state-facts.md here>
