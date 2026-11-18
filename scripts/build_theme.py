#!/usr/bin/env python3
"""يبني قالب Blogger الكامل theme/smart-choice-blogger.xml من theme/src (CSS مدمج + HTML من الخادم).
الروابط تُقرأ من .blogger-pages-state.json و assets/content/tool-urls.json حتى لا تُكتب يدوياً."""
import json, re, urllib.parse
from pathlib import Path
R = Path(__file__).resolve().parent.parent
SRC = R / "theme/src"
BASE = "https://smartchoicee1.blogspot.com"
state = json.loads((R / ".blogger-pages-state.json").read_text(encoding="utf-8"))
TU = json.loads((R / "assets/content/tool-urls.json").read_text(encoding="utf-8"))
def page(name): return state[name + ".md"]["url"]
URLS = {k: page(k) for k in ["tools", "rates", "decide", "compare", "about", "editorial", "contact", "advertise", "privacy", "terms", "sitemap"]}
def T(k): return BASE + TU[k] if TU[k].startswith("/") else TU[k]

TOOLS = {
 "taxeg": ("ضريبة المرتبات", "صافي الراتب بعد التأمينات والضريبة"), "budget": ("الميزانية الشهرية", "المتبقي من دخلك بعد الإنفاق"),
 "saving": ("هدف الادخار", "كم تدخر شهرياً لتبلغ هدفك"), "hourly": ("قيمة ساعتك", "كم تساوي ساعة عملك"),
 "loan": ("القرض", "القسط الشهري وإجمالي الفوائد"), "payoff": ("سداد القرض مبكراً", "ما توفره إذا عجّلت السداد"),
 "loancompare": ("مقارنة عرضي تمويل", "أي العرضين أقل فوائد"), "installment": ("التقسيط", "الفرق بين التقسيط والكاش"),
 "effrate": ("الفائدة الفعلية للتقسيط", "التكلفة الحقيقية كنسبة سنوية"),
 "bankdep": ("عائد شهادة الادخار", "عائد الشهادة على مبلغ ومدة"), "compound": ("نمو الادخار", "إضافة شهرية وفائدة مركبة"),
 "rule72": ("مضاعفة المال (قاعدة 72)", "المدة التقريبية للمضاعفة"), "inflation": ("التضخم والقوة الشرائية", "كيف تُضعف الأسعار قوة مالك"),
 "roi": ("العائد على الاستثمار", "عائد استثمارك بالنسبة والمبلغ"), "rental": ("العائد الإيجاري للعقار", "العائد السنوي من الإيجار"),
 "discount": ("حاسبة الخصم", "السعر بعد الخصم وقيمة التوفير"), "stack": ("خصومات متتالية", "الخصم الحقيقي بعد عدة خصومات"),
 "unit": ("مقارنة سعر الوحدة", "أيهما أرخص بالجرام أو اللتر"), "cashback": ("قيمة الكاش باك", "ما تساويه النقاط والاسترداد"),
 "total": ("التكلفة الإجمالية", "السعر النهائي مع الشحن والرسوم"), "compare": ("مقارنة المنتجات", "منتجان بالتكلفة الشهرية الحقيقية"),
 "sub": ("اشتراك سنوي أم شهري", "أيهما أوفر"), "split": ("قسمة الفاتورة", "تقسيم الفاتورة مع البقشيش"),
 "appl": ("تكلفة تشغيل جهاز", "ما يضيفه الجهاز لفاتورة الكهرباء"), "trip": ("تكلفة الرحلة", "الوقود ونصيب كل راكب"),
 "decide": ("مركز القرار", "رتّب خياراتك بمعايير وأوزان"),
 "margin": ("هامش الربح", "هامش الربح وسعر البيع"), "breakeven": ("نقطة التعادل", "المبيعات اللازمة لتغطية التكاليف"),
 "vat": ("الضريبة المضافة", "إضافة الضريبة أو استخراجها"), "percent": ("النسبة المئوية", "نسبة من رقم أو رقم من نسبة"),
 "gold": ("الذهب والمصنعية", "قيمة القطعة بالجرام والعيار"), "fx": ("تحويل عملة", "تحويل مبلغ مع العمولة"), "zakat": ("حاسبة الزكاة", "تقدير الزكاة من مدخلاتك"),
}
CATS = [  # key, اسم, أيقونة, وصف, أدوات, وسم المقالات
 ("pay", "الرواتب والميزانية", "wallet", "اعرف ما يصلك فعلاً من راتبك وكيف توزّعه وتدخر منه.", ["taxeg", "budget", "saving", "hourly"], "الرواتب والميزانية"),
 ("loan", "القروض والتقسيط", "bank", "احسب القسط وإجمالي الفوائد وقارن العروض قبل أي التزام شهري.", ["loan", "payoff", "loancompare", "installment", "effrate"], "القروض والتقسيط"),
 ("save", "الادخار والاستثمار", "trend", "قدّر نمو مالك وعائده الحقيقي بعد التضخم.", ["bankdep", "compound", "inflation", "roi", "rule72", "rental"], "الادخار والتضخم"),
 ("shop", "التسوق والخصومات", "tag", "اكشف العرض الأرخص فعلاً: خصم، سعر وحدة، تكلفة إجمالية.", ["discount", "stack", "unit", "cashback", "total", "compare", "sub", "split", "appl", "trip", "decide"], "التسوق والخصومات"),
 ("biz", "مشروعك الصغير", "store", "سعّر منتجك واعرف نقطة التعادل قبل أن تحدد سعر البيع.", ["margin", "breakeven", "vat", "percent"], "مشروعك الصغير"),
 ("gold", "الذهب والعملات والزكاة", "coin", "أسعار مرجعية محدّثة وحاسبات المصنعية والتحويل والزكاة.", ["gold", "fx", "zakat"], None),
]
LABEL_DESC = {
 "الرواتب والميزانية": "كيف يُحسب صافي المرتب، وكيف توزّع دخلك وتبني صندوق طوارئ وتراجع اشتراكاتك. شروح بأرقام محسوبة.",
 "القروض والتقسيط": "القسط وإجمالي الفوائد والتكلفة الحقيقية للتقسيط، مع أمثلة تقارن بين المدد والعروض.",
 "الادخار والتضخم": "كيف تخطط لهدف ادخار وتقيس العائد الحقيقي بعد التضخم بدل الاكتفاء برقم الرصيد.",
 "التسوق والخصومات": "الخصومات وسعر الوحدة والتكلفة الإجمالية وسياسات الضمان والاسترجاع، لتشتري بوعي.",
 "مشروعك الصغير": "هامش الربح والتسعير والضريبة المضافة ونقطة التعادل لأصحاب المشروعات الصغيرة.",
}
ICON = {
"wallet": '<path d="M3 7a2 2 0 0 1 2-2h13v4"/><path d="M3 7v11a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H5a2 2 0 0 1-2-2z"/><circle cx="16.5" cy="14.5" r="1"/>',
"bank": '<path d="M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/>',
"trend": '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
"tag": '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.2"/>',
"store": '<path d="M4 9l1-5h14l1 5M4 9v11h16V9M4 9a3 3 0 0 0 5.3 1.9A3 3 0 0 0 14.7 10.9 3 3 0 0 0 20 9M10 20v-5h4v5"/>',
"coin": '<circle cx="12" cy="12" r="9"/><path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1 0-2-.5-2.5-1.5M12 6v2M12 16v2"/>',
"search": '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>', "menu": '<path d="M4 7h16M4 12h16M4 17h16"/>',
"moon": '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
"sun": '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
"arrow": '<path d="M19 12H5M11 6l-6 6 6 6"/>', "chev": '<path d="M15 6l-6 6 6 6"/>', "chev-d": '<path d="M6 9l6 6 6-6"/>',
"check": '<path d="M5 12.5l4.5 4.5L19 7"/>', "shield": '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
"bolt": '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>', "book": '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7"/>',
"calc": '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
"lock": '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
"user": '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>', "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
"cal": '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
}
sprite = "".join(f'<symbol id="i-{k}" viewBox="0 0 24 24">{v}</symbol>' for k, v in ICON.items())
def ic(n, cls="ic"): return f'<svg class="{cls}"><use href="#i-{n}"/></svg>'
def lab_url(l): return "/search/label/" + urllib.parse.quote(l)

