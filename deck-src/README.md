# 포트폴리오 PPT 생성 스크립트

`유소은_포트폴리오.pptx`(46장)를 만드는 스크립트입니다.

## 다시 만들기

```bash
npm install pptxgenjs sharp react react-dom react-icons
node build.js ../유소은_포트폴리오.pptx
```

- `lib.js` — 색·폰트·아이콘·이미지 공통 헬퍼 (에셋 경로 `ROOT` 상수에 지정)
- `templates.js` — 머리말·지표 띠·기능 격자·갤러리·차트 등 공통 틀
- `slides-a.js` — 표지 · 목차 · 한눈에 보기 · 주로 맡은 역할 · 진행 순서 · 기술 스택
- `slides-p1.js` — PART 1 (WorkFlow AI · Curatio · artClassifier · 게이머 고립도 예측)
- `slides-cases.js` — 문제 해결 사례 5건 (WorkFlow AI 슬라이드 뒤에 삽입)
- `slides-b.js` — PART 2 · PART 3 · 작업 방식 · 마무리
- `render.ps1` — PowerPoint로 슬라이드를 PNG로 내보내 확인용

폴더를 옮기면 `lib.js`의 `ROOT` 경로를 새 위치로 고쳐야 합니다.
