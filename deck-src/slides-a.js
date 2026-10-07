// 앞부분: 표지 · 목차 · 한눈에 보기 · 주로 맡은 역할 · 진행 순서 · 기술 스택
const L = require('./lib');
const { W, H, M, F, MONO, C, asset, tint, mix, textW, textH, icon } = L;

const fitPt = (s, w, pt, min = 8, k = 1) => { while (pt > min && textW(s, pt) * k > w) pt -= 0.5; return pt; };

module.exports = async function frontSlides(pres, K, T) {
  // ───────────── 1. 표지 ─────────────
  {
    const s = pres.addSlide();
    await T.background(s, 'cover');
    const eb = '휴먼AI교육센터 · 2025.06 ~ 2026.08';
    const ebw = textW(eb, 10.5) + 0.62;
    K.rect(s, M, 0.85, ebw, 0.36, { fill: C.surf, line: C.border, r: 0.18 });
    K.circle(s, M + 0.17, 0.85 + 0.135, 0.09, C.ok);
    K.text(s, eb, { x: M + 0.36, y: 0.85, w: ebw - 0.4, h: 0.36, fontSize: 10.5, color: C.mid, bold: true, valign: 'middle' });

    K.text(s, [{ text: '유소은 ', options: { color: C.text } }, { text: 'Portfolio', options: { color: C.accent2 } }],
      { x: M, y: 1.45, w: 6.8, h: 1.1, fontSize: 52, bold: true, valign: 'middle' });
    K.text(s, 'AI 서비스 풀스택 개발자', { x: M, y: 2.6, w: 6.5, h: 0.45, fontSize: 20, bold: true, color: C.mid, valign: 'middle' });
    K.text(s, 'ML 모델 학습, API 서빙, 화면 구현을\n한 프로젝트 안에서 함께 다뤄 왔습니다',
      { x: M, y: 3.25, w: 6.6, h: 1.05, fontSize: 24, bold: true, lineSpacingMultiple: 1.15 });

    const courses = [
      [C.ai, 'AI 기반 서비스 개발 심화 과정', '2026.06 ~ 2026.08'],
      [C.kdc, 'Java 기반 풀스택 웹 개발자 과정', '2025.12 ~ 2026.06'],
      [C.web, '웹 디자이너 과정', '2025.06 ~ 2025.08'],
    ];
    let cy = 4.75;
    for (const [tone, name, period] of courses) {
      K.circle(s, M, cy + 0.1, 0.13, tone);
      K.text(s, name, { x: M + 0.3, y: cy, w: 3.5, h: 0.33, fontSize: 12.5, bold: true, valign: 'middle' });
      K.text(s, period, { x: M + 3.85, y: cy, w: 2.2, h: 0.33, fontSize: 11, color: C.muted, fontFace: MONO, valign: 'middle' });
      cy += 0.44;
    }
    K.text(s, [{ text: 'github.com/soeun-yu', options: { hyperlink: { url: 'https://github.com/soeun-yu' } } }],
      { x: M + 0.3, y: 6.35, w: 3, h: 0.3, fontSize: 11, color: C.accent2, bold: true, fontFace: MONO, valign: 'middle' });
    s.addImage({ data: await icon('LuGithub', C.accent2), x: M, y: 6.405, w: 0.19, h: 0.19 });

    await K.browser(s, asset('workflow/dashboard-home.jpg'), 7.25, 1.6, 5.48, 3.4, { url: 'workflow-ai · /dashboard', anchor: 'left' });
    const float = async (ic, label, val, tone, x, y) => {
      const w = textW(label, 10.5) + textW(val, 11.5) + 0.8;
      K.rect(s, x, y, w, 0.46, { fill: C.surf, line: C.border, r: 0.12, shadow: true });
      s.addImage({ data: await icon(ic, tone), x: x + 0.14, y: y + 0.13, w: 0.2, h: 0.2 });
      K.text(s, [{ text: label + '  ', options: { color: tone, bold: true } }, { text: val, options: { color: C.accent2, bold: true, fontFace: MONO, fontSize: 11.5 } }],
        { x: x + 0.42, y, w: w - 0.46, h: 0.46, fontSize: 10.5, valign: 'middle' });
    };
    await float('LuMonitor', '담당 화면', '9', C.ai, 10.95, 1.2);
    await float('LuServer', 'ML 서빙', 'FastAPI', C.accent3, 6.85, 4.3);
    await float('LuCode', 'REST API', '10', C.kdc, 10.75, 4.78);
  }

  // ───────────── 2. 목차 ─────────────
  {
    const s = pres.addSlide();
    await T.background(s, 'glow', C.accent);
    T.header(s, { tag: 'Contents', title: '목차' });
    const left = [['01', '한눈에 보기'], ['02', '주로 맡은 역할'], ['03', '프로젝트 진행 순서'], ['04', '기술 스택'], ['08', '작업 방식']];
    let y = 1.75;
    left.forEach(([n, t], i) => {
      if (i === 4) y += 0.2;
      K.text(s, n, { x: M, y, w: 0.7, h: 0.62, fontSize: 20, bold: true, color: C.accent2, fontFace: MONO, valign: 'middle' });
      K.text(s, t, { x: M + 0.8, y, w: 4, h: 0.62, fontSize: 16, bold: true, valign: 'middle' });
      if (i !== 3 && i !== left.length - 1) s.addShape(pres.shapes.LINE, { x: M, y: y + 0.66, w: 4.6, h: 0, line: { color: C.border, width: 0.75 } });
      y += 0.7;
    });
    const parts = [
      ['05', 'PART 1', 'AI 기반 서비스 개발 심화 과정', C.ai, ['WorkFlow AI', 'Curatio', 'artClassifier', '게이머 고립도 예측']],
      ['06', 'PART 2', 'Java 기반 풀스택 웹 개발자 과정', C.kdc, ['3H Furniture', 'PPAP', '너와 함께']],
      ['07', 'PART 3', '웹 디자이너 과정', C.web, ['할리스커피', '오늘의집']],
    ];
    let py = 1.75;
    const px = 5.9, pw = W - M - px;
    for (const [n, label, title, tone, projs] of parts) {
      K.rect(s, px, py, pw, 1.55, { fill: C.surf, line: C.border, r: 0.16 });
      K.text(s, n, { x: px + 0.3, y: py + 0.26, w: 0.7, h: 0.5, fontSize: 20, bold: true, color: tone, fontFace: MONO, valign: 'middle' });
      K.chip(s, label, px + 1.05, py + 0.36, { fill: tint(tone, 0.14), line: tint(tone, 0.4), color: tone, bold: true, pt: 9, h: 0.27 });
      K.text(s, title, { x: px + 1.95, y: py + 0.26, w: pw - 2.2, h: 0.5, fontSize: 16, bold: true, valign: 'middle' });
      K.chips(s, projs, px + 1.05, py + 0.92, pw - 1.35, { pt: 10, h: 0.3, color: C.mid });
      py += 1.55 + 0.2;
    }
    T.footer(s, '');
  }

  // ───────────── 3. 한눈에 보기 ─────────────
  {
    const s = pres.addSlide();
    await T.background(s, 'glow', C.accent);
    T.header(s, { tag: 'About', title: '한눈에 보기' });
    const sum3 = [
      'React · Spring Boot · FastAPI로 AI 웹 서비스를 개발했습니다.',
      '팀 프로젝트 WorkFlow AI에서 대시보드를 맡아 화면 9개, REST API 10개, ML 모델 2종을 구현했습니다. ML 서버 호출이 실패할 때의 처리 방식도 모델별로 정했습니다.',
      'ML · DL · LLM 개인 프로젝트 3건을 진행했습니다. 회화 사조 분류 모델의 테스트 정확도는 94.5%(5-fold 평균 84.8%)였고, 작품 벡터 42,500건으로 유사도 검색을 구성했습니다.',
    ];
    let y = 1.75;
    const tw = 6.75;
    sum3.forEach((t, i) => {
      K.rect(s, M, y + 0.02, 0.36, 0.36, { fill: tint(C.accent2, 0.14, C.bg), line: tint(C.accent2, 0.3, C.bg), r: 0.09 });
      K.text(s, String(i + 1), { x: M, y: y + 0.02, w: 0.36, h: 0.36, fontSize: 11, bold: true, color: C.accent2, fontFace: MONO, align: 'center', valign: 'middle' });
      const pt = i === 0 ? 15 : 13.5;
      const h = textH(t, pt, tw, 1.45);
      K.text(s, t, { x: M + 0.55, y, w: tw, h, fontSize: pt, bold: i === 0, color: i === 0 ? C.text : C.mid, lineSpacingMultiple: 1.3 });
      y += Math.max(h, 0.4) + 0.24;
    });
    const cx = 8.25, cw = W - M - cx;
    K.rect(s, cx, 1.75, cw, 2.55, { fill: C.surf, line: C.border, r: 0.16 });
    s.addImage({ data: await icon('LuRoute', C.accent2), x: cx + 0.28, y: 1.99, w: 0.22, h: 0.22 });
    K.text(s, '학습 경로', { x: cx + 0.6, y: 1.95, w: 3, h: 0.3, fontSize: 12, bold: true, color: C.accent2, valign: 'middle' });
    const path = '웹 디자이너 과정에서 웹사이트 리뉴얼 2건으로 UI/UX와 퍼블리싱을 익힌 뒤, Java 기반 풀스택 웹 개발자 과정에서 Java 웹 팀 프로젝트 3건(JSP → React+Express → Spring Boot)을, AI 기반 서비스 개발 심화 과정에서 ML·DL·LLM 개인 프로젝트 3건과 팀 프로젝트 1건을 진행했습니다.';
    let ppt = 11;
    while (ppt > 9.5 && textH(path, ppt, cw - 0.56, 1.45) > 1.7) ppt -= 0.5;
    K.text(s, path, { x: cx + 0.28, y: 2.4, w: cw - 0.56, h: 1.75, fontSize: ppt, color: C.mid, lineSpacingMultiple: 1.28 });

    const stats = [
      ['LuFolderKanban', '9', '건', '진행한 프로젝트', '팀 4 · 개인 5'],
      ['LuLayoutDashboard', '9', '화면', 'WorkFlow AI 담당 화면', 'REST API 10개 · ML 모델 2종'],
      ['LuTarget', '94.5', '%', '사조 분류 테스트 정확도', 'ResNet-50 · 테스트 200장'],
      ['LuDatabase', '42,500', '건', '작품 특징 벡터', 'CLIP 임베딩 · ChromaDB'],
    ];
    const gap = 0.25, sw = (W - M * 2 - gap * 3) / 4, sy = 4.6, sh = 2.2;
    for (let i = 0; i < 4; i++) {
      const [ic, v, u, l, sub] = stats[i];
      const sx = M + i * (sw + gap);
      K.rect(s, sx, sy, sw, sh, { fill: C.surf, line: C.border, r: 0.16 });
      s.addImage({ data: await icon(ic, C.accent2), x: sx + 0.3, y: sy + 0.28, w: 0.3, h: 0.3 });
      K.text(s, [{ text: v, options: { fontFace: MONO, fontSize: 36, color: C.text, bold: true } }, { text: ' ' + u, options: { fontSize: 15, color: C.muted, bold: true } }],
        { x: sx + 0.3, y: sy + 0.72, w: sw - 0.5, h: 0.66, valign: 'middle' });
      K.text(s, l, { x: sx + 0.3, y: sy + 1.42, w: sw - 0.5, h: 0.32, fontSize: 13, bold: true, valign: 'middle' });
      K.text(s, sub, { x: sx + 0.3, y: sy + 1.74, w: sw - 0.5, h: 0.28, fontSize: 10.5, color: C.muted, valign: 'middle' });
    }
    T.footer(s, 'About');
  }

  // ───────────── 4. 주로 맡은 역할 ─────────────
  {
    const s = pres.addSlide();
    await T.background(s, 'glow', C.accent);
    const top = T.header(s, { tag: 'Experience', title: '주로 맡은 역할', sub: '프로젝트를 진행하며 여러 번 맡았던 역할을 네 가지로 정리했습니다. 구체적인 구현 내용은 프로젝트별 슬라이드에 있습니다.' });
    const pillars = [
      ['LuLayers', '화면 · API · DB · ML 구현', 'WorkFlow AI(6인 기능 오너제)에서 대시보드를 맡아 React 화면 9개, Spring Boot API 10개, PostgreSQL 4개 테이블 집계, FastAPI ML 서버 2개를 설계하고 연동했습니다.', ['화면 9', 'API 10', '테이블 9', 'ML 모델 2']],
      ['LuServerCog', '학습한 모델을 API로 서빙', '학습한 모델을 FastAPI로 서빙했습니다. 예측 이력 테이블, 호출 타임아웃, 장애 시 폴백 정책을 모델의 저장 방식에 따라 다르게 정해, ML 서버가 응답하지 않을 때도 대시보드 화면은 표시되도록 했습니다.', ['FastAPI 서빙', '예측 이력 적재', '실패 정책 분리', 'LangSmith 트레이싱']],
      ['LuGauge', '원인을 확인한 뒤 수정', '반복 조회로 늘어나던 DB 왕복을 한 번의 조회로 줄였습니다. 소규모 팀에서 Isolation Forest가 과부하 팀원을 탐지하지 못하는 사례를 확인해 MAD 기반 방식으로 바꿨습니다. 모델 성능은 K-fold로 다시 검증해 테스트 정확도와 함께 기록했습니다.', ['N+1 제거', '알고리즘 교체', 'K-fold 검증', 'Failure Case 분석']],
      ['LuUsers', '팀 공통 구조와 문서 작업', '6명이 같은 구조에서 작업할 수 있도록 프로젝트 계층 구조를 제안했고, 팀 표준으로 확정되었습니다. 착수보고서의 개발 수행 계획(역할 분담·일정·협업 방식)을 작성했습니다.', ['프로젝트 계층 구조', '착수보고서 작성', 'PR 자동 점검', 'Jira · Slack 연동']],
    ];
    const gap = 0.24, cw = (W - M * 2 - gap) / 2, ch = (H - 0.62 - top - gap) / 2;
    for (let i = 0; i < 4; i++) {
      const [ic, t, d, proof] = pillars[i];
      const x = M + (i % 2) * (cw + gap), y = top + Math.floor(i / 2) * (ch + gap);
      K.rect(s, x, y, cw, ch, { fill: C.surf, line: C.border, r: 0.16 });
      K.text(s, '0' + (i + 1), { x: x + cw - 1.3, y: y + 0.12, w: 1.1, h: 0.62, fontSize: 36, bold: true, color: mix(C.text, C.surf, 0.1), fontFace: MONO, align: 'right' });
      await K.iconTile(s, ic, x + 0.28, y + 0.26, 0.5, C.accent2);
      K.text(s, t, { x: x + 0.94, y: y + 0.26, w: cw - 2.3, h: 0.5, fontSize: 16, bold: true, valign: 'middle' });
      const dw = cw - 0.56, dAvail = ch - 0.96 - 0.62;
      let pt = 11.5;
      while (pt > 9.5 && textH(d, pt, dw, 1.45) > dAvail) pt -= 0.5;
      K.text(s, d, { x: x + 0.28, y: y + 0.94, w: dw, h: dAvail, fontSize: pt, color: C.mid, lineSpacingMultiple: 1.25 });
      K.chips(s, proof, x + 0.28, y + ch - 0.5, dw, { pt: 9.5, h: 0.27, r: 0.07, color: C.mid });
    }
    T.footer(s, 'Experience');
  }

  // ───────────── 5. 프로젝트 진행 순서 ─────────────
  {
    const s = pres.addSlide();
    await T.background(s, 'glow', C.accent);
    T.header(s, { tag: 'Growth Path', title: '프로젝트 진행 순서', sub: '2025.06부터 2026.08까지 진행한 프로젝트 9건입니다. 웹 디자인에서 시작해 JSP, React + Express, Spring Boot, AI 서비스 순으로 사용 기술이 바뀌었습니다.' });
    const items = [
      ['web', '2025.06', '오늘의집 리뉴얼', 'SWOT · 페르소나 분석\n메인 · 커뮤니티 IA 재설계'],
      ['web', '2025.07', '할리스커피 리뉴얼', '브랜드 아이덴티티 개편\njQuery 동적 인터랙션'],
      ['kdc', '2026.02', '너와 함께', 'JSP · Servlet · JDBC\n세션 인증과 마이페이지 담당'],
      ['kdc', '2026.03', 'PPAP', 'React · Express · MongoDB\nJWT 인증과 회원 도메인 담당'],
      ['kdc', '2026.05', '3H Furniture', 'Spring Boot · Security · JPA\n메인 페이지와 OAuth2 인증 담당'],
      ['ai', '2026.06', '게이머 고립도 예측', '회귀 모델 5종 비교\nR² 0.801'],
      ['ai', '2026.06', 'artClassifier', '전이학습 3종 비교 · MLflow\n테스트 정확도 94.5%'],
      ['ai', '2026.07', 'Curatio', 'CLIP · ChromaDB · RAG\n작품 벡터 42,500건 구축'],
      ['ai', '2026.07', 'WorkFlow AI', 'React · Spring Boot · FastAPI\n화면 9 · API 10 · ML 2종'],
    ];
    const tone = { web: C.web, kdc: C.kdc, ai: C.ai };
    const railY = 4.0, x0 = M + 1.25, x1 = W - M - 1.25, step = (x1 - x0) / 8;
    const xs = items.map((_, i) => x0 + i * step);
    const seg = (a, b, col) => K.rect(s, a, railY - 0.025, b - a, 0.05, { fill: mix(col, C.bg, 0.55), line: null, r: 0 });
    seg(x0 - 0.5, (xs[1] + xs[2]) / 2, C.web);
    seg((xs[1] + xs[2]) / 2, (xs[4] + xs[5]) / 2, C.kdc);
    seg((xs[4] + xs[5]) / 2, x1 + 0.5, C.ai);
    const bw = 2.3;
    items.forEach(([tr, d, t, nt], i) => {
      const cx = xs[i], col = tone[tr], up = i % 2 === 0;
      const stemCol = mix(col, C.bg, 0.45);
      if (up) {
        s.addShape(pres.shapes.LINE, { x: cx, y: 3.6, w: 0, h: railY - 0.16 - 3.6, line: { color: stemCol, width: 1 } });
        K.text(s, d, { x: cx - bw / 2, y: 2.4, w: bw, h: 0.24, fontSize: 10.5, bold: true, color: C.muted, fontFace: MONO, align: 'center' });
        K.text(s, t, { x: cx - bw / 2, y: 2.65, w: bw, h: 0.32, fontSize: 13, bold: true, align: 'center', valign: 'middle' });
        K.text(s, nt, { x: cx - bw / 2, y: 3.01, w: bw, h: 0.52, fontSize: 10, color: C.mid, align: 'center', lineSpacingMultiple: 1.2 });
      } else {
        s.addShape(pres.shapes.LINE, { x: cx, y: railY + 0.16, w: 0, h: 0.26, line: { color: stemCol, width: 1 } });
        K.text(s, d, { x: cx - bw / 2, y: 4.5, w: bw, h: 0.24, fontSize: 10.5, bold: true, color: C.muted, fontFace: MONO, align: 'center' });
        K.text(s, t, { x: cx - bw / 2, y: 4.75, w: bw, h: 0.32, fontSize: 13, bold: true, align: 'center', valign: 'middle' });
        K.text(s, nt, { x: cx - bw / 2, y: 5.11, w: bw, h: 0.86, fontSize: 10, color: C.mid, align: 'center', lineSpacingMultiple: 1.2 });
      }
      K.circle(s, cx - 0.15, railY - 0.15, 0.3, C.bg, { color: col, width: 1.75 });
      K.circle(s, cx - 0.08, railY - 0.08, 0.16, col);
    });
    const legend = [[C.web, '웹 디자이너 과정', '2025.06 ~ 08'], [C.kdc, 'Java 기반 풀스택 웹 개발자 과정', '2025.12 ~ 2026.06'], [C.ai, 'AI 기반 서비스 개발 심화 과정', '2026.06 ~ 08']];
    const lws = legend.map(([, n, p]) => textW(n, 10.5) * 1.08 + textW(p, 9.5) + 0.95);
    let lx = (W - (lws.reduce((a, b) => a + b, 0) + 0.2 * 2)) / 2;
    legend.forEach(([col, n, p], i) => {
      K.rect(s, lx, 6.3, lws[i], 0.36, { fill: C.surf, line: C.border, r: 0.18 });
      K.circle(s, lx + 0.16, 6.3 + 0.12, 0.12, col);
      K.text(s, [{ text: n + '  ', options: { bold: true, color: C.text } }, { text: p, options: { color: C.muted, fontFace: MONO, fontSize: 9.5 } }],
        { x: lx + 0.36, y: 6.3, w: lws[i] - 0.4, h: 0.36, fontSize: 10.5, valign: 'middle' });
      lx += lws[i] + 0.2;
    });
    T.footer(s, 'Growth Path');
  }

  // ───────────── 6–7. 기술 스택 ─────────────
  const stack = {
    fe: ['Frontend', 'LuMonitor', C.accent3, [
      ['React', '대시보드 9화면 · 매물 탐색 · 가구몰 메인', 'WorkFlow AI · PPAP · 3H'],
      ['TypeScript', '대시보드 응답 DTO 타입 정의', 'WorkFlow AI'],
      ['Vite', '프론트엔드 개발 서버 · 빌드', 'WorkFlow AI'],
      ['Tailwind CSS', '대시보드 카드·배지 반응형 레이아웃', 'WorkFlow AI'],
      ['MUI · Bootstrap', '매물 입력 폼 · 가구몰 화면 컴포넌트', 'PPAP · 3H'],
      ['Recharts', '진행률·업무량 차트', 'WorkFlow AI'],
      ['JSP · JSTL', '회원 인증 · 마이페이지 화면', '너와 함께'],
    ]],
    be: ['Backend', 'LuServer', C.kdc, [
      ['Java', '대시보드 집계 로직 · 회원 도메인', 'WorkFlow AI · 3H'],
      ['Spring Boot', '대시보드 API 10개 · 상품 조회 API', 'WorkFlow AI · 3H'],
      ['Spring Security', 'OAuth2 소셜 로그인 · 권한 분리', '3H Furniture'],
      ['Spring Data JPA', '업무·마일스톤·회원 테이블 접근', '3H · WorkFlow AI'],
      ['JWT', '토큰 인증 · 보호 라우트 검증', 'PPAP · WorkFlow AI'],
      ['Node.js · Express', '매물·회원·상담 예약 REST API', 'PPAP'],
      ['Servlet · JDBC', '세션 로그인 · DTO/DAO 계층', '너와 함께'],
    ]],
    ai: ['AI / ML', 'LuBrain', C.ai, [
      ['Python', 'ML 모델 학습 · FastAPI 서빙', '전 AI 프로젝트'],
      ['FastAPI', '지연 위험도·업무 편중 예측 서버', 'WorkFlow AI'],
      ['TensorFlow · Keras', '회화 사조 분류 모델 학습', 'artClassifier'],
      ['scikit-learn', '회귀 모델 비교 · MAD 이상치 탐지', 'ML 개인 · WorkFlow AI'],
      ['MLflow', '전이학습 8개 trial 기록·비교', 'artClassifier'],
      ['CLIP · ChromaDB', '작품 벡터 42,500건 유사도 검색', 'Curatio'],
      ['Ollama · Gemma', 'RAG 근거 기반 도슨트 해설 생성', 'Curatio'],
      ['LangSmith', '업무 편중 계산 흐름 트레이싱', 'WorkFlow AI'],
      ['Streamlit', '사조 예측·작품 추천 프로토타입', 'artClassifier · Curatio'],
    ]],
    db: ['Database', 'LuDatabase', C.web, [
      ['PostgreSQL · Supabase', '업무·활동·ML 예측 이력 저장', 'WorkFlow AI'],
      ['Oracle DB', '상품·회원·게시판 테이블 (3H: Cloud ADB)', '3H · 너와 함께'],
      ['MongoDB · Mongoose', '매물·이미지·상담 예약 스키마', 'PPAP'],
      ['pgvector', '문서 임베딩 저장 · 유사도 검색', 'WorkFlow AI'],
    ]],
    co: ['협업 · 품질', 'LuGitBranch', C.accent2, [
      ['Git · GitHub', 'feature 브랜치 전략 · PR 리뷰', '전 프로젝트'],
      ['GitHub Actions', 'PR 자동 점검 · 팀 알림', 'WorkFlow AI'],
      ['Vitest', '대시보드 훅·유틸 회귀 테스트', 'WorkFlow AI'],
      ['JUnit · MockMvc', '집계 API · 권한 검증 테스트', 'WorkFlow AI'],
      ['pytest', 'ML 예측 로직 테스트', 'WorkFlow AI'],
      ['Jira · Discord · Slack', '이슈 추적 · PR 알림봇 연동', 'WorkFlow AI'],
    ]],
  };
  // 한 줄 = 기술명 | 활용 | 사용 프로젝트
  async function stackCard(s, [name, ic, tone, rows], x, y, w, h, o = {}) {
    K.rect(s, x, y, w, h, { fill: C.surf, line: C.border, r: 0.16 });
    const head = o.head || 0.76, ty = y + (head - 0.4) / 2 + 0.02;
    await K.iconTile(s, ic, x + 0.26, ty, 0.4, tone);
    K.text(s, name.toUpperCase(), { x: x + 0.8, y: ty, w: w - 1.1, h: 0.4, fontSize: 11.5, bold: true, color: tone, charSpacing: 1.5, valign: 'middle' });
    const rh = (h - head - 0.14) / rows.length;
    const [nw, uw, pw] = o.cols;
    rows.forEach(([n, u, p], i) => {
      const ry = y + head + i * rh;
      if (i > 0) s.addShape(pres.shapes.LINE, { x: x + 0.26, y: ry, w: w - 0.52, h: 0, line: { color: C.borderSoft, width: 0.75 } });
      const x0 = x + 0.26;
      K.text(s, n, { x: x0, y: ry, w: nw, h: rh, fontSize: fitPt(n, nw - 0.12, o.pt + 0.5, 8.5, 1.1), bold: true, valign: 'middle' });
      const upt = o.wrap ? o.pt : fitPt(u, uw - 0.12, o.pt, 8.5);
      K.text(s, u, { x: x0 + nw, y: ry, w: uw, h: rh, fontSize: upt, color: C.mid, valign: 'middle', lineSpacingMultiple: 1.05 });
      const ppt = fitPt(p, pw - 0.02, o.pt - 1, 7.5);
      K.text(s, p, { x: x0 + nw + uw, y: ry, w: pw, h: rh, fontSize: ppt, color: C.muted, align: 'right', valign: 'middle', lineSpacingMultiple: 1.05 });
    });
  }
  {
    const s = pres.addSlide();
    await T.background(s, 'glow', C.accent);
    const top = T.header(s, { tag: 'Tech Stack', title: '기술 스택 · Frontend / Backend', sub: '각 기술로 무엇을 만들었는지와, 어떤 프로젝트에서 썼는지를 함께 적었습니다.' });
    const gap = 0.24, cw = (W - M * 2 - gap) / 2, ch = H - 0.62 - top;
    const cols = [1.55, 2.4, cw - 0.52 - 1.55 - 2.4];
    await stackCard(s, stack.fe, M, top, cw, ch, { cols, pt: 10.5, wrap: true });
    await stackCard(s, stack.be, M + cw + gap, top, cw, ch, { cols, pt: 10.5, wrap: true });
    T.footer(s, 'Tech Stack');
  }
  {
    const s = pres.addSlide();
    await T.background(s, 'glow', C.accent);
    const top = T.header(s, { tag: 'Tech Stack', title: '기술 스택 · AI/ML · Database · 협업', sub: '프로젝트에서 사용한 AI/ML · 데이터베이스 · 테스트 · 협업 도구입니다.' });
    const gap = 0.24, cw = (W - M * 2 - gap) / 2, ch = H - 0.62 - top;
    await stackCard(s, stack.ai, M, top, cw, ch, { cols: [1.7, 2.45, cw - 0.52 - 1.7 - 2.45], pt: 10.5, wrap: true });
    const dbH = 0.62 + 0.14 + 4 * 0.33;
    const rx = M + cw + gap;
    const cols = [1.8, 2.4, cw - 0.52 - 1.8 - 2.4];
    await stackCard(s, stack.db, rx, top, cw, dbH, { cols, pt: 10, head: 0.62 });
    await stackCard(s, stack.co, rx, top + dbH + 0.2, cw, ch - dbH - 0.2, { cols, pt: 10, head: 0.62 });
    T.footer(s, 'Tech Stack');
  }
};
