"""调用 aitechflux 中转站的 gpt-image-2，批量生成年鉴插画。
用法: python3 scripts/illustrations/generate.py <prompt文件> <输出png路径>
key 从环境变量 AITECHFLUX_API_KEY 读取，不落盘。
"""
import base64, json, os, sys, urllib.request

BASE = 'https://aitechflux.com/v1/images/generations'
KEY = os.environ['AITECHFLUX_API_KEY']

def main(prompt_file, out):
    prompt = open(prompt_file).read().strip()
    body = json.dumps({
        'model': 'gpt-image-2',
        'prompt': prompt,
        'size': '1536x1024',
        'quality': 'medium',
        'n': 1,
    }).encode()
    req = urllib.request.Request(BASE, data=body, headers={
        'Authorization': f'Bearer {KEY}',
        'Content-Type': 'application/json',
    })
    with urllib.request.urlopen(req, timeout=420) as r:
        data = json.loads(r.read())
    item = data['data'][0]
    if item.get('b64_json'):
        img = base64.b64decode(item['b64_json'])
    else:
        with urllib.request.urlopen(item['url'], timeout=120) as ir:
            img = ir.read()
    with open(out, 'wb') as f:
        f.write(img)
    print(f'saved {out} ({len(img)//1024} KB)')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
