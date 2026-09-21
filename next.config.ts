import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Thin, orphaned supplemental-pay page superseded by the full bonus page.
      {
        source: "/texas-bonus-commission-paycheck-calculator",
        destination: "/texas-paycheck-calculator-with-bonus",
        // vinext prod emits `permanent ? 308 : 307` and ignores `statusCode`;
        // 308 is treated the same as 301 for consolidation.
        permanent: true,
      },
      // /hourly hub merged into the main hourly calculator, which now lists every rate page.
      {
        source: "/hourly",
        destination: "/hourly-paycheck-calculator",
        permanent: true,
      },
      // Thin Texas hourly page consolidated into the main hourly calculator.
      {
        source: "/texas-hourly-paycheck-calculator",
        destination: "/hourly-paycheck-calculator",
        // vinext prod emits `permanent ? 308 : 307` and ignores `statusCode`;
        // 308 is treated the same as 301 for consolidation.
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
