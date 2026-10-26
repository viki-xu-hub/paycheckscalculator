"use client";

/**
 * Prints only the blank worksheet (see `html.print-worksheet` in globals.css), so
 * "Save as PDF" in the browser's print dialog produces a one-page worksheet PDF.
 */
export default function PrintWorksheetButton() {
  function print() {
    const root = document.documentElement;
    root.classList.add("print-worksheet");
    const done = () => {
      root.classList.remove("print-worksheet");
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    window.print();
  }
  return (
    <button type="button" className="print-worksheet-button" onClick={print}>
      Print or save as PDF
    </button>
  );
}
