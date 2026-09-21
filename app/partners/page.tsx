import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
export const metadata:Metadata={title:"Partners | Paycheck Atlas",description:"Browse independent websites listed as Paycheck Atlas partners and external resources.",alternates:{canonical:"/partners"},robots:{index:false,follow:true}};
const partners:[string,string,boolean?][]=[
  ["FishCare AI","https://www.fishcareai.com"],
  ["AnySites","https://www.anysites.app"],
  ["Disclaimer Snippets","https://www.disclaimersnippets.com"],
  ["Online Kings Cup","https://www.onlinekingscup.com"],
  ["Paycheck Calculator","https://www.paycheckscalculator.org"],
  ["Gravel Calculate","https://www.gravelcalculate.com"],
  ["Peptide Calculator UK","https://www.peptide-calculator.uk"],
  ["Chronological Age Calculator","https://www.chronologicalagercalculator.com"],
  ["Recommendation Letters","https://www.recommendation-letters.com"],
  ["Cursive Text Generator","https://www.cursive-text-generator.net"],
  ["Hood-Chain","https://www.hood-chain.com"],
  ["Bank Statement to PDF","https://bankstatement2pdf.com/",true],
];
export default function Partners(){return <main><SiteHeader/><section className="partners-page"><p className="kicker">PARTNERS &amp; EXTERNAL RESOURCES</p><h1>Partners</h1><p>Explore these independent websites and online tools. Inclusion does not imply ownership, sponsorship, endorsement, or responsibility for third-party content and privacy practices.</p><div className="partners-grid">{partners.map(([name,url,dofollow])=><a key={url} href={url} target="_blank" rel={dofollow?"noopener noreferrer":"nofollow noopener noreferrer"}><span className="partner-icon">↗</span><b>{name}</b><small>{url.replace("https://","").replace(/\/$/,"")}</small></a>)}</div></section><SiteFooter/></main>}
