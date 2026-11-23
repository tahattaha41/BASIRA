# BASIRA | بصيرة

**فكّر. اكتشف. العب.** — منصة معرفة وألعاب أسئلة عربية على Blogger.

## مصدر الحقيقة

- `src/theme.tpl.xml`: قالب Blogger المصدر.
- `src/app.js` و`src/app.css`: محرك الألعاب الخمس والتنسيق.
- `src/data/bank.json`: بنك الأسئلة.
- `src/pages/`: محتوى الصفحات الثابتة.
- `content/articles/`: ثمانية مسودات مقالات بمصادرها؛ لا تُنشر تلقائياً وتحتاج مراجعة المالك.
- `brand/`: أصول الهوية والرسومات الأصلية.
- `scripts/build.py`: يبني القالب والصفحات إلى `dist/`.
- `preview/`: ملفات معاينة واختبار محفوظة داخل المستودع؛ ليست نسخة الموقع الحي ولا تُرفع إلى Blogger.
- `dist/`: ناتج البناء، ويُعاد توليده من ملفات المصدر.

## البناء والاختبار

```bash
python3 scripts/build.py
python3 scripts/release_preflight.py
python3 qa/test_theme.py
python3 qa/content_test.py
python3 qa/publish_test.py
python3 qa/ui_test.py
python3 qa/game_test.py
```

GitHub Actions يشغّل البناء والاختبارات تلقائياً عند التغيير على `main`. نجاح CI لا يعني نشر الموقع.

## النشر إلى Blogger — قيد مهم

- Blogger API v3 يدير المقالات والصفحات، لكنه لا يعرض مورداً لرفع قالب Blogger XML.
- لذلك تغيير `src/theme.tpl.xml` يتطلب بناء `dist/theme.xml` ثم رفعه من لوحة Blogger: **السمة ← استعادة**.
- يوجد workflow مستقل للصفحات الثابتة، لكنه حالياً يدوي. لا ينشر المقالات الثمانية ولا يرفع القالب.
- لا تُعتبر أي صفحة منشورة أو رابطها معتمداً حتى يتم التحقق من عنوانها الفعلي وتسجيله في `src/site.json`.
- لا يوجد نشر تلقائي للمقالات؛ مسوداتها تحتاج مراجعة المالك.

راجع `docs/DEPLOYMENT.md` و`docs/PHASE2_EXECUTION.md` لمعرفة الحالة والقيود الحالية.