n_tools = len(TOOLS)
mega = ""
for k, name, icon, desc, tools, _ in CATS:
    mega += f'<div style="--c:var(--c-{k})"><h4>{ic(icon)}{name}</h4>' + "".join(f'<a href="{T(t)}">{TOOLS[t][0]}</a>' for t in tools[:5]) + "</div>"
foot_cats = "".join(f'<li><a href="{URLS["tools"]}">{name}</a></li>' for _, name, *_ in CATS)

def cat_card(k, name, icon, desc, tools):
    li = "".join(f'<li><a href="{T(t)}"><span>{TOOLS[t][0]}</span>{ic("chev")}</a></li>' for t in tools[:6])
    return f'<article class="cat cat-{k}"><div class="cat-i">{ic(icon)}</div><h3>{name}</h3><p>{desc}</p><ul>{li}</ul><a class="cat-more" href="{URLS["tools"]}">كل حاسبات القسم {ic("arrow")}</a></article>'
cats_html = "".join(cat_card(k, n, i, d, t) for k, n, i, d, t, _ in CATS)
ASKS = [("effrate", "هل التقسيط أغلى من الكاش فعلاً؟", "احسب الفائدة الفعلية"), ("discount", "هل هذا الخصم يوفّر لي فعلاً؟", "احسب السعر بعد الخصم"),
        ("loan", "كم قسط القرض وكم أدفع فوائد؟", "احسب القسط"), ("taxeg", "كم صافي راتبي بعد الضريبة؟", "احسب صافي المرتب"),
        ("unit", "أي عبوة أرخص بسعر الوحدة؟", "قارن العبوات"), ("margin", "بكم أبيع منتجي لأربح فعلاً؟", "احسب هامش الربح")]
