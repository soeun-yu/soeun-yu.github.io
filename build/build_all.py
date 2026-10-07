# ../content/portfolio.json 의 원고를 build/templates/ 골격에 넣어 사이트 HTML을 만든다.
#
#   python build/build_all.py          # index.html, projects/*.html 생성
#   python build/build_all.py --pptx   # PPT(deck-src)까지 다시 생성
#
# 필요한 패키지: pip install lxml cssselect
import json
import subprocess
import sys
from pathlib import Path

from lxml import html as LH

ROOT = Path(__file__).resolve().parent.parent          # soeun-yu.github.io
DATA = ROOT / 'content' / 'portfolio.json'             # 원고
TPL = ROOT / 'build' / 'templates'                     # 골격 HTML
PAGES = ['workflow', 'curatio', 'artclassifier', 'gaming-ml', 'furniture',
         'ppap', 'nextto', 'hollys', 'ohouse']

warn = []


def note(msg):
    warn.append(msg)


def sel1(el, css):
    r = el.cssselect(css)
    return r[0] if r else None


def set_text(el, value, where):
    """요소의 글자만 바꾼다. 안에 <span>·<svg>가 있어도 구조는 그대로 둔다."""
    if value is None or el is None:
        return
    kids = [c for c in el if isinstance(c.tag, str)]
    if not kids:
        el.text = value
        return
    if all(c.tag == 'br' for c in kids):                      # <br>로 나뉜 여러 줄
        parts = value.split('\n')
        want = len(kids) + 1
        if len(parts) != want:
            note(f'{where}: 줄 수가 골격과 다릅니다 ({len(parts)} ≠ {want}) — 골격도 함께 고치세요')
            parts = (parts + [''] * want)[:want]
        el.text = parts[0]
        for c, p in zip(kids, parts[1:]):
            c.tail = p
        return
    tail_txt = kids[-1].text_content()
    if tail_txt and value.endswith(tail_txt):                 # 예: <h1>유소은 <span>Portfolio</span></h1>
        prefix = value[:len(value) - len(tail_txt)]
        if len(kids) == 1:
            el.text = prefix
        else:
            kids[-2].tail = prefix
        return
    if not (el.text or '').strip():                           # 예: <div><svg/> 글자</div>
        kids[-1].tail = ' ' + value
        return
    note(f'{where}: 구조가 복잡해 건너뜁니다')


def put(el, css, value, where):
    if value is None:
        return
    t = sel1(el, css)
    if t is None:
        note(f'{where}: 골격에 {css} 가 없습니다')
        return
    set_text(t, value, where)


def put_list(parent, css, values, where, field=None):
    els = parent.cssselect(css)
    if len(els) != len(values):
        note(f'{where}: 개수가 다릅니다 (원고 {len(values)} ≠ 골격 {len(els)}) — 항목을 더하거나 빼려면 골격도 고치세요')
    for el, v in zip(els, values):
        set_text(el, v if field is None else v[field], where)


def put_links(parent, css, items, where):
    els = parent.cssselect(css)
    if len(els) != len(items):
        note(f'{where}: 링크 개수가 다릅니다 (원고 {len(items)} ≠ 골격 {len(els)})')
    for a, lk in zip(els, items):
        set_text(a, lk['label'], where)
        if lk.get('url'):
            a.set('href', lk['url'])


def sec_head(doc, css, d, where):
    sec = sel1(doc, css)
    put(sec, '.sec-tag', d.get('tag'), where)
    put(sec, 'h2', d.get('title'), where)
    put(sec, '.sec-head p', d.get('desc'), where)
    return sec


def cases_into(scope, cases, where):
    cards = scope.cssselect('.ts-card')
    if len(cards) != len(cases):
        note(f'{where}: 사례 수가 다릅니다 (원고 {len(cases)} ≠ 골격 {len(cards)})')
    for card, c in zip(cards, cases):
        put(card, '.pj', c.get('project'), where)
        put(card, '.ts-head h3', c['title'], where)
        put(card, '.ts-row.p p', c['problem'], where)
        put(card, '.ts-row.a p', c['analysis'], where)
        put(card, '.ts-row.c p', c['action'], where)
        put(card, '.ts-row.s p', c['result'], where)
        put_list(card, '.ts-tags span', c['tags'], where)


