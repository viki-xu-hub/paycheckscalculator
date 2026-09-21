#!/usr/bin/env bash
# Submit the 14 new state pages + 10 newly indexable state pages to IndexNow (Bing/Yandex/etc.).
# Run AFTER the deploy is live, otherwise the crawler gets a 404.
set -euo pipefail
KEY=8ac7d3d579de286b04538bfe3bdc7a3b55d3aad6777b2fb4
HOST=www.paycheckscalculator.org
URLS=$(sed 's/^/"/; s/$/",/' new-state-urls.txt | tr -d '\n' | sed 's/,$//')
curl -sS -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "{\"host\":\"$HOST\",\"key\":\"$KEY\",\"keyLocation\":\"https://$HOST/$KEY.txt\",\"urlList\":[$URLS]}" \
  -w "\nHTTP %{http_code}\n"
