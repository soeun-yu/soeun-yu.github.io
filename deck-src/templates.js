// 반복되는 슬라이드 구성 요소
const sharp = require('sharp');
const L = require('./lib');
const { W, H, M, F, MONO, C, tint, mix, textW, textH, nLines, lineH, icon, crop } = L;

// ---- 배경 이미지 (그라데이션은 PPT 도형으로 못 그려서 PNG로 생성) ----
async function bgImage(kind, tone) {
  const hex = (c) => '#' + c;
  const grid = `
    <defs>
      <pattern id="g" width="64" height="64" patternUnits="userSpaceOnUse">
        <path d="M64 0H0V64" fill="none" stroke="${hex(C.borderSoft)}" stroke-width="1.4"/>
      </pattern>
      <radialGradient id="gm" cx="${kind === 'cover' ? '50%' : '10%'}" cy="${kind === 'cover' ? '20%' : '0%'}" r="70%">
        <stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <mask id="m"><rect width="1920" height="1080" fill="url(#gm)"/></mask>
    </defs>`;
  const glow = (id, cx, cy, rx, ry, color, op) => `
    <radialGradient id="${id}" cx="${cx}" cy="${cy}" r="1" gradientUnits="userSpaceOnUse"
      gradientTransform="translate(${cx} ${cy}) scale(${rx} ${ry}) translate(${-cx} ${-cy})">
      <stop offset="0" stop-color="${hex(color)}" stop-opacity="${op}"/>
      <stop offset="1" stop-color="${hex(color)}" stop-opacity="0"/>
    </radialGradient>
    <rect width="1920" height="1080" fill="url(#${id})"/>`;
  let body = '';
  if (kind === 'cover') {
    body = glow('a', 420, 190, 900, 520, C.accent, 0.30) + glow('b', 1500, 90, 760, 460, C.accent2, 0.22) + glow('c', 1050, 520, 700, 420, C.accent3, 0.12);
  } else if (kind === 'part') {
    body = glow('a', 150, 0, 1250, 700, tone, 0.30) + glow('b', 1800, 1080, 900, 500, tone, 0.08);
  } else {
    body = glow('a', 0, 0, 1000, 480, tone, 0.10);
  }
  const gridLayer = kind === 'glow' ? '' : `<rect width="1920" height="1080" fill="url(#g)" mask="url(#m)" opacity="${kind === 'cover' ? 0.8 : 0.6}"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">${grid}
    <rect width="1920" height="1080" fill="${hex(C.bg)}"/>${body}${gridLayer}</svg>`;
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return 'image/png;base64,' + buf.toString('base64');
}

