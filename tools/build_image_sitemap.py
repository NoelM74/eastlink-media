"""Write sitemap-images.xml: every content image on each page in sitemap.xml.

Picks up <img src> and <video poster> on each page. Skips the WeChat QR code,
which is no use in image search. Re-run after adding or removing images:
python3 tools/build_image_sitemap.py
"""
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = 'https://eastlinkmedia.com'
SKIP = {'/images/wechat-andrelee8.png'}


def page_file(url):
    path = url[len(SITE):].strip('/')
    return ROOT / (path + '/index.html' if path in ('', 'zh') else path + '.html').lstrip('/')


def main():
    urls = re.findall(r'<loc>([^<]+)</loc>', (ROOT / 'sitemap.xml').read_text(encoding='utf-8'))
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
           '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">', '']
    total = 0
    for url in urls:
        html = page_file(url).read_text(encoding='utf-8')
        imgs = []
        for src in re.findall(r'<(?:img[^>]*?\ssrc|video[^>]*?\sposter)="(/images/[^"]+)"', html):
            if src not in SKIP and src not in imgs:
                imgs.append(src)
        if not imgs:
            continue
        out.append('  <url>')
        out.append(f'    <loc>{url}</loc>')
        out += [f'    <image:image><image:loc>{SITE}{src}</image:loc></image:image>' for src in imgs]
        out += ['  </url>', '']
        total += len(imgs)
    out.append('</urlset>')
    (ROOT / 'sitemap-images.xml').write_text('\n'.join(out) + '\n', encoding='utf-8')
    print(f'{total} images on {sum(1 for l in out if l == "  <url>")} pages')


if __name__ == '__main__':
    main()
