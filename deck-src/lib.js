// 공통 헬퍼 — 색·폰트·아이콘·이미지·도형
const path = require('path');
const sharp = require('sharp');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const Lu = require('react-icons/lu');

const ROOT = 'C:/Users/yuthd/OneDrive/바탕 화면/[취업 활동]/1. 서류 전형/포트폴리오/soeun-yu.github.io';
const asset = (p) => path.join(ROOT, 'assets', p);

const W = 13.333, H = 7.5, M = 0.6;
const F = 'Malgun Gothic', MONO = 'Consolas';

// 사이트 다크 테마 토큰 그대로
const C = {
  bg: '0A0B10', bgAlt: '0E1017', surf: '13151E', surf2: '191C27',
  border: '242835', borderSoft: '1C1F2A',
  text: 'E9EBF2', mid: 'B3B8C8', muted: '7F859A',
  accent: '7C7CF5', accent2: 'C084FC', accent3: '22D3EE',
  ai: 'A78BFA', kdc: '2DD4BF', web: 'FBBF24',
  ok: '4ADE80', danger: 'FB7185', warn: 'FBBF24', white: 'FFFFFF',
};

function mix(a, b, t) {
  const pa = [0, 2, 4].map((i) => parseInt(a.substr(i, 2), 16));
  const pb = [0, 2, 4].map((i) => parseInt(b.substr(i, 2), 16));
  return pa.map((v, i) => Math.round(v * t + pb[i] * (1 - t)).toString(16).padStart(2, '0')).join('').toUpperCase();
}
const tint = (tone, t = 0.14, base = C.surf) => mix(tone, base, t);

