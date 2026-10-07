const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const L = require('./lib');
const { makeTemplates } = require('./templates');

(async () => {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.author = '유소은';
  pres.title = '유소은 · AI 서비스 풀스택 개발자 포트폴리오';
  pres.theme = { headFontFace: L.F, bodyFontFace: L.F };
  const K = L.makeKit(pres);
  const T = makeTemplates(pres, K);

  const parts = ['./slides-a', './slides-p1', './slides-b'].filter((p) => fs.existsSync(path.join(__dirname, p + '.js')));
  for (const p of parts) await require(p)(pres, K, T);

  const out = process.argv[2] || path.join(__dirname, 'deck.pptx');
  // 한글이 단어 중간에서 줄바꿈되지 않게: PowerPoint는 lang="ko-KR"인 런에만 한글 단어 단위 줄바꿈을 적용한다.
  // pptxgenjs는 모든 런을 en-US로 쓰므로 슬라이드 XML에서 언어 태그만 바꾼다.
  const JSZip = require('jszip');
  const zip = await JSZip.loadAsync(await pres.write({ outputType: 'nodebuffer' }));
  for (const name of Object.keys(zip.files)) {
    if (!/^ppt\/slides\/slide\d+\.xml$/.test(name)) continue;
    let xml = await zip.file(name).async('string');
    xml = xml.replace(/lang="en-US"/g, 'lang="ko-KR" altLang="en-US"');
    zip.file(name, xml);
  }
  fs.writeFileSync(out, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
  console.log('written', out);
})().catch((e) => { console.error(e); process.exit(1); });