def build_index(d):
    doc = LH.fromstring((TPL / 'index.html').read_text(encoding='utf-8'))
    site, home = d['site'], d['home']
    put(doc, 'title', site['title'], 'site.title')
    for css, val in [('meta[name="description"]', site['description']),
                     ('meta[property="og:description"]', site['description']),
                     ('meta[name="twitter:description"]', site['description']),
                     ('meta[property="og:title"]', site['title']),
                     ('meta[name="twitter:title"]', site['title'])]:
        el = sel1(doc, css)
        if el is not None:
            el.set('content', val)
    put(doc, '.nav-brand', site['author'], 'site.author')

    hero, h = sel1(doc, '.hero'), home['hero']
    put(hero, '.eyebrow', h['eyebrow'], 'hero.eyebrow')
    put(hero, 'h1', h['name'], 'hero.name')
    put(hero, '.role', h['role'], 'hero.role')
    put(hero, '.tagline', h['tagline'], 'hero.tagline')
    put_list(hero, '.sum3 li p', h['summary3'], 'hero.summary3')
    put(hero, '.summary', h['summary'], 'hero.summary')
    put(hero, '.mock-url', h['mockCaption'], 'hero.mockCaption')
    put_list(hero, '.float', h['floats'], 'hero.floats')
    put_links(hero, '.hero-cta a', h['cta'], 'hero.cta')

    for el, s in zip(doc.cssselect('.stats .stat'), home['stats']):
        put(el, '.v', s['value'], 'stats')
        put(el, '.l', s['label'], 'stats')
        put(el, '.s', s['sub'], 'stats')

    sec = sec_head(doc, '#about', home['strengths'], 'strengths')
    for el, p in zip(sec.cssselect('.pillar'), home['strengths']['items']):
        put(el, '.n', p['no'], 'strengths')
        put(el, 'h3', p['title'], 'strengths')
        put(el, 'p', p['desc'], 'strengths')
        put_list(el, '.proof span', p['proof'], 'strengths.proof')

    sec = sec_head(doc, '#journey', home['journey'], 'journey')
    for el, it in zip(sec.cssselect('.tl-item'), home['journey']['items']):
        el.set('data-track', it['track'])
        put(el, '.d', it['date'], 'journey')
        put(el, '.t', it['title'], 'journey')
        put(el, '.nt', it['note'], 'journey')

    sec = sec_head(doc, '#stack', home['stack'], 'stack')
    for col, cat in zip(sec.cssselect('.stack-col'), home['stack']['categories']):
        put(col, 'h3', cat['name'], 'stack')
        lis = col.cssselect('li')
        if len(lis) != len(cat['items']):
            note(f"stack({cat['name']}): 항목 수가 다릅니다 (원고 {len(cat['items'])} ≠ 골격 {len(lis)})")
        for li, item in zip(lis, cat['items']):
            put(li, 'b', item['name'], 'stack')
            put(li, '.use', item['use'], 'stack')
            put(li, 'em', item['projects'], 'stack')

    for part in home['parts']:
        sec = sel1(doc, '#' + part['id'])
        put(sec, '.part-label', part['label'], part['id'])
        put(sec, '.part-head h2', part['title'], part['id'])
        put(sec, '.part-head p', part['desc'], part['id'])
        put(sec, '.per', part['period'], part['id'])
        cards = sec.cssselect('.pcard')
        if len(cards) != len(part['cards']):
            note(f"{part['id']}: 카드 수가 다릅니다 (원고 {len(part['cards'])} ≠ 골격 {len(cards)})")
        for el, c in zip(cards, part['cards']):
            el.set('href', c['href'])
            img = sel1(el, '.pc-thumb img')
            if img is not None and c.get('thumb'):
                img.set('src', c['thumb'])
                img.set('alt', c['title'] + ' 화면')
            put_list(el, '.proj-badges span', c['badges'], part['id'] + '.badges')
            put(el, 'h3', c['title'], part['id'])
            put(el, '.pc-sub', c['sub'], part['id'])
            put(el, '.pc-role', c['role'], part['id'])
            for m_el, m in zip(el.cssselect('.pc-metrics > div'), c['metrics']):
                put(m_el, 'b', m['value'], part['id'])
                put(m_el, 'span', m['label'], part['id'])
            chips = [x for x in el.cssselect('.chips .chip') if 'more' not in (x.get('class') or '')]
            for ch, v in zip(chips, c['tech']):
                set_text(ch, v, part['id'] + '.tech')

    sec = sec_head(doc, '#trouble', home['problemSolving'], 'problemSolving')
    cases_into(sec, home['problemSolving']['cases'], 'problemSolving')

    sec = sec_head(doc, '#closing', home['closing'], 'closing')
    for el, it in zip(sec.cssselect('.close-card'), home['closing']['items']):
        put(el, 'h3', it['title'], 'closing')
        put(el, 'p', it['desc'], 'closing')

    foot = sel1(doc, 'footer')
    put(foot, '.fname', home['footer']['name'], 'footer')
    put(foot, '.fsub', home['footer']['sub'], 'footer')
    put_links(foot, '.flinks a', home['footer']['links'], 'footer.links')
    put(foot, '.meta-note', home['footer']['note'], 'footer')
    return doc


