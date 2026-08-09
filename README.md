# 포트폴리오 (GitHub Pages)

## 배포 방법

1. GitHub에서 새 저장소를 만듭니다. 이름을 `<본인아이디>.github.io` 로 하면
   `https://<본인아이디>.github.io` 주소를 그대로 쓸 수 있습니다.
   (다른 이름으로 만들면 `https://<본인아이디>.github.io/<저장소이름>/` 이 됩니다.)

2. 이 폴더(`github-io`)의 **내용물 전체**를 저장소 루트에 올립니다.

   ```bash
   cd github-io
   git init
   git add .
   git commit -m "docs: 포트폴리오 사이트 추가"
   git branch -M main
   git remote add origin https://github.com/<본인아이디>/<저장소이름>.git
   git push -u origin main
   ```

3. 저장소 **Settings → Pages** 에서
   - Source: `Deploy from a branch`
   - Branch: `main` / `/ (root)`
   를 선택하고 저장합니다. 1~2분 뒤 주소가 활성화됩니다.

## 수정하는 법

이 폴더의 `index.html`을 직접 고치지 마세요. 다시 빌드하면 덮어써집니다.

`../content/portfolio.json` 을 고친 뒤 아래를 실행하면 HTML·Pages·PPTX가 함께 갱신됩니다.

```bash
python build/build_all.py
```

## 파일 구성

| 파일 | 설명 |
| --- | --- |
| `index.html` | 메인 페이지 — 소개·핵심 역량·기술 스택·프로젝트 카드 목록 |
| `projects/*.html` | 프로젝트별 상세 페이지 7개 (카드를 누르면 이동) |
| `assets/` | 프로젝트 스크린샷 |
| `.nojekyll` | GitHub Pages의 Jekyll 처리를 끄는 파일 (지우지 마세요) |
