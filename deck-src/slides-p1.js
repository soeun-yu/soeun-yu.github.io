// PART 1 · AI 기반 서비스 개발 심화 과정
const L = require('./lib');
const { W, H, M, F, MONO, C, asset, tint, mix, textW, textH, icon, meta } = L;

module.exports = async function part1(pres, K, T) {
  const tone = C.ai;
  const FOOT = 'PART 1 · AI 기반 서비스 개발 심화 과정';

  // 파트 표지 — PART 2·3에서도 재사용
  T.partDivider = async function (s, d) {
    await T.background(s, 'part', d.tone);
    K.chip(s, 'PART ' + d.n, M, 0.95, { fill: tint(d.tone, 0.16, C.bg), line: tint(d.tone, 0.45, C.bg), color: d.tone, bold: true, pt: 11, h: 0.34 });
    K.text(s, d.title, { x: M, y: 1.42, w: 11.5, h: 0.85, fontSize: 40, bold: true, valign: 'middle' });
    const dh = textH(d.desc, 14, 10.5, 1.4);
    K.text(s, d.desc, { x: M, y: 2.35, w: 10.5, h: dh, fontSize: 14, color: C.mid, lineSpacingMultiple: 1.25 });
    const py = 2.35 + dh + 0.14;
    s.addImage({ data: await icon('LuCalendar', d.tone), x: M, y: py + 0.06, w: 0.2, h: 0.2 });
    K.text(s, d.period, { x: M + 0.32, y: py, w: 6, h: 0.32, fontSize: 12, bold: true, color: d.tone, valign: 'middle' });

    const y0 = Math.max(3.75, py + 0.62), ch = H - 0.65 - y0, gap = 0.24, n = d.cards.length;
    const cw = (W - M * 2 - gap * (n - 1)) / n, th = 1.3;
    for (let i = 0; i < n; i++) {
      const c = d.cards[i], x = M + i * (cw + gap);
      K.rect(s, x, y0, cw, ch, { fill: C.surf, line: C.border, r: 0.14 });
      if (c.file) {
        s.addImage({ data: await L.crop(c.file, (cw - 0.24) / th, c.anchor || 'top'), x: x + 0.12, y: y0 + 0.12, w: cw - 0.24, h: th });
      } else {
        K.rect(s, x + 0.12, y0 + 0.12, cw - 0.24, th, { fill: tint(d.tone, 0.1), line: null, r: 0.06 });
        s.addImage({ data: await icon(c.icon, d.tone), x: x + cw / 2 - 0.3, y: y0 + 0.12 + th / 2 - 0.3, w: 0.6, h: 0.6 });
      }
      let bx = x + 0.24;
      for (const b of c.badges) {
        const star = b === '대표작';
        bx += K.chip(s, b, bx, y0 + th + 0.28, star
          ? { fill: C.accent, line: C.accent, color: C.white, bold: true, pt: 8.5, h: 0.24 }
          : { fill: tint(d.tone, 0.14), line: tint(d.tone, 0.4), color: d.tone, bold: true, pt: 8.5, h: 0.24 }) + 0.06;
      }
      let tpt = 15;
      while (tpt > 11 && textW(c.title, tpt) * 1.12 > cw - 0.48) tpt -= 0.5;
      K.text(s, c.title, { x: x + 0.24, y: y0 + th + 0.6, w: cw - 0.48, h: 0.36, fontSize: tpt, bold: true, valign: 'middle' });
      const sy = y0 + th + 1.0, avail = y0 + ch - 0.14 - sy;
      let pt = 10.5;
      while (pt > 9 && textH(c.sub, pt, cw - 0.48, 1.45) > avail) pt -= 0.5;
      K.text(s, c.sub, { x: x + 0.24, y: sy, w: cw - 0.48, h: avail, fontSize: pt, color: C.mid, lineSpacingMultiple: 1.22 });
    }
    T.footer(s, d.footer);
  };

  // 캡션 한 줄
  const caption = (s, t, x, y, w, align = 'left') =>
    K.text(s, t, { x, y, w, h: 0.26, fontSize: 10, color: C.muted, align, valign: 'middle' });

  // 오른쪽 설명 패널: 소개 문단 + 항목(제목 · 설명) + 하단 메모. 글자 크기는 패널 높이에 맞춰 줄인다
  T.descPanel = async function (s, x, y, w, h, { icon: ic, title, intro, rows = [], note, tone: tn = tone, maxPt = 12 }) {
    K.rect(s, x, y, w, h, { fill: C.surf, line: C.border, r: 0.14 });
    // k: 한글 줄바꿈이 추정보다 일찍 일어나므로 폭을 보수적으로 잡는다
    const px = x + 0.28, pw = w - 0.56, rowX = px + 0.22, rowW = pw - 0.22, k = 0.84;
    s.addImage({ data: await icon(ic, tn), x: px, y: y + 0.28, w: 0.22, h: 0.22 });
    K.text(s, title, { x: px + 0.34, y: y + 0.23, w: pw - 0.34, h: 0.32, fontSize: 13.5, bold: true, color: tn, valign: 'middle' });
    const noteH = (pt) => (note ? textH(note, pt - 0.5, (pw - 0.36) * k, 1.45) + 0.3 : 0);
    const measure = (pt) => {
      let t = intro ? textH(intro, pt, pw * k, 1.45) + 0.22 : 0;
      for (const r of rows) t += L.lineH(pt + 0.5, 1.35) + 0.03 + textH(r.d, pt - 0.5, rowW * k, 1.45) + 0.18;
      return t + (note ? noteH(pt) + 0.12 : 0);
    };
    const avail = h - 0.8 - 0.24;
    let pt = maxPt;
    while (pt > 9 && measure(pt) > avail) pt -= 0.5;
    if (measure(pt) > avail) console.warn(`descPanel overflow: "${title}" needs ${measure(pt).toFixed(2)}in, has ${avail.toFixed(2)}in`);
    let cy = y + 0.8;
    if (intro) {
      const ih = textH(intro, pt, pw * k, 1.45);
      K.text(s, intro, { x: px, y: cy, w: pw, h: ih, fontSize: pt, color: C.text, lineSpacingMultiple: 1.28 });
      cy += ih + 0.22;
    }
    for (const r of rows) {
      const lh = L.lineH(pt + 0.5, 1.35);
      K.circle(s, px + 0.01, cy + lh / 2 - 0.045, 0.09, r.col || tn);
      K.text(s, r.t, { x: rowX, y: cy, w: rowW, h: lh, fontSize: pt + 0.5, bold: true, valign: 'middle' });
      cy += lh + 0.03;
      const dh = textH(r.d, pt - 0.5, rowW * k, 1.45);
      K.text(s, r.d, { x: rowX, y: cy, w: rowW, h: dh, fontSize: pt - 0.5, color: C.mid, lineSpacingMultiple: 1.28 });
      cy += dh + 0.18;
    }
    if (note) {
      const nh = noteH(pt), ny = y + h - 0.24 - nh;
      K.rect(s, px, ny, pw, nh, { fill: tint(tn, 0.1), line: tint(tn, 0.35), r: 0.1 });
      K.text(s, note, { x: px + 0.18, y: ny, w: pw - 0.36, h: nh, fontSize: pt - 0.5, color: C.text, valign: 'middle', lineSpacingMultiple: 1.28 });
    }
  };

  // ───────────── PART 1 표지 ─────────────
  await T.partDivider(pres.addSlide(), {
    n: 1, tone, footer: FOOT,
    title: 'AI 기반 서비스 개발 심화 과정',
    desc: 'ML · DL · LLM 개인 프로젝트 3건과, 이를 서비스 기능으로 구현한 팀 프로젝트 1건입니다.',
    period: '2026.06 ~ 2026.08 · 프로젝트 4건',
    cards: [
      { title: 'WorkFlow AI', sub: '회의·업무·기록·평가를 AI가 하나의 흐름으로 잇는 협업 플랫폼', badges: ['대표 프로젝트', '팀'], file: asset('workflow/dashboard-home.jpg'), anchor: 'left' },
      { title: 'Curatio', sub: '회화 이미지를 벡터로 검색하고, LLM이 도슨트처럼 해설해 주는 미술 감상 서비스', badges: ['개인', 'ML + DL + LLM'], file: asset('curatio/hero.jpg'), anchor: 'center' },
      { title: 'artClassifier', sub: '회화 이미지를 5개 미술 사조로 분류하는 딥러닝 모델', badges: ['개인', 'DL'], file: asset('artclassifier/streamlit-predict.png'), anchor: 'top' },
      { title: '온라인 게이머 사회적 고립도 예측', sub: '행동·수면·정서 데이터로 사회적 고립 수준을 예측하는 회귀 모델', badges: ['개인', 'ML'], icon: 'LuChartBar' },
    ],
  });

  // ───────────── WorkFlow AI ─────────────
  await T.projectCover(pres.addSlide(), {
    tone, footer: FOOT, part: 'PART 1 · AI 기반 서비스 개발 심화 과정',
    badges: ['대표 프로젝트', '팀'], title: 'WorkFlow AI',
    sub: '팀 프로젝트의 회의·업무·기록·평가를 AI가 하나의 흐름으로 잇는 협업 플랫폼',
    period: '2026.07.06 ~ 08.05 (4주)', team: '3팀 · 6인 기능 오너제', role: 'FS-3 대시보드 담당 — 화면 · API · DB · ML',
    links: [
      { t: 'GitHub', icon: 'LuGithub', url: 'https://github.com/rhantj/work-flow' },
      { t: '시연 영상', icon: 'LuPlay', url: 'https://youtu.be/D5jy2qbKh7g' },
    ],
    metrics: [{ v: '9', l: '담당 화면' }, { v: '13', l: 'REST API' }, { v: '2', l: 'ML 모델' }, { v: '5', l: '데이터 훅' }],
    position: '회의록 AI가 만든 To-Do가 업무보드에 반영되면, 대시보드는 그 업무·활동 데이터로 지연 위험도와 업무 편중도를 계산해 보여줍니다. 다른 기능에서 쌓인 데이터를 조회·분석하는 부분입니다.',
    visual: (s, x, y, w, h) => K.browser(s, asset('workflow/dashboard-home.jpg'), x, y, w, h, { url: 'workflow-ai · /dashboard', anchor: 'left' }),
  });

  {
    const s = pres.addSlide();
    await T.background(s, 'glow', tone);
    const top = T.header(s, { tag: 'WorkFlow AI · 담당 기능', title: '대시보드 담당 기능', tone });
    await T.featureGrid(s, [
      { icon: 'LuLayoutDashboard', t: '대시보드 홈 + 상세 8화면', d: '진행률 분석 · 블로커 관리 · 마감 임박 · 팀원별 업무량 · 최근 활동 · 전체 업무 관리를 역할(팀장/팀원)에 따라 다르게 노출' },
      { icon: 'LuServer', t: 'Spring Boot API 13개', d: '조회 6 · 마일스톤 3 · 재분석 작업 4. tasks · milestones · activities · ml_predictions 4개 테이블을 집계하고, @PreAuthorize로 팀장 전용(마일스톤 CRUD)과 멤버 권한을 분리' },
      { icon: 'LuTriangleAlert', t: 'ML 지연 위험도 예측', d: '업무별 피처 약 35개를 생성해 정상/주의/위험 3분류. 체크리스트 진행률과 경과 시간의 차이(imbalance index)로 경과 시간 대비 진행이 더딘 업무를 탐지' },
      { icon: 'LuScale', t: 'ML 업무 편중 점수', d: '팀 규모에 따라 MAD 기반 Modified Z-score와 Isolation Forest를 자동 전환. 0~100 점수와 함께 과부하 의심 / 배정량 불균형을 구분해 판정' },
      { icon: 'LuRefreshCw', t: '자동 갱신 처리', d: '15초마다 시그니처만 비교해 실제 변경이 있을 때만 갱신하므로 스크롤·선택 상태가 유지됨. 요청 세대 번호로 프로젝트 전환 시 도착한 이전 응답(stale)을 폐기' },
      { icon: 'LuFolderTree', t: '프로젝트 폴더 구조 · 문서화', d: '폴더 구조 설계를 자원해 Frontend(React) / Backend(Spring Boot) / AI Backend(FastAPI) 3계층 구조를 참고 자료와 함께 팀 채널에 공유했고, PL 검토 의견을 반영한 구조도를 다시 공유. 설계 · 개발 · 트러블슈팅 문서 14건과 착수보고서 「개발 수행 계획」 작성' },
    ], M, top, W - M * 2, H - 0.65 - top, { cols: 2, tone, pt: 11 });
    T.footer(s, FOOT);
  }

  {
    const s = pres.addSlide();
    await T.background(s, 'glow', tone);
    const top = T.header(s, { tag: 'WorkFlow AI · 수치', title: '데이터 흐름과 담당 산출물', tone });
    await T.pipeline(s, [
      { icon: 'LuMonitor', l: 'React 대시보드', s: '9개 화면 · 훅 5개' },
      { icon: 'LuShieldCheck', l: 'Spring Boot', s: '집계 · 권한 검증' },
      { icon: 'LuDatabase', l: 'PostgreSQL', s: '9개 테이블' },
      { icon: 'LuBrain', l: 'FastAPI × 2', s: '지연 위험 · 업무 편중' },
    ], M, top, W - M * 2, 1.55, tone);
    const y2 = top + 1.55 + 0.26, h2 = H - 0.65 - y2;
    T.barChart(s, { title: '담당 산출물', labels: ['Spring REST API', 'React 화면', '공통 팝업·차트', '데이터 훅', 'FastAPI ML 모델'], values: [13, 9, 6, 5, 2], x: M, y: y2, w: 6.9, h: h2, tone, fmt: '0', unit: '개', max: 15 });
    const cx = M + 6.9 + 0.24, cw = W - M - cx;
    K.rect(s, cx, y2, cw, h2, { fill: C.surf, line: C.border, r: 0.14 });
    K.text(s, '사용 기술', { x: cx + 0.26, y: y2 + 0.2, w: cw - 0.52, h: 0.3, fontSize: 12.5, bold: true });
    K.chips(s, ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS 4', 'Recharts', 'Spring Boot 3.5', 'Java 21', 'Spring Data JPA', 'FastAPI', 'scikit-learn', 'PostgreSQL · Supabase', 'LangSmith', 'GitHub Actions', 'Jira · Slack · Discord'],
      cx + 0.26, y2 + 0.66, cw - 0.52, { pt: 10.5, h: 0.32, gap: 0.1, r: 0.08, color: C.mid });
    T.footer(s, FOOT);
  }

  await T.gallery(pres.addSlide(), {
    tone, footer: FOOT, tag: 'WorkFlow AI', title: '구현 화면',
    sub: '역할(팀장/팀원)에 따라 다르게 보이는 대시보드 상세 화면입니다. 카드 데이터는 Spring Boot 집계 API와 FastAPI 예측 결과를 사용합니다.',
    cols: 2,
    shots: [
      { file: asset('workflow/workload.png'), cap: '팀원별 업무량 — ML 업무 편중 점수와 과부하 판정' },
      { file: asset('workflow/blockers.jpg'), cap: '블로커 관리 — 심각도·지속시간·지연 위험 분석' },
      { file: asset('workflow/progress.png'), cap: '전체 진행률 — 일정 대비 진행률과 마일스톤 관리' },
      { file: asset('workflow/all-tasks.jpg'), cap: '전체 업무 관리 — 검색·필터·인라인 상태 변경' },
    ],
  });

  // 시스템 구성도 — 왼쪽 이미지, 오른쪽 설명
  {
    const s = pres.addSlide();
    await T.background(s, 'glow', tone);
    const top = T.header(s, { tag: 'WorkFlow AI · 구조', title: '시스템 구성도', sub: '담당 범위: 대시보드 API(Backend API), 지연 위험도 · 업무 편중 모델(AI/ML Backend)', tone });
    const bh = H - 0.65 - top, iw = 6.3, px = M + iw + 0.26;
    await K.fitImage(s, asset('workflow/architecture.png'), M, top, iw, bh - 0.36, { pad: 0.14 });
    caption(s, '전체 시스템 구성도 — OCI Ubuntu 24.04 VM 한 대에서 컨테이너로 운영', M, top + bh - 0.28, iw);
    await T.descPanel(s, px, top, W - M - px, bh, {
      icon: 'LuNetwork', title: '구성',
      rows: [
        { t: 'Frontend', d: 'Nginx · React(TypeScript · Vite · Tailwind). /api/* 요청을 Backend로 리버스 프록시' },
        { t: 'Backend API', d: 'Spring Boot 3.5 · Java 21, JWT · RBAC. 인증 · 업무보드 · 회의록 · 대시보드 API, FastAPI 호출' },
        { t: 'AI/ML Backend', d: 'FastAPI · Python 3.12. 회의록 분석 · To-Do 후보 추출, RAG Assistant, 지연 위험도 분석' },
        { t: '데이터 · 큐', d: 'PostgreSQL + pgvector(업무 · 회의록 · RAG 벡터), Redis(회의록 분석 비동기 큐)' },
        { t: '외부 연동 · 배포', d: "GitHub Actions(main push → OCI 배포), Let's Encrypt, Google OAuth, Supabase Storage, Hugging Face" },
      ],
    });
    T.footer(s, FOOT);
  }

  // 프로젝트 계층 구조 — 왼쪽 이미지 3장, 오른쪽 설명
  {
    const s = pres.addSlide();
    await T.background(s, 'glow', tone);
    const top = T.header(s, { tag: 'WorkFlow AI · 구조', title: '프로젝트 계층 구조', tone });
    const bh = H - 0.65 - top, panelW = 3.75, px = W - M - panelW, lw = px - 0.26 - M;
    const trees = [['folder-frontend.png', 'Frontend (React)'], ['folder-spring.png', 'Backend (Spring Boot)'], ['folder-fastapi.png', 'AI Backend (FastAPI)']];
    const gap = 0.18, cw = (lw - gap * 2) / 3, pad = 0.06;
    for (let i = 0; i < trees.length; i++) {
      const file = asset('workflow/' + trees[i][0]);
      const { w: pxW, h: pxH } = await L.meta(file);
      const ch = (cw - pad * 2) * (pxH / pxW) + pad * 2;
      const cx = M + i * (cw + gap);
      await K.fitImage(s, file, cx, top, cw, ch, { pad });
      caption(s, trees[i][1], cx, top + ch + 0.08, cw);
    }
    await T.descPanel(s, px, top, panelW, bh, {
      icon: 'LuFolderTree', title: '프로젝트 계층 구조',
      intro: '프로젝트 초반(당시 팀원 7명)에 같은 구조에서 작업할 수 있도록 3계층 구조의 방향을 참고 자료와 함께 먼저 공유했습니다. PL의 검토 의견을 반영한 구조도를 같은 날 다시 공유했고, 팀장이 일부를 수정해 프로젝트에 반영했습니다.',
      rows: [
        { t: 'Frontend (React)', d: '기능 폴더(components · hooks · libs · screen)와 공통 global 폴더(api · store · styles 등)로 구분' },
        { t: 'Backend (Spring Boot)', d: '기능 폴더 안에 entity → repository → service → DTO → controller, 공통은 global(config · queue · client · error)' },
        { t: 'AI Backend (FastAPI)', d: '공통 설정 core(config · logging · exceptions · middleware · queue)와 모델별 폴더(routers · schema · services)' },
      ],
    });
    T.footer(s, FOOT);
  }

  // WorkFlow AI 문제 해결 사례는 프로젝트 슬라이드 바로 뒤에
  await require('./slides-cases')(pres, K, T, { tone, footer: FOOT, project: 'WorkFlow AI' });

  // ───────────── Curatio ─────────────
  await T.projectCover(pres.addSlide(), {
    tone, footer: FOOT, part: 'PART 1 · AI 기반 서비스 개발 심화 과정',
    badges: ['개인', 'ML + DL + LLM'], title: 'Curatio',
    sub: '회화 이미지를 벡터로 검색하고, LLM이 도슨트처럼 해설해 주는 미술 감상 서비스',
    period: '2026.07.03 ~ 07.07 (5일)', team: '개인 프로젝트', role: '기획 · 데이터 구축 · 모델 · 앱 구현',
    chips: ['Python', 'CLIP ViT-B/32', 'ChromaDB', 'SentenceTransformer', 'Ollama · Gemma', 'RAG', 'Streamlit', 'DuckDuckGo API'],
    metrics: [{ v: '42,500', l: '작품 특징 벡터' }, { v: '6,299', l: 'RAG 문서' }, { v: '13', l: '미술 사조' }, { v: '128', l: '벡터 차원' }],
    position: '기존 분류 모델을 특징 추출기로 재활용하고, 검색 결과를 ML 추천과 LLM 해설에 연결했습니다. 한 사용자 흐름 안에서 ML·DL·LLM을 함께 사용합니다.',
    visual: async (s, x, y, w, h) => {
      const ih = h - 0.36, gap = 0.2;
      const a1 = 1280 / 1521, a2 = 976 / 1488;
      let hh = ih, w1 = hh * a1, w2 = hh * a2;
      if (w1 + w2 + gap > w) { hh = (w - gap) / (a1 + a2); w1 = hh * a1; w2 = hh * a2; }
      const x0 = x + (w - (w1 + w2 + gap)) / 2;
      s.addImage({ data: await L.crop(asset('curatio/hero.jpg'), a1), x: x0, y, w: w1, h: hh });
      s.addImage({ data: await L.crop(asset('curatio/gallery.jpg'), a2), x: x0 + w1 + gap, y, w: w2, h: hh });
      caption(s, '서비스 대표 이미지 — 페르메이르, 회화의 기술', x0, y + hh + 0.08, w1 + 0.4);
      caption(s, '도슨트 해설 컨셉', x0 + w1 + gap, y + hh + 0.08, w2);
    },
  });

  {
    const s = pres.addSlide();
    await T.background(s, 'glow', tone);
    const top = T.header(s, { tag: 'Curatio · ML + DL + LLM', title: '파이프라인과 구현 기능', tone });
    await T.pipeline(s, [
      { icon: 'LuImageUp', l: '이미지 / 키워드', s: '사용자 입력' },
      { icon: 'LuScanEye', l: 'CLIP · centroid', s: '임베딩 · 대표 벡터' },
      { icon: 'LuDatabase', l: 'ChromaDB', s: '유사도 Top-K' },
      { icon: 'LuLibrary', l: '텍스트 RAG', s: '소장품 근거 검색' },
      { icon: 'LuMessageSquareText', l: 'Gemma', s: '한국어 도슨트 해설' },
    ], M, top, W - M * 2, 1.5, tone);
    const gy = top + 1.5 + 0.24, gh = H - 0.65 - gy, gw = W - M * 2;
    await T.featureGrid(s, [
      { icon: 'LuSparkles', t: '분위기 기반 추천 (ML)', d: '감성 키워드를 미술 사조에 매핑하고, 사조별 벡터 centroid를 query로 코사인 유사도 Top-K 검색. 별도의 자연어 임베딩 학습 없이 추천 근거를 제시할 수 있음' },
      { icon: 'LuImages', t: '이미지 유사도 검색 (DL)', d: "CLIP ViT-B/32로 업로드 이미지를 임베딩해 ChromaDB에서 시각적으로 가까운 작품을 조회. 기존 분류 모델을 '특징 추출기'로 재활용" },
      { icon: 'LuBookOpen', t: '텍스트 RAG', d: '국립현대미술관·서울시립미술관 소장품 메타데이터를 다국어 임베딩으로 인덱싱해 해설의 근거로 사용' },
      { icon: 'LuBot', t: 'LLM 큐레이션', d: 'Ollama Gemma가 RAG 근거 + 이미지 후보 + 외부 검색을 종합해 한국어 해설 생성. "근거가 부족하면 확인 불가라고 답하라"는 프롬프트로 근거 없는 답변을 줄이도록 구성' },
      { icon: 'LuShieldAlert', t: '장애 대응 설계', d: '인덱스 없으면 실행 안내 표시, LLM 실패 시 규칙 기반 fallback, 외부 검색은 API 실패 시 HTML 파싱으로 이중화' },
    ], M, gy, gw, gh, { cols: 3, rows: 2, tone, pt: 10, gap: 0.2, tile: 0.38 });
    const cw = (gw - 0.2 * 2) / 3, ch = (gh - 0.2) / 2;
    T.barChart(s, { title: '구축한 벡터 인덱스', labels: ['작품 벡터 (WikiArt)', 'RAG 문서 (MMCA·SeMA)'], values: [42500, 6299], x: M + 2 * (cw + 0.2), y: gy + ch + 0.2, w: cw, h: ch, tone, fmt: '#,##0', unit: '건', max: 72000 });
    T.footer(s, FOOT);
  }

  // ───────────── artClassifier ─────────────
  await T.projectCover(pres.addSlide(), {
    tone, footer: FOOT, part: 'PART 1 · AI 기반 서비스 개발 심화 과정',
    badges: ['개인', 'DL'], title: 'artClassifier',
    sub: '회화 이미지를 5개 미술 사조로 분류하는 딥러닝 모델',
    period: '2026.06.25 ~ 07.03', team: '개인 프로젝트', role: '데이터 분석 · 전처리 · 모델 학습 · 튜닝 · 프로토타입',
    chips: ['Python', 'TensorFlow · Keras', 'ResNet50', 'EfficientNetB0', 'MLflow', 'scikit-learn', 'Streamlit'],
    metrics: [{ v: '94.5%', l: '테스트 정확도' }, { v: '0.945', l: 'weighted F1' }, { v: '8', l: 'MLflow 실험' }, { v: '84.8%', l: '5-fold 평균' }],
    position: '미술관 아카이브 분류, 작품 검색, 유사 작품 추천에 활용할 수 있는 모델입니다. 이후 Curatio에서 특징 추출기로 재사용했습니다.',
    visual: async (s, x, y, w, h) => {
      const fh = h - 0.34, fw = (fh - 0.3 - 0.035) * (590 / 554) + 0.07;
      const fx = x + (w - fw) / 2;
      await K.browser(s, asset('artclassifier/streamlit-predict.png'), fx, y, fw, fh, { url: 'streamlit · artClassifier' });
      caption(s, 'Streamlit 예측 화면 — 사조별 확률 출력', fx, y + fh + 0.08, fw, 'center');
    },
  });

  {
    const s = pres.addSlide();
    await T.background(s, 'glow', tone);
    const top = T.header(s, { tag: 'artClassifier · 담당 기능', title: '데이터 구성 · 모델 비교 · 검증', tone });
    await T.featureGrid(s, [
      { icon: 'LuDatabase', t: '데이터 구성', d: 'WikiArt 5개 사조 1,000장을 224×224 RGB로 정규화하고 train 800 / validation 200으로 8:2 분할. TensorFlow Dataset으로 shuffle · batch · prefetch 파이프라인 구성' },
      { icon: 'LuWandSparkles', t: '증강 기법 선정 기준', d: '사조를 판단하는 단서(색감·질감·구도)를 훼손하지 않는 범위로 제한 — Flip, Rotation 0.06, Zoom 0.12, Translation 0.05, Contrast 0.12' },
      { icon: 'LuGitCompare', t: '모델 3종 비교', d: 'Custom CNN(scratch) · EfficientNetB0 · ResNet50을 MLflow로 총 8개 trial 기록. validation loss 최소화와 accuracy 최대화를 동시에 기준으로 사용' },
      { icon: 'LuBadgeCheck', t: '최종 모델 검증', d: 'ResNet-50 선정 후 테스트 200장 기준 Accuracy 0.9450 / weighted F1 0.9446. 5-fold 교차검증으로 일반화 성능(평균 0.8480)을 별도 확인' },
      { icon: 'LuSearchX', t: 'Failure Case Analysis', d: 'Art Nouveau의 장식적 곡선이 Japanese Art·Western Medieval과 겹치고, Baroque의 어두운 톤이 Realism과 혼동되는 패턴을 확인. 클래스별 데이터 확충과 Grad-CAM 분석을 개선안으로 제시' },
      { icon: 'LuAppWindow', t: 'Streamlit 프로토타입', d: '이미지를 업로드하면 예측 사조와 클래스별 확률 그래프를 보여주는 앱으로 배포' },
    ], M, top, W - M * 2, H - 0.65 - top, { cols: 3, tone, pt: 11 });
    T.footer(s, FOOT);
  }

  {
    const s = pres.addSlide();
    await T.background(s, 'glow', tone);
    const top = T.header(s, { tag: 'artClassifier · 결과', title: '모델 비교와 최종 검증', tone });
    const bh = H - 0.65 - top, c1w = 3.95, ch = (bh - 0.22) / 2;
    T.barChart(s, { title: '모델별 Validation Accuracy', labels: ['Custom CNN', 'EfficientNetB0', 'ResNet50'], values: [61.0, 83.5, 84.5], x: M, y: top, w: c1w, h: ch, tone, hl: 2, fmt: '0.0', unit: '%', max: 110 });
    T.barChart(s, { title: '5-fold 교차검증 Accuracy', labels: ['Fold 1', 'Fold 2', 'Fold 3', 'Fold 4', 'Fold 5'], values: [83.0, 83.5, 87.5, 85.0, 85.0], x: M, y: top + ch + 0.22, w: c1w, h: ch, tone, hl: 2, fmt: '0.0', unit: '%', max: 100, min: 50 });

    // 혼동행렬
    const mx = M + c1w + 0.24, mw = 4.75;
    K.rect(s, mx, top, mw, bh, { fill: C.surf, line: C.border, r: 0.14 });
    K.text(s, '최종 ResNet-50 혼동행렬 (테스트 200장)', { x: mx + 0.26, y: top + 0.2, w: mw - 0.52, h: 0.3, fontSize: 12.5, bold: true });
    const cls = ['Art Nouveau', 'Baroque', 'Japanese Art', 'Realism', 'W. Medieval'];
    const mat = [[35, 1, 2, 1, 1], [0, 37, 0, 1, 2], [0, 0, 39, 0, 1], [2, 0, 0, 38, 0], [0, 0, 0, 0, 40]];
    const hdr = (t) => ({ text: t, options: { fill: { color: C.surf }, color: C.muted, fontSize: 8.5, bold: true, align: 'center', valign: 'middle' } });
    const rows = [[hdr('실제 / 예측'), ...cls.map(hdr)]];
    mat.forEach((r, i) => rows.push([
      { text: cls[i], options: { fill: { color: C.surf }, color: C.mid, fontSize: 9, bold: true, align: 'right', valign: 'middle' } },
      ...r.map((v, j) => ({ text: String(v), options: {
        fill: { color: i === j ? mix(tone, C.surf, 0.35 + (v - 34) * 0.06) : v > 0 ? tint(C.danger, 0.2) : C.surf2 },
        color: i === j ? C.white : v > 0 ? C.danger : C.muted,
        fontFace: MONO, fontSize: 12, bold: v > 0, align: 'center', valign: 'middle',
      } })),
    ]));
    const tw = mw - 0.4, firstW = 1.05, cellW = (tw - firstW) / 5, tH = bh - 1.45;
    s.addTable(rows, { x: mx + 0.2, y: top + 0.66, w: tw, colW: [firstW, ...Array(5).fill(cellW)], rowH: Array(6).fill(tH / 6), fontFace: F, border: { type: 'solid', pt: 2, color: C.surf }, margin: 0.02 });
    K.text(s, '세로 = 실제 사조, 가로 = 예측 사조 · 대각선 189 / 전체 200건 정답 (94.5%)', { x: mx + 0.26, y: top + bh - 0.66, w: mw - 0.52, h: 0.46, fontSize: 9.5, color: C.muted, lineSpacingMultiple: 1.2 });

    // 핵심 수치
    const kx = mx + mw + 0.24, kw = W - M - kx;
    const keys = [['0.9450', 'Test Accuracy', '테스트 200장 기준'], ['0.9446', 'weighted F1', '클래스별 표본 수 가중 평균'], ['0.8480', '5-fold 평균', '일반화 성능 별도 확인']];
    const kh = (bh - 0.22 * 2) / 3;
    keys.forEach(([v, l, sub], i) => {
      const ky = top + i * (kh + 0.22);
      K.rect(s, kx, ky, kw, kh, { fill: i === 0 ? tint(tone, 0.12) : C.surf, line: i === 0 ? tint(tone, 0.4) : C.border, r: 0.14 });
      K.text(s, v, { x: kx + 0.26, y: ky + 0.2, w: kw - 0.52, h: 0.6, fontSize: 28, bold: true, color: tone, fontFace: MONO, valign: 'middle' });
      K.text(s, l, { x: kx + 0.26, y: ky + 0.82, w: kw - 0.52, h: 0.3, fontSize: 12, bold: true, valign: 'middle' });
      K.text(s, sub, { x: kx + 0.26, y: ky + 1.1, w: kw - 0.52, h: 0.28, fontSize: 10, color: C.muted, valign: 'middle' });
    });
    T.footer(s, FOOT);
  }

  // 학습 곡선 — 왼쪽 이미지, 오른쪽 설명
  {
    const s = pres.addSlide();
    await T.background(s, 'glow', tone);
    const top = T.header(s, { tag: 'artClassifier · 학습 곡선', title: '모델별 학습 곡선', tone });
    const bh = H - 0.65 - top, iw = 6.3, px = M + iw + 0.26;
    await K.fitImage(s, asset('artclassifier/training-curves.png'), M, top, iw, bh - 0.36, { pad: 0.14 });
    caption(s, 'trial별 train / validation Loss · Accuracy', M, top + bh - 0.28, iw);
    await T.descPanel(s, px, top, W - M - px, bh, {
      icon: 'LuChartLine', title: '학습 곡선', maxPt: 13,
      intro: 'MLflow로 기록한 8개 trial 중 3개의 epoch별 train / validation Loss · Accuracy 곡선입니다.',
      rows: [
        { t: '07_resnet_dense128_dropout03', d: 'ResNet50 · Dense 128 · Dropout 0.3. train과 validation 곡선이 비슷한 간격을 유지하며 함께 개선됨' },
        { t: '08_resnet_unfreeze20_dense256', d: 'ResNet50 · unfreeze 20 · Dense 256. 7 epoch 이후 train loss는 계속 줄지만 validation loss는 더 줄지 않음' },
        { t: '04_efficientnet_dense128', d: 'EfficientNetB0 · Dense 128. 5~6 epoch 이후 validation accuracy가 거의 오르지 않음' },
      ],
      note: '최종 모델은 validation loss 최소화와 accuracy 최대화를 함께 기준으로 삼아 ResNet50으로 선정했습니다.',
    });
    T.footer(s, FOOT);
  }

  // 학습 데이터 — 왼쪽 이미지, 오른쪽 설명
  {
    const s = pres.addSlide();
    await T.background(s, 'glow', tone);
    const top = T.header(s, { tag: 'artClassifier · 학습 데이터', title: '학습 데이터', tone });
    const bh = H - 0.65 - top, iw = 6.3, px = M + iw + 0.26;
    await K.fitImage(s, asset('artclassifier/dataset-samples.png'), M, top, iw, bh - 0.36, { pad: 0.14 });
    caption(s, '학습 데이터 샘플', M, top + bh - 0.28, iw);
    await T.descPanel(s, px, top, W - M - px, bh, {
      icon: 'LuImages', title: '데이터 구성', maxPt: 13,
      intro: 'WikiArt 5개 사조 이미지 1,000장을 224×224 RGB로 정규화하고 train 800 / validation 200으로 8:2 분할했습니다.',
      rows: [
        { t: '분류 대상 사조', d: 'Art Nouveau · Baroque · Japanese Art · Realism · Western Medieval' },
        { t: '입력 파이프라인', d: 'TensorFlow Dataset으로 shuffle · batch · prefetch 구성' },
        { t: '데이터 증강', d: 'Flip, Rotation 0.06, Zoom 0.12, Translation 0.05, Contrast 0.12. 사조를 판단하는 단서(색감 · 질감 · 구도)를 훼손하지 않는 범위로 제한' },
      ],
    });
    T.footer(s, FOOT);
  }

  // ───────────── 게이머 고립도 예측 ─────────────
  const models = ['다중선형회귀', '랜덤포레스트', 'Elastic Net', 'XGBoost', '결정트리'];
  await T.projectCover(pres.addSlide(), {
    tone, footer: FOOT, part: 'PART 1 · AI 기반 서비스 개발 심화 과정',
    badges: ['개인', 'ML'], title: '온라인 게이머 사회적 고립도 예측',
    sub: '게이머의 행동·수면·정서 데이터로 사회적 고립 수준을 예측하는 회귀 모델',
    period: '2026.06.22 ~ 06.25', team: '개인 프로젝트', role: 'EDA · 전처리 · 모델 비교 · 평가',
    chips: ['Python', 'pandas', 'scikit-learn', 'XGBoost', 'matplotlib', 'Jupyter'],
    metrics: [{ v: '0.801', l: 'R² (최고)' }, { v: '0.961', l: 'RMSE' }, { v: '26', l: '입력 피처' }, { v: '5', l: '비교 모델' }],
    position: '게임 이용 패턴 데이터로 사회적 고립 수준을 예측하는 회귀 모델입니다. 데이터 확인부터 모델 평가까지 개인 프로젝트로 진행했습니다.',
    visual: (s, x, y, w, h) => T.barChart(s, { title: '모델별 R² (높을수록 좋음)', labels: models, values: [0.801, 0.794, 0.790, 0.762, 0.590], x, y, w, h, tone, hl: 0, fmt: '0.000', max: 0.95 }),
  });

  {
    const s = pres.addSlide();
    await T.background(s, 'glow', tone);
    const top = T.header(s, { tag: '게이머 고립도 예측 · 분석 과정', title: '분석 과정과 모델 비교', tone });
    const bh = H - 0.65 - top, lw = 7.2;
    await T.featureGrid(s, [
      { icon: 'LuListChecks', t: '피처 설계', d: '일일 게임 시간, 수면 시간·질, 학업/업무 성과, 기분 변화, 금단 증상, 대면 사회활동 시간 등 26개 변수로 사회적 고립도(1~10)를 예측' },
      { icon: 'LuSlidersHorizontal', t: '전처리', d: '범주형(gender, headset_usage)과 연속형 변수를 분리해 인코딩·스케일링 경로를 다르게 구성' },
      { icon: 'LuGitCompare', t: '5개 모델 비교', d: '다중선형회귀 · Elastic Net · 결정트리 · 랜덤포레스트 · XGBoost를 동일 조건에서 학습하고 RMSE · MAE · R²로 비교' },
      { icon: 'LuTrophy', t: '지표별 최적 모델 비교', d: 'R² 기준으로는 다중선형회귀(0.8011), MAE 기준으로는 랜덤포레스트(0.7615)가 가장 높았습니다. 두 결과를 모두 기록하고 어떤 지표를 기준으로 선택했는지 명시했습니다' },
    ], M, top, lw, bh, { cols: 2, tone, pt: 11 });
    T.barChart(s, { title: '모델별 RMSE (낮을수록 좋음)', labels: models, values: [0.961, 0.979, 0.986, 1.051, 1.379], x: M + lw + 0.24, y: top, w: W - M * 2 - lw - 0.24, h: bh, tone, hl: 0, fmt: '0.000', max: 1.6 });
    T.footer(s, FOOT);
  }
};