def fill_charts(holder, charts, where):
    for ch, c in zip(holder.cssselect('.chart'), charts):
        put(ch, 'h4', c['title'], where)
        if c.get('type') == 'pipeline':
            for st, s in zip(ch.cssselect('.pipe-step'), c['steps']):
                put(st, '.pl', s['label'], where)
                put(st, '.ps', s['sub'], where)
        elif c.get('type') == 'bars':
            for row, r in zip(ch.cssselect('.bar-row'), c['rows']):
                put(row, '.bl', r['label'], where)
                put(row, '.bv', r['value'], where)
                fill = sel1(row, '.bar-fill')
                if fill is not None and r.get('pct') is not None:
                    fill.set('style', f"--pct:{r['pct']}%")
        elif c.get('type') == 'matrix':
            trs = ch.cssselect('table.matrix tr')
            for th, v in zip(trs[0].cssselect('th')[1:], c['columns']):
                set_text(th, v, where)
            for tr, row in zip(trs[1:], c['rows']):
                put(tr, 'th.rowh', row['label'], where)
                for td, v in zip(tr.cssselect('td'), row['values']):
                    set_text(td, str(v), where)
            put(ch, '.matrix-note', c.get('note'), where)


def build_project(stem, p):
    doc = LH.fromstring((TPL / f'{stem}.html').read_text(encoding='utf-8'))
    where = f'projects.{stem}'
    put(doc, 'title', p['pageTitle'], where)
    for css in ('meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]'):
        el = sel1(doc, css)
        if el is not None and p.get('pageDescription'):
            el.set('content', p['pageDescription'])
    put(doc, '.nav-cur', p['title'], where)

    dh = sel1(doc, '.dhero')
    put(dh, '.dhero-part', p['part'], where)
    put_list(dh, '.proj-badges span', p['badges'], where + '.badges')
    put(dh, 'h1', p['title'], where)
    put(dh, '.dhero-sub', p['sub'], where)
    rows = dh.cssselect('.meta > div')
    for el in rows:
        if 'role-m' in (el.get('class') or ''):
            set_text(el, p.get('role'), where)
    plain = [el for el in rows if 'role-m' not in (el.get('class') or '')]
    for el, key in zip(plain, ['period', 'team']):
        set_text(el, p.get(key), where)
    if p.get('links'):
        put_links(dh, '.plinks a', p['links'], where + '.links')

    for el, m in zip(doc.cssselect('.pmetric'), p['metrics']):
        put(el, '.v', m['value'], where)
        put(el, '.l', m['label'], where)

    body = sel1(doc, '.proj-body')
    kinds = {'features': 'feats', 'note': 'srole', 'charts': 'charts', 'tech': 'chips',
             'shots': 'shots', 'links': 'hero-cta'}
    slots, last_bt = [], None
    for el in body:
        cls = (el.get('class') or '').split()
        if 'block-t' in cls:
            last_bt = el
        else:
            slots.append((cls[0] if cls else '', el, last_bt))
            last_bt = None
    blocks = p['blocks']
    if len(slots) != len(blocks):
        note(f'{where}: 본문 블록 수가 다릅니다 (원고 {len(blocks)} ≠ 골격 {len(slots)})')
    for (cls, el, bt), b in zip(slots, blocks):
        want = kinds.get(b['type'])
        if cls != want:
            note(f"{where}: 블록 순서가 다릅니다 (원고 {b['type']} ≠ 골격 {cls})")
            continue
        heading = b.get('heading') if b['type'] == 'note' else b.get('label')
        if bt is not None and heading:
            set_text(bt, heading, where)
        if b['type'] == 'features':
            for f_el, f in zip(el.cssselect('.feat'), b['items']):
                put(f_el, 'h4', f['title'], where)
                put(f_el, 'p', f['desc'], where)
        elif b['type'] == 'note':
            put(el, '.k', b['label'], where)
            ps = el.cssselect('p')
            if ps:
                set_text(ps[0], b['body'], where)
            for li, item in zip(el.cssselect('ul.dl li'), b.get('items') or []):
                put(li, 'b', item['name'], where)
                bb = sel1(li, 'b')
                if bb is not None:
                    bb.tail = item['desc']
            put(el, 'p.dn', b.get('note'), where)
        elif b['type'] == 'charts':
            fill_charts(el, b['items'], where)
        elif b['type'] == 'tech':
            put_list(el, 'span.chip', b['items'], where + '.tech')
        elif b['type'] == 'shots':
            for fig, sh in zip(el.cssselect('figure'), b['items']):
                img = sel1(fig, 'img')
                img.set('src', sh['src'])
                img.set('alt', sh['caption'])
                fig.set('data-full', sh['src'])
                fig.set('data-cap', sh['caption'])
                put(fig, '.cap', sh['caption'], where)
        elif b['type'] == 'links':
            put_links(el, 'a', b['items'], where + '.links')

    ps = p.get('problemSolving')
    if ps:
        band = [s for s in doc.cssselect('section.band') if s.cssselect('.ts-card')]
        if band:
            put(band[0], 'h2', ps['title'], where)
            put(band[0], '.sec-head p', ps['desc'], where)
            cases_into(band[0], ps['cases'], where)
    return doc


def main():
    data = json.loads(DATA.read_text(encoding='utf-8'))
    out = [(ROOT / 'index.html', build_index(data))]
    for stem in PAGES:
        out.append((ROOT / 'projects' / f'{stem}.html', build_project(stem, data['projects'][stem])))
    for path, doc in out:
        html = LH.tostring(doc, encoding='unicode', doctype='<!doctype html>')
        path.write_text(html, encoding='utf-8', newline='')
        print('생성:', path.relative_to(ROOT))
    if warn:
        print('\n확인이 필요한 항목:')
        for w in dict.fromkeys(warn):
            print('  -', w)
    else:
        print('\n경고 없음 — 원고와 골격이 맞습니다.')
    if '--pptx' in sys.argv:
        deck = ROOT / 'deck-src' / 'build.js'
        print('\nPPT 생성:', deck)
        subprocess.run(['node', str(deck), str(ROOT / '유소은_포트폴리오.pptx')], cwd=deck.parent, check=True)


if __name__ == '__main__':
    main()
