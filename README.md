# BASIRA | بصيرة

فكّر. اكتشف. العب. — Think. Discover. Play.

منصة معرفة وألعاب أسئلة بالعربية على Blogger، تعمل بلا تسجيل. الفرع المعتمد: `main`.

## الحالة
- خمس ألعاب تفاعلية (اختيار من متعدد، صح/خطأ، ترتيب، ذاكرة، خمّن الكلمة) بأسئلة مراجَعة ومخزنة، والتقدم محفوظ على جهاز اللاعب فقط.
- ثمانية أقسام معرفة، ومسودات مقال لكل قسم في `content/articles/` (غير منشورة وتنتظر مراجعة المالك).
- لا حسابات ولا إعلانات، ولا ضمان لقبول AdSense.

## البناء والفحص
```
python3 scripts/build.py              # ينتج dist/theme.xml و dist/pages و dist/articles
python3 scripts/release_preflight.py  # بوابة الجاهزية (أضف --strict قبل النشر)
python3 qa/test_theme.py && python3 qa/content_test.py && python3 qa/publish_test.py
python3 qa/browser_test.py && python3 qa/game_test.py   # يحتاجان playwright وChromium
```
لا تعدّل `dist/` يدوياً؛ هو ناتج البناء. التفاصيل في `docs/HANDOFF.md` و`docs/RELEASE_READINESS.md` و`docs/AUDIT.md`.

## النشر على Blogger
رفع `dist/theme.xml` يدوي من «السمة ← استعادة» (الـ API بلا مورد للقوالب). الصفحات تُنشر بـ `scripts/blogger_pages.py` أو بالـ workflow اليدوي `basira-blogger-pages.yml` (أسرار GitHub، لا كلمة مرور). بعد رفع القالب يجب أن تكون أداة «مشاركات المدونة» موجودة في تخطيط المدونة.
