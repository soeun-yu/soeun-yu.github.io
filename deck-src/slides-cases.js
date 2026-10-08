// 문제 해결 사례 — 해당 프로젝트 슬라이드 바로 뒤에 들어간다 (사례 목록은 인자로 받는다)
const L = require('./lib');
const { W, H, M, MONO, C, tint, mix, textW, textH, icon } = L;

const WORKFLOW_CASES = [
  {
    t: '대시보드 요약 API의 N+1 조회', icon: 'LuTimer', tags: ['N+1', 'JPA', '성능'],
    p: '대시보드 요약 API가 업무·활동·팀원마다 UserRepository.findById를 반복 호출해, DB 왕복이 레코드 수만큼 늘어났습니다.',
    a: '화면에 필요한 값은 담당자 이름뿐이라 연관관계 매핑을 새로 추가할 필요는 없다고 보았습니다. 조회할 id를 먼저 모아 한 번에 가져오면 기존 도메인 구조를 바꾸지 않고 왕복 횟수만 줄일 수 있다고 판단했습니다.',
    c: '업무·활동·팀원에서 필요한 user id를 Set으로 모아 findAllById 한 번으로 조회하고, 같은 방식을 조회 메서드 5곳에 적용했습니다. 읽기 메서드에는 @Transactional(readOnly = true)를 붙였습니다.',
    r: '업무·활동 건수와 관계없이 사용자 조회가 1회로 고정됩니다.',
  },
  {
    t: '소규모 팀에서 Isolation Forest의 과부하 미탐지', icon: 'LuChartScatter', tags: ['이상치 탐지', '통계', 'MAD'],
    p: '업무 편중 이상치 탐지에서, 팀원이 5~9명일 때 과부하가 분명한 팀원을 이상치로 잡지 못하는 사례가 있었습니다.',
    a: 'Isolation Forest는 표본이 적으면 트리 분할이 불안정해집니다. 팀 규모는 바꿀 수 없으므로 표본 수에 맞는 방식이 필요하다고 보고, 소표본에서 안정적인 MAD 기반 Modified Z-score를 검토했습니다(임계값 3.5는 Iglewicz & Hoaglin 권장치).',
    c: '팀원 수가 15명 미만이면 MAD 기반으로 전환하도록 분기했습니다. MAD가 0이면 표준편차로 대체하고, 표준편차도 0인 피처는 구분에 쓸 수 없어 판단에서 제외했습니다.',
    r: '팀원 5~9명 규모에서도 과부하 팀원이 이상치로 탐지됩니다.',
  },
  {
    t: 'ML 서버 장애 시 모델별 처리 방식', icon: 'LuServerCrash', tags: ['장애 대응', 'API 설계', 'FastAPI'],
    p: 'ML 서버 두 대(지연 위험도·업무 편중)의 호출 실패를 같은 방식으로 처리하면, 한쪽은 화면 표시가 불필요하게 실패하고 다른 쪽은 잘못된 값을 보여주게 됩니다.',
    a: '두 모델은 저장 방식이 다릅니다. 지연 위험도는 ml_predictions에 이력이 남아 이전 값을 쓸 수 있고, 업무 편중은 호출 시점마다 계산하는 값이라 캐시가 없습니다. 그래서 실패 처리도 저장 방식에 맞춰 나누기로 했습니다.',
    c: '지연 위험도는 예외를 처리하고 마지막으로 저장된 예측을 응답하도록, 업무 편중은 503 WORKLOAD_SCORE_UNAVAILABLE을 반환하도록 나눴습니다. 연결 3초·읽기 30초 타임아웃도 설정했습니다.',
    r: 'ML 서버가 응답하지 않아도 대시보드 화면은 표시되고, 값을 불러오지 못한 카드는 "0명" 대신 "…명"으로 표시됩니다.',
  },
  {
    t: '브라우저 타임존에 따른 날짜 표시 차이', icon: 'LuCalendarClock', tags: ['타임존', 'KST', '날짜 처리'],
    p: '완료일과 경과일이 사용자의 브라우저 타임존에 따라 하루씩 다르게 표시됐습니다.',
    a: '백엔드 JVM은 Asia/Seoul로 고정돼 있지만 LocalDateTime 문자열에는 오프셋이 없어, 브라우저가 로컬 타임존으로 해석한 것이 원인이었습니다. 응답 포맷을 바꾸면 다른 담당자의 API에도 영향이 있어 프론트엔드의 파싱 단계에서 보정하기로 했습니다.',
    c: '오프셋이 없는 문자열에 +09:00을 붙여 파싱하고, "3일 이상 미업데이트" 같은 임계값 판정용(경과 시간 기준)과 화면 라벨용(날짜 경계 기준)을 별도 함수로 나눴습니다.',
    r: '브라우저 타임존과 관계없이 모든 사용자에게 같은 날짜가 표시됩니다.',
  },
  {
    t: 'Spring Boot → FastAPI 호출 실패', icon: 'LuUnplug', tags: ['HTTP/2', '타임아웃', '서비스 연동'],
    p: 'Spring Boot에서 내부 ML 서버(FastAPI)로 보낸 요청이 응답을 받지 못하고 실패했습니다.',
    a: 'JDK HttpClient가 plaintext(http://) 대상에도 기본적으로 HTTP/2(h2c) 업그레이드를 시도하는데, uvicorn이 이를 지원하지 않는 것이 원인이었습니다. 서버를 바꾸는 것보다 클라이언트에서 프로토콜을 지정하는 편이 영향 범위가 작다고 판단했습니다.',
    c: 'HttpClient에 HTTP_1_1을 지정하고, 응답을 무한정 기다리지 않도록 연결 3초·읽기 30초 타임아웃을 설정했습니다.',
    r: '내부 ML 서버 호출이 정상적으로 응답을 받고, 장애 시 대기 시간은 최대 30초로 제한됩니다.',
  },
];

