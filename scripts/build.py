#!/usr/bin/env python3
"""بناء موقع BASIRA | بصيرة: يولّد dist/basira-theme.xml (قالب بلوجر) و dist/basira-import.xml (مقالات وصفحات للاستيراد) و dist/fixtures.json (للاختبار)."""
import html, json, os, re, sys, datetime
import markdown

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC, DIST = os.path.join(ROOT, 'src'), os.path.join(ROOT, 'dist')
os.makedirs(DIST, exist_ok=True)
ADSENSE_CLIENT = 'ca-pub-1235197294708204'
GA_ID = os.environ.get('BASIRA_GA_ID', '')  # اتركه فارغاً حتى تنشئ خاصية Analytics للموقع الجديد
AUTHOR = 'طه'

# (slug, title, group, short description, sample)
TOOLS = [
    ('age-calculator', 'حاسبة العمر', 'A', 'عمرك بالسنين والأشهر والأيام، ميلادياً وهجرياً، وموعد عيد ميلادك القادم.'),
    ('date-difference', 'الفرق بين تاريخين', 'A', 'عدد الأيام والأسابيع والأشهر بين أي تاريخين مع خيار احتساب يوم النهاية.'),
    ('hijri-converter', 'تحويل التاريخ الهجري والميلادي', 'A', 'تحويل في الاتجاهين بتقويم أم القرى مع اسم اليوم.'),
    ('business-days', 'حاسبة أيام العمل', 'A', 'أيام العمل بين تاريخين أو بعد عدد من الأيام، بعطلة الجمعة والسبت وإجازاتك.'),
    ('countdown', 'كم باقي على رمضان والأعياد', 'A', 'العد التنازلي لرمضان والعيدين ورأس السنة الهجرية أو لأي تاريخ.'),
    ('numbers-to-words', 'كتابة الأرقام والمبالغ بالحروف', 'B', 'تفقيط الجنيه والريال والدولار والدرهم بالإعراب المناسب.'),
    ('percentage-calculator', 'حاسبة النسبة المئوية', 'B', 'ست عمليات: نسبة من رقم، التغير، الإضافة، الخصم، والعكس.'),
    ('word-counter', 'عدّاد الكلمات والحروف', 'B', 'كلمات وحروف وجمل وزمن قراءة وأكثر الكلمات تكراراً.'),
    ('unit-converter', 'محوّل الوحدات والمساحات المصرية', 'B', 'الفدان والقيراط والسهم والقصبة والرطل بجانب الوحدات العالمية.'),
    ('time-calculator', 'حاسبة ساعات العمل', 'B', 'مدة الدوام بالساعات العشرية وأجر اليوم مع خصم الاستراحة.'),
]
TOOL = {t[0]: t for t in TOOLS}
LABEL_DESC = {
    'التقويم والتواريخ': 'شروح التقويمين الهجري والميلادي وحساب الأعمار والفروق بين التواريخ.',
    'الأرقام واللغة': 'كتابة الأرقام والمبالغ بالحروف وقواعد العدد والمعدود.',
    'الوحدات والمقاييس': 'الوحدات المصرية التقليدية وتحويلها إلى الوحدات العالمية.',
    'الحساب اليومي': 'النسب وأيام العمل وساعات الدوام: حساب بلا التباس.',
}
PAGES = [  # slug, title, file
    ('about', 'عن بصيرة', 'about.html'), ('contact', 'اتصل بنا', 'contact.html'), ('editorial-policy', 'سياسة التحرير', 'editorial-policy.html'),
    ('privacy-policy', 'سياسة الخصوصية', 'privacy-policy.html'), ('terms', 'شروط الاستخدام', 'terms.html')]


def read(p):
    with open(os.path.join(SRC, p), encoding='utf-8') as f:
        return f.read()


def li_tools(group):
    return ''.join(f"<li><a href='/p/{s}.html'>{html.escape(t)}</a></li>" for s, t, g, d in TOOLS if g == group)


# ---------- المحتوى ----------
def posts():
    out = []
    for fn in sorted(os.listdir(os.path.join(SRC, 'posts'))):
        if not fn.endswith('.md'):
            continue
        raw = read('posts/' + fn)
        m = re.match(r'---\n(.*?)\n---\n(.*)', raw, re.S)
        meta = dict(l.split(':', 1) for l in m.group(1).split('\n') if ':' in l)
        meta = {k.strip(): v.strip() for k, v in meta.items()}
        body = markdown.markdown(m.group(2), extensions=['tables'])
        body = re.sub(r'<p>(<span class="eq">.*?</span>)</p>', r'\1', body, flags=re.S)
        tools = [t.strip() for t in meta.get('tools', '').split(',') if t.strip()]
        rel = ''.join(f"<li><a href='/p/{s}.html'>{html.escape(TOOL[s][1])}</a> — {html.escape(TOOL[s][3])}</li>" for s in tools)
        body += f"<div class='related'><h2>أدوات مرتبطة بهذا المقال</h2><ul>{rel}</ul></div>"
        out.append(dict(slug=fn[:-3], title=meta['title'], labels=[x.strip() for x in meta['labels'].split(',')], date=meta['date'], summary=meta['summary'], body=body))
    return out