asks_html = "".join(f'<a class="ask" href="{T(k)}"><b>{q}</b><span>{a} {ic("arrow")}</span></a>' for k, q, a in ASKS)
n_posts = len([p for p in (R / "posts").glob("*.md") if not p.name.startswith("_") and "publish: false" not in p.read_text(encoding="utf-8")[:300]])
quick = "".join(f'<a href="{T(k)}">{TOOLS[k][0]}</a>' for k in ["taxeg", "loan", "discount", "effrate", "bankdep", "gold"])

pcard = ('<article class="pcard"><div class="pcard-top"></div><div class="pcard-b">'
 '<div><b:loop values=\'data:post.labels\' var=\'label\'><a class=\'chip\' expr:href=\'data:label.url\'><data:label.name/></a> </b:loop></div>'
 '<h3><a expr:href=\'data:post.url\'><data:post.title/></a></h3><p><data:post.snippet/></p>'
 '<div class="pcard-m"><span><data:post.timestamp/></span><a expr:href=\'data:post.url\'>اقرأ المقال ' + ic("arrow") + '</a></div></div></article>')

HOME = f'''<section class="hero"><div class="wrap hero-in">
<div><span class="kicker"><i></i>مجاني · بلا تسجيل · الحسابات داخل متصفحك</span>
<h1>احسب <span>قبل أن توقّع</span> أي التزام مالي</h1>
<p class="lead">أكثر من {n_tools} حاسبة بالجنيه المصري: صافي المرتب بعد الضريبة، قسط القرض وفوائده، الفرق بين التقسيط والكاش، وعائد الادخار. تحت كل حاسبة شرح المعادلة ومثال محسوب لتتحقق بنفسك.</p>
<div class="cta"><a class="btn" href="{URLS["tools"]}">{ic("calc")} تصفّح الحاسبات</a><a class="btn alt" href="{T("taxeg")}">احسب صافي مرتبك</a></div>
<div class="quick"><span>الأكثر استخداماً:</span>{quick}</div></div>
<div class="hcalc"><div class="hcalc-h"><b>مثال سريع: صافي المرتب</b><a href="{T("taxeg")}">الحاسبة الكاملة ←</a></div>
<div class="row"><div><label for="hc-g">الراتب الإجمالي</label><input id="hc-g" type="number" inputmode="decimal" value="20000" min="0"/></div><div><label for="hc-i">التأمينات الشهرية</label><input id="hc-i" type="number" inputmode="decimal" value="1100" min="0"/></div></div>
<div class="hcalc-out"><div><small>صافي ما يصلك شهرياً</small><strong id="hc-n">16,293 جنيه</strong></div><div><small>الضريبة شهرياً</small><strong id="hc-t">2,607</strong></div></div>
<div class="hbar"><i class="a" id="hc-ba" style="width:81%"></i><i class="b" id="hc-bb" style="width:13%"></i><i class="c" id="hc-bc" style="width:5.5%"></i></div>
<div class="hleg"><span>الصافي</span><span class="b">الضريبة</span><span class="c">التأمينات</span></div>
<p class="hcalc-n">تقدير استرشادي بشرائح معلنة وإعفاء شخصي 20 ألف جنيه سنوياً. المرجع النهائي شيت مرتبك.</p></div>
</div></section>
<div class="wrap"><div class="stats"><div><b>{n_tools}+</b><span>حاسبة مجانية</span></div><div><b>{n_posts}</b><span>دليل ومقال بأرقام محسوبة</span></div><div><b>كل ساعة</b><span>تحديث أسعار الذهب والفضة</span></div><div><b>100%</b><span>الحساب داخل متصفحك</span></div></div></div>
<div class="wrap"><section class="sec" style="padding-top:34px"><div class="sc-rates-wrap sc-ticker" hidden="hidden"><div id="sc-rates-strip" class="sc-rs"></div><a class="sc-ticker-link" href="{URLS["rates"]}">كل الأسعار ←</a></div></section></div>
<div class="wrap"><section class="sec"><div class="sec-h"><div><h2>الحاسبات حسب الموضوع</h2><p>اختر ما يخص قرارك: راتب أو قرض أو ادخار أو تسوق أو مشروع.</p></div><a href="{URLS["tools"]}">كل الحاسبات {ic("arrow")}</a></div><div class="cats">{cats_html}</div></section>
<section class="sec"><div class="sec-h"><div><h2>ابدأ من سؤالك</h2><p>أسئلة يومية يجيب عنها حساب بسيط.</p></div></div><div class="asks">{asks_html}</div></section>
<section class="sec" id="guides"><div class="sec-h"><div><h2>أحدث الأدلة والمقالات</h2><p>شروح عملية بأمثلة محسوبة وجداول، ومرتبطة بالحاسبة المناسبة.</p></div><a expr:href='data:blog.homepageUrl + &quot;search?max-results=24&quot;'>كل المقالات {ic("arrow")}</a></div>
<div class="posts"><b:loop values='data:posts' var='post'>{pcard}</b:loop></div></section>
<section class="sec"><div class="sec-h"><div><h2>لماذا تثق في الأرقام هنا؟</h2></div></div><div class="trust">
<div><div class="cat-i">{ic("calc")}</div><h3>معادلات معلنة</h3><p>كل حاسبة تعرض معادلتها وحدود نتيجتها ومثالاً محسوباً، فتتحقق بنفسك ولا تثق بصندوق أسود.</p></div>
<div><div class="cat-i">{ic("lock")}</div><h3>بياناتك في متصفحك</h3><p>الحسابات تتم على جهازك ولا نطلب تسجيلاً ولا نرسل ما تكتبه لأي جهة.</p></div>
<div><div class="cat-i">{ic("shield")}</div><h3>مصادر وتواريخ</h3><p>نذكر مصدر كل سعر ووقت تحديثه، ونُخفي ما تقادم بدل أن نعرض رقماً قديماً.</p></div></div></section>
<section class="sec"><div class="band"><div><h2>جرّب أرقامك الآن</h2><p>ابدأ بصافي مرتبك أو بقسط قرضك، وشاهد الرسم والجدول وسجّل الحساب لتعود إليه.</p></div><a class="btn" href="{URLS["tools"]}">افتح الحاسبات</a></div></section></div>'''

