# Repairs unescaped inner double quotes in ChatGPT-produced batch JSON (e.g. uses "Hawaii Booklet A" method).
import json, sys, re
src = open(sys.argv[1], encoding="utf8").read()
out = []; i = 0; in_str = False; n = len(src)
while i < n:
    c = src[i]
    if not in_str:
        if c == '"': in_str = True
        out.append(c); i += 1; continue
    if c == '\\':
        out.append(src[i:i+2]); i += 2; continue
    if c == '"':
        j = i + 1
        while j < n and src[j] in ' \t\r\n': j += 1
        if j >= n or src[j] in ',:}]':
            in_str = False; out.append(c)
        else:
            out.append('\\"')
        i += 1; continue
    out.append(c); i += 1
fixed = "".join(out)
data = json.loads(fixed)
json.dump(data, open(sys.argv[1], "w", encoding="utf8"), ensure_ascii=False, indent=1)
print(f"ok: {len(data)} states, codes {[s['code'] for s in data]}")