def tool_pages():
    out = []
    for s, t, g, d in TOOLS:
        out.append(dict(slug=s, title=t, body=read(f'tools/{s}.html'), desc=d))
    return out


def tools_hub():
    rows = ''
    for g, name in (('A', 'التواريخ والوقت'), ('B', 'الأرقام والنصوص والوحدات')):
        rows += f"<h2>{name}</h2><ul class='idx'>" + ''.join(
            f"<li><a href='/p/{s}.html'><span class='n'>{i + 1:02d}</span><span><span class='t'>{html.escape(t)}</span><span class='d'>{html.escape(d)}</span></span><span class='go'>افتح الأداة ←</span></a></li>"
            for i, (s, t, gg, d) in enumerate(TOOLS) if gg == g) + '</ul>'
    return "<p class='lede'>كل أدوات بصيرة في مكان واحد. تعمل كلها داخل متصفحك دون تسجيل، وتحت كل أداة شرح لطريقة الحساب وحدودها.</p><div class='hub'>" + rows + '</div>'


# ---------- القوالب ----------
def idx_list(group):
    start = 0 if group == 'A' else 5
    return "<ul class='idx'>" + ''.join(
        f"<li><a href='/p/{s}.html'><span class='n'>{start + i + 1:02d}</span><span><span class='t'>{html.escape(t)}</span><span class='d'>{html.escape(d)}</span></span><span class='go'>افتح ←</span></a></li>"
        for i, (s, t, g, d) in enumerate([x for x in TOOLS if x[2] == group])) + '</ul>'


HOME = f"""<section class='intro'><div class='wrap'><div>
<h1>أدوات عربية دقيقة للتواريخ والأرقام والوحدات</h1>
<p>تحسب بلا تسجيل وبلا إرسال بياناتك لأحد، وتشرح لك تحت كل أداة طريقة الحساب وحدودها وأمثلة يمكنك التحقق منها.</p>
<div class='quick'><a class='btn' href='/p/age-calculator.html'>احسب عمرك</a><a class='btn alt' href='/p/numbers-to-words.html'>اكتب مبلغاً بالحروف</a><a class='btn alt' href='/p/tools.html'>كل الأدوات</a></div></div>
<div class='plate' id='plate' aria-label='تاريخ اليوم'></div>
</div></section>
<div class='wrap'>
<div class='cols'>
<section class='sec'><h2>التواريخ والوقت <small>خمس أدوات</small></h2>{idx_list('A')}</section>
<section class='sec'><h2>الأرقام والنصوص والوحدات <small>خمس أدوات</small></h2>{idx_list('B')}</section>
</div>
<section class='sec'><h2>أحدث المقالات <small>شروح بأمثلة محسوبة</small></h2>
<ul class='posts'><b:loop values='data:posts' var='post'><li><div class='meta'><b:loop values='data:post.labels' var='label'><span><data:label.name/></span></b:loop><time expr:datetime='data:post.timestampISO8601'><data:post.timestamp/></time></div>
<a expr:href='data:post.url'><data:post.title/></a><p><data:post.snippet/></p></li></b:loop></ul>
<p><a href='/search?max-results=24'>كل المقالات ←</a></p></section>
<section class='sec'><h2>كيف نعمل</h2>
<div class='method'>
<div><h3>كل أداة مشروحة</h3><p>تحت كل أداة طريقة الحساب بالمعادلة وأمثلة محسوبة وأسئلة شائعة، حتى تفهم النتيجة لا أن تصدّقها فقط.</p></div>
<div><h3>اختبار الحالات الحدّية</h3><p>نختبر الأدوات على نهاية الشهر والسنة الكبيسة والإعراب والكسور، وهي مواضع الخطأ المعتادة.</p></div>
<div><h3>خصوصيتك محفوظة</h3><p>يجري الحساب كله في متصفحك. لا تُرسل التواريخ ولا النصوص إلى أي خادم.</p></div>
</div></section>
</div>"""

