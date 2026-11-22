# BASIRA | بصيرة

فكّر. اكتشف. العب. — منصة معرفة وألعاب أسئلة بالعربية على Blogger، بلا تسجيل ولا إعلانات.

- `src/theme.tpl.xml`: قالب Blogger. الصفحة الرئيسية والألعاب ثابتة خارج أداة Blog1، وأداة Blog1 بقالب بسيط للمقالات والصفحات.
- `src/app.js` و`src/app.css`: محرك الألعاب الخمس والتنسيق.
- `src/data/bank.json`: أسئلة مراجَعة ومخزنة. `content/articles/`: مسودات مقالات بمصادرها (تنتظر مراجعة المالك).
- `preview/`: معاينة محلية للاختبار فقط (غير مرفوعة).

```
python3 scripts/build.py && python3 scripts/release_preflight.py
python3 qa/test_theme.py && python3 qa/content_test.py && python3 qa/publish_test.py
python3 qa/game_test.py   # يحتاج playwright وChromium
```
رفع `dist/theme.xml` يدوي من «السمة ← استعادة» في Blogger. التفاصيل في `docs/`.
