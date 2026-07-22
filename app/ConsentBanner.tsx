"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "paycheck-atlas-analytics-consent";

function enableAnalytics() {
  if (document.querySelector('script[data-paycheck-atlas-analytics]')) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-LT34HE1KHJ";
  script.dataset.paycheckAtlasAnalytics = "true";
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) { window.dataLayer?.push(args); };
  window.gtag("js", new Date());
  window.gtag("config", "G-LT34HE1KHJ", { anonymize_ip: true });
}

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function ConsentBanner() {
  const [choice, setChoice] = useState<"accepted" | "rejected" | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = localStorage.getItem(CONSENT_KEY) as "accepted" | "rejected" | null;
      setChoice(saved);
      if (saved === "accepted") enableAnalytics();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function save(next: "accepted" | "rejected") {
    localStorage.setItem(CONSENT_KEY, next);
    setChoice(next);
    if (next === "accepted") enableAnalytics();
  }

  if (choice !== null) return null;
  return <aside className="consent-banner" aria-label="Cookie choices">
    <div><b>Your privacy choices</b><p>We use optional analytics cookies to understand site usage. The calculators work without them. Learn more in our <a href="/privacy">Privacy Policy</a>.</p></div>
    <div className="consent-actions"><button type="button" className="secondary" onClick={() => save("rejected")}>Reject optional cookies</button><button type="button" onClick={() => save("accepted")}>Accept analytics</button></div>
  </aside>;
}