ITEM = """<div class='wrap page'><b:loop values='data:posts' var='post'><article>
<nav aria-label='مسار التصفح' class='crumbs'><a expr:href='data:blog.homepageUrl'>الرئيسية</a> › <a expr:href='data:blog.homepageUrl + &quot;search?max-results=24&quot;'>المقالات</a></nav>
<div class='labels'><b:loop values='data:post.labels' var='label'><a expr:href='data:label.url' rel='tag'><data:label.name/></a></b:loop></div>
<h1 class='entry-title' itemprop='headline'><data:post.title/></h1>
<div class='byline'><span>بقلم <data:post.author.name/></span><time expr:datetime='data:post.timestampISO8601' itemprop='datePublished'><data:post.timestamp/></time><span id='rt'></span></div>
<div class='layout'><div>
<nav hidden='hidden' id='toc'></nav>
<div class='prose entry-content' data-toc='1' itemprop='articleBody'><data:post.body/></div>
<nav aria-label='التنقل بين المقالات' class='pager'><b:if cond='data:newerPageUrl'><a expr:href='data:newerPageUrl'>→ المقال الأحدث</a></b:if><b:if cond='data:olderPageUrl'><a expr:href='data:olderPageUrl'>المقال الأقدم ←</a></b:if></nav>
</div>
<aside class='side'><h4>الأدوات</h4><ul>{A}{B}</ul><h4>اقرأ أيضاً</h4><ul><li><a expr:href='data:blog.homepageUrl + &quot;search?max-results=24&quot;'>كل المقالات</a></li><li><a href='/p/editorial-policy.html'>سياسة التحرير</a></li></ul></aside>
</div></article></b:loop></div>""".replace('{A}', li_tools('A')).replace('{B}', li_tools('B'))

STATIC = """<div class='wrap page'><b:loop values='data:posts' var='post'><article>
<nav aria-label='مسار التصفح' class='crumbs'><a expr:href='data:blog.homepageUrl'>الرئيسية</a> › <data:post.title/></nav>
<h1><data:post.title/></h1>
<div class='layout'><div class='prose entry-content'><data:post.body/></div>
<aside class='side'><h4>الأدوات</h4><ul>{A}{B}</ul></aside></div></article></b:loop></div>""".replace('{A}', li_tools('A')).replace('{B}', li_tools('B'))

label_blocks = ''.join(f"<b:if cond='data:blog.searchLabel == &quot;{l}&quot;'><p class='lede'>{d}</p></b:if>" for l, d in LABEL_DESC.items())
LISTING = f"""<div class='wrap page'>
<nav aria-label='مسار التصفح' class='crumbs'><a expr:href='data:blog.homepageUrl'>الرئيسية</a> › المقالات</nav>
<b:if cond='data:blog.searchLabel'><h1><data:blog.searchLabel/></h1>{label_blocks}
<b:elseif cond='data:blog.searchQuery'/><h1>نتائج البحث: <data:blog.searchQuery/></h1><p class='lede'>المقالات المطابقة لبحثك.</p>
<b:else/><h1>كل المقالات</h1><p class='lede'>شروح بأمثلة محسوبة، كل مقال مرتبط بالأداة المناسبة.</p></b:if>
<ul class='posts'><b:loop values='data:posts' var='post'><li><div class='meta'><b:loop values='data:post.labels' var='label'><span><data:label.name/></span></b:loop><time expr:datetime='data:post.timestampISO8601'><data:post.timestamp/></time></div>
<a expr:href='data:post.url'><data:post.title/></a><p><data:post.snippet/></p></li></b:loop></ul>
<nav aria-label='التنقل بين الصفحات' class='pager'><b:if cond='data:newerPageUrl'><a expr:href='data:newerPageUrl'>→ الأحدث</a></b:if><b:if cond='data:olderPageUrl'><a expr:href='data:olderPageUrl'>الأقدم ←</a></b:if></nav>
</div>"""

ERROR = """<div class='wrap err'><h1>404</h1><h2>هذه الصفحة غير موجودة</h2><p>ربما تغيّر الرابط. ابدأ من الأدوات أو ارجع إلى الرئيسية.</p><p><a class='btn' expr:href='data:blog.homepageUrl'>الرئيسية</a> <a class='btn alt' href='/p/tools.html'>الأدوات</a></p></div>"""

GA = (f"""  <script async='async' src='https://www.googletagmanager.com/gtag/js?id={GA_ID}'></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','{GA_ID}');</script>\n""" if GA_ID else '')

HEAD_SCRIPTS = GA + f"""  <!-- AdSense: يُحمَّل فقط في المقالات وصفحات الأدوات والشروح ذات المحتوى الكافي. لا إعلانات في الرئيسية ولا الفهارس ولا البحث ولا 404. -->
  <script>//<![CDATA[ /*DQ-AD-GATE*/
  (function(){{
    var CLIENT='{ADSENSE_CLIENT}',MIN=350,tries=0,done=false;
    function eligible(){{
      var m=document.querySelector('meta[name="dq-pagetype"]'),pt=m?m.getAttribute('content'):'';
      if(pt!=='item'&&pt!=='static_page')return false;
      var main=document.querySelector('#main-content');if(!main||main.querySelector('.hub'))return false;
      var c=main.querySelector('.prose');if(!c)return false;c=c.cloneNode(true);
      c.querySelectorAll('.tool,.related,script,style,nav').forEach(function(n){{n.remove();}});
      return (c.textContent||'').split(/\\s+/).filter(function(w){{return w.length>1;}}).length>=MIN;
    }}
    function load(){{if(done)return;done=true;var s=document.createElement('script');s.async=true;s.crossOrigin='anonymous';s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+CLIENT;document.head.appendChild(s);}}
    function check(){{if(done)return;tries++;try{{if(eligible()){{load();return;}}}}catch(e){{}}if(tries<8)setTimeout(check,900);}}
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){{setTimeout(check,500);}});else setTimeout(check,500);
  }})();
  //]]></script>"""


