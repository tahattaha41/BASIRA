# BASIRA | بصيرة — مرجع المشروع

**الفكرة:** موقع عربي مستقل (بلوجر) لأدوات حساب عملية للتواريخ والأرقام والوحدات، مع مقالات شارحة. بدأ من الصفر في نوفمبر 2026 بعد حذف المشروع القديم (تاريخه محفوظ في git).

## الهيكل
- `src/core.js` منطق الحساب (يُختبر في Node)، `src/app.js` واجهات الأدوات، `src/style.css` التصميم، `src/theme.tpl.xml` قالب بلوجر.
- `src/tools/*.html` صفحات الأدوات (نص + `<div class="tool" data-tool="...">`)، `src/posts/*.md` المقالات، `src/pages/*.html` صفحات الثقة.
- `scripts/build.py` يولّد `dist/basira-theme.xml` (القالب) و`dist/basira-import.xml` (استيراد المقالات والصفحات) و`dist/fixtures.json` (للاختبار).
- الاختبارات: `node qa/core-test.mjs` (الحساب)، `node qa/tools-ui.mjs` (واجهات الأدوات)، `node qa/site-shots.mjs` (تصوير وفحص الفيض). تحتاج Playwright.

## النشر (يدوي، لا API في بلوجر للقالب)
1. مدونة Blogger باسم «BASIRA | بصيرة» (اللغة العربية).
2. القالب: Theme ← Restore ← ارفع `dist/daqqa-theme.xml`.
3. المحتوى: Settings ← Manage blog ← Import content ← `dist/daqqa-import.xml` (يضم 10 مقالات و16 صفحة منها `tools`). إن فشل الاستيراد أنشئ الصفحات يدوياً بنفس الروابط `/p/<slug>.html`.
4. تأكد أن روابط الصفحات تطابق: `/p/age-calculator.html` ... و`/p/tools.html` و`/p/about.html`.
5. Search Console: أضف الموقع وأرسل `sitemap.xml`. AdSense: أضف الموقع الجديد من الحساب نفسه، و`ads.txt` من الإعدادات.
6. Google Analytics: أنشئ خاصية جديدة وشغّل `BASIRA_GA_ID=G-XXXX python3 scripts/build.py` ثم أعد رفع القالب.

## قواعد
- لا ضمان لقبول AdSense. الإعلانات تُحمَّل فقط في المقالات وصفحات الأدوات (350+ كلمة) عبر `DQ-AD-GATE`.
- لا أسرار في المستودع (عام). الحلول مجانية فقط.
- كل رقم في المحتوى يُتحقق منه بالحساب أو بالاختبار. لا تضف معلومة لا يمكن التحقق منها.
- المقالات كتبت بمساعدة الذكاء الاصطناعي: على المالك مراجعتها بنفسه وتعديل صفحة «سياسة التحرير» لتطابق الواقع.


## النشر عبر GitHub
- GitHub Actions يبني القالب وملف الاستيراد ويرفعهما كـ Artifact باسم `basira-blogger-release`.
- Blogger API v3 يدعم المقالات والصفحات، لكنه لا يوفّر واجهة رسمية لرفع/تحديث ملف Theme XML؛ لذلك لا يمكن استبدال القالب تلقائياً من GitHub دون واجهة Blogger نفسها.
- Workflow القديم لمزامنة الصفحات كان موجوداً في تاريخ المستودع لكنه غير موجود حالياً على `main`. لم تتم استعادة مزامنة صفحات API لتجنب إنشاء صفحات مكررة أو الكتابة فوق صفحات Blogger دون قراءة حالتها الحالية.
- بعد نجاح البناء، يُنزّل المالك Artifact ويرفع `basira-theme.xml` من Blogger → Theme → Restore. ثم يستورد `basira-import.xml` من Settings → Manage blog → Import content.
