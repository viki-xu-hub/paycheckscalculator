import type { Metadata } from "next";
export const metadata:Metadata={title:"Partners | Paycheck Atlas",description:"Explore independent partner websites and useful online tools listed by Paycheck Atlas.",alternates:{canonical:"/partners"}};
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
export default function Partners(){return <main><header className="site-header"><a className="brand" href="/"><span className="brand-mark">★</span><span>Paycheck <b>Atlas</b></span></a><nav><a href="/">Calculators</a><a href="/state-paycheck-calculators">All locations</a></nav></header><section className="partners-page"><p className="kicker">USEFUL WEBSITES</p><h1>Our Partners</h1><p>Explore independent websites and online tools from our partner network.</p><div className="partners-grid">{partners.map(([name,url])=><a key={url} href={url} target="_blank" rel="noopener noreferrer"><span className="partner-icon">↗</span><b>{name}</b><small>{url.replace("https://","")}</small></a>)}</div></section><footer><a className="brand" href="/"><span className="brand-mark">★</span><span>Paycheck <b>Atlas</b></span></a><p>Free paycheck estimates, built for clarity.</p><p className="disclaimer"><a href="/disclaimer">Disclaimer</a> · <a href="/privacy">Privacy Policy</a> · <a href="/partners">Partners</a></p></footer></main>}
