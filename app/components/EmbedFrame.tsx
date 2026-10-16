"use client";

import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";

const SITE_ORIGIN = "https://www.paycheckscalculator.org";
const BRAND_ANCHOR = "Paycheck Calculator by Paycheck Atlas";

/**
 * Embed support for every calculator. On normal pages it adds an "Embed" button above the
 * calculator's top-right corner that opens the copy-paste code. When the page is loaded with
 * `?embed=1` (layout.tsx adds `html.embed-mode`), CSS hides everything except the calculator,
 * this wrapper shows a credit link and reports its height so the host page can size the iframe.
 * The credit link in the snippet sits outside the iframe so it is a real link on the host page;
 * its anchor stays a brand phrase rather than an exact-match keyword.
 */
export function withEmbed<P extends object>(Calculator: ComponentType<P>) {
  function Embeddable(props: P) {
    return <EmbedFrame><Calculator {...props} /></EmbedFrame>;
  }
  Embeddable.displayName = `withEmbed(${Calculator.displayName ?? Calculator.name})`;
  return Embeddable;
}

export default function EmbedFrame({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [embedded, setEmbedded] = useState(false);
  const [pageUrl, setPageUrl] = useState(SITE_ORIGIN);
  const [dialog, setDialog] = useState<{ title: string; height: number } | null>(null);

  useEffect(() => {
    const on = document.documentElement.classList.contains("embed-mode");
    const timer = window.setTimeout(() => {
      setEmbedded(on);
      setPageUrl(`${SITE_ORIGIN}${window.location.pathname}`);
    }, 0);
    if (!on || window.parent === window) return () => window.clearTimeout(timer);
    const report = () => window.parent.postMessage({ paycheckAtlasHeight: Math.ceil(document.body.getBoundingClientRect().height) }, "*");
    const observer = new ResizeObserver(report);
    observer.observe(document.body);
    return () => { window.clearTimeout(timer); observer.disconnect(); };
  }, []);

  function openDialog() {
    const title = document.title.split(/ [|–—-] /)[0].trim() || "Paycheck Calculator";
    const measured = root.current?.offsetHeight ?? 700;
    setDialog({ title, height: Math.max(520, Math.round(measured * 1.25) + 60) });
  }

  return <div className="embed-root" data-embed-root ref={root}>
    {!embedded && <div className="embed-bar"><button type="button" className="embed-trigger" onClick={openDialog} aria-haspopup="dialog"><span aria-hidden="true">&lt;/&gt;</span> Embed</button></div>}
    {children}
    {embedded && <p className="embed-credit"><a href={pageUrl} target="_blank" rel="noopener">{BRAND_ANCHOR}</a><span>Free 2026 estimates</span></p>}
    {dialog && <EmbedDialog pageUrl={pageUrl} title={dialog.title} height={dialog.height} onClose={() => setDialog(null)} />}
  </div>;
}

function EmbedDialog({ pageUrl, title, height, onClose }: { pageUrl: string; title: string; height: number; onClose: () => void }) {
  const [autoResize, setAutoResize] = useState(true);
  const [copied, setCopied] = useState(false);
  const box = useRef<HTMLTextAreaElement>(null);
  const safeTitle = title.replace(/"/g, "&quot;");
  const resizeScript = `<script>addEventListener("message",function(e){if(e.origin!=="${SITE_ORIGIN}"||!e.data||!e.data.paycheckAtlasHeight)return;document.querySelectorAll('iframe[src^="${SITE_ORIGIN}/"]').forEach(function(f){if(f.contentWindow===e.source)f.style.height=e.data.paycheckAtlasHeight+"px"})})</script>`;
  const code = [
    `<iframe src="${pageUrl}?embed=1" title="${safeTitle}" width="100%" height="${height}" style="border:0;max-width:100%;" loading="lazy"></iframe>`,
    `<p style="font-size:13px;margin:6px 0 0;"><a href="${pageUrl}">${BRAND_ANCHOR}</a></p>`,
    ...(autoResize ? [resizeScript] : []),
  ].join("\n");

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function copy() {
    let ok = false;
    try {
      await navigator.clipboard.writeText(code);
      ok = true;
    } catch {
      // Clipboard API can be blocked (permissions, insecure origin); fall back to the selection.
      box.current?.select();
      ok = document.execCommand("copy");
    }
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return <div className="embed-overlay" onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="embed-dialog" role="dialog" aria-modal="true" aria-labelledby="embed-dialog-title">
      <button type="button" className="embed-close" onClick={onClose} aria-label="Close">×</button>
      <p className="kicker">FREE FOR YOUR SITE</p>
      <h2 id="embed-dialog-title">Embed this {title}</h2>
      <p>Writing about pay, taxes, or a minimum wage increase? Paste this code into any HTML block of your article, HR page, or news story. Please keep the credit line below the frame.</p>
      <textarea ref={box} readOnly value={code} rows={6} aria-label="Embed code" onFocus={event => event.currentTarget.select()} />
      <label className="embed-option"><input type="checkbox" checked={autoResize} onChange={event => setAutoResize(event.target.checked)} /> Auto-fit the frame height (adds a small script; leave off if your editor strips scripts)</label>
      <div className="embed-actions">
        <button type="button" className="embed-copy" onClick={copy}>{copied ? "Copied" : "Copy embed code"}</button>
        <a className="text-link" href={`${pageUrl}?embed=1`} target="_blank" rel="noopener nofollow">Preview the widget</a>
      </div>
    </div>
  </div>;
}
