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

원고(글·숫자·링크)는 `content/portfolio.json` 에 있습니다. 고친 뒤 아래를 실행하면 HTML이 갱신됩니다.

```bash
python build/build_all.py          # index.html, projects/*.html 생성
python build/build_all.py --pptx   # 포트폴리오 PPT까지 함께 생성
```

- 페이지 골격(HTML 구조·CSS·아이콘)은 `build/templates/` 에 있고, 빌드는 그 골격에 원고만 채워 넣습니다.
- 문구·수치·링크·이미지 경로는 JSON만 고치면 됩니다. `index.html`을 직접 고치면 다음 빌드 때 덮어써집니다.
- 항목을 더하거나 빼는 변경(프로젝트 카드 추가, 기능 카드 삭제 등)은 `build/templates/` 의 골격도 함께 고쳐야 합니다. 개수가 맞지 않으면 빌드가 경고로 알려 줍니다.

필요한 패키지: `pip install lxml cssselect`

## 파일 구성

| 파일 | 설명 |
| --- | --- |
| `content/portfolio.json` | 사이트 원고 (글·숫자·링크) |
| `build/build_all.py` | 원고 + 골격 → HTML 생성 |
| `build/templates/` | 페이지 골격 10개 (구조·CSS·아이콘) |
| `index.html` | 생성물 — 메인 페이지 |
| `projects/*.html` | 생성물 — 프로젝트 상세 페이지 9개 |
| `deck-src/` | 포트폴리오 PPT 생성 스크립트 |
| `유소은_포트폴리오.pptx` | 발표용 PPT 46장 |
| `assets/` | 프로젝트 스크린샷 |
| `.nojekyll` | GitHub Pages의 Jekyll 처리를 끄는 파일 (지우지 마세요) |
