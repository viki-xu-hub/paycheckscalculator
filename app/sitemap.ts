import type { MetadataRoute } from "next"; import {locations} from "./lib/locations";
const base="https://paycheckscalculator.org";
export default function sitemap():MetadataRoute.Sitemap{return ["","/texas-bonus-commission-paycheck-calculator","/texas-hourly-paycheck-calculator","/state-paycheck-calculators","/partners",...locations.filter(x=>x.short!=="TX").map(x=>`/${x.slug}`)].map((url,i)=>({url:base+url,lastModified:new Date(),changeFrequency:i?"monthly":"weekly",priority:i?0.75:1}))}