module.exports = async function problemSlides(pres, K, T, { tone, footer, project = 'WorkFlow AI', cases = WORKFLOW_CASES, list = true }) {
  // 사례 목록 (사례가 많을 때만 한 장으로 먼저 보여준다)
  if (list) {
    const s = pres.addSlide();
    await T.background(s, 'glow', tone);
    const top = T.header(s, { tag: `${project} · Problem Solving`, title: '문제 해결 사례', sub: `${project} 개발 중 확인한 문제와 처리 과정입니다. 문제 · 분석 · 행동 · 결과 순으로 정리했습니다.`, tone });
    const n = cases.length, gap = 0.14, rh = (H - 0.65 - top - gap * (n - 1)) / n;
    for (let i = 0; i < cases.length; i++) {
      const c = cases[i], y = top + i * (rh + gap);
      K.rect(s, M, y, W - M * 2, rh, { fill: C.surf, line: C.border, r: 0.12 });
      K.text(s, '0' + (i + 1), { x: M + 0.26, y, w: 0.6, h: rh, fontSize: 20, bold: true, color: tone, fontFace: MONO, valign: 'middle' });
      await K.iconTile(s, c.icon, M + 0.95, y + (rh - 0.46) / 2, 0.46, tone);
      K.text(s, c.t, { x: M + 1.6, y: y + 0.12, w: 6.6, h: 0.36, fontSize: 14, bold: true, valign: 'middle' });
      const tw = c.tags.reduce((a, t) => a + textW(t, 9.5) + 0.26 + 0.08, 0) - 0.08;
      const resW = W - M - 0.26 - tw - 0.3 - (M + 1.6);
      let rpt = 10.5;
      while (rpt > 9 && textW('결과  ' + c.r, rpt) * 1.08 > resW) rpt -= 0.5;
      K.text(s, [{ text: '결과  ', options: { color: C.ok, bold: true } }, { text: c.r, options: { color: C.mid } }],
        { x: M + 1.6, y: y + 0.48, w: resW, h: rh - 0.58, fontSize: rpt, valign: 'top' });
      let tx = W - M - 0.26 - tw;
      for (const t of c.tags) tx += K.chip(s, t, tx, y + (rh - 0.27) / 2, { pt: 9.5, h: 0.27, r: 0.07, color: C.mid }) + 0.08;
    }
    T.footer(s, footer);
  }

  // 사례별 한 장씩: 왼쪽 문제·분석·행동, 오른쪽 결과
  const rowsDef = [
    ['P', '문제', C.danger, 'p'],
    ['A', '분석', C.warn, 'a'],
    ['A', '행동', C.accent3, 'c'],
  ];
  for (let i = 0; i < cases.length; i++) {
    const c = cases[i];
    const s = pres.addSlide();
    await T.background(s, 'glow', tone);
    K.text(s, `${project.toUpperCase()} · 문제 해결 0${i + 1}`, { x: M, y: 0.5, w: 8, h: 0.26, fontSize: 10.5, bold: true, color: tone, charSpacing: 2.5 });
    let tpt = 28;
    while (tpt > 22 && textW(c.t, tpt) * 1.1 > W - M * 2) tpt -= 1;
    K.text(s, c.t, { x: M, y: 0.78, w: W - M * 2, h: 0.62, fontSize: tpt, bold: true, valign: 'middle' });
    const top = 1.7, bh = H - 0.65 - top, lw = 7.75, gap = 0.18;
    const tw = lw - 1.35;
    const nat = rowsDef.map(([, , , k]) => textH(c[k], 12, tw, 1.5) + 0.5);
    const extra = (bh - gap * 2 - nat.reduce((a, b) => a + b, 0)) / 3;
    let y = top;
    rowsDef.forEach(([letter, label, col, k], j) => {
      const h = nat[j] + Math.max(0, extra);
      K.rect(s, M, y, lw, h, { fill: C.surf, line: C.border, r: 0.14 });
      K.circle(s, M + 0.26, y + h / 2 - 0.25, 0.5, tint(col, 0.18), { color: tint(col, 0.5), width: 1 });
      K.text(s, letter, { x: M + 0.26, y: y + h / 2 - 0.25, w: 0.5, h: 0.5, fontSize: 15, bold: true, color: col, fontFace: MONO, align: 'center', valign: 'middle' });
      K.text(s, label, { x: M + 0.2, y: y + h / 2 + 0.3, w: 0.62, h: 0.24, fontSize: 9.5, bold: true, color: col, align: 'center' });
      K.text(s, c[k], { x: M + 1.1, y: y + 0.16, w: tw, h: h - 0.32, fontSize: 12, color: C.mid, valign: 'middle', lineSpacingMultiple: 1.3 });
      y += h + gap;
    });
    const rx = M + lw + 0.24, rw = W - M - rx;
    K.rect(s, rx, top, rw, bh, { fill: tint(C.ok, 0.08, C.surf), line: tint(C.ok, 0.35, C.surf), r: 0.16 });
    K.circle(s, rx + 0.3, top + 0.3, 0.5, tint(C.ok, 0.2), { color: tint(C.ok, 0.55), width: 1 });
    K.text(s, 'R', { x: rx + 0.3, y: top + 0.3, w: 0.5, h: 0.5, fontSize: 15, bold: true, color: C.ok, fontFace: MONO, align: 'center', valign: 'middle' });
    K.text(s, '결과', { x: rx + 0.95, y: top + 0.3, w: 2, h: 0.5, fontSize: 14, bold: true, color: C.ok, valign: 'middle' });
    let rpt = 18;
    while (rpt > 14 && textH(c.r, rpt, rw - 0.6, 1.45) > 2.6) rpt -= 1;
    K.text(s, c.r, { x: rx + 0.3, y: top + 1.05, w: rw - 0.6, h: 2.9, fontSize: rpt, bold: true, color: C.text, lineSpacingMultiple: 1.3 });
    s.addImage({ data: await icon(c.icon, mix(C.ok, C.surf, 0.35)), x: rx + rw - 1.3, y: top + bh - 2.05, w: 0.9, h: 0.9 });
    K.chips(s, c.tags, rx + 0.3, top + bh - 0.6, rw - 0.6, { pt: 10, h: 0.3, r: 0.07, color: C.mid });
    T.footer(s, footer);
  }
};