ITEM = '''<div class="wrap page-pad"><nav class="crumbs" aria-label="مسار التصفح"><a expr:href='data:blog.homepageUrl'>الرئيسية</a><span>›</span><a expr:href='data:blog.homepageUrl + &quot;search?max-results=24&quot;'>المقالات</a></nav>
<b:loop values='data:posts' var='post'><article class="post" itemscope="itemscope" itemtype="https://schema.org/BlogPosting">
<header class="post-h"><div class="sc-post-labels"><b:loop values='data:post.labels' var='label'><a class='chip' expr:href='data:label.url' rel='tag'><data:label.name/></a> </b:loop></div>
<h1 class="entry-title post-title" itemprop="headline"><data:post.title/></h1>
<div class="post-m"><span>''' + ic("user") + '''<data:post.author.name/></span><span>''' + ic("cal") + '''<time expr:datetime='data:post.timestampISO8601' itemprop="datePublished"><data:post.timestamp/></time></span><span>''' + ic("clock") + '''<i id="rt"></i></span></div></header>
<div class="prose post-body entry-content" itemprop="articleBody"><data:post.body/></div>
<div class="author"><div class="author-i">T</div><div><b>Taha</b><p>صاحب Smart Choice ومحرره. موقع مستقل من مصر يشرح حسابات المال اليومي بأمثلة قابلة للتحقق. للتصحيح أو الاقتراح راسلنا من صفحة اتصل بنا.</p></div></div>
<nav class="pager" aria-label="التنقل بين المقالات"><b:if cond='data:newerPageUrl'><a expr:href='data:newerPageUrl'>→ المقال الأحدث</a></b:if><b:if cond='data:olderPageUrl'><a expr:href='data:olderPageUrl'>المقال الأقدم ←</a></b:if></nav>
</article></b:loop></div>'''