def build_theme():
    css = read('style.css')
    core, app = read('core.js'), read('app.js')
    for name, txt in (('css', css), ('core', core), ('app', app)):
        assert ']]>' not in txt, f'{name} contains CDATA terminator'
    t = read('theme.tpl.xml')
    rep = {'{{CSS}}': css, '{{CORE}}': core, '{{APP}}': app, '{{HEAD_SCRIPTS}}': HEAD_SCRIPTS, '{{HOME}}': HOME, '{{ITEM}}': ITEM, '{{STATIC}}': STATIC,
           '{{LISTING}}': LISTING, '{{ERROR}}': ERROR, '{{FOOT_A}}': li_tools('A'), '{{FOOT_B}}': li_tools('B')}
    for k, v in rep.items():
        t = t.replace(k, v)
    assert '{{' not in t, 'placeholder left'
    with open(os.path.join(DIST, 'daqqa-theme.xml'), 'w', encoding='utf-8') as f:
        f.write(t)
    return len(t.encode())


def atom_entry(kind, idx, title, body, date, slug, labels=()):
    when = f'{date}T09:00:00.000+02:00'
    path = f'/p/{slug}.html' if kind == 'PAGE' else f"/{date[:4]}/{date[5:7]}/{slug}.html"
    cats = ''.join(f"<category scheme='http://www.blogger.com/atom/ns#' term='{html.escape(l)}'/>" for l in labels)
    return (f"<entry><id>tag:blogger.com,1999:blog-1.{kind.lower()}-{idx}</id><published>{when}</published><updated>{when}</updated>"
            f"<category scheme='http://schemas.google.com/g/2005#kind' term='http://schemas.google.com/blogger/2008/kind#{kind.lower()}'/>{cats}"
            f"<title type='text'>{html.escape(title)}</title><content type='html'>{html.escape(body)}</content>"
            f"<author><name>{AUTHOR}</name></author><blogger:type>{kind}</blogger:type><blogger:status>LIVE</blogger:status><blogger:filename>{path}</blogger:filename></entry>")


def build_import(ps, tp):
    now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.000Z')
    entries = []
    i = 1
    for p in ps:
        entries.append(atom_entry('POST', i, p['title'], p['body'], p['date'], p['slug'], p['labels'])); i += 1
    base = '2026-11-14'
    for t in tp:
        entries.append(atom_entry('PAGE', i, t['title'], t['body'], base, t['slug'])); i += 1
    entries.append(atom_entry('PAGE', i, 'كل الأدوات', tools_hub(), base, 'tools')); i += 1
    for slug, title, fn in PAGES:
        entries.append(atom_entry('PAGE', i, title, read('pages/' + fn), base, slug)); i += 1
    xml = (f"<?xml version='1.0' encoding='UTF-8'?><feed xmlns='http://www.w3.org/2005/Atom' xmlns:blogger='http://schemas.google.com/blogger/2018' xmlns:gd='http://schemas.google.com/g/2005' xmlns:thr='http://purl.org/syndication/thread/1.0'>"
           f"<id>tag:blogger.com,1999:blog-1.archive</id><updated>{now}</updated><title type='text'>BASIRA | بصيرة</title><generator version='7.00' uri='https://www2.blogger.com'>Blogger</generator>" + ''.join(entries) + '</feed>')
    with open(os.path.join(DIST, 'daqqa-import.xml'), 'w', encoding='utf-8') as f:
        f.write(xml)
    return len(entries)


def build_fixtures(ps, tp):
    fx = {'posts': ps, 'tools': tp, 'pages': [dict(slug=s, title=t, body=read('pages/' + fn)) for s, t, fn in PAGES], 'hub': tools_hub()}
    with open(os.path.join(DIST, 'fixtures.json'), 'w', encoding='utf-8') as f:
        json.dump(fx, f, ensure_ascii=False)


if __name__ == '__main__':
    ps, tp = posts(), tool_pages()
    size = build_theme()
    n = build_import(ps, tp)
    build_fixtures(ps, tp)
    print(f'theme {size} bytes | import entries {n} | posts {len(ps)} tools {len(tp)}')
