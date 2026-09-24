#!/bin/bash
# 用法: fetch-raw.sh <id> <url> —— 抓取原文转存 data/raw/<id>.txt
id="$1"; url="$2"
curl -sL --max-time 40 -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" "$url" -o /tmp/raw-$$.html
python3 - "$id" "/tmp/raw-$$.html" << 'PYEOF'
import re, html, sys
cid, path = sys.argv[1], sys.argv[2]
s = open(path, encoding='utf-8', errors='ignore').read()
s = re.sub(r'<script[\s\S]*?</script>|<style[\s\S]*?</style>|<nav[\s\S]*?</nav>|<header[\s\S]*?</header>|<footer[\s\S]*?</footer>', '', s)
text = html.unescape(re.sub(r'<[^>]+>', '\n', s))
lines = [l.strip() for l in text.split('\n') if l.strip()]
out = '\n'.join(lines)
open(f'data/raw/{cid}.txt', 'w').write(out)
print(cid, len(out), '字符')
PYEOF
rm -f /tmp/raw-$$.html
