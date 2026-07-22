import type { Metadata } from "next";
export const metadata:Metadata={title:"External Resources | Paycheck Atlas",description:"External websites previously shared with Paycheck Atlas visitors.",alternates:{canonical:"/partners"},robots:{index:false,follow:false}};
const partners=[
  ["FishCare AI","https://www.fishcareai.com"],
  ["Disclaimer Snippets","https://www.disclaimersnippets.com"],
  ["AnySites App","https://www.anysitesapp.com"],
  ["Gravel Calculate","https://www.gravelcalculate.com"],
  ["Peptide Calculator UK","https://www.peptide-calculator.uk"],
  ["Cursive Text Generator","https://www.cursive-text-generator.net"],
  ["Recommendation Letters","https://www.recommendation-letters.com"],
  ["Online Kings Cup","https://www.onlinekingscup.com"],
  ["Chronological Age Calculator","https://www.chronologicalagercalculator.com"],
];
export default function Partners(){return <main><header className="site-header"><a className="brand" href="/"><span className="brand-mark">★</span><span>Paycheck <b>Atlas</b></span></a><nav><a href="/">Calculators</a><a href="/state-paycheck-calculators">All locations</a><a href="/about">About</a><a href="/contact">Contact</a></nav></header><section className="partners-page"><p className="kicker">EXTERNAL RESOURCES</p><h1>External Websites</h1><p>This archived list contains independent third-party websites. Inclusion is not a review, recommendation, sponsorship, or endorsement. Paycheck Atlas does not control their content or privacy practices. These links are excluded from search indexing and are not part of our calculator guidance.</p><div className="partners-grid">{partners.map(([name,url])=><a key={url} href={url} target="_blank" rel="nofollow noopener noreferrer"><span className="partner-icon">↗</span><b>{name}</b><small>{url.replace("https://","")}</small></a>)}</div></section><footer><a className="brand" href="/"><span className="brand-mark">★</span><span>Paycheck <b>Atlas</b></span></a><p>Independent educational paycheck estimates.</p><p className="disclaimer"><a href="/about">About</a> · <a href="/contact">Contact</a> · <a href="/disclaimer">Disclaimer</a> · <a href="/privacy">Privacy Policy</a></p></footer></main>}