STATIC = '''<div class="wrap docpage"><b:loop values='data:posts' var='post'><article class="static-page"><data:post.body/></article></b:loop></div>'''

label_blocks = "".join(f"<b:if cond='data:blog.searchLabel == &quot;{l}&quot;'><p>{d}</p></b:if>" for l, d in LABEL_DESC.items())
LISTING = f'''<div class="wrap"><div class="lhead">
<b:if cond='data:blog.searchLabel'><span class="chip">قسم المقالات</span><h1><data:blog.searchLabel/></h1>{label_blocks}
<b:elseif cond='data:blog.searchQuery'/><span class="chip">بحث</span><h1>نتائج البحث: <data:blog.searchQuery/></h1><p>المقالات المطابقة لبحثك. جرّب كلمات أقصر إن لم تجد ما تريد.</p>
<b:else/><span class="chip">المكتبة</span><h1>كل الأدلة والمقالات</h1><p>شروح عملية لحسابات المال اليومي، كل مقال مرتبط بحاسبة تطبّق عليها أرقامك.</p></b:if></div>
<div class="posts"><b:loop values='data:posts' var='post'>{pcard}</b:loop></div>
<nav class="pager" aria-label="التنقل بين الصفحات"><b:if cond='data:newerPageUrl'><a expr:href='data:newerPageUrl'>→ الأحدث</a></b:if><b:if cond='data:olderPageUrl'><a expr:href='data:olderPageUrl'>الأقدم ←</a></b:if></nav></div>'''

ERROR = f'''<div class="wrap empty"><h1>٤٠٤</h1><h2>هذه الصفحة غير موجودة</h2><p>ربما تغيّر الرابط. ابدأ من الحاسبات أو ابحث عمّا تريد.</p><a class="btn" expr:href='data:blog.homepageUrl'>الرئيسية</a> <a class="btn alt" href="{URLS["tools"]}">الحاسبات</a></div>'''

skin = "\n".join((SRC / f).read_text(encoding="utf-8") for f in ["skin-1-base.css", "skin-2-pages.css", "skin-3-tools.css", "skin-4-admin.css"])
skin += "\n.hero h1 span{isolation:isolate}[hidden]{display:none!important}\n"
out = (SRC / "theme.tpl.xml").read_text(encoding="utf-8")
rep = {"SKIN": skin, "SPRITE": sprite, "MEGA": mega, "FOOT_CATS": foot_cats, "HOME": HOME, "ITEM": ITEM, "STATIC": STATIC, "LISTING": LISTING, "ERROR": ERROR,
       "HEAD_META": (SRC / "head-meta.xml").read_text(encoding="utf-8"), "HEAD_SCRIPTS": (SRC / "head-scripts.xml").read_text(encoding="utf-8"), "N_TOOLS": str(n_tools)}
for k, v in rep.items(): out = out.replace("{{" + k + "}}", v)
for k, v in URLS.items(): out = out.replace("{{URL_" + k + "}}", v)
left = re.findall(r"\{\{[A-Za-z_]+\}\}", out)
assert not left, left
(R / "theme/smart-choice-blogger.xml").write_text(out, encoding="utf-8")
print("theme built", len(out), "bytes; tools", n_tools, "posts", n_posts)