function makeTemplates(pres, K) {
  const bgCache = {};
  async function background(slide, kind = 'plain', tone = C.accent) {
    if (kind === 'plain') { slide.background = { color: C.bg }; return; }
    const key = kind + tone;
    if (!bgCache[key]) bgCache[key] = await bgImage(kind, tone);
    slide.background = { data: bgCache[key] };
  }

  function footer(slide, label) {
    K.text(slide, '유소은 · Portfolio', { x: M, y: H - 0.42, w: 3, h: 0.22, fontSize: 9, color: C.muted, bold: true });
    if (label) K.text(slide, label, { x: 3.4, y: H - 0.42, w: 6.5, h: 0.22, fontSize: 9, color: C.muted, align: 'center' });
    slide.slideNumber = { x: W - M - 0.8, y: H - 0.45, w: 0.8, h: 0.25, fontFace: MONO, fontSize: 9, color: C.muted, align: 'right' };
  }

  // 섹션 머리말: 태그 + 제목 + 설명. 본문 시작 y를 돌려준다
  function header(slide, { tag, title, sub, tone = C.accent2, w = W - M * 2 }) {
    K.text(slide, tag.toUpperCase(), { x: M, y: 0.5, w, h: 0.26, fontSize: 10.5, bold: true, color: tone, charSpacing: 2.5 });
    K.text(slide, title, { x: M, y: 0.78, w, h: 0.62, fontSize: 30, bold: true, color: C.text });
    if (sub) {
      K.text(slide, sub, { x: M, y: 1.42, w, h: 0.3, fontSize: 12, color: C.mid });
      return 1.95;
    }
    return 1.6;
  }

  // 지표 띠 — 값(모노) + 라벨
  function metricStrip(slide, metrics, x, y, w, h, tone) {
    K.rect(slide, x, y, w, h, { fill: C.surf, line: C.border, r: 0.14 });
    const cw = w / metrics.length;
    metrics.forEach((m, i) => {
      const cx = x + i * cw;
      if (i > 0) slide.addShape(pres.shapes.LINE, { x: cx, y: y + 0.22, w: 0, h: h - 0.44, line: { color: C.border, width: 0.75 } });
      const vpt = textW(m.v, 26) > cw - 0.2 ? 20 : 26;
      // 한글이 섞인 값은 모노 폰트 대체 글꼴 때문에 자간이 벌어지므로 본문 폰트로
      K.text(slide, m.v, { x: cx, y: y + h / 2 - 0.42, w: cw, h: 0.48, fontSize: vpt, bold: true, color: tone, fontFace: /[가-힣]/.test(m.v) ? F : MONO, align: 'center', valign: 'middle' });
      K.text(slide, m.l, { x: cx + 0.05, y: y + h / 2 + 0.1, w: cw - 0.1, h: 0.28, fontSize: 10.5, color: C.muted, align: 'center', valign: 'top' });
    });
  }

  // 톤을 옅게 깐 강조 박스 ("서비스 내 위치", "배경" 등)
  async function callout(slide, label, body, x, y, w, h, tone, o = {}) {
    K.rect(slide, x, y, w, h, { fill: tint(tone, 0.08, C.surf2), line: tint(tone, 0.3, C.surf2), r: 0.14 });
    const ix = x + 0.26;
    slide.addImage({ data: await icon(o.icon || 'LuCompass', tone), x: ix, y: y + 0.24, w: 0.2, h: 0.2 });
    K.text(slide, label, { x: ix + 0.3, y: y + 0.2, w: w - 0.8, h: 0.28, fontSize: 11.5, bold: true, color: tone, valign: 'middle' });
    let pt = o.pt || 11.5;
    const tw = w - 0.52, avail = h - 0.66;
    while (pt > 9 && textH(body, pt, tw * 0.9, 1.5) > avail) pt -= 0.5;
    K.text(slide, body, { x: ix, y: y + 0.56, w: tw, h: avail, fontSize: pt, color: C.mid, lineSpacingMultiple: 1.3 });
  }

  // 기능 카드 격자
  async function featureGrid(slide, feats, x, y, w, h, { cols, rows: rowsOpt, tone, gap = 0.22, pt = 11, base = C.surf, tile = 0.46 }) {
    const rows = rowsOpt || Math.ceil(feats.length / cols);
    const cw = (w - gap * (cols - 1)) / cols;
    const ch = (h - gap * (rows - 1)) / rows;
    for (let i = 0; i < feats.length; i++) {
      const f = feats[i];
      const r = Math.floor(i / cols), c = i % cols;
      const cx = x + c * (cw + gap), cy = y + r * (ch + gap);
      K.rect(slide, cx, cy, cw, ch, { fill: base, line: C.border, r: 0.14 });
      const pad = 0.24;
      await K.iconTile(slide, f.icon, cx + pad, cy + pad, tile, tone, base);
      const side = cw >= 4.6; // 넓은 카드는 아이콘 오른쪽에 제목+설명
      const tx = side ? cx + pad + tile + 0.2 : cx + pad;
      const tw = side ? cw - pad * 2 - tile - 0.2 : cw - pad * 2;
      const titleY = side ? cy + pad - 0.02 : cy + pad + tile + 0.14;
      if (!side) {
        // 좁은 카드: 제목을 아이콘 오른쪽 한 줄에
        K.text(slide, f.t, { x: cx + pad + tile + 0.16, y: cy + pad, w: cw - pad * 2 - tile - 0.16, h: tile, fontSize: 13, bold: true, valign: 'middle' });
      } else {
        K.text(slide, f.t, { x: tx, y: titleY, w: tw, h: 0.34, fontSize: 13.5, bold: true, valign: 'middle' });
      }
      const dy = side ? titleY + 0.4 : cy + pad + tile + 0.14;
      const avail = cy + ch - pad + 0.06 - dy;
      let dpt = pt;
      while (dpt > 9 && textH(f.d, dpt, tw, 1.45) > avail) dpt -= 0.5;
      K.text(slide, f.d, { x: tx, y: dy, w: tw, h: avail, fontSize: dpt, color: C.mid, lineSpacingMultiple: 1.22 });
    }
  }

  // 단계 흐름 (아이콘 카드 + 화살표)
  async function pipeline(slide, steps, x, y, w, h, tone) {
    const aw = 0.36, n = steps.length;
    const sw = (w - aw * (n - 1)) / n;
    for (let i = 0; i < n; i++) {
      const s = steps[i];
      const sx = x + i * (sw + aw);
      K.rect(slide, sx, y, sw, h, { fill: C.surf, line: C.border, r: 0.14 });
      const tile = 0.5;
      await K.iconTile(slide, s.icon, sx + (sw - tile) / 2, y + 0.24, tile, tone);
      K.text(slide, s.l, { x: sx + 0.08, y: y + 0.84, w: sw - 0.16, h: 0.32, fontSize: 13, bold: true, align: 'center', valign: 'middle' });
      K.text(slide, s.s, { x: sx + 0.08, y: y + 1.16, w: sw - 0.16, h: 0.28, fontSize: 10, color: C.muted, align: 'center', valign: 'top' });
      if (i < n - 1) slide.addImage({ data: await icon('LuChevronRight', C.muted), x: sx + sw + 0.06, y: y + h / 2 - 0.12, w: 0.24, h: 0.24 });
    }
  }

  // 가로 막대 차트 (네이티브) — 카드 위에 올림
  function barChart(slide, { title, labels, values, x, y, w, h, tone, hl = -1, fmt = '0.0', unit = '', max, min = 0 }) {
    K.rect(slide, x, y, w, h, { fill: C.surf, line: C.border, r: 0.14 });
    K.text(slide, title, { x: x + 0.26, y: y + 0.2, w: w - 0.52, h: 0.3, fontSize: 12.5, bold: true });
    const dim = mix(tone, C.surf, 0.42);
    const colors = values.map((_, i) => (hl === -1 || i === hl ? tone : dim));
    slide.addChart(pres.charts.BAR, [{ name: title, labels, values }], {
      x: x + 0.1, y: y + 0.55, w: w - 0.25, h: h - 0.7,
      barDir: 'bar', barGapWidthPct: 55,
      chartColors: colors.length > 1 ? colors : [tone, tone],
      catAxisOrientation: 'maxMin',
      catAxisLabelColor: C.mid, catAxisLabelFontFace: F, catAxisLabelFontSize: 10,
      catAxisLineShow: false,
      valAxisHidden: true, valAxisMinVal: min, valAxisMaxVal: max,
      valGridLine: { style: 'none' }, catGridLine: { style: 'none' },
      showValue: true, dataLabelPosition: 'outEnd', dataLabelColor: C.text, dataLabelFontFace: MONO,
      dataLabelFontSize: 10.5, dataLabelFontBold: true, dataLabelFormatCode: fmt + (unit ? `"${unit}"` : ''),
      showLegend: false, showTitle: false,
      plotArea: { fill: { color: C.surf } }, chartArea: { fill: { color: C.surf } },
    });
  }

  // 프로젝트 첫 장: 왼쪽 소개, 오른쪽 대표 화면, 아래 지표 + 서비스 내 위치
  async function projectCover(slide, p) {
    await background(slide, 'glow', p.tone);
    const lw = 6.1;
    K.text(slide, p.part, { x: M, y: 0.58, w: lw, h: 0.26, fontSize: 10.5, bold: true, color: p.tone, charSpacing: 1 });
    let bx = M;
    for (const b of p.badges) {
      const star = b.startsWith('⭐');
      const label = star ? '대표작' : b;
      bx += K.chip(slide, label, bx, 0.95, star
        ? { fill: C.accent, line: C.accent, color: C.white, bold: true, pt: 9.5, h: 0.27 }
        : { fill: tint(p.tone, 0.14), line: tint(p.tone, 0.4), color: p.tone, bold: true, pt: 9.5, h: 0.27 }) + 0.08;
    }
    let tpt = 36;
    while (tpt > 22 && textW(p.title, tpt) * 1.12 > lw) tpt -= 1;
    K.text(slide, p.title, { x: M, y: 1.36, w: lw, h: 0.74, fontSize: tpt, bold: true, valign: 'middle' });
    const subH = textH(p.sub, 14, lw * 0.92, 1.4);
    K.text(slide, p.sub, { x: M, y: 2.2, w: lw, h: subH, fontSize: 14, color: C.mid, lineSpacingMultiple: 1.2 });
    let my = 2.2 + subH + 0.22;
    const rows = [['LuCalendar', p.period, C.mid], ['LuUsers', p.team, C.mid], ['LuUserCheck', p.role, p.tone]];
    for (const [ic, t, col] of rows) {
      slide.addImage({ data: await icon(ic, col === C.mid ? C.muted : col), x: M, y: my + 0.07, w: 0.2, h: 0.2 });
      K.text(slide, t, { x: M + 0.32, y: my, w: lw - 0.32, h: 0.34, fontSize: 11.5, color: col, bold: col !== C.mid, valign: 'middle' });
      my += 0.36;
    }
    if (p.links && p.links.length) {
      let lx = M;
      my += 0.1;
      for (const lk of p.links) {
        const lwid = textW(lk.t, 10) + 0.56;
        K.rect(slide, lx, my, lwid, 0.3, { fill: tint(p.tone, 0.1), line: tint(p.tone, 0.4), r: 0.08 });
        slide.addImage({ data: await icon(lk.icon, p.tone), x: lx + 0.12, y: my + 0.07, w: 0.16, h: 0.16 });
        K.text(slide, [{ text: lk.t, options: { hyperlink: { url: lk.url, tooltip: lk.url } } }], { x: lx + 0.34, y: my, w: lwid - 0.4, h: 0.3, fontSize: 10, bold: true, color: p.tone, valign: 'middle' });
        lx += lwid + 0.1;
      }
      my += 0.3;
    }
    if (p.chips) {
      my += 0.16;
      K.chips(slide, p.chips, M, my, lw, { pt: 9.5, h: 0.27, r: 0.07, color: C.mid });
    }
    // 오른쪽 이미지 영역
    const rx = 7.0, rw = W - M - rx;
    if (p.visual) await p.visual(slide, rx, 0.6, rw, 4.2);
    // 아래 띠
    metricStrip(slide, p.metrics, M, 5.1, lw, 1.72, p.tone);
    await callout(slide, p.positionLabel || '서비스 내 위치', p.position, rx, 5.1, rw, 1.72, p.tone, { icon: p.positionIcon });
    footer(slide, p.footer);
  }

  // 갤러리: 왼쪽 제목 패널 + 오른쪽 화면 격자
  async function gallery(slide, g) {
    await background(slide, 'glow', g.tone);
    const pw = 3.05;
    K.text(slide, g.tag.toUpperCase(), { x: M, y: 0.6, w: pw, h: 0.26, fontSize: 10.5, bold: true, color: g.tone, charSpacing: 2 });
    const titleH = textH(g.title, 26, pw, 1.25);
    K.text(slide, g.title, { x: M, y: 0.9, w: pw, h: titleH, fontSize: 26, bold: true, lineSpacingMultiple: 1.05 });
    let y = 0.9 + titleH + 0.18;
    if (g.sub) {
      const sh = textH(g.sub, 11.5, pw, 1.5);
      K.text(slide, g.sub, { x: M, y, w: pw, h: sh, fontSize: 11.5, color: C.mid, lineSpacingMultiple: 1.3 });
      y += sh + 0.25;
    }
    if (g.aside) await g.aside(slide, M, y, pw, H - 0.7 - y);
    const gx = M + pw + 0.45, gw = W - M - gx, gy = 0.6, gh = H - 0.72 - gy;
    const cols = g.cols, rows = g.rows || Math.ceil(g.shots.length / cols);
    const gap = 0.26, capH = 0.34;
    const cw = (gw - gap * (cols - 1)) / cols;
    const ch = (gh - gap * (rows - 1)) / rows;
    for (let i = 0; i < g.shots.length; i++) {
      const s = g.shots[i];
      const r = Math.floor(i / cols), c = i % cols;
      const sx = gx + c * (cw + gap), sy = gy + r * (ch + gap);
      const span = s.span || 1;
      const sw = cw * span + gap * (span - 1);
      await K.browser(slide, s.file, sx, sy, sw, ch - capH, { anchor: s.anchor, url: s.url });
      let cpt = 10;
      while (cpt > 8 && (textW(s.cap, cpt) + 0.35) * 1.05 > sw) cpt -= 0.5;
      K.text(slide, [
        { text: String(i + 1).padStart(2, '0') + '  ', options: { fontFace: MONO, color: g.tone, bold: true } },
        { text: s.cap, options: { color: C.mid } },
      ], { x: sx, y: sy + ch - capH + 0.07, w: sw, h: 0.26, fontSize: cpt, valign: 'middle' });
    }
    // 화면 수가 격자보다 적으면 남는 칸을 호출 쪽에서 채운다
    if (g.extra) {
      const i = g.shots.length;
      await g.extra(slide, gx + (i % cols) * (cw + gap), gy + Math.floor(i / cols) * (ch + gap), cw, ch);
    }
    footer(slide, g.footer);
  }

  return { background, footer, header, metricStrip, callout, featureGrid, pipeline, barChart, projectCover, gallery };
}

module.exports = { makeTemplates };
