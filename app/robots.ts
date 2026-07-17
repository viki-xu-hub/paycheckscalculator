import type { MetadataRoute } from "next";
export default function robots():MetadataRoute.Robots{return{rules:{userAgent:"*",allow:"/",disallow:["/disclaimer","/privacy"]},sitemap:"https://paycheckscalculator.org/sitemap.xml",host:"https://paycheckscalculator.org"}}
