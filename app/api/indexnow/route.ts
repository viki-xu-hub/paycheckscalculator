import { INDEXABLE_URLS, SITE_ORIGIN } from "../../lib/indexableRoutes";

export const dynamic = "force-dynamic";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const INDEXNOW_KEY = "8ac7d3d579de286b04538bfe3bdc7a3b55d3aad6777b2fb4";

function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return true;
  }

  return request.headers.get("authorization") === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(SITE_ORIGIN).host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`,
        urlList: INDEXABLE_URLS,
      }),
      cache: "no-store",
    });

    const details = await response.text();

    return Response.json(
      {
        submitted: response.ok,
        indexNowStatus: response.status,
        urlCount: INDEXABLE_URLS.length,
        urls: INDEXABLE_URLS,
        ...(details ? { details } : {}),
      },
      {
        status: response.ok ? 200 : 502,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    return Response.json(
      {
        submitted: false,
        error: error instanceof Error ? error.message : "IndexNow request failed",
      },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