// ---- 텍스트 폭 추정 (맑은 고딕 기준, 약간 보수적으로) ----
function textW(str, pt) {
  let em = 0;
  for (const ch of String(str)) {
    const c = ch.codePointAt(0);
    if ((c >= 0x1100 && c <= 0x11ff) || (c >= 0x2e80 && c <= 0xd7af) || (c >= 0xf900 && c <= 0xfaff) || (c >= 0xff00 && c <= 0xffef)) em += 0.96;
    else if (ch === ' ') em += 0.3;
    else if (/[A-Z0-9%@#&]/.test(ch)) em += 0.64;
    else if (/[a-z]/.test(ch)) em += 0.52;
    else if (/[·()\/.,:'"\-]/.test(ch)) em += 0.38;
    else em += 0.6;
  }
  return (em * pt) / 72;
}
function nLines(str, pt, w) {
  let lines = 0;
  for (const para of String(str).split('\n')) {
    lines++;
    let cur = 0;
    const sp = textW(' ', pt);
    for (const wd of para.split(' ')) {
      const ww = textW(wd, pt);
      if (cur > 0 && cur + ww > w) { lines++; cur = ww + sp; } else cur += ww + sp;
    }
  }
  return lines;
}
const lineH = (pt, spacing = 1.38) => (pt * spacing) / 72;
const textH = (str, pt, w, spacing) => nLines(str, pt, w) * lineH(pt, spacing);

// ---- 아이콘 (lucide) ----
const iconCache = {};
async function icon(name, color) {
  const key = name + color;
  if (iconCache[key]) return iconCache[key];
  const Comp = Lu[name];
  if (!Comp) throw new Error('icon missing: ' + name);
  let svg = renderToStaticMarkup(React.createElement(Comp, { size: 256 }));
  svg = svg.replace(/currentColor/g, '#' + color);
  if (!/xmlns=/.test(svg)) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return (iconCache[key] = 'image/png;base64,' + buf.toString('base64'));
}

// ---- 이미지: 목표 비율로 잘라서 base64 ----
const imgCache = {};
async function meta(file) {
  const m = await sharp(file).metadata();
  return { w: m.width, h: m.height };
}
async function crop(file, aspect, anchor = 'top') {
  const key = file + '|' + aspect.toFixed(3) + '|' + anchor;
  if (imgCache[key]) return imgCache[key];
  const { w: iw, h: ih } = await meta(file);
  let left = 0, top = 0, w = iw, h = ih;
  if (iw / ih > aspect) {
    w = Math.round(ih * aspect);
    left = anchor === 'left' ? 0 : Math.round((iw - w) / 2);
  } else {
    h = Math.round(iw / aspect);
    top = anchor === 'center' ? Math.round((ih - h) / 2) : 0;
  }
  let p = sharp(file).extract({ left, top, width: w, height: h });
  if (w > 1600) p = p.resize({ width: 1600 });
  const isPng = /\.png$/i.test(file);
  const buf = isPng ? await p.png({ compressionLevel: 9 }).toBuffer() : await p.jpeg({ quality: 85 }).toBuffer();
  return (imgCache[key] = (isPng ? 'image/png;base64,' : 'image/jpeg;base64,') + buf.toString('base64'));
}
// 원본 비율 그대로 (필요 시 축소만)
async function full(file) {
  const { w, h } = await meta(file);
  return { data: await crop(file, w / h, 'center'), aspect: w / h };
}

// ---- 도형·텍스트 기본 ----
function makeKit(pres) {
  const S = pres.shapes;

  function text(slide, t, o = {}) {
    const base = { fontFace: F, color: C.text, fontSize: 12 };
    let body = t;
    if (Array.isArray(t)) {
      // 상자 옵션(크기·색·굵기)을 런 기본값으로 물려준다
      const inherit = {};
      for (const k of ['fontFace', 'fontSize', 'color', 'bold']) if (o[k] !== undefined) inherit[k] = o[k];
      body = t.map((r) => ({ text: r.text, options: Object.assign({}, base, inherit, r.options || {}) }));
    }
    const opts = Object.assign({ isTextBox: true, margin: 0, valign: 'top', lineSpacingMultiple: 1.12 }, base, o);
    delete opts.runBase;
    slide.addText(body, opts);
  }

  function rect(slide, x, y, w, h, o = {}) {
    const radius = o.r === undefined ? 0.12 : o.r;
    slide.addShape(radius ? S.ROUNDED_RECTANGLE : S.RECTANGLE, {
      x, y, w, h,
      fill: { color: o.fill || C.surf, transparency: o.transparency || 0 },
      line: o.line === null ? { type: 'none' } : { color: o.line || C.border, width: o.lineW || 0.75 },
      rectRadius: radius || undefined,
      shadow: o.shadow ? { type: 'outer', color: '000000', opacity: 0.45, blur: 14, offset: 4, angle: 90 } : undefined,
    });
  }

  function circle(slide, x, y, d, fill, line) {
    slide.addShape(S.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: line ? { color: line.color, width: line.width } : { type: 'none' } });
  }

  // 아이콘 타일: 톤을 옅게 깐 둥근 사각형 + 아이콘
  async function iconTile(slide, name, x, y, size, tone, base = C.surf) {
    rect(slide, x, y, size, size, { fill: tint(tone, 0.16, base), line: tint(tone, 0.34, base), r: size * 0.26 });
    const pad = size * 0.25;
    slide.addImage({ data: await icon(name, tone), x: x + pad, y: y + pad, w: size - pad * 2, h: size - pad * 2 });
  }

  // 알약형 칩 — 폭은 텍스트 길이로 계산, 반환값은 칩 폭
  function chip(slide, label, x, y, o = {}) {
    const pt = o.pt || 10;
    const h = o.h || 0.28;
    const w = textW(label, pt) + (o.padX || 0.26);
    rect(slide, x, y, w, h, { fill: o.fill || C.surf2, line: o.line || C.border, r: o.r === undefined ? h / 2 : o.r });
    text(slide, label, { x, y, w, h, fontSize: pt, color: o.color || C.mid, bold: !!o.bold, align: 'center', valign: 'middle', fontFace: o.font || F });
    return w;
  }
  // 칩 줄바꿈 배치, 반환값은 사용한 높이
  function chips(slide, labels, x, y, maxW, o = {}) {
    const gap = o.gap || 0.08, h = o.h || 0.28;
    let cx = x, cy = y;
    for (const l of labels) {
      const w = textW(l, o.pt || 10) + (o.padX || 0.26);
      if (cx > x && cx + w > x + maxW) { cx = x; cy += h + gap; }
      chip(slide, l, cx, cy, o);
      cx += w + gap;
    }
    return cy + h - y;
  }

  // 브라우저 창 목업 — 사이트 히어로의 .mock 프레임을 그대로 옮김
  async function browser(slide, file, x, y, w, h, o = {}) {
    const bar = 0.3, inset = 0.035;
    rect(slide, x, y, w, h, { fill: C.surf2, line: C.border, r: 0.1, shadow: o.shadow !== false });
    const dots = ['FB7185', 'FBBF24', '4ADE80'];
    dots.forEach((d, i) => circle(slide, x + 0.16 + i * 0.16, y + bar / 2 - 0.045, 0.09, d));
    if (o.url) {
      const uw = Math.min(w - 0.9, textW(o.url, 8) + 0.3);
      rect(slide, x + 0.7, y + 0.065, uw, 0.17, { fill: C.bg, line: C.borderSoft, r: 0.05 });
      text(slide, o.url, { x: x + 0.7, y: y + 0.065, w: uw, h: 0.17, fontSize: 8, color: C.muted, fontFace: MONO, align: 'center', valign: 'middle' });
    }
    const iw = w - inset * 2, ih = h - bar - inset;
    slide.addImage({ data: await crop(file, iw / ih, o.anchor || 'top'), x: x + inset, y: y + bar, w: iw, h: ih });
  }

  // 원본 비율을 유지해 상자 안에 맞춰 넣기 (여백 카드 포함)
  async function fitImage(slide, file, x, y, w, h, o = {}) {
    const { data, aspect } = await full(file);
    const pad = o.pad === undefined ? 0.12 : o.pad;
    if (o.card !== false) rect(slide, x, y, w, h, { fill: o.fill || C.white, line: o.line || C.border, r: 0.08 });
    let iw = w - pad * 2, ih = iw / aspect;
    if (ih > h - pad * 2) { ih = h - pad * 2; iw = ih * aspect; }
    slide.addImage({ data, x: x + (w - iw) / 2, y: y + (h - ih) / 2, w: iw, h: ih });
    return { iw, ih };
  }

  return { text, rect, circle, iconTile, chip, chips, browser, fitImage };
}

module.exports = { ROOT, asset, W, H, M, F, MONO, C, mix, tint, textW, nLines, lineH, textH, icon, crop, full, meta, makeKit };
