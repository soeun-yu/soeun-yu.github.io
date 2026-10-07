// PART 2 · PART 3 · 작업 방식 · 마무리
const L = require('./lib');
const { W, H, M, F, MONO, C, asset, tint, mix, textW, textH, icon } = L;

const PDF_BASE = 'https://soeun-yu.github.io/assets/webdesign/';

module.exports = async function partsB(pres, K, T) {
  const caption = (s, t, x, y, w, align = 'left', h = 0.26) =>
    K.text(s, t, { x, y, w, h, fontSize: 10, color: C.muted, align, valign: 'top', lineSpacingMultiple: 1.15 });

  // ═════════════ PART 2 ═════════════
  {
    const tone = C.kdc, FOOT = 'PART 2 · Java 기반 풀스택 웹 개발자 과정', PART = FOOT;
    await T.partDivider(pres.addSlide(), {
      n: 2, tone, footer: FOOT,
      title: 'Java 기반 풀스택 웹 개발자 과정',
      desc: '팀 프로젝트 3건입니다. 서버 렌더링, 프론트/백엔드 분리, 프레임워크 기반 인증 순으로 구성이 바뀌었습니다.',
      period: '2025.12 ~ 2026.06 · 프로젝트 3건',
      cards: [
        { title: '3H Furniture', sub: 'Spring Boot + React 기반 가구 이커머스 반응형 웹', badges: ['3차 · Final', '팀'], file: asset('furniture/main.jpg') },
        { title: 'PPAP', sub: '네이버 지도와 공공 실거래 데이터를 결합한 부동산 매물 탐색 플랫폼', badges: ['2차 · Advanced', '팀'], file: asset('ppap/detail.jpg') },
        { title: '너와 함께', sub: '반려견 보호자를 위한 정보 공유 커뮤니티 (JSP · Servlet MVC)', badges: ['1차', '팀'], file: asset('nextto/login.jpg') },
      ],
    });

    // ── 3H Furniture ──
    await T.projectCover(pres.addSlide(), {
      tone, footer: FOOT, part: PART, badges: ['3차 · Final', '팀'], title: '3H Furniture',
      sub: 'Spring Boot + React 기반 가구 이커머스 반응형 웹',
      period: '2026.05 ~ 2026.06', team: 'CMYK팀', role: '메인 페이지 · 회원/인증 도메인 · 상품 검색',
      chips: ['Java', 'Spring Boot', 'Spring Security', 'Spring Data JPA', 'JWT', 'OAuth2', 'React', 'React Context', 'CSS3 · Bootstrap', 'Oracle Cloud ADB'],
      metrics: [{ v: '3', l: '소셜 로그인' }, { v: '3', l: '복합 검색 조건' }, { v: '6', l: '담당 화면' }],
      position: '메인 페이지, 회원 가입·로그인, 상품 검색 기능을 맡았습니다. 서비스에 처음 들어와 상품을 찾기까지 거치는 화면입니다.',
      visual: (s, x, y, w, h) => K.browser(s, asset('furniture/main.jpg'), x, y, w, h, { url: 'cmyk-furniture · /' }),
    });
    {
      const s = pres.addSlide();
      await T.background(s, 'glow', tone);
      const top = T.header(s, { tag: '3H Furniture · 담당 기능', title: '메인 · 회원/인증 · 상품 검색', tone });
      await T.featureGrid(s, [
        { icon: 'LuHouse', t: '메인 페이지', d: '메인 배너, 카테고리 네비게이션, 베스트셀러·신상품 섹션, 상품 리스트를 컴포넌트로 분리해 구현. 헤더·푸터 공통 레이아웃과 MainController · MainService로 상품 조회 API를 함께 담당' },
        { icon: 'LuListFilter', t: '상품 검색 필터', d: '카테고리 · 색상 · 가격대를 조합한 복합 조건 검색. 가격은 슬라이더로 최솟값/최댓값 범위를 지정. SearchContext로 헤더 검색창과 결과 화면의 조건을 공유' },
        { icon: 'LuKeyRound', t: 'OAuth2 소셜 로그인', d: '구글 · 네이버 · 카카오 계정으로 가입. LoginSuccessHandler와 OAuth2DTO · SessionMember로 소셜 계정을 일반 회원과 동일한 권한 체계에 통합해, 구매·장바구니·북마크를 그대로 사용' },
        { icon: 'LuShieldCheck', t: 'Spring Security 인증·인가', d: 'SecurityConfig · MemberSecurityService · LoginFailHandler를 구성하고 MemberRole enum으로 권한을 분리' },
        { icon: 'LuUserPlus', t: '회원가입 · 계정 찾기', d: '회원가입 · 아이디 찾기 · 비밀번호 재설정 화면과 각 결과 화면 구현' },
        { icon: 'LuBookmark', t: '북마크(찜)', d: 'BookmarksService · Repository · DTO로 관심 상품 저장/조회 기능 구현' },
      ], M, top, W - M * 2, H - 0.65 - top, { cols: 3, tone, pt: 11 });
      T.footer(s, FOOT);
    }
    await T.gallery(pres.addSlide(), {
      tone, footer: FOOT, tag: '3H Furniture', title: '구현 화면',
      sub: '담당한 검색 · 로그인 · 회원가입 · 아이디 찾기 화면입니다.',
      cols: 3,
      shots: [
        { file: asset('furniture/search-filter.png'), cap: '검색 필터 — 카테고리·색상·가격 슬라이더' },
        { file: asset('furniture/search-result.jpg'), cap: '검색 결과' },
        { file: asset('furniture/login.jpg'), cap: '로그인 — OAuth2 소셜 로그인' },
        { file: asset('furniture/signup.jpg'), cap: '회원가입' },
        { file: asset('furniture/find-id.jpg'), cap: '아이디 찾기' },
      ],
      extra: async (s, x, y, w, h) => {
        K.rect(s, x, y, w, h - 0.34, { fill: tint(tone, 0.08, C.surf2), line: tint(tone, 0.3, C.surf2), r: 0.12 });
        s.addImage({ data: await icon('LuWorkflow', tone), x: x + 0.26, y: y + 0.26, w: 0.24, h: 0.24 });
        K.text(s, '회원 플로우', { x: x + 0.6, y: y + 0.22, w: w - 0.8, h: 0.32, fontSize: 12, bold: true, color: tone, valign: 'middle' });
        const steps = ['회원가입', '로그인 (일반 · 소셜 3종)', '아이디 찾기', '비밀번호 재설정'];
        steps.forEach((t, i) => {
          const sy = y + 0.72 + i * 0.44;
          K.circle(s, x + 0.28, sy + 0.08, 0.16, tone);
          K.text(s, t, { x: x + 0.56, y: sy, w: w - 0.8, h: 0.32, fontSize: 11, color: C.mid, valign: 'middle' });
        });
      },
    });

    // ── PPAP ──
    await T.projectCover(pres.addSlide(), {
      tone, footer: FOOT, part: PART, badges: ['2차 · Advanced', '팀'], title: 'PPAP',
      sub: '네이버 지도와 공공 실거래 데이터를 결합한 부동산 매물 탐색 플랫폼',
      period: '2026.03 ~ 2026.04', team: 'PPAP팀', role: '인증 · 회원 도메인',
      links: [{ t: 'GitHub', icon: 'LuGithub', url: 'https://github.com/Polalise/Advanced_project' }],
      metrics: [{ v: 'JWT', l: '인증 방식' }, { v: '2', l: '회원 유형' }],
      position: '일반 회원과 사업자 회원을 구분하는 인증 · 회원 구조를 맡았습니다. 매물 등록과 상담 관리 권한이 이 구분에 따라 나뉩니다.',
      visual: (s, x, y, w, h) => K.browser(s, asset('ppap/detail.jpg'), x, y, w, h, { url: 'ppap · 매물 상세' }),
    });
    {
      const s = pres.addSlide();
      await T.background(s, 'glow', tone);
      const top = T.header(s, { tag: 'PPAP · 담당 기능', title: '인증 · 회원 도메인', tone });
      const bh = H - 0.65 - top, lw = 5.9;
      await T.featureGrid(s, [
        { icon: 'LuKeyRound', t: 'JWT 기반 로그인·인증', d: 'authMiddleware로 토큰을 검증하고 보호 라우트를 분리. AuthContext로 프론트 인증 상태를 관리' },
        { icon: 'LuUsers', t: '회원 도메인', d: '회원가입 · 정보 수정 · 탈퇴와 개별/전체 회원정보 조회 API 구현' },
        { icon: 'LuBriefcaseBusiness', t: '일반 / 사업자 회원 구분', d: '회원 유형에 따라 매물 등록·상담 관리 권한이 나뉘도록 회원 구분 기준을 설계' },
      ], M, top, lw, bh, { cols: 1, tone, pt: 12, gap: 0.22 });
      const rx = M + lw + 0.3, rw = W - M - rx, gap = 0.24, iw = (rw - gap) / 2, ih = bh - 1.25;
      await K.fitImage(s, asset('ppap/login-design.png'), rx, top, iw, ih, { pad: 0.1 });
      caption(s, '로그인·회원가입 화면 설계', rx, top + ih + 0.06, iw);
      await K.fitImage(s, asset('ppap/sitemap.png'), rx + iw + gap, top, iw, ih, { pad: 0.1 });
      caption(s, '페이지 구조도', rx + iw + gap, top + ih + 0.06, iw);
      K.chips(s, ['React', 'React Router', 'MUI', 'Naver Maps API', 'Chart.js', 'Node.js', 'Express', 'MongoDB', 'JWT'], rx, top + ih + 0.44, rw, { pt: 9.5, h: 0.28, r: 0.07, color: C.mid });
      T.footer(s, FOOT);
    }

    // ── 너와 함께 ──
    await T.projectCover(pres.addSlide(), {
      tone, footer: FOOT, part: PART, badges: ['1차', '팀'], title: '너와 함께',
      sub: '반려견 보호자를 위한 정보 공유 커뮤니티 (JSP · Servlet MVC)',
      period: '2026.02 ~ 2026.03 (약 2주)', team: '무조건동의팀', role: '회원 인증 · 마이페이지 · 반려견 정보 관리',
      chips: ['Java', 'JSP', 'Servlet', 'JDBC', 'Oracle DB', 'HTML · CSS · JavaScript'],
      metrics: [{ v: '5', l: '담당 화면' }, { v: 'MVC', l: '아키텍처' }, { v: '2', l: '계정 종류' }],
      position: '법률·의학·뉴스·상식 게시판과 자유게시판은 로그인 후 사용합니다. 회원 인증과 개인·반려견 정보 관리 기능을 맡았습니다.',
      visual: (s, x, y, w, h) => K.browser(s, asset('nextto/mypage.jpg'), x, y, w, h, { url: 'nextto · /mypage' }),
    });
    {
      const s = pres.addSlide();
      await T.background(s, 'glow', tone);
      const top = T.header(s, { tag: '너와 함께 · 담당 기능', title: '회원 인증 · 마이페이지 · 반려견 정보', tone });
      await T.featureGrid(s, [
        { icon: 'LuLogIn', t: '로그인 · 회원가입', d: '세션 기반 로그인과 입력값 검증을 포함한 가입 플로우. 일반 사용자 계정과 관리자 계정을 구분해 처리' },
        { icon: 'LuIdCard', t: '마이페이지', d: '프로필 사진·닉네임·아이디를 묶은 사이드바와 연락처 영역, 등록한 반려견 정보 카드를 함께 배치. 홈 > 마이페이지 > 내 정보 관리 순의 브레드크럼으로 현재 위치를 표시' },
        { icon: 'LuUserPen', t: '내 정보 관리 · 수정', d: '조회 화면과 수정 화면을 분리해 구현. 수정 화면에는 비밀번호 재확인 입력과 프로필 사진 교체(파일 업로드), 생년월일 선택기를 배치하고 계정 종류는 읽기 전용으로 고정' },
        { icon: 'LuDog', t: '반려견 정보 등록 · 수정', d: '대표 반려견 1마리의 이름·견종·나이·몸무게·성별·중성화 여부·건강 상태·사진을 등록하고 수정. 마이페이지에서는 태그 형태로 요약 표시' },
        { icon: 'LuUserX', t: '회원 탈퇴', d: '수정 화면에서 탈퇴를 처리해 계정과 관련 정보를 정리' },
        { icon: 'LuLayers', t: 'DTO · DAO 패턴', d: 'Model 2(MVC) 구조에서 데이터 접근 계층을 분리하는 기본 패턴을 적용' },
      ], M, top, W - M * 2, H - 0.65 - top, { cols: 3, tone, pt: 11 });
      T.footer(s, FOOT);
    }
    await T.gallery(pres.addSlide(), {
      tone, footer: FOOT, tag: '너와 함께', title: '구현 화면',
      sub: '로그인부터 내 정보 수정까지, 조회 화면과 수정 화면을 나눠 구현했습니다.',
      cols: 2,
      shots: [
        { file: asset('nextto/login.jpg'), cap: '로그인' },
        { file: asset('nextto/register.jpg'), cap: '회원가입' },
        { file: asset('nextto/privacy.jpg'), cap: '내 정보 관리 — 회원정보 조회' },
        { file: asset('nextto/privacy-edit.jpg'), cap: '내 정보 수정 — 비밀번호 재확인 · 사진 교체' },
      ],
    });
  }

  // ═════════════ PART 3 ═════════════
  {
    const tone = C.web, FOOT = 'PART 3 · 웹 디자이너 과정', PART = FOOT;
    await T.partDivider(pres.addSlide(), {
      n: 3, tone, footer: FOOT,
      title: '웹 디자이너 과정',
      desc: '개발 과정을 수강하기 전에 진행한 브랜드 웹사이트 리뉴얼 2건입니다. SWOT·페르소나 분석으로 문제를 정리하고 정보 구조(IA)를 다시 구성한 뒤, HTML·CSS·jQuery로 퍼블리싱했습니다.',
      period: '2025.06 ~ 2025.08 · 개인 프로젝트 2건',
      cards: [
        { title: '할리스커피', sub: '브랜드 아이덴티티를 반영해 정보 구조와 인터랙션을 개편한 리뉴얼', badges: ['리뉴얼 02', '개인'], file: asset('webdesign/hollys-main.jpg') },
        { title: '오늘의집', sub: '복잡한 정보 구조와 사용성 문제를 개선한 인테리어 플랫폼 UI/UX 리뉴얼', badges: ['리뉴얼 01', '개인'], file: asset('webdesign/ohouse-main.jpg') },
      ],
    });

    // ── 할리스커피 ──
    await T.projectCover(pres.addSlide(), {
      tone, footer: FOOT, part: PART, badges: ['리뉴얼 02', '개인'], title: '할리스커피',
      sub: '브랜드 아이덴티티를 반영해 정보 구조와 인터랙션을 개편한 리뉴얼',
      period: '2025.07.14 ~ 2025.08.04 (약 3주)', team: '개인 프로젝트', role: '기획 · 디자인 · 퍼블리싱',
      links: [
        { t: '실제 사이트 보기', icon: 'LuExternalLink', url: 'https://plainaube.dothome.co.kr/hollys/index.html' },
        { t: 'PDF 포트폴리오', icon: 'LuFileText', url: PDF_BASE + encodeURIComponent('HTML 기반_할리스커피 홈페이지 리뉴얼.pdf') },
      ],
      chips: ['PowerPoint', 'Photoshop', 'Illustrator', 'HTML5', 'CSS3', 'jQuery'],
      metrics: [{ v: '3', l: '제작 화면' }, { v: 'SWOT', l: '브랜드 분석' }, { v: '약 3주', l: '작업 기간' }],
      positionLabel: '배경', positionIcon: 'LuLightbulb',
      position: '커피 브랜드 ‘할리스’의 홈페이지를 SWOT·페르소나 기법으로 분석했습니다. 메뉴와 매장 정보가 브랜드 색 없이 나열되어 있다는 점을 주요 문제로 정리했고, 브랜드 색과 서체를 화면 전반에 적용하면서 정보 구조와 동적 요소를 함께 수정했습니다.',
      visual: (s, x, y, w, h) => K.browser(s, asset('webdesign/hollys-main.jpg'), x, y, w, h, { url: 'hollys · renewal' }),
    });
    {
      const s = pres.addSlide();
      await T.background(s, 'glow', tone);
      const top = T.header(s, { tag: '할리스커피 · 개선 포인트', title: '브랜드 · 정보 구조 · 인터랙션 개선', tone });
      await T.featureGrid(s, [
        { icon: 'LuPalette', t: '브랜드 아이덴티티 기반 UI/UX 개편', d: '브랜드 레드와 딥브라운을 축으로 색·타이포·여백 규칙을 다시 정했습니다. 전용 서체(카페24 단정해, 에스코어드림)를 적용해 화면 전체의 인상을 통일했습니다.' },
        { icon: 'LuNetwork', t: '정보 구조(IA) 재설계', d: '메뉴·매장·브랜드로 흩어져 있던 항목을 사용자가 찾는 순서대로 다시 묶었습니다. 메뉴는 커피·음료·푸드·굿즈로 나누고, 매장은 지도와 목록을 한 화면에서 오갈 수 있게 했습니다.' },
        { icon: 'LuMousePointerClick', t: '동적 인터랙션 적용', d: '메인 슬라이드, 메뉴 카테고리 탭, 매장찾기 지도 마커를 jQuery로 구현했습니다. 클릭 대상과 현재 상태가 항상 눈에 보이도록 활성 표시를 붙였습니다.' },
        { icon: 'LuMapPin', t: '사용자 맞춤형 기능 추가', d: '매장 상세 조건(드라이브스루·주차·24시간 등)으로 걸러 볼 수 있는 필터와, 관심 매장을 상단에 고정하는 흐름을 기획했습니다.' },
      ], M, top, W - M * 2, H - 0.65 - top, { cols: 2, tone, pt: 12 });
      T.footer(s, FOOT);
    }
    await T.gallery(pres.addSlide(), {
      tone, footer: FOOT, tag: '할리스커피', title: '주요 비주얼',
      sub: '브랜드 레드와 딥브라운을 축으로 메인 · 메뉴 · 매장찾기 3개 화면을 디자인하고 퍼블리싱했습니다.',
      cols: 3,
      shots: [
        { file: asset('webdesign/hollys-main.jpg'), cap: '메인 — 시즌 음료 슬라이드' },
        { file: asset('webdesign/hollys-menu.jpg'), cap: '메뉴 · 커피 — 카테고리 탭' },
        { file: asset('webdesign/hollys-store.jpg'), cap: '매장찾기 — 지도 마커와 목록' },
      ],
    });

    // ── 오늘의집 ──
    await T.projectCover(pres.addSlide(), {
      tone, footer: FOOT, part: PART, badges: ['리뉴얼 01', '개인'], title: '오늘의집',
      sub: '복잡한 정보 구조와 사용성 문제를 개선한 인테리어 플랫폼 UI/UX 리뉴얼',
      period: '2025.06.02 ~ 2025.06.16 (약 2주)', team: '개인 프로젝트', role: '기획 · 디자인 · 퍼블리싱',
      links: [
        { t: '실제 사이트 보기', icon: 'LuExternalLink', url: 'https://plainaube.dothome.co.kr/ohouse/index.html' },
        { t: 'PDF 포트폴리오', icon: 'LuFileText', url: PDF_BASE + encodeURIComponent('HTML 기반_오늘의집 홈페이지 리뉴얼.pdf') },
      ],
      chips: ['Figma', 'Photoshop', 'Illustrator', 'HTML5', 'CSS3', 'jQuery'],
      metrics: [{ v: '2', l: '제작 화면' }, { v: 'IA', l: '정보구조 재설계' }, { v: '약 2주', l: '작업 기간' }],
      positionLabel: '배경', positionIcon: 'LuLightbulb',
      position: '인테리어 플랫폼 ‘오늘의집’은 커뮤니티·쇼핑·전문가 서비스가 한 화면에 모여 있어, 처음 방문한 사용자가 무엇부터 봐야 할지 알기 어렵다고 보았습니다. SWOT으로 강점과 약점을 정리하고 페르소나의 사용 흐름을 따라가 본 뒤, 메인 화면의 정보 우선순위를 다시 정했습니다.',
      visual: (s, x, y, w, h) => K.browser(s, asset('webdesign/ohouse-main.jpg'), x, y, w, h, { url: 'ohouse · renewal' }),
    });
    {
      const s = pres.addSlide();
      await T.background(s, 'glow', tone);
      const top = T.header(s, { tag: '오늘의집 · 개선 포인트', title: '메인 · 게시판 · 상세페이지 개선', tone });
      const bh = H - 0.65 - top, lw = 6.55;
      await T.featureGrid(s, [
        { icon: 'LuLayoutTemplate', t: '메인 레이아웃 최적화', d: '첫 화면에서 무엇을 먼저 보여줄지 기준을 정하고 블록 순서를 재배치했습니다. 통합검색에는 실시간 검색어를 접었다 펼치는 인터랙션을 붙여, 평소에는 공간을 차지하지 않도록 했습니다.' },
        { icon: 'LuLayoutGrid', t: '커뮤니티(집들이) 게시판 개선', d: '사진이 주인공인 게시판이라 카드 비율과 여백을 먼저 맞추고, 정렬·필터 조건을 상단에 모았습니다. 페이지 이동은 번호 · 이전/다음 · 직접 입력 세 가지를 함께 제공합니다.' },
        { icon: 'LuShoppingBag', t: '브랜드관 상품 상세페이지 기획', d: '단독 상품을 소개하는 상세 페이지의 구성을 새로 짰습니다. 상품 정보와 후기, 연관 상품이 이어지는 순서를 정하고 각 구간의 역할을 나눴습니다.' },
      ], M, top, lw, bh, { cols: 1, tone, pt: 11, gap: 0.18 });
      const rx = M + lw + 0.3, rw = W - M - rx, gap = 0.24, fw = (rw - gap) / 2, fh = bh - 0.56;
      await K.browser(s, asset('webdesign/ohouse-main.jpg'), rx, top, fw, fh, { shadow: false });
      caption(s, '메인 — 통합검색·실시간 검색어부터 커뮤니티·쇼핑 블록까지', rx, top + fh + 0.08, fw, 'left', 0.48);
      await K.browser(s, asset('webdesign/ohouse-housewarming.jpg'), rx + fw + gap, top, fw, fh, { shadow: false });
      caption(s, '집들이 게시판 — 카드형 목록과 정렬·필터, 페이지 네비게이션', rx + fw + gap, top + fh + 0.08, fw, 'left', 0.48);
      T.footer(s, FOOT);
    }
  }

  // ═════════════ 작업 방식 ═════════════
  {
    const s = pres.addSlide();
    await T.background(s, 'glow', C.accent);
    const top = T.header(s, { tag: 'How I Work', title: '작업 방식', sub: '프로젝트를 진행하면서 반복해서 적용한 방식입니다.' });
    const items = [
      ['LuRuler', '원인 확인 후 수정', '성능 문제는 쿼리 왕복 횟수로, 모델 문제는 지표별 수치로 원인을 먼저 확인한 뒤 코드를 수정했습니다.'],
      ['LuShieldHalf', '실패 상황 처리', 'ML 서버 장애, 응답 지연, 화면 전환 중 도착한 이전 응답을 각각 다르게 처리했고, 실패했을 때 화면에 표시할 내용도 정했습니다.'],
      ['LuNotebookPen', '결정 이유 기록', '선택한 이유를 코드 주석과 개발 보고서에 기록해 팀에 공유했습니다. 같은 내용을 다시 조사하지 않기 위해서였습니다.'],
    ];
    const gap = 0.26, cw = (W - M * 2 - gap * 2) / 3, ch = 3.9, cy = top + (H - 0.65 - top - ch) / 2;
    for (let i = 0; i < 3; i++) {
      const [ic, t, d] = items[i], x = M + i * (cw + gap);
      K.rect(s, x, cy, cw, ch, { fill: C.surf, line: C.border, r: 0.18 });
      K.text(s, '0' + (i + 1), { x: x + cw - 1.2, y: cy + 0.22, w: 0.95, h: 0.6, fontSize: 32, bold: true, color: mix(C.text, C.surf, 0.1), fontFace: MONO, align: 'right' });
      await K.iconTile(s, ic, x + 0.34, cy + 0.36, 0.64, C.accent2);
      let tpt = 18;
      while (tpt > 14 && textW(t, tpt) * 1.12 > cw - 0.68) tpt -= 0.5;
      K.text(s, t, { x: x + 0.34, y: cy + 1.26, w: cw - 0.68, h: 0.44, fontSize: tpt, bold: true, valign: 'middle' });
      K.text(s, d, { x: x + 0.34, y: cy + 1.86, w: cw - 0.68, h: ch - 2.1, fontSize: 12.5, color: C.mid, lineSpacingMultiple: 1.4 });
    }
    T.footer(s, 'How I Work');
  }

  // ═════════════ 마무리 ═════════════
  {
    const s = pres.addSlide();
    await T.background(s, 'cover');
    K.text(s, '감사합니다', { x: M, y: 1.7, w: W - M * 2, h: 1.0, fontSize: 48, bold: true, align: 'center', valign: 'middle' });
    K.text(s, [{ text: '유소은', options: { color: C.text, bold: true } }, { text: '  ·  AI 서비스 풀스택 개발자', options: { color: C.mid, bold: true } }],
      { x: M, y: 2.85, w: W - M * 2, h: 0.46, fontSize: 18, align: 'center', valign: 'middle' });
    K.text(s, 'ML 모델 학습, API 서빙, 화면 구현을 한 프로젝트 안에서 함께 다뤄 왔습니다', { x: M, y: 3.45, w: W - M * 2, h: 0.5, fontSize: 18, color: C.accent2, align: 'center', valign: 'middle' });
    const lk = 'github.com/soeun-yu', lw = textW(lk, 13) + 0.9, lx = (W - lw) / 2;
    K.rect(s, lx, 4.35, lw, 0.5, { fill: C.surf, line: C.border, r: 0.25 });
    s.addImage({ data: await icon('LuGithub', C.text), x: lx + 0.22, y: 4.48, w: 0.24, h: 0.24 });
    K.text(s, [{ text: lk, options: { hyperlink: { url: 'https://github.com/soeun-yu' } } }], { x: lx + 0.56, y: 4.35, w: lw - 0.62, h: 0.5, fontSize: 13, bold: true, color: C.text, fontFace: MONO, valign: 'middle' });
    const courses = [[C.web, '웹 디자이너 과정'], [C.kdc, 'Java 기반 풀스택 웹 개발자 과정'], [C.ai, 'AI 기반 서비스 개발 심화 과정']];
    const widths = courses.map(([, n]) => textW(n, 11) * 1.05 + 0.45);
    const total = widths.reduce((a, b) => a + b, 0) + textW('프로젝트 9건', 11) + 0.4 * 3;
    let x = (W - total) / 2;
    courses.forEach(([col, n], i) => {
      K.circle(s, x, 5.62, 0.13, col);
      K.text(s, n, { x: x + 0.24, y: 5.5, w: widths[i], h: 0.36, fontSize: 11, color: C.mid, valign: 'middle' });
      x += widths[i] + 0.4;
    });
    K.text(s, '프로젝트 9건', { x, y: 5.5, w: 1.6, h: 0.36, fontSize: 11, bold: true, color: C.text, valign: 'middle' });
  }
};
