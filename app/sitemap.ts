import type { MetadataRoute } from "next"; import {locations} from "./lib/locations";
const base="https://texas-paycheck-calculator-2026.wxixuan118.chatgpt.site";
export default function sitemap():MetadataRoute.Sitemap{return ["","/texas-bonus-commission-paycheck-calculator","/texas-hourly-paycheck-calculator","/state-paycheck-calculators",...locations.map(x=>`/${x.slug}`)].map((url,i)=>({url:base+url,lastModified:new Date(),changeFrequency:i?"monthly":"weekly",priority:i?0.75:1}))}
