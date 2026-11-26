(function(){
'use strict';
var DICT={"ar":{"brand":"BASIRA | بصيرة","nav.games":"الألعاب","nav.topics":"المعرفة","nav.articles":"المقالات","nav.verify":"كيف نتحقق","search.ph":"ابحث في المقالات","search.btn":"بحث","search.label":"ابحث في الموقع","lang.switch":"English","theme.dark":"الوضع الداكن","theme.light":"الوضع الفاتح","hero.eyebrow":"Think. Discover. Play. · فكّر. اكتشف. العب.","manifesto.text":"في بصيرة ألعاب قصيرة تُمتع وتُعلّم. لكل سؤال مصدر، وكل جولة تعمل على جهازك بلا تسجيل. العب خمس دقائق، واخرج بمعلومة تستحق أن تُروى.","hero.title":"العب بذكاء. اكتشف أكثر.","hero.lede":"عشر ألعاب ذهنية وتحدٍّ جديد كل يوم، بأسئلة موثّقة المصدر. ابدأ فوراً بلا تسجيل، وتُحفظ نتائجك على جهازك.","hero.cta":"ابدأ اللعب الآن","hero.cta2":"استكشف المعرفة","games.title":"اختر تحدّيك","topics.title":"استكشف المعرفة","latest.title":"اقرأ ثم اختبر نفسك","verify.title":"كيف نتحقق","verify.text":"كل رقم أو تاريخ في مقالاتنا له مصدر مذكور، وأسئلة الألعاب تُراجع قبل ظهورها ولا تُولَّد أثناء اللعب.","verify.link":"اقرأ منهجنا","foot.note":"معلومات موثّقة وألعاب ذهنية بالعربية، تعمل بلا تسجيل.","foot.topics":"أقسام المعرفة","foot.about":"عن الموقع","foot.pending":"الصفحات التعريفية قيد الإعداد","lang.note":"محتوى الأسئلة والمقالات الإنجليزية قيد المراجعة، لذلك تظهر الأسئلة بالعربية الآن.","noscript":"الألعاب والتحدي اليومي تحتاج تفعيل JavaScript في متصفحك.","t.العلوم":"العلوم","t.التاريخ والحضارات":"التاريخ والحضارات","t.الجغرافيا والدول":"الجغرافيا والدول","t.التكنولوجيا":"التكنولوجيا","t.الثقافة العامة":"الثقافة العامة","t.الرياضيات والمنطق":"الرياضيات والمنطق","t.اللغة والأدب":"اللغة والأدب","t.الفضاء والفلك":"الفضاء والفلك","g.mcq.name":"اختبر معلوماتك","g.mcq.desc":"أربع إجابات وواحدة صحيحة، مع تفسير بعد كل سؤال","g.truefalse.name":"صح ولا خطأ؟","g.truefalse.desc":"احكم بسرعة قبل أن ينتهي الوقت","g.order.name":"رتّب الزمن","g.order.desc":"اسحب الأحداث إلى مكانها الصحيح","g.memory.name":"توأم الذاكرة","g.memory.desc":"اعثر على الأزواج بأقل محاولات","g.word.name":"فك الشفرة","g.word.desc":"كلمة مخفية وتلميحات تنقذك","g.start":"ابدأ","g.next":"التالي","g.finish":"النتيجة","g.again":"جولة جديدة","g.back":"رجوع","g.best":"أفضل نتيجة","g.score":"النقاط","g.streak":"سلسلة","g.time":"الوقت","g.level":"المستوى","g.easy":"سهل","g.medium":"متوسط","g.hard":"صعب","g.prog":"متدرج","g.pick":"اختر المستوى","g.qof":"السؤال {n} من {m}","g.hint":"حذف إجابتين (−3 نقاط)","g.correct":"إجابة صحيحة.","g.wrong":"إجابة غير صحيحة.","g.timeout":"انتهى الوقت.","g.check":"تحقق","g.up":"أعلى","g.down":"أسفل","g.moves":"المحاولات","g.pairs":"الأزواج","g.reveal":"اكشف حرفاً (−2 نقطة)","g.attempts":"المحاولات المتبقية","g.hintw":"التلميح","g.wordis":"الكلمة:","g.order.is":"الترتيب الصحيح:","g.result.pass":"أحسنت! اجتزت الجولة","g.result.fail":"قريب جداً! جرّب مرة أخرى","g.xp":"+{n} نقطة خبرة","g.newbest":"رقم قياسي جديد","g.local":"تُحفظ نتائجك على جهازك فقط.","g.points":"نقطة","g.rules.mcq":"أجب عن أسئلة الاختيار من متعدد قبل انتهاء الوقت. الإجابات السريعة والمتتالية تمنحك نقاطاً أكثر، ولك حذف إجابتين مرة واحدة في الجولة.","g.rules.truefalse":"احكم على كل عبارة بصح أو خطأ بسرعة. كل إجابة صحيحة متتالية ترفع مضاعف السلسلة.","g.rules.order":"رتّب الأحداث من الأقدم إلى الأحدث بالسحب والإفلات أو بأزرار الأعلى والأسفل، ثم اضغط تحقق. تُحتسب نقطة لكل حدث في مكانه الصحيح.","g.rules.memory":"اقلب بطاقتين لتجد الأزواج المتطابقة بأقل عدد من المحاولات. كلما زاد المستوى زادت البطاقات.","g.rules.word":"خمّن الكلمة المخفية من التلميح. لك ثلاث محاولات، ويمكنك كشف حرف مقابل نقطتين.","g.timer.on":"مؤقت","g.items":"{n} أسئلة","daily.title":"تحدّي اليوم","daily.sub":"خمسة أسئلة هي نفسها لكل اللاعبين اليوم. هل تتفوق على أصدقائك؟ خبرة التحدي تُحتسب مرة واحدة يومياً.","daily.play":"ابدأ التحدي","daily.done":"أنجزت تحدّي اليوم: {s} نقطة","daily.again":"أعد المحاولة (بلا خبرة إضافية)","profile.title":"رحلتك","profile.level":"المستوى {n}","profile.xp":"{a} / {b} خبرة","profile.ach":"أوسمتك","profile.hist":"آخر جولاتك","profile.none":"لم تلعب بعد. ابدأ أي لعبة وسترى رحلتك هنا.","profile.days":"أيام اللعب: {n}","profile.reset":"مسح بياناتي من هذا الجهاز","profile.confirm":"سيُمسح كل تقدمك على هذا الجهاز. متأكد؟","ach.first":"البداية","ach.first.d":"أكمل أول جولة لك","ach.perfect":"بلا أخطاء","ach.perfect.d":"أجب عن كل الأسئلة بشكل صحيح","ach.streak5":"سلسلة 5","ach.streak5.d":"5 إجابات صحيحة متتالية","ach.streak10":"سلسلة 10","ach.streak10.d":"10 إجابات صحيحة متتالية","ach.all":"مجرّب","ach.all.d":"جرّب خمس ألعاب مختلفة","ach.daily3":"ثلاثة أيام","ach.daily3.d":"أنجز تحدي اليوم في 3 أيام مختلفة","ach.lvl5":"المستوى 5","ach.lvl5.d":"ابلغ المستوى 5","ach.hard":"تحدٍّ صعب","ach.hard.d":"اجتز جولة بمستوى صعب بنسبة 70% فأكثر","challenge.title":"تحدي صديق","challenge.invite":"صديقك يتحداك في تحدي {date} بنتيجة {s} نقطة. العب الأسئلة نفسها وقارن نتيجتك.","challenge.share":"تحدَّ صديقاً","challenge.share.text":"تحداك في بصيرة! نتيجتي {score} نقطة. العب نفس التحدي: {url}","challenge.copied":"تم نسخ رابط التحدي","challenge.copy.prompt":"انسخ رابط التحدي وشاركه","challenge.opponent":"نتيجة صديقك: {s}","challenge.won":"تفوقت على صديقك!","challenge.lost":"صديقك حقق نتيجة أعلى","challenge.tie":"تعادلتما","admin.link":"إدارة الموقع","page.about":"من نحن","page.verify":"كيف نتحقق","page.editorial":"سياسة التحرير","page.contact":"اتصل بنا","page.privacy":"الخصوصية","page.terms":"الشروط","skip":"تجاوز إلى المحتوى","card.play":"العب الآن","pstrip.lv":"المستوى {n}","pstrip.xp":"{a} / {b} خبرة","pstrip.new":"ابدأ أول جولة واكسب الخبرة","streak.n":"سلسلة {n}","cheer.1":"ممتاز","cheer.2":"رائع","cheer.3":"أسطوري","theme.mode":"المظهر: {m}","theme.m.dark":"داكن","theme.m.light":"فاتح","theme.m.auto":"تلقائي","lvl.up":"مستوى جديد: المستوى {n}","sound.on":"الصوت: مفعّل","sound.off":"الصوت: مغلق","cta.title":"خلّصت القراءة؟ اختبر نفسك","cta.sub":"خمس ألعاب بأسئلة مراجَعة وتحدي يومي، وتقدمك يُحفظ على جهازك","cta.btn":"العب الآن","empty.title":"لا يوجد شيء هنا","empty.sub":"الصفحة غير موجودة أو لا توجد نتائج مطابقة. جرّب البحث أو ابدأ لعبة.","empty.home":"الرئيسية","empty.play":"العب الآن","g.math.name":"حساب سريع","g.math.desc":"عمليات ذهنية ضد الساعة","g.pattern.name":"ما التالي؟","g.pattern.desc":"اكتشف قاعدة الأرقام وأكمل النمط","g.simon.name":"تتبّع النمط","g.simon.desc":"شاهد التسلسل ثم كرّره من ذاكرتك","g.blitz.name":"تحدّي الدقيقة","g.blitz.desc":"كم سؤالاً تجيب في 60 ثانية؟","g.survival.name":"البقاء","g.survival.desc":"ثلاث أرواح فقط. كل خطأ يكلّفك روحاً","g.rules.math":"احسب الناتج ذهنياً واختر الإجابة الصحيحة قبل انتهاء الوقت. الإجابات السريعة المتتالية تمنحك نقاطاً أكثر. كل عملية تُحسب بالبرنامج فلا مجال للخطأ في الأسئلة.","g.rules.pattern":"لكل صف أعداد قاعدة خفية: فرق ثابت أو مضاعفة أو مربعات أو مجموع حدين. اكتشفها واختر العدد التالي، وسيظهر شرح القاعدة بعد كل سؤال.","g.rules.simon":"شاهد الأزرار وهي تضيء بالتسلسل ثم كرّره بالترتيب نفسه. يزداد التسلسل طولاً مع كل جولة، وتنتهي اللعبة عند أول خطأ.","g.rules.blitz":"لديك 60 ثانية لتجيب عن أكبر عدد من الأسئلة. لا انتظار بين الأسئلة، والسلسلة المتتالية ترفع نقاطك. بلوغ الهدف يعني النجاح.","g.rules.survival":"ثلاث أرواح فقط. كل إجابة خاطئة تكلّفك روحاً، وتنتهي الجولة حين تفقدها كلها. أجب عن العدد المطلوب لتنجح.","pattern.q":"ما العدد التالي في النمط؟","pattern.why.arith":"الفرق بين كل عددين ثابت ويساوي {d}.","pattern.why.geo":"كل عدد هو السابق مضروباً في {r}.","pattern.why.sq":"الأعداد هي مربعات متتالية (عدد × نفسه).","pattern.why.fib":"كل عدد هو مجموع العددين اللذين قبله.","pattern.why.diff":"الفروق بين الأعداد تزداد بالمقدار نفسه في كل خطوة.","pattern.why.tri":"أعداد مثلثية: نضيف 2 ثم 3 ثم 4 وهكذا.","pattern.why.alt":"الفرق يتناوب بين {a} و{b}.","simon.round":"الجولة {n} من {m}","simon.watch":"شاهد التسلسل…","simon.go":"دورك! كرّر التسلسل","simon.next":"أحسنت، جولة أصعب قادمة","simon.fail":"أخطأت في التسلسل","simon.win":"أكملت كل الجولات","simon.p1":"الزر الأول المثلث","simon.p2":"الزر الثاني الدائرة","simon.p3":"الزر الثالث المربع","simon.p4":"الزر الرابع المعين","blitz.correct":"صحيحة: {n}","survival.lives":"الأرواح","ach.ten":"سيد الألعاب","ach.ten.d":"العب الألعاب العشر كلها","filter.all":"الكل","filter.knowledge":"معرفة","filter.speed":"سرعة","filter.memory":"ذاكرة","filter.logic":"منطق","tag.new":"جديد","tag.challenge":"تحدٍّ","view.back":"كل الألعاب","view.more":"ألعاب أخرى","hero.badge":"تحدّي جديد كل يوم","hero.s1":"10 ألعاب","hero.s2":"تحدٍّ يومي","hero.s3":"بلا تسجيل","habit.days":"{n} أيام متتالية","habit.start":"ابدأ سلسلتك","habit.goal":"هدف اليوم","habit.goal.done":"أنجزت هدف اليوم وفتحت الصندوق. عُد غداً للحفاظ على السلسلة.","habit.safe":"سلسلتك آمنة اليوم. أكمل ثلاث جولات لتفتح صندوق المكافأة.","habit.risk":"العب جولة واحدة اليوم لتحافظ على سلسلتك.","habit.first":"العب جولة اليوم لتبدأ سلسلة أيام متتالية.","habit.wd":"أحد,اثنين,ثلاثاء,أربعاء,خميس,جمعة,سبت","habit.next":"بعد {n} يوم تصل إلى {d} أيام وتنال {x} نقطة خبرة","habit.sync":"انقل تقدمك إلى جهاز آخر","habit.sync.text":"بلا حساب ولا بريد: انسخ الرمز هنا والصقه في الجهاز الآخر ثم اضغط استيراد. يستبدل الاستيراد التقدم الموجود على ذلك الجهاز.","habit.export":"إنشاء الرمز ونسخه","habit.import":"استيراد من الرمز","habit.copied":"نُسخ الرمز. احتفظ به لنفسك.","habit.imported":"تم الاستيراد.","habit.bad":"الرمز غير صالح.","habit.chest":"فتحت صندوق اليوم: +{n} خبرة","habit.mile":"{d} أيام متتالية: +{n} خبرة","g.bubbles.name":"فقاعات المعرفة","g.bubbles.desc":"اضغط الفقاعة الصحيحة قبل أن تطفو بعيداً","g.rules.bubbles":"تطفو أمامك أربع فقاعات، في كل منها إجابة محتملة. اضغط الفقاعة الصحيحة لتفرقعها. كل سؤال له وقت محدود، والأسئلة مراجَعة ومخزّنة على جهازك.","stroop.ask":"ما لون الحبر؟","stroop.why":"لون الحبر هو {c}","col.0":"أحمر","col.1":"أزرق","col.2":"أخضر","col.3":"أصفر","col.4":"بنفسجي","cmp.ask":"أيهما ناتجه أكبر؟","count.ask":"عدّ النقاط بسرعة","count.why":"العدد الصحيح {n}","sch.ask":"المس الأرقام من 1 إلى {n} بالترتيب","odd.ask":"المس المربع المختلف","odd.tile":"مربع {n}","mult.ask":"المس كل مضاعفات {k}","mult.why":"{v} ليس من مضاعفات {k}","dig.ask":"احفظ الأرقام","dig.why":"الرقم الصحيح {c}","g.stroop.name":"ألوان مخادعة","g.stroop.desc":"اضغط لون الحبر لا الكلمة المكتوبة","g.rules.stroop":"تظهر كلمة لون مكتوبة بلون مختلف. اضغط اسم لون الحبر الذي كُتبت به وليس ما تقوله الكلمة. الوقت قصير، والمستوى الأعلى يزيد الخيارات.","g.compare.name":"الأكبر","g.compare.desc":"قارن عمليتين واختر الأكبر ناتجاً قبل انتهاء الوقت","g.rules.compare":"تظهر عمليتان حسابيتان. اضغط التي ناتجها أكبر قبل انتهاء الوقت. كل العمليات تُحسب بالبرنامج.","g.count.name":"عدّ سريع","g.count.desc":"تظهر نقاط لثوانٍ ثم تختفي، فكم كان عددها؟","g.rules.count":"تظهر نقاط ملونة لثوانٍ معدودة ثم تختفي. اختر عددها الصحيح من أربعة خيارات.","g.schulte.name":"الأرقام المتتالية","g.schulte.desc":"المس الأرقام بالترتيب من 1 بأسرع ما تستطيع","g.rules.schulte":"لوحة أرقام مبعثرة. المس الأرقام بالترتيب من 1 حتى آخر رقم قبل انتهاء الوقت. اللمس الخاطئ لا يحتسب لكنه يضيّع وقتك.","g.odd.name":"اكتشف الشاذ","g.odd.desc":"مربع واحد يختلف قليلاً في اللون، جده","g.rules.odd":"شبكة مربعات متشابهة وواحد منها يختلف في درجة اللون. المس المختلف. المستوى الأعلى يزيد الشبكة ويقلل الفرق.","g.multiples.name":"صيد المضاعفات","g.multiples.desc":"المس كل مضاعفات الرقم المطلوب ولا تلمس غيرها","g.rules.multiples":"يُعطى لك رقم، والمس كل مضاعفاته في الشبكة. لمسة واحدة خاطئة تنهي السؤال.","g.digits.name":"ذاكرة الأرقام","g.digits.desc":"احفظ الأرقام ثم أعد كتابتها من الذاكرة","g.rules.digits":"تظهر أرقام لثانيتين ثم تختفي. اكتبها من الذاكرة باللوحة. تزداد الأرقام في الأسئلة الأخيرة.","admin.posts":"المقالات","admin.pages":"الصفحات","admin.stats":"الإحصائيات","admin.comments":"التعليقات","admin.theme":"القالب","admin.settings":"الإعدادات","admin.gsc":"Search Console","admin.speed":"سرعة الموقع","gc.title":"صديقك يتحداك","gc.invite":"تحداك صديقك في «{g}» وحقق {s} نقطة على المستوى {l}. ستلعب الأسئلة نفسها بالترتيب نفسه، فتكون المقارنة عادلة.","gc.accept":"اقبل التحدي","gc.decline":"العب بحرية","gc.share.text":"حققت {score} نقطة في «{g}» على بصيرة. هل تتفوق عليّ؟ {url}","stk.floors":"الطوابق: {n} / {m}","stk.hint":"اضغط في اللحظة المناسبة لإسقاط الكتلة","stk.drop":"أسقط الكتلة","stk.perfect":"إسقاط دقيق × {n}","rhy.hint":"اضغط حين تلامس الدائرة الحلقة","rhy.tap":"اضغط عند التلامس","rhy.perfect":"ممتاز","rhy.good":"جيد","rhy.miss":"فاتتك","mrg.hint":"الهدف: الوصول إلى {g}","mrg.board":"لوحة الأرقام","mrg.score":"النقاط: {n}","mrg.best":"أكبر رقم: {n}","mrg.u":"أعلى","mrg.d":"أسفل","mrg.l":"يسار","mrg.r":"يمين","g.stack.name":"برج التوازن","g.stack.desc":"ابنِ برجاً بإسقاط الكتل في لحظتها المناسبة","g.rules.stack":"تتحرك كتلة يميناً ويساراً فوق البرج. اضغط (أو المسافة) لإسقاطها. الجزء الذي يتجاوز الكتلة التي تحتها يُقطع، فيضيق البرج. إسقاط دقيق تماماً يحفظ العرض ويمنحك نقاطاً إضافية. اصعد 15 طابقاً.","g.rhythm.name":"إيقاع الدائرة","g.rhythm.desc":"اضغط لحظة تلاقي الدائرة بالحلقة","g.rules.rhythm":"دائرة كبيرة تنكمش نحو حلقة. اضغط في اللحظة التي تلامس فيها الحلقة بالضبط. 16 نبضة، وكلما تتابعت ضرباتك الصحيحة زادت النقاط.","g.merge.name":"ادمج الأرقام","g.merge.desc":"اسحب لدمج الأرقام المتشابهة وصولاً للرقم الهدف","g.rules.merge":"اسحب الأرقام في أي اتجاه، فإذا تلاقى رقمان متساويان اندمجا في ضعفهما. هدفك الوصول إلى الرقم المطلوب قبل أن تمتلئ الشبكة. يعمل السحب بالإصبع أو الأسهم أو الأزرار.","ops.ask":"أي علامة ناقصة؟","nl.ask":"أين يقع الرقم {n}؟","nl.line":"الخط العددي","nl.why":"لمست {v} والصحيح {t}","path.watch":"شاهد المسار","path.repeat":"الآن كرر المسار","path.cell":"خلية {n}","rev.ask":"احفظ الأرقام ثم اكتبها بالعكس","shd.ask":"المس من الأغمق إلى الأفتح","shd.tile":"درجة لون","int.ask":"كلها من مضاعفات {k} إلا واحداً. جده","int.why":"{v} ليس من مضاعفات {k}","g.opsign.name":"العلامة الضائعة","g.opsign.desc":"ضع العلامة الحسابية الصحيحة بين الرقمين","g.rules.opsign":"يظهر رقمان وناتج بينهما علامة ناقصة. اختر العملية (+ − × ÷) التي تجعل المعادلة صحيحة. في كل سؤال علامة واحدة صحيحة فقط.","g.numline.name":"أين الرقم؟","g.numline.desc":"المس موضع الرقم على الخط العددي بأقرب ما تستطيع","g.rules.numline":"يُعطى لك رقم، والمس موضعه على خط من الصفر إلى الحد الأعلى. تُقبل الإجابة إذا كانت قريبة بما يكفي، والمستوى الأعلى يضيّق الهامش.","g.pathmem.name":"مسار الذاكرة","g.pathmem.desc":"شاهد المسار المضيء ثم أعد لمس الخلايا بالترتيب","g.rules.pathmem":"تضيء خلايا في شبكة بترتيب معين. شاهدها ثم المس الخلايا نفسها بالترتيب نفسه. يطول المسار تدريجياً.","g.revdigits.name":"الذاكرة العكسية","g.revdigits.desc":"احفظ الأرقام ثم اكتبها بالعكس","g.rules.revdigits":"تظهر أرقام لثانيتين ثم تختفي. اكتبها بالعكس: آخر رقم أولاً. أصعب من الذاكرة العادية.","g.shades.name":"من الأغمق للأفتح","g.shades.desc":"رتّب الدرجات اللونية من الأغمق إلى الأفتح باللمس","g.rules.shades":"مجموعة مربعات بدرجات متفاوتة من لون واحد. المس الأغمق أولاً ثم الأفتح تدريجياً. لمسة خاطئة تنهي السؤال.","g.intruder.name":"دخيل الأرقام","g.intruder.desc":"كل الأرقام من مضاعفات رقم واحد إلا رقماً دخيلاً، جده","g.rules.intruder":"كل الأرقام في الشبكة من مضاعفات رقم معيّن إلا واحداً دخيلاً. المسه بسرعة."},"en":{"brand":"BASIRA | بصيرة","nav.games":"Games","nav.topics":"Knowledge","nav.articles":"Articles","nav.verify":"How we verify","search.ph":"Search articles","search.btn":"Search","search.label":"Search the site","lang.switch":"العربية","theme.dark":"Dark mode","theme.light":"Light mode","hero.eyebrow":"Think. Discover. Play.","manifesto.text":"Basira is short games that entertain and teach. Every question has a source, and every round runs on your device with no sign-up. Play for five minutes and leave with a fact worth retelling.","hero.title":"Play smart. Know more.","hero.lede":"Ten brain games and a fresh challenge every day, with sourced questions. Start instantly with no sign-up; your results stay on your device.","hero.cta":"Start playing","hero.cta2":"Explore knowledge","games.title":"Pick your challenge","topics.title":"Explore knowledge","latest.title":"Read, then test yourself","verify.title":"How we verify","verify.text":"Every figure and date in our articles has a cited source, and game questions are reviewed before they appear, never generated while you play.","verify.link":"Read our method","foot.note":"Sourced knowledge and brain games, no sign-up needed.","foot.topics":"Knowledge sections","foot.about":"About","foot.pending":"Info pages are being prepared","lang.note":"English questions and articles are still under review, so questions are shown in Arabic for now.","noscript":"Games and the daily challenge need JavaScript enabled in your browser.","t.العلوم":"Science","t.التاريخ والحضارات":"History & Civilizations","t.الجغرافيا والدول":"Geography & Countries","t.التكنولوجيا":"Technology","t.الثقافة العامة":"General Knowledge","t.الرياضيات والمنطق":"Math & Logic","t.اللغة والأدب":"Language & Literature","t.الفضاء والفلك":"Space & Astronomy","g.mcq.name":"Test your knowledge","g.mcq.desc":"Four answers, one correct, with an explanation after each","g.truefalse.name":"True or false?","g.truefalse.desc":"Judge fast before time runs out","g.order.name":"Order the timeline","g.order.desc":"Drag events into the right place","g.memory.name":"Memory twins","g.memory.desc":"Find the pairs in as few moves as you can","g.word.name":"Crack the code","g.word.desc":"A hidden word and hints to save you","g.start":"Start","g.next":"Next","g.finish":"Results","g.again":"New round","g.back":"Back","g.best":"Best","g.score":"Points","g.streak":"Streak","g.time":"Time","g.level":"Level","g.easy":"Easy","g.medium":"Medium","g.hard":"Hard","g.prog":"Progressive","g.pick":"Choose a level","g.qof":"Question {n} of {m}","g.hint":"Remove two answers (−3 pts)","g.correct":"Correct.","g.wrong":"Incorrect.","g.timeout":"Time's up.","g.check":"Check","g.up":"Up","g.down":"Down","g.moves":"Moves","g.pairs":"Pairs","g.reveal":"Reveal a letter (−2 pts)","g.attempts":"Attempts left","g.hintw":"Hint","g.wordis":"The word:","g.order.is":"Correct order:","g.result.pass":"Well done! You passed the round","g.result.fail":"So close! Try again","g.xp":"+{n} XP","g.newbest":"New personal best","g.local":"Your results are saved on this device only.","g.points":"pts","g.rules.mcq":"Answer multiple-choice questions before time runs out. Fast, consecutive answers earn more points, and you can remove two answers once per round.","g.rules.truefalse":"Judge each statement true or false, quickly. Each consecutive correct answer raises your streak multiplier.","g.rules.order":"Put the events in order from earliest to latest by drag and drop or the up and down buttons, then press Check. You get a point for each event in its right place.","g.rules.memory":"Flip two cards to find matching pairs in as few moves as possible. Higher levels have more cards.","g.rules.word":"Guess the hidden word from its hint. You have three attempts, and you can reveal a letter for two points.","g.timer.on":"Timed","g.items":"{n} questions","daily.title":"Today's challenge","daily.sub":"The same five questions for every player today. Can you beat your friends? Challenge XP counts once a day.","daily.play":"Start the challenge","daily.done":"You finished today's challenge: {s} points","daily.again":"Try again (no extra XP)","profile.title":"Your journey","profile.level":"Level {n}","profile.xp":"{a} / {b} XP","profile.ach":"Your badges","profile.hist":"Recent rounds","profile.none":"You haven't played yet. Start any game and your journey will show up here.","profile.days":"Days played: {n}","profile.reset":"Clear my data on this device","profile.confirm":"This will erase all your progress on this device. Sure?","ach.first":"First step","ach.first.d":"Finish your first round","ach.perfect":"Flawless","ach.perfect.d":"Answer every question correctly","ach.streak5":"Streak 5","ach.streak5.d":"5 correct answers in a row","ach.streak10":"Streak 10","ach.streak10.d":"10 correct answers in a row","ach.all":"Explorer","ach.all.d":"Try five different games","ach.daily3":"Three days","ach.daily3.d":"Finish the daily challenge on 3 different days","ach.lvl5":"Level 5","ach.lvl5.d":"Reach level 5","ach.hard":"Hard challenge","ach.hard.d":"Pass a hard round with 70% or more","challenge.title":"Friend challenge","challenge.invite":"Your friend challenges you on {date} with {s} points. Play the same questions and compare your result.","challenge.share":"Challenge a friend","challenge.share.text":"I challenge you on BASIRA! My score: {score} points. Play the same challenge: {url}","challenge.copied":"Challenge link copied","challenge.copy.prompt":"Copy and share this challenge link","challenge.opponent":"Your friend's score: {s}","challenge.won":"You beat your friend!","challenge.lost":"Your friend scored higher","challenge.tie":"It's a tie","admin.link":"Site administration","page.about":"About","page.verify":"How we verify","page.editorial":"Editorial policy","page.contact":"Contact","page.privacy":"Privacy","page.terms":"Terms","skip":"Skip to content","card.play":"Play now","pstrip.lv":"Level {n}","pstrip.xp":"{a} / {b} XP","pstrip.new":"Play a round to earn XP","streak.n":"Streak {n}","cheer.1":"Nice","cheer.2":"Great","cheer.3":"Legendary","theme.mode":"Theme: {m}","theme.m.dark":"Dark","theme.m.light":"Light","theme.m.auto":"Auto","lvl.up":"Level up: Level {n}","sound.on":"Sound: On","sound.off":"Sound: Off","cta.title":"Done reading? Test yourself","cta.sub":"Five games with reviewed questions and a daily challenge; your progress stays on your device","cta.btn":"Play now","empty.title":"Nothing here","empty.sub":"The page does not exist or no results match. Try searching or start a game.","empty.home":"Home","empty.play":"Play now","g.math.name":"Quick math","g.math.desc":"Mental arithmetic against the clock","g.pattern.name":"What comes next?","g.pattern.desc":"Spot the rule and complete the pattern","g.simon.name":"Follow the pattern","g.simon.desc":"Watch the sequence, then repeat it from memory","g.blitz.name":"One-minute blitz","g.blitz.desc":"How many can you answer in 60 seconds?","g.survival.name":"Survival","g.survival.desc":"Only three lives. Every mistake costs one","g.rules.math":"Work out the result in your head and pick the right answer before time runs out. Fast, consecutive answers earn more points. Every problem is computed by the program, so the answers are always right.","g.rules.pattern":"Every row of numbers hides a rule: a constant step, doubling, squares or a sum of two terms. Spot it and pick the next number; the rule is explained after each question.","g.rules.simon":"Watch the buttons light up in order, then repeat the same order. The sequence grows each round and the game ends at your first mistake.","g.rules.blitz":"You have 60 seconds to answer as many questions as you can. No waiting between questions, and a streak boosts your points. Reaching the target means you pass.","g.rules.survival":"Only three lives. Each wrong answer costs one life and the round ends when they are gone. Answer the target number to pass.","pattern.q":"What is the next number in the pattern?","pattern.why.arith":"The step between numbers is constant: {d}.","pattern.why.geo":"Each number is the previous one times {r}.","pattern.why.sq":"These are consecutive square numbers (a number times itself).","pattern.why.fib":"Each number is the sum of the two before it.","pattern.why.diff":"The gaps grow by the same amount at every step.","pattern.why.tri":"Triangular numbers: add 2, then 3, then 4 and so on.","pattern.why.alt":"The step alternates between {a} and {b}.","simon.round":"Round {n} of {m}","simon.watch":"Watch the sequence…","simon.go":"Your turn! Repeat it","simon.next":"Nice, a harder round is coming","simon.fail":"Wrong in the sequence","simon.win":"You completed every round","simon.p1":"Button 1, triangle","simon.p2":"Button 2, circle","simon.p3":"Button 3, square","simon.p4":"Button 4, diamond","blitz.correct":"Correct: {n}","survival.lives":"Lives","ach.ten":"Game master","ach.ten.d":"Play all ten games","filter.all":"All","filter.knowledge":"Knowledge","filter.speed":"Speed","filter.memory":"Memory","filter.logic":"Logic","tag.new":"New","tag.challenge":"Challenge","view.back":"All games","view.more":"More games","hero.badge":"A new challenge every day","hero.s1":"10 games","hero.s2":"Daily challenge","hero.s3":"No sign-up","habit.days":"{n}-day streak","habit.start":"Start your streak","habit.goal":"Today's goal","habit.goal.done":"Goal done and chest opened. Come back tomorrow to keep the streak.","habit.safe":"Your streak is safe today. Finish three rounds to open the reward chest.","habit.risk":"Play one round today to keep your streak.","habit.first":"Play a round today to start a daily streak.","habit.wd":"Sun,Mon,Tue,Wed,Thu,Fri,Sat","habit.next":"In {n} days you reach {d} days and earn {x} XP","habit.sync":"Move your progress to another device","habit.sync.text":"No account or email: copy the code here, paste it on the other device and press Import. Importing replaces the progress on that device.","habit.export":"Create and copy code","habit.import":"Import from code","habit.copied":"Code copied. Keep it private.","habit.imported":"Imported.","habit.bad":"Invalid code.","habit.chest":"Daily chest opened: +{n} XP","habit.mile":"{d}-day streak: +{n} XP","g.bubbles.name":"Knowledge bubbles","g.bubbles.desc":"Tap the right bubble before it floats away","g.rules.bubbles":"Four bubbles float up, each holding a possible answer. Tap the right one to pop it. Each question is timed, and all questions are reviewed and stored on your device.","stroop.ask":"What is the ink color?","stroop.why":"The ink color is {c}","col.0":"Red","col.1":"Blue","col.2":"Green","col.3":"Yellow","col.4":"Purple","cmp.ask":"Which result is bigger?","count.ask":"Count the dots quickly","count.why":"The correct count is {n}","sch.ask":"Tap the numbers from 1 to {n} in order","odd.ask":"Tap the different square","odd.tile":"Square {n}","mult.ask":"Tap every multiple of {k}","mult.why":"{v} is not a multiple of {k}","dig.ask":"Memorize the digits","dig.why":"The correct number is {c}","g.stroop.name":"Tricky colors","g.stroop.desc":"Tap the ink color, not the word","g.rules.stroop":"A color word appears written in a different color. Tap the name of the ink color, not what the word says. Time is short, and higher levels add more choices.","g.compare.name":"Which is bigger","g.compare.desc":"Compare two sums and pick the bigger before time runs out","g.rules.compare":"Two sums appear. Tap the one with the bigger result before time runs out. Every result is computed by the program.","g.count.name":"Quick count","g.count.desc":"Dots flash for a moment, then vanish. How many were there?","g.rules.count":"Colored dots show for a few seconds and disappear. Pick the correct count from four options.","g.schulte.name":"Number chase","g.schulte.desc":"Tap the numbers in order from 1 as fast as you can","g.rules.schulte":"A scattered board of numbers. Tap them in order from 1 to the last before time runs out. A wrong tap does not count and costs time.","g.odd.name":"Spot the odd one","g.odd.desc":"One square is a slightly different shade. Find it","g.rules.odd":"A grid of similar squares where one differs in shade. Tap the odd one. Higher levels enlarge the grid and shrink the difference.","g.multiples.name":"Multiples hunt","g.multiples.desc":"Tap every multiple of the target number and nothing else","g.rules.multiples":"You get a number. Tap all of its multiples in the grid. One wrong tap ends the question.","g.digits.name":"Digit memory","g.digits.desc":"Memorize the digits, then type them back","g.rules.digits":"Digits show for two seconds and vanish. Type them back from memory on the keypad. Later questions add a digit.","admin.posts":"Posts","admin.pages":"Pages","admin.stats":"Stats","admin.comments":"Comments","admin.theme":"Theme","admin.settings":"Settings","admin.gsc":"Search Console","admin.speed":"Site speed","gc.title":"A friend challenged you","gc.invite":"Your friend challenged you in \"{g}\" with {s} points on {l}. You will play the same questions in the same order, so the comparison is fair.","gc.accept":"Accept challenge","gc.decline":"Play freely","gc.share.text":"I scored {score} in \"{g}\" on Basira. Can you beat me? {url}","stk.floors":"Floors: {n} / {m}","stk.hint":"Tap at the right moment to drop the block","stk.drop":"Drop block","stk.perfect":"Perfect drops × {n}","rhy.hint":"Tap when the circle touches the ring","rhy.tap":"Tap on contact","rhy.perfect":"Perfect","rhy.good":"Good","rhy.miss":"Missed","mrg.hint":"Goal: reach {g}","mrg.board":"Number board","mrg.score":"Score: {n}","mrg.best":"Biggest tile: {n}","mrg.u":"Up","mrg.d":"Down","mrg.l":"Left","mrg.r":"Right","g.stack.name":"Tower balance","g.stack.desc":"Build a tower by dropping blocks at the right moment","g.rules.stack":"A block slides left and right above the tower. Tap (or press Space) to drop it. Any overhang is cut off, so the tower narrows. A perfectly aligned drop keeps its width and earns bonus points. Reach 15 floors.","g.rhythm.name":"Ring rhythm","g.rhythm.desc":"Tap the instant the circle meets the ring","g.rules.rhythm":"A big circle shrinks toward a ring. Tap the exact moment it touches the ring. 16 beats, and consecutive hits raise your points.","g.merge.name":"Merge numbers","g.merge.desc":"Swipe to merge equal numbers up to the goal tile","g.rules.merge":"Slide the tiles in any direction; two equal tiles that meet merge into their double. Reach the goal tile before the board fills. Swipe, use arrow keys, or the buttons.","ops.ask":"Which sign is missing?","nl.ask":"Where is {n}?","nl.line":"Number line","nl.why":"You tapped {v}; the answer was {t}","path.watch":"Watch the path","path.repeat":"Now repeat it","path.cell":"Cell {n}","rev.ask":"Memorize, then type in reverse","shd.ask":"Tap from darkest to lightest","shd.tile":"Color shade","int.ask":"All are multiples of {k} except one. Find it","int.why":"{v} is not a multiple of {k}","g.opsign.name":"Missing sign","g.opsign.desc":"Pick the missing operator between two numbers","g.rules.opsign":"Two numbers and a result appear with a missing operator. Pick the operation (+ − × ÷) that makes the equation true. Each question has exactly one correct sign.","g.numline.name":"Where is the number","g.numline.desc":"Tap where the number sits on the number line","g.rules.numline":"You get a number; tap where it sits on a line from zero to the maximum. Close enough counts, and higher levels shrink the margin.","g.pathmem.name":"Path memory","g.pathmem.desc":"Watch the lit path, then tap the cells in order","g.rules.pathmem":"Cells light up in a sequence. Watch, then tap the same cells in the same order. The path grows longer as you go.","g.revdigits.name":"Reverse memory","g.revdigits.desc":"Memorize the digits, then type them in reverse","g.rules.revdigits":"Digits show for two seconds and vanish. Type them in reverse, last digit first. Harder than plain digit memory.","g.shades.name":"Dark to light","g.shades.desc":"Tap the shades from darkest to lightest","g.rules.shades":"A set of squares in different shades of one color. Tap the darkest first, then lighter step by step. One wrong tap ends the question.","g.intruder.name":"Number intruder","g.intruder.desc":"All numbers are multiples of one number except an intruder","g.rules.intruder":"Every number in the grid is a multiple of a given number except one intruder. Tap it fast."}};
var KEY='basira.lang';
function getLang(){
  var m=/[?&]lang=(en|ar)/.exec(location.search);
  if(m)return m[1];
  try{var s=localStorage.getItem(KEY);if(s==='en'||s==='ar')return s;}catch(e){}
  return 'ar';
}
var lang=getLang();
function t(k){var d=DICT[lang]||DICT.ar;return d[k]!=null?d[k]:(DICT.ar[k]!=null?DICT.ar[k]:k);}
function apply(){
  var d=document.documentElement;
  d.setAttribute('lang',lang);d.setAttribute('dir',lang==='en'?'ltr':'rtl');
  [].forEach.call(document.querySelectorAll('[data-i]'),function(n){n.textContent=t(n.getAttribute('data-i'));});
  [].forEach.call(document.querySelectorAll('[data-ip]'),function(n){n.setAttribute('placeholder',t(n.getAttribute('data-ip')));});
  [].forEach.call(document.querySelectorAll('.js-lang'),function(n){n.textContent=t('lang.switch');});
  var note=document.getElementById('lang-note');if(note)note.hidden=(lang!=='en');
}
function set(l){
  lang=l;try{localStorage.setItem(KEY,l);}catch(e){}
  apply();
  try{document.dispatchEvent(new CustomEvent('basira:lang',{detail:l}));}catch(e){}
}
window.BSR=window.BSR||{};
window.BSR.t=t;window.BSR.lang=function(){return lang;};window.BSR.setLang=set;window.BSR.applyI18n=apply;
function init(){
  [].forEach.call(document.querySelectorAll('.js-lang'),function(b){b.addEventListener('click',function(){set(lang==='en'?'ar':'en');});});
  apply();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

(function(){
'use strict';
var BANK={"topics":["العلوم","التاريخ والحضارات","الجغرافيا والدول","التكنولوجيا","الثقافة العامة","الرياضيات والمنطق","اللغة والأدب","الفضاء والفلك"],"mcq":[{"id":"m1","t":"العلوم","l":1,"q":"أي غاز تمتصه النباتات أثناء البناء الضوئي؟","o":["الأكسجين","النيتروجين","ثاني أكسيد الكربون","الهيدروجين"],"a":2,"x":"تمتص النباتات ثاني أكسيد الكربون وتستخدمه مع الماء وضوء الشمس لصنع الغذاء، وتطلق الأكسجين."},{"id":"m2","t":"العلوم","l":2,"q":"ما الرمز الكيميائي للذهب؟","o":["Ag","Au","Fe","Go"],"a":1,"x":"الرمز Au مأخوذ من الاسم اللاتيني aurum. أما Ag فللفضة وFe للحديد."},{"id":"m3","t":"العلوم","l":2,"q":"كم عدد العظام في جسم الإنسان البالغ تقريباً؟","o":["150","206","300","412"],"a":1,"x":"للبالغ 206 عظمة، بينما يولد الطفل بعدد أكبر تلتحم بعض عظامه مع النمو."},{"id":"m4","t":"العلوم","l":1,"q":"ما أسرع حيوان بري في العالم؟","o":["الأسد","الحصان","الفهد","الغزال"],"a":2,"x":"الفهد (الشيتا) أسرع الحيوانات البرية، ويستطيع الركض بسرعات تفوق 100 كم/س لمسافات قصيرة."},{"id":"m5","t":"العلوم","l":2,"q":"ما الغاز الأكثر وفرة في الغلاف الجوي للأرض؟","o":["الأكسجين","النيتروجين","ثاني أكسيد الكربون","الأرجون"],"a":1,"x":"يشكل النيتروجين نحو 78% من حجم الهواء، والأكسجين نحو 21%."},{"id":"m6","t":"العلوم","l":2,"q":"ما وحدة قياس القوة في النظام الدولي للوحدات؟","o":["الجول","الواط","النيوتن","الباسكال"],"a":2,"x":"النيوتن وحدة القوة، والجول للطاقة، والواط للقدرة، والباسكال للضغط."},{"id":"m7","t":"العلوم","l":1,"q":"ما أصلب مادة طبيعية معروفة؟","o":["الحديد","الألماس","الذهب","الكوارتز"],"a":1,"x":"الألماس أصلب المواد الطبيعية على مقياس موس للصلادة."},{"id":"m8","t":"التاريخ والحضارات","l":2,"q":"في أي عام سقطت القسطنطينية بيد العثمانيين؟","o":["1204","1453","1517","1683"],"a":1,"x":"فتح السلطان محمد الفاتح القسطنطينية عام 1453م."},{"id":"m9","t":"التاريخ والحضارات","l":2,"q":"من الفرعون الذي يُنسب إليه بناء الهرم الأكبر في الجيزة؟","o":["خوفو","خفرع","رمسيس الثاني","توت عنخ آمون"],"a":0,"x":"يُنسب الهرم الأكبر إلى الملك خوفو من الأسرة الرابعة."},{"id":"m10","t":"التاريخ والحضارات","l":2,"q":"في أي عام بدأت الحرب العالمية الأولى؟","o":["1905","1914","1918","1939"],"a":1,"x":"بدأت الحرب العالمية الأولى عام 1914 وانتهت عام 1918."},{"id":"m11","t":"التاريخ والحضارات","l":1,"q":"في أي عام انتهت الحرب العالمية الثانية؟","o":["1939","1941","1945","1950"],"a":2,"x":"انتهت الحرب العالمية الثانية عام 1945."},{"id":"m12","t":"التاريخ والحضارات","l":3,"q":"من الذي نجح في فكّ رموز حجر رشيد؟","o":["هوارد كارتر","جان فرانسوا شامبليون","نابليون بونابرت","ماريت"],"a":1,"x":"فكّ شامبليون رموز الكتابة الهيروغليفية عام 1822 بالاستعانة بحجر رشيد."},{"id":"m13","t":"التاريخ والحضارات","l":2,"q":"أي حضارة بنت مدينة البتراء؟","o":["الرومان","الفرس","الأنباط","الفينيقيون"],"a":2,"x":"بنى الأنباط البتراء في جنوب الأردن ونحتوا واجهاتها في الصخر."},{"id":"m14","t":"الجغرافيا والدول","l":2,"q":"ما عاصمة أستراليا؟","o":["سيدني","ملبورن","كانبرا","بيرث"],"a":2,"x":"عاصمة أستراليا كانبرا، وليست سيدني التي هي أكبر مدنها."},{"id":"m15","t":"الجغرافيا والدول","l":1,"q":"ما أكبر محيطات العالم مساحة؟","o":["الأطلسي","الهندي","الهادئ","المتجمد الشمالي"],"a":2,"x":"المحيط الهادئ أكبر المحيطات، ويغطي نحو ثلث سطح الأرض."},{"id":"m16","t":"الجغرافيا والدول","l":1,"q":"ما أطول نهر في قارة أفريقيا؟","o":["الكونغو","النيجر","النيل","الزمبيزي"],"a":2,"x":"نهر النيل أطول أنهار أفريقيا."},{"id":"m17","t":"الجغرافيا والدول","l":1,"q":"ما أعلى قمة جبلية فوق مستوى سطح البحر؟","o":["كي تو","إفرست","كليمنجارو","مون بلان"],"a":1,"x":"قمة إفرست في جبال الهيمالايا أعلى قمة فوق مستوى سطح البحر."},{"id":"m18","t":"الجغرافيا والدول","l":2,"q":"ما عاصمة كندا؟","o":["تورونتو","فانكوفر","أوتاوا","مونتريال"],"a":2,"x":"عاصمة كندا أوتاوا."},{"id":"m19","t":"الجغرافيا والدول","l":2,"q":"ما أصغر دولة في العالم مساحة؟","o":["موناكو","الفاتيكان","سان مارينو","ليختنشتاين"],"a":1,"x":"الفاتيكان أصغر دولة مساحة، ومساحتها نحو 0.44 كم²."},{"id":"m20","t":"التكنولوجيا","l":1,"q":"ماذا يعني الاختصار CPU؟","o":["وحدة المعالجة المركزية","ذاكرة الوصول العشوائي","وحدة التخزين","بطاقة الشاشة"],"a":0,"x":"CPU اختصار Central Processing Unit أي وحدة المعالجة المركزية، وهي عقل الحاسوب."},{"id":"m21","t":"التكنولوجيا","l":1,"q":"من الذي أسس شركة مايكروسوفت مع بول ألين؟","o":["ستيف جوبز","بيل غيتس","مارك زوكربيرغ","لاري بيج"],"a":1,"x":"أسس بيل غيتس وبول ألين مايكروسوفت عام 1975."},{"id":"m22","t":"التكنولوجيا","l":1,"q":"ما النظام العددي الذي تعتمد عليه الحواسيب داخلياً؟","o":["العشري","الثنائي","الروماني","الثماني فقط"],"a":1,"x":"تعمل الحواسيب بالنظام الثنائي المكوَّن من 0 و1."},{"id":"m23","t":"التكنولوجيا","l":2,"q":"ماذا يرمز الاختصار HTTP؟","o":["بروتوكول نقل النص التشعبي","لغة ترميز الصفحات","عنوان الموقع","نظام أسماء النطاقات"],"a":0,"x":"HTTP هو بروتوكول نقل النص التشعبي، وبه يتبادل المتصفح والخادم صفحات الويب."},{"id":"m24","t":"الثقافة العامة","l":1,"q":"كم عدد ألوان قوس قزح التقليدية؟","o":["5","6","7","8"],"a":2,"x":"يُقسَّم قوس قزح تقليدياً إلى سبعة ألوان."},{"id":"m25","t":"الثقافة العامة","l":1,"q":"ما أكبر حيوان ثديي في العالم؟","o":["الفيل الأفريقي","الحوت الأزرق","القرش الحوتي","الزرافة"],"a":1,"x":"الحوت الأزرق أكبر الثدييات، بل أكبر حيوان عاش على الأرض."},{"id":"m26","t":"الثقافة العامة","l":1,"q":"كم عدد لاعبي فريق كرة القدم داخل الملعب؟","o":["9","10","11","12"],"a":2,"x":"يلعب كل فريق بأحد عشر لاعباً داخل الملعب."},{"id":"m27","t":"الثقافة العامة","l":1,"q":"في أي دولة يقع برج بيزا المائل؟","o":["فرنسا","إيطاليا","إسبانيا","اليونان"],"a":1,"x":"يقع برج بيزا المائل في مدينة بيزا بإيطاليا."},{"id":"m28","t":"الرياضيات والمنطق","l":1,"q":"ما ناتج 12 × 12؟","o":["124","132","144","156"],"a":2,"x":"12 × 12 = 144."},{"id":"m29","t":"الرياضيات والمنطق","l":2,"q":"ما العدد التالي: 2، 6، 12، 20، ؟","o":["28","30","32","24"],"a":1,"x":"الفروق بين الأعداد 4 ثم 6 ثم 8 ثم 10، فالعدد التالي 20 + 10 = 30."},{"id":"m30","t":"الرياضيات والمنطق","l":1,"q":"ما قيمة النسبة التقريبية π (باي)؟","o":["2.14","3.14","4.13","3.41"],"a":1,"x":"قيمة π تقريباً 3.14159."},{"id":"m31","t":"الرياضيات والمنطق","l":1,"q":"ما مجموع زوايا المثلث؟","o":["90 درجة","180 درجة","270 درجة","360 درجة"],"a":1,"x":"مجموع زوايا أي مثلث مستوٍ 180 درجة."},{"id":"m32","t":"الرياضيات والمنطق","l":2,"q":"ما الجذر التربيعي للعدد 169؟","o":["11","12","13","14"],"a":2,"x":"13 × 13 = 169."},{"id":"m33","t":"الرياضيات والمنطق","l":2,"q":"ما العدد التالي: 1، 1، 2، 3، 5، 8، ؟","o":["11","12","13","15"],"a":2,"x":"كل عدد هو مجموع العددين السابقين له (متتالية فيبوناتشي): 5 + 8 = 13."},{"id":"m34","t":"اللغة والأدب","l":1,"q":"ما جمع كلمة «كتاب»؟","o":["كتّاب","كتب","أكتاب","كاتبون"],"a":1,"x":"جمع «كتاب» هو «كتب»."},{"id":"m35","t":"اللغة والأدب","l":1,"q":"ما ضد كلمة «كريم»؟","o":["بخيل","شجاع","ذكي","قوي"],"a":0,"x":"ضد الكريم هو البخيل."},{"id":"m36","t":"اللغة والأدب","l":1,"q":"كم عدد حروف الأبجدية العربية؟","o":["26","28","29","30"],"a":1,"x":"تتكون الأبجدية العربية من 28 حرفاً."},{"id":"m37","t":"اللغة والأدب","l":2,"q":"من مؤلف سيرة «الأيام» الذاتية؟","o":["طه حسين","العقاد","توفيق الحكيم","المازني"],"a":0,"x":"«الأيام» سيرة ذاتية للأديب طه حسين."},{"id":"m38","t":"اللغة والأدب","l":2,"q":"من كاتب «الثلاثية» (بين القصرين، قصر الشوق، السكرية)؟","o":["نجيب محفوظ","يوسف إدريس","إحسان عبد القدوس","جمال الغيطاني"],"a":0,"x":"«الثلاثية» رواية لنجيب محفوظ، وقد نال جائزة نوبل في الأدب عام 1988."},{"id":"m39","t":"الفضاء والفلك","l":1,"q":"كم عدد كواكب المجموعة الشمسية؟","o":["7","8","9","10"],"a":1,"x":"ثمانية كواكب بعد أن صُنِّف بلوتو كوكباً قزماً عام 2006."},{"id":"m40","t":"الفضاء والفلك","l":1,"q":"ما أكبر كواكب المجموعة الشمسية؟","o":["زحل","المشتري","نبتون","الأرض"],"a":1,"x":"المشتري هو الأكبر، وكتلته أكبر من كتلة بقية الكواكب مجتمعة."},{"id":"m41","t":"الفضاء والفلك","l":1,"q":"أي كوكب يُعرف بالكوكب الأحمر؟","o":["المريخ","الزهرة","عطارد","أورانوس"],"a":0,"x":"المريخ، ويرجع لونه الأحمر إلى أكاسيد الحديد في تربته."},{"id":"m42","t":"الفضاء والفلك","l":1,"q":"ما اسم المجرة التي تقع فيها المجموعة الشمسية؟","o":["أندروميدا","درب التبانة","المثلث","الدوامة"],"a":1,"x":"مجرتنا هي درب التبانة."},{"id":"m43","t":"الفضاء والفلك","l":1,"q":"أي كوكب يشتهر بحلقاته الواضحة؟","o":["زحل","المريخ","عطارد","الزهرة"],"a":0,"x":"يشتهر زحل بحلقاته، وللمشتري وأورانوس ونبتون حلقات خافتة أيضاً."},{"id":"m44","t":"الفضاء والفلك","l":2,"q":"ما أقرب كواكب المجموعة الشمسية إلى الشمس؟","o":["الزهرة","الأرض","عطارد","المريخ"],"a":2,"x":"عطارد أقرب الكواكب إلى الشمس."},{"id":"m45","t":"الفضاء والفلك","l":2,"q":"من أول إنسان وطئت قدماه سطح القمر؟","o":["بز ألدرين","نيل أرمسترونغ","يوري غاغارين","مايكل كولينز"],"a":1,"x":"وطئ نيل أرمسترونغ سطح القمر في 20 يوليو 1969 ضمن مهمة أبولو 11."}],"tf":[{"id":"t1","t":"العلوم","l":1,"s":"يغلي الماء النقي عند 100 درجة مئوية عند مستوى سطح البحر.","v":true,"x":"يتغير ذلك مع الارتفاع، إذ ينخفض الضغط فتنخفض درجة الغليان."},{"id":"t2","t":"الفضاء والفلك","l":1,"s":"الشمس كوكب.","v":false,"x":"الشمس نجم، والكواكب تدور حول النجوم."},{"id":"t3","t":"العلوم","l":1,"s":"للقلب البشري أربع حجرات.","v":true,"x":"أذينان وبطينان."},{"id":"t4","t":"العلوم","l":1,"s":"الخفاش من الطيور.","v":false,"x":"الخفاش من الثدييات، وهو الثديي الوحيد القادر على الطيران الحقيقي."},{"id":"t5","t":"العلوم","l":2,"s":"كثافة الذهب أكبر من كثافة الحديد.","v":true,"x":"كثافة الذهب نحو 19.3 غ/سم³ وكثافة الحديد نحو 7.9 غ/سم³."},{"id":"t6","t":"العلوم","l":1,"s":"العنكبوت حشرة.","v":false,"x":"العنكبوت من العنكبيات وله ثماني أرجل، أما الحشرات فلها ست أرجل."},{"id":"t7","t":"الفضاء والفلك","l":1,"s":"القمر يدور حول الأرض.","v":true,"x":"القمر تابع طبيعي للأرض."},{"id":"t8","t":"الجغرافيا والدول","l":2,"s":"تقع مصر في قارة آسيا بالكامل.","v":false,"x":"معظم مصر في أفريقيا، وتقع شبه جزيرة سيناء في آسيا."},{"id":"t9","t":"الجغرافيا والدول","l":1,"s":"أستراليا قارة ودولة في آن واحد.","v":true,"x":"أستراليا دولة تشغل قارة كاملة."},{"id":"t10","t":"الجغرافيا والدول","l":2,"s":"تطل الصين على المحيط الأطلسي.","v":false,"x":"تطل الصين على المحيط الهادئ، ولا ساحل لها على الأطلسي."},{"id":"t11","t":"الرياضيات والمنطق","l":2,"s":"العدد 1 عدد أولي.","v":false,"x":"العدد الأولي له قاسمان بالضبط، والعدد 1 له قاسم واحد فقط."},{"id":"t12","t":"الرياضيات والمنطق","l":2,"s":"العدد 2 هو العدد الأولي الزوجي الوحيد.","v":true,"x":"كل عدد زوجي أكبر من 2 يقبل القسمة على 2، فليس أولياً."},{"id":"t13","t":"الرياضيات والمنطق","l":1,"s":"مجموع زوايا أي مثلث مستوٍ 180 درجة.","v":true,"x":"هذه خاصية المثلث في الهندسة المستوية."},{"id":"t14","t":"الرياضيات والمنطق","l":2,"s":"الصفر عدد زوجي.","v":true,"x":"الصفر يقبل القسمة على 2 بلا باقٍ فهو عدد زوجي."},{"id":"t15","t":"التاريخ والحضارات","l":2,"s":"بدأت الثورة الفرنسية عام 1789.","v":true,"x":"بدأت الثورة الفرنسية بسقوط سجن الباستيل في يوليو 1789."},{"id":"t16","t":"التاريخ والحضارات","l":1,"s":"بُنيت أهرامات الجيزة في عهد الدولة العثمانية.","v":false,"x":"بُنيت قبل ذلك بنحو أربعة آلاف سنة في عصر الدولة القديمة."},{"id":"t17","t":"التاريخ والحضارات","l":2,"s":"اخترع غوتنبرغ الطباعة بالحروف المعدنية المتحركة في أوروبا.","v":true,"x":"اخترعها يوهان غوتنبرغ في منتصف القرن الخامس عشر."},{"id":"t18","t":"التكنولوجيا","l":1,"s":"يعتمد الحاسوب داخلياً على النظام الثنائي.","v":true,"x":"كل المعلومات تُمثَّل بسلاسل من 0 و1."},{"id":"t19","t":"التكنولوجيا","l":2,"s":"تحتفظ ذاكرة RAM بمحتواها بعد إطفاء الجهاز.","v":false,"x":"ذاكرة RAM مؤقتة وتفقد محتواها عند انقطاع الكهرباء."},{"id":"t20","t":"اللغة والأدب","l":2,"s":"التاء المربوطة (ة) تأتي في أول الكلمة.","v":false,"x":"التاء المربوطة لا تأتي إلا في آخر الكلمة."},{"id":"t21","t":"الفضاء والفلك","l":1,"s":"المشتري أكبر من الأرض.","v":true,"x":"قطر المشتري نحو 11 ضعف قطر الأرض."},{"id":"t22","t":"العلوم","l":1,"s":"الضوء أسرع من الصوت.","v":true,"x":"يقطع الضوء نحو 300 ألف كم كل ثانية، والصوت في الهواء نحو 343 م/ث."},{"id":"t23","t":"الفضاء والفلك","l":1,"s":"تدور الأرض حول الشمس دورة كاملة كل 24 ساعة.","v":false,"x":"الدورة حول الشمس تستغرق نحو 365 يوماً، أما 24 ساعة فمدة دورانها حول نفسها."},{"id":"t24","t":"العلوم","l":3,"s":"تسقط الريشة والحجر بالتسارع نفسه في الفراغ.","v":true,"x":"في الفراغ لا توجد مقاومة هواء، فيتساوى تسارع السقوط لكل الأجسام."},{"id":"t25","t":"العلوم","l":1,"s":"الحوت سمكة.","v":false,"x":"الحوت من الثدييات يتنفس الهواء ويرضع صغاره."},{"id":"t26","t":"اللغة والأدب","l":2,"s":"نال نجيب محفوظ جائزة نوبل في الأدب.","v":true,"x":"نالها عام 1988."},{"id":"t27","t":"الجغرافيا والدول","l":2,"s":"عاصمة تركيا هي إسطنبول.","v":false,"x":"عاصمة تركيا أنقرة، وإسطنبول أكبر مدنها."},{"id":"t28","t":"الجغرافيا والدول","l":3,"s":"يُعد البحر الميت أخفض منطقة على سطح اليابسة.","v":true,"x":"يقع شاطئه على نحو 430 متراً تحت مستوى سطح البحر."},{"id":"t29","t":"العلوم","l":2,"s":"تحمي طبقة الأوزون الأرض من معظم الأشعة فوق البنفسجية الضارة.","v":true,"x":"تمتص طبقة الأوزون الجزء الأكبر من هذه الأشعة."},{"id":"t30","t":"العلوم","l":3,"s":"الألماس والجرافيت مكوَّنان من عنصر الكربون.","v":true,"x":"يختلفان في ترتيب ذرات الكربون فقط."},{"id":"t31","t":"العلوم","l":2,"s":"يتكوَّن جزيء الماء من ذرتي أكسجين وذرة هيدروجين.","v":false,"x":"العكس صحيح: ذرتا هيدروجين وذرة أكسجين (H₂O)."},{"id":"t32","t":"العلوم","l":1,"s":"ينتقل الصوت عبر الفراغ.","v":false,"x":"يحتاج الصوت إلى وسط مادي كالهواء أو الماء."},{"id":"t33","t":"الرياضيات والمنطق","l":1,"s":"تحتوي السنة الكبيسة على 366 يوماً.","v":true,"x":"يضاف يوم 29 فبراير في السنة الكبيسة."},{"id":"t34","t":"الفضاء والفلك","l":2,"s":"قطر المشتري أكبر من قطر الأرض بأكثر من عشرة أضعاف.","v":true,"x":"نحو 11.2 ضعفاً."},{"id":"t35","t":"الرياضيات والمنطق","l":1,"s":"عدد أضلاع المسدس سبعة.","v":false,"x":"للمسدس ستة أضلاع."},{"id":"t36","t":"اللغة والأدب","l":3,"s":"الخليل بن أحمد الفراهيدي هو واضع علم العروض.","v":true,"x":"وضع الخليل علم العروض لضبط أوزان الشعر العربي."},{"id":"t37","t":"العلوم","l":2,"s":"كان ابن الهيثم من علماء البصريات المسلمين.","v":true,"x":"ألّف «كتاب المناظر» وأسهم في تأسيس علم البصريات."},{"id":"t38","t":"التاريخ والحضارات","l":3,"s":"فُتحت مصر على يد عمرو بن العاص في القرن السابع الميلادي.","v":true,"x":"جرى الفتح نحو عام 640م."},{"id":"t39","t":"التكنولوجيا","l":2,"s":"يمكن لمتصفح الويب فتح الصفحات دون استخدام بروتوكول HTTP أو HTTPS.","v":false,"x":"تُحمَّل صفحات الويب عبر HTTP أو HTTPS، مع وجود بروتوكولات أخرى لخدمات مختلفة."}],"order":[{"id":"o1","t":"التاريخ والحضارات","l":2,"q":"رتّب الأحداث من الأقدم إلى الأحدث","items":["اختراع الطباعة بالحروف المتحركة في أوروبا","الثورة الفرنسية","أول هبوط بشري على القمر","سقوط جدار برلين"],"x":"منتصف القرن 15، ثم 1789، ثم 1969، ثم 1989."},{"id":"o2","t":"الفضاء والفلك","l":1,"q":"رتّب الكواكب من الأقرب إلى الشمس إلى الأبعد","items":["عطارد","الزهرة","الأرض","المريخ"],"x":"عطارد ثم الزهرة ثم الأرض ثم المريخ."},{"id":"o3","t":"الرياضيات والمنطق","l":1,"q":"رتّب الوحدات من الأصغر إلى الأكبر","items":["مليمتر","سنتيمتر","متر","كيلومتر"],"x":"1 سم = 10 مم، و1 م = 100 سم، و1 كم = 1000 م."},{"id":"o4","t":"العلوم","l":1,"q":"رتّب مراحل دورة حياة الفراشة","items":["بيضة","يرقة","شرنقة","فراشة بالغة"],"x":"تمر الفراشة بتحوّل كامل: بيضة فيرقة فشرنقة فبالغة."},{"id":"o5","t":"التاريخ والحضارات","l":3,"q":"رتّب الأحداث من الأقدم إلى الأحدث","items":["بناء الهرم الأكبر (نحو 2560 ق.م)","تأسيس الإسكندرية (332 ق.م)","فتح مصر على يد عمرو بن العاص (نحو 640م)","بناء الجامع الأزهر (نحو 970م)"],"x":"الأحداث موزعة على نحو أربعة آلاف سنة من التاريخ المصري."},{"id":"o6","t":"الرياضيات والمنطق","l":1,"q":"رتّب الأعداد من الأصغر إلى الأكبر","items":["0.5","3/4","1","1.25"],"x":"0.5 ثم 0.75 ثم 1 ثم 1.25."},{"id":"o7","t":"التكنولوجيا","l":2,"q":"رتّب من الأقدم إلى الأحدث","items":["حاسوب IBM الشخصي (1981)","إطلاق شبكة الويب للجمهور (1991)","إطلاق هاتف آيفون الأول (2007)","إطلاق ChatGPT (2022)"],"x":"1981 ثم 1991 ثم 2007 ثم 2022."},{"id":"o8","t":"العلوم","l":1,"q":"رتّب حالات الماء أثناء التسخين","items":["جليد","ماء سائل","بخار ماء"],"x":"يذوب الجليد فيصير ماءً، ثم يتبخر الماء بالتسخين."},{"id":"o9","t":"الرياضيات والمنطق","l":2,"q":"رتّب الأرقام الرومانية من الأصغر إلى الأكبر","items":["V","X","L","C"],"x":"V = 5 ثم X = 10 ثم L = 50 ثم C = 100."},{"id":"o10","t":"اللغة والأدب","l":1,"q":"رتّب الأشهر الهجرية كما تأتي في السنة","items":["محرم","صفر","ربيع الأول","ربيع الآخر"],"x":"هذه أول أربعة أشهر في التقويم الهجري."}],"word":[{"id":"w1","t":"الفضاء والفلك","w":"مجرة","h":"تجمع هائل من النجوم والغاز والغبار"},{"id":"w2","t":"الفضاء والفلك","w":"كوكب","h":"جرم يدور حول نجم"},{"id":"w3","t":"الفضاء والفلك","w":"تلسكوب","h":"جهاز يُقرِّب الأجرام البعيدة"},{"id":"w4","t":"الجغرافيا والدول","w":"بركان","h":"جبل يقذف حمماً ورماداً"},{"id":"w5","t":"الجغرافيا والدول","w":"محيط","h":"أوسع مسطح مائي على الأرض"},{"id":"w6","t":"الجغرافيا والدول","w":"جزيرة","h":"يابسة تحيط بها المياه"},{"id":"w7","t":"الجغرافيا والدول","w":"خريطة","h":"رسم يمثل سطح الأرض"},{"id":"w8","t":"الجغرافيا والدول","w":"عاصمة","h":"المدينة التي تقع فيها الحكومة"},{"id":"w9","t":"العلوم","w":"ذرة","h":"أصغر وحدة بناء للعنصر"},{"id":"w10","t":"العلوم","w":"خلية","h":"وحدة بناء الكائن الحي"},{"id":"w11","t":"العلوم","w":"طاقة","h":"القدرة على إنجاز شغل"},{"id":"w12","t":"العلوم","w":"مجهر","h":"جهاز يُكبِّر الأشياء الدقيقة"},{"id":"w13","t":"العلوم","w":"جاذبية","h":"قوة تشدّ الأجسام نحو الأرض"},{"id":"w14","t":"التكنولوجيا","w":"حاسوب","h":"جهاز يعالج البيانات"},{"id":"w15","t":"التكنولوجيا","w":"برمجة","h":"كتابة تعليمات للحاسوب"},{"id":"w16","t":"التكنولوجيا","w":"شبكة","h":"أجهزة متصلة ببعضها"},{"id":"w17","t":"التكنولوجيا","w":"معالج","h":"عقل الحاسوب"},{"id":"w18","t":"الرياضيات والمنطق","w":"مثلث","h":"شكل له ثلاثة أضلاع"},{"id":"w19","t":"الرياضيات والمنطق","w":"دائرة","h":"شكل كل نقاطه على بعد واحد من مركزه"},{"id":"w20","t":"الرياضيات والمنطق","w":"معادلة","h":"تساوٍ بين تعبيرين يحوي مجهولاً"},{"id":"w21","t":"اللغة والأدب","w":"قصيدة","h":"نص شعري"},{"id":"w22","t":"اللغة والأدب","w":"ديوان","h":"مجموعة قصائد"},{"id":"w23","t":"اللغة والأدب","w":"مكتبة","h":"مكان الكتب"},{"id":"w24","t":"اللغة والأدب","w":"رواية","h":"عمل أدبي سردي طويل"},{"id":"w25","t":"التاريخ والحضارات","w":"حضارة","h":"مجتمع متقدم عمرانياً وثقافياً"},{"id":"w26","t":"التاريخ والحضارات","w":"تاريخ","h":"علم دراسة الماضي"},{"id":"w27","t":"التاريخ والحضارات","w":"فرعون","h":"لقب ملك مصر القديمة"},{"id":"w28","t":"التاريخ والحضارات","w":"قلعة","h":"حصن محصَّن"}],"mem":[{"id":"p1","title":"عواصم","kind":"الدولة والعاصمة","pairs":[["مصر","القاهرة"],["فرنسا","باريس"],["اليابان","طوكيو"],["إيطاليا","روما"],["ألمانيا","برلين"],["إسبانيا","مدريد"]]},{"id":"p2","title":"عواصم عربية","kind":"الدولة والعاصمة","pairs":[["السعودية","الرياض"],["المغرب","الرباط"],["الأردن","عمّان"],["العراق","بغداد"],["لبنان","بيروت"],["السودان","الخرطوم"]]},{"id":"p3","title":"عناصر","kind":"العنصر ورمزه","pairs":[["الذهب","Au"],["الحديد","Fe"],["الأكسجين","O"],["الهيدروجين","H"],["الصوديوم","Na"],["الكربون","C"]]},{"id":"p4","title":"علماء","kind":"العالم وإسهامه","pairs":[["الخوارزمي","الجبر"],["ابن سينا","القانون في الطب"],["ابن الهيثم","المناظر"],["ابن النفيس","الدورة الدموية الصغرى"],["نيوتن","الجاذبية"],["أينشتاين","النسبية"]]}]};
var META=[["mcq","اختبر معلوماتك","أربع إجابات وواحدة صحيحة، مع تفسير بعد كل سؤال","متوسط"],["truefalse","صح ولا خطأ؟","احكم بسرعة قبل أن ينتهي الوقت","سهل"],["order","رتّب الزمن","اسحب الأحداث إلى مكانها الصحيح","صعب"],["memory","توأم الذاكرة","اعثر على الأزواج بأقل محاولات","سهل"],["word","فك الشفرة","كلمة مخفية وتلميحات تنقذك","متوسط"],["math","حساب سريع","عمليات ذهنية ضد الساعة","متوسط"],["pattern","ما التالي؟","اكتشف قاعدة الأرقام وأكمل النمط","متوسط"],["simon","تتبّع النمط","شاهد التسلسل ثم كرّره من ذاكرتك","صعب"],["blitz","تحدّي الدقيقة","كم سؤالاً تجيب في 60 ثانية؟","صعب"],["survival","البقاء","ثلاث أرواح فقط. كل خطأ يكلّفك روحاً","صعب"],["bubbles","فقاعات المعرفة","اضغط الفقاعة الصحيحة قبل أن تطفو بعيداً","متوسط"],["stroop","ألوان مخادعة","اضغط لون الحبر لا الكلمة المكتوبة","صعب"],["compare","الأكبر","قارن عمليتين واختر الأكبر ناتجاً قبل انتهاء الوقت","متوسط"],["count","عدّ سريع","تظهر نقاط لثوانٍ ثم تختفي، فكم كان عددها؟","متوسط"],["schulte","الأرقام المتتالية","المس الأرقام بالترتيب من 1 بأسرع ما تستطيع","متوسط"],["odd","اكتشف الشاذ","مربع واحد يختلف قليلاً في اللون، جده","متوسط"],["multiples","صيد المضاعفات","المس كل مضاعفات الرقم المطلوب ولا تلمس غيرها","متوسط"],["digits","ذاكرة الأرقام","احفظ الأرقام ثم أعد كتابتها من الذاكرة","صعب"],["stack","برج التوازن","ابنِ برجاً بإسقاط الكتل في لحظتها المناسبة","متوسط"],["rhythm","إيقاع الدائرة","اضغط لحظة تلاقي الدائرة بالحلقة","متوسط"],["merge","ادمج الأرقام","اسحب لدمج الأرقام المتشابهة وصولاً للرقم الهدف","صعب"],["opsign","العلامة الضائعة","ضع العلامة الحسابية الصحيحة بين الرقمين","متوسط"],["numline","أين الرقم؟","المس موضع الرقم على الخط العددي بأقرب ما تستطيع","متوسط"],["pathmem","مسار الذاكرة","شاهد المسار المضيء ثم أعد لمس الخلايا بالترتيب","متوسط"],["revdigits","الذاكرة العكسية","احفظ الأرقام ثم اكتبها بالعكس","صعب"],["shades","من الأغمق للأفتح","رتّب الدرجات اللونية من الأغمق إلى الأفتح باللمس","متوسط"],["intruder","دخيل الأرقام","كل الأرقام من مضاعفات رقم واحد إلا رقماً دخيلاً، جده","متوسط"]];
var KEY='basira.v2',PASS=0.7;
var LV={easy:1,medium:2,hard:3};
var BASE={1:10,2:15,3:20};
var SEC={easy:25,medium:18,hard:12};
function T(k,v){var s=(window.BSR&&window.BSR.t)?window.BSR.t(k):k;if(v)for(var x in v)s=s.replace('{'+x+'}',v[x]);return s;}
function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;}
function btn(text,cls,fn){var b=el('button',cls,text);b.type='button';if(fn)b.addEventListener('click',fn);return b;}
function tl(node,key,v){node.setAttribute('data-i',key);if(v)node.setAttribute('data-v',JSON.stringify(v));node.textContent=T(key,v);return node;}
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{};}catch(e){return {};}}
function save(s){try{localStorage.setItem(KEY,JSON.stringify(s));}catch(e){}}
var RND=Math.random;
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
var PEND=null;
function shuffle(a,rnd){a=a.slice();rnd=rnd||RND;for(var i=a.length-1;i>0;i--){var j=Math.floor(rnd()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function mulberry(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function today(){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Cairo'}).format(new Date());}catch(e){return new Date().toISOString().slice(0,10);}}
function norm(t){return String(t).replace(/[ً-ْـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,'').trim();}
function letters(w){return Array.from(w.replace(/\s+/g,''));}

/* ===== مؤثرات صوتية (Web Audio، بلا ملفات، صامتة افتراضياً) ===== */
var SFX=(function(){
  var ctx=null,KEY='basira.sound',on=false;
  try{on=localStorage.getItem(KEY)==='on';}catch(e){}
  var NOTES={ok:[[660,0,.09],[880,.09,.14]],bad:[[220,0,.16],[165,.12,.2]],reward:[[988,0,.07],[1319,.07,.07],[1760,.14,.16]],
    win:[[523,0,.12],[659,.12,.12],[784,.24,.12],[1047,.36,.3]],level:[[392,0,.12],[523,.12,.12],[659,.24,.12],[784,.36,.12],[1047,.48,.35]]};
  function ensure(){
    if(ctx)return ctx;var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
    try{ctx=new AC();}catch(e){ctx=null;}return ctx;
  }
  function play(n){
    if(!on||!NOTES[n])return;var c=ensure();if(!c)return;
    if(c.state==='suspended'&&c.resume)c.resume();
    var t0=c.currentTime;
    NOTES[n].forEach(function(x){
      var o=c.createOscillator(),g=c.createGain();o.type=n==='bad'?'triangle':'sine';o.frequency.value=x[0];
      g.gain.setValueAtTime(0.0001,t0+x[1]);g.gain.exponentialRampToValueAtTime(.16,t0+x[1]+.02);g.gain.exponentialRampToValueAtTime(.0001,t0+x[1]+x[2]);
      o.connect(g);g.connect(c.destination);o.start(t0+x[1]);o.stop(t0+x[1]+x[2]+.05);
    });
  }
  function tone(f,d){if(!on)return;var c=ensure();if(!c)return;if(c.state==='suspended'&&c.resume)c.resume();var t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(.18,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d+.05);}
  function set(v){on=!!v;try{localStorage.setItem(KEY,on?'on':'off');}catch(e){}}
  return {play:play,tone:tone,set:set,isOn:function(){return on;}};
})();
function ico(name,cls){var s=el('span','ico'+(cls?' '+cls:''));s.setAttribute('aria-hidden','true');s.innerHTML='<svg class="i3" aria-hidden="true" viewBox="0 0 96 96" focusable="false"><use href="#i3-'+name+'"></use></svg>';return s;}
function tick(){var s=el('span','tick');s.setAttribute('aria-hidden','true');s.innerHTML='<svg viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="12" r="11"/><path d="M6.5 12.5l4 4 7-8.5"/></svg>';return s;}
function levelUp(host,n){
  var o=el('div','lvlup');o.setAttribute('role','status');
  var c=el('div','lvlup-card');c.appendChild(ico('level','lvl-big'));
  var t=el('p','lvlup-t');t.textContent=T('lvl.up',{n:n});c.appendChild(t);o.appendChild(c);
  var close=function(){if(o.parentNode)o.parentNode.removeChild(o);};
  o.addEventListener('click',close);host.appendChild(o);burst(host);setTimeout(close,4000);
}
function burst(host){
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var c=el('div','confetti'),cols=['#d7bd82','#5fc7bb','#e9a3ba','#6a58c8','#c27a12'];
  for(var i=0;i<34;i++){var p=el('i');p.style.left=Math.round(Math.random()*100)+'%';p.style.background=cols[i%cols.length];if(i%3===0)p.className='star';p.style.setProperty('--dx',Math.round(Math.random()*160-80)+'px');p.style.setProperty('--rot',Math.round(Math.random()*720-360)+'deg');p.style.animationDelay=(Math.random()*0.4)+'s';c.appendChild(p);}
  host.appendChild(c);setTimeout(function(){if(c.parentNode)c.parentNode.removeChild(c);},2600);
}
function countUp(n,target,suffix){
  var steps=16,k=0;if(!target){n.textContent=target+(suffix||'');return;}
  var id=setInterval(function(){k++;n.textContent=Math.round(target*k/steps)+(suffix||'');if(k>=steps)clearInterval(id);},35);
}
/* ===== محرك النقاط والتقدم (دوال صافية قابلة للاختبار) ===== */
function points(o){ // o: level(1-3), streak(بعد هذه الإجابة), left, total
  var b=BASE[o.level]||10,tb=o.total?Math.round(b*0.5*Math.max(0,o.left)/o.total):0,sb=Math.min(o.streak||0,5)*2;
  return b+tb+sb;
}
function levelInfo(xp){var l=1,need=50;while(xp>=need){xp-=need;l++;need=50+(l-1)*25;}return {level:l,into:xp,need:need};}
var ACHI={ten:'trophy',first:'xp',perfect:'gem',streak5:'flame',streak10:'flame',all:'trophy',daily3:'target',lvl5:'level',hard:'trophy'};
var ACH=['first','perfect','streak5','streak10','all','ten','daily3','lvl5','hard'];
function unlock(s,r){
  s.ach=s.ach||{};var got=[];
  function g(id,c){if(c&&!s.ach[id]){s.ach[id]=Date.now();got.push(id);}}
  g('first',true);g('perfect',r.pct===100&&r.total>0);g('streak5',r.bestStreak>=5);g('streak10',r.bestStreak>=10);
  g('all',Object.keys(s.stats||{}).length>=5);g('ten',Object.keys(s.stats||{}).length>=10);g('daily3',Object.keys(s.daily||{}).length>=3);
  g('lvl5',levelInfo(s.xp||0).level>=5);g('hard',r.level==='hard'&&r.pct>=70);
  return got;
}

/* ===== عادة اللعب اليومية: سلسلة أيام، هدف يومي، صندوق مكافأة ===== */
var GOAL=3;
function addDays(d,n){var t=new Date(d+'T00:00:00Z');t.setUTCDate(t.getUTCDate()+n);return t.toISOString().slice(0,10);}
function streakInfo(s,now){ // سلسلة الأيام المتتالية التي لُعب فيها؛ لا تنكسر قبل نهاية اليوم الحالي
  var days=s.days||{},t=now||today(),n=0,d=days[t]?t:addDays(t,-1);
  while(days[d]){n++;d=addDays(d,-1);}
  return {streak:n,playedToday:!!days[t],rounds:days[t]||0,goal:GOAL,week:[6,5,4,3,2,1,0].map(function(k){var x=addDays(t,-k);return {d:x,on:!!days[x]};})};
}
var MILE={3:20,7:50,14:100,30:250};
function habit(s,now){ // يُستدعى عند تسجيل جولة؛ يُرجع مكافآت اليوم
  var t=now||today();s.days=s.days||{};var before=s.days[t]||0;s.days[t]=before+1;
  var out={chest:0,mile:0,streak:0};
  if(before+1===GOAL){out.chest=15;}
  var st=streakInfo(s,t);out.streak=st.streak;
  if(before===0&&MILE[st.streak])out.mile=MILE[st.streak];
  var keys=Object.keys(s.days).sort();if(keys.length>400)keys.slice(0,keys.length-400).forEach(function(k){delete s.days[k];});
  return out;
}
function exportCode(){try{return btoa(unescape(encodeURIComponent(localStorage.getItem(KEY)||'{}')));}catch(e){return '';}}
function importCode(c){try{var j=JSON.parse(decodeURIComponent(escape(atob(String(c).trim()))));if(!j||typeof j!=='object'||Array.isArray(j))return false;if(j.xp!=null&&!(j.xp>=0))return false;save(j);try{document.dispatchEvent(new CustomEvent('basira:progress'));}catch(e){}return true;}catch(e){return false;}}
function record(r){ // يحفظ نتيجة جولة ويُرجع ملخصاً
  var s=load();s.stats=s.stats||{};s.hist=s.hist||[];s.xp=s.xp||0;
  var st=s.stats[r.slug]||{plays:0,best:0,bestPts:0},isBest=r.pct>st.best&&st.plays>0;
  st.plays++;st.best=Math.max(st.best,r.pct);st.bestPts=Math.max(st.bestPts,r.pts);s.stats[r.slug]=st;
  var xp=0;
  if(r.daily){s.daily=s.daily||{};if(!s.daily[r.daily]){s.daily[r.daily]={pts:r.pts,pct:r.pct};xp=Math.round(r.pts/2)+10;}}
  else xp=Math.round(r.pts/2)+(r.pct>=PASS*100?10:0);
  var hb=habit(s);xp+=hb.chest+hb.mile;s.xp+=xp;
  s.hist.unshift({t:Date.now(),slug:r.slug,level:r.level,pts:r.pts,pct:r.pct,daily:r.daily||null});s.hist=s.hist.slice(0,10);
  var got=unlock(s,r);save(s);
  try{document.dispatchEvent(new CustomEvent('basira:progress'));}catch(e){}
  return {xp:xp,isBest:isBest,ach:got,best:st.best,chest:hb.chest,mile:hb.mile,streak:hb.streak};
}

/* ===== اختيار الأسئلة ===== */
function pool(slug,level){
  var all=slug==='mcq'?BANK.mcq:slug==='truefalse'?BANK.tf:BANK.order;
  function by(f){return all.filter(f);}
  var p;
  if(level==='easy')p=by(function(q){return q.l===1;});
  else if(level==='medium')p=by(function(q){return q.l===2;});
  else p=by(function(q){return q.l>=2;});
  return p.length>=3?p:all;
}
function pick(slug,list,n,rnd){
  var s=load(),seen=(s.seen&&s.seen[slug])||[];
  var fresh=list.filter(function(x){return seen.indexOf(x.id)<0;});
  if(fresh.length<n){fresh=list;seen=[];}
  var ch=shuffle(fresh,rnd).slice(0,n);
  if(!rnd){s.seen=s.seen||{};s.seen[slug]=seen.concat(ch.map(function(x){return x.id;}));save(s);}
  return ch;
}
function progressive(slug,n){ // يبدأ سهلاً ويصعد
  var all=slug==='mcq'?BANK.mcq:BANK.tf,out=[],lv=[1,1,1,2,2,2,2,3,3,3];
  for(var i=0;i<n;i++){var want=lv[Math.min(i,lv.length-1)];var c=all.filter(function(q){return q.l===want&&out.indexOf(q)<0;});if(!c.length)c=all.filter(function(q){return out.indexOf(q)<0;});out.push(shuffle(c)[0]);}
  return out;
}

/* ===== واجهة اللعبة ===== */
function mount(root,slug){
  var m=null;for(var i=0;i<META.length;i++)if(META[i][0]===slug)m=META[i];
  if(!m||root.getAttribute('data-ready')===slug)return;
  root.setAttribute('data-ready',slug);root.setAttribute('data-game',slug);root.textContent='';
  var box=el('div');root.appendChild(box);
  var level='medium',timer=null,onDone=null,daily=null,opponentScore=null,curSeed=0,gcOpp=null,chSeed=null,gcOppRound=null;
  function stopTimer(){if(timer){clearInterval(timer);timer=null;}}
  function intro(){
    stopTimer();box.textContent='';
    if(PEND&&PEND.slug===slug&&!daily){var pe=PEND;PEND=null;var iv=el('div','g-invite');iv.appendChild(ico('trophy','hbi'));var ih=el('h3');ih.textContent=T('gc.title');iv.appendChild(ih);
      var ip=el('p','g-sub');ip.textContent=T('gc.invite',{g:T('g.'+slug+'.name'),s:pe.score,l:T('g.'+pe.level)});iv.appendChild(ip);
      var ia=el('div','g-act');ia.style.justifyContent='center';var ig=btn('','btn',function(){gcOpp=pe.score;chSeed=pe.seed;start(pe.level);});tl(ig,'gc.accept');ia.appendChild(ig);var io=btn('','btn alt',function(){PEND=null;intro();});tl(io,'gc.decline');ia.appendChild(io);iv.appendChild(ia);box.appendChild(iv);return;}
    var h=el('h3');tl(h,'g.'+slug+'.name');box.appendChild(h);
    box.appendChild(tl(el('p','g-sub'),'g.rules.'+slug));
    var st=(load().stats||{})[slug];
    if(st){var p=el('p','note');p.textContent=T('g.best')+': '+st.best+'%';box.appendChild(p);}
    box.appendChild(tl(el('p','g-lab'),'g.pick'));
    var row=el('div','g-lv');
    var opts=['mcq','truefalse'].indexOf(slug)>=0||slug==='word'?['prog','easy','medium','hard']:['easy','medium','hard'];
    if(opts.indexOf(level)<0)level=opts[0];
    opts.forEach(function(k){var b=btn('','g-chip',function(){level=k;[].forEach.call(row.children,function(c){c.setAttribute('aria-pressed',c===b?'true':'false');});});tl(b,'g.'+k);b.setAttribute('aria-pressed',k===level?'true':'false');row.appendChild(b);});
    box.appendChild(row);
    var a=el('div','g-act');var go=btn('','btn',function(){start(level);});tl(go,'g.start');a.appendChild(go);box.appendChild(a);
  }
  function finish(r){
    stopTimer();
    r.slug=slug;r.level=r.level||level;r.daily=daily;
    var lvBefore=levelInfo(load().xp||0).level;
    var out=record(r);
    var lvAfter=levelInfo(load().xp||0).level;
    box.textContent='';
    var e=el('div','g-end'+(r.pct>=PASS*100?' win':''));
    if(r.pct>=PASS*100){var wi=el('div','win-ico');wi.appendChild(ico('trophy'));e.appendChild(wi);}
    e.appendChild(el('p','g-score',r.correct+' / '+r.total));
    e.appendChild(el('p','g-pts',r.pts+' '+T('g.points')));
    if(out.xp){var gain=el('span','g-gain');gain.textContent='+'+out.xp+' XP';gain.setAttribute('aria-hidden','true');e.appendChild(gain);}
    e.appendChild(tl(el('p',''),r.pct>=PASS*100?'g.result.pass':'g.result.fail'));
    var xp=el('p','note');xp.textContent=(out.xp?T('g.xp',{n:out.xp}):'')+(out.isBest?' · '+T('g.newbest'):'');e.appendChild(xp);
    if(out.chest){var c1=el('p','g-ach');c1.appendChild(ico('gem','hbi2'));c1.appendChild(document.createTextNode(' '+T('habit.chest',{n:out.chest})));e.appendChild(c1);}
    if(out.mile){var c2=el('p','g-ach');c2.appendChild(ico('flame','hbi2'));c2.appendChild(document.createTextNode(' '+T('habit.mile',{d:out.streak,n:out.mile})));e.appendChild(c2);}
    out.ach.forEach(function(id){var p=el('p','g-ach');p.textContent='★ '+T('ach.'+id);e.appendChild(p);});
    var bp=el('p','note');bp.textContent=T('g.best')+': '+out.best+'%';e.appendChild(bp);
    e.appendChild(tl(el('p','note'),'g.local'));
    if(opponentScore!==null){var cmp=el('p','g-ach');cmp.textContent=T('challenge.opponent',{s:opponentScore})+' · '+(r.pts>opponentScore?T('challenge.won'):r.pts<opponentScore?T('challenge.lost'):T('challenge.tie'));e.appendChild(cmp);}
    if(!daily&&gcOppRound!==null){var cg=el('p','g-ach');cg.textContent=T('challenge.opponent',{s:gcOppRound})+' · '+(r.pts>gcOppRound?T('challenge.won'):r.pts<gcOppRound?T('challenge.lost'):T('challenge.tie'));e.appendChild(cg);}
    var a=el('div','g-act');a.style.justifyContent='center';
    var again=btn('','btn',function(){if(onDone&&daily){onDone();}else start(level);});tl(again,daily?'daily.again':'g.again');a.appendChild(again);
    if(daily){var share=btn('','btn alt',function(){
      var u=new URL(location.href);u.search='';u.searchParams.set('challenge',daily);u.searchParams.set('score',String(r.pts));u.searchParams.set('pct',String(r.pct));
      var msg=T('challenge.share.text',{url:u.toString(),score:r.pts});
      if(navigator.share){navigator.share({title:T('challenge.title'),text:msg,url:u.toString()}).catch(function(){});}
      else if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(u.toString()).then(function(){share.textContent=T('challenge.copied');}).catch(function(){prompt(T('challenge.copy.prompt'),u.toString());});}
      else prompt(T('challenge.copy.prompt'),u.toString());
    });tl(share,'challenge.share');a.appendChild(share);}
    if(!daily){var gs=btn('','btn alt',function(){var u=new URL(location.href);u.search='';u.searchParams.set('game',slug);u.searchParams.set('gc',curSeed+'.'+(r.level==='prog'?'medium':r.level)+'.'+r.pts);
      var msg=T('gc.share.text',{g:T('g.'+slug+'.name'),score:r.pts,url:u.toString()});
      if(navigator.share){navigator.share({title:T('challenge.title'),text:msg,url:u.toString()}).catch(function(){});}
      else if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(u.toString()).then(function(){gs.textContent=T('challenge.copied');}).catch(function(){prompt(T('challenge.copy.prompt'),u.toString());});}
      else prompt(T('challenge.copy.prompt'),u.toString());});tl(gs,'challenge.share');a.appendChild(gs);}
    var back=btn('','btn alt',function(){if(daily&&onDone){onDone('close');}else intro();});tl(back,'g.back');a.appendChild(back);
    e.appendChild(a);box.appendChild(e);
    if(r.pct>=PASS*100){burst(root);SFX.play('win');}
    if(out.ach.length)setTimeout(function(){SFX.play('reward');},700);
    if(lvAfter>lvBefore){levelUp(root,lvAfter);setTimeout(function(){SFX.play('level');},900);}
  }
  /* مشغّل الأسئلة المتتابعة: يدير المؤقت والسلسلة والنقاط */
  function run(items,opt){
    var i=0,pts=0,ok=0,streak=0,best=0,lvl=LV[opt.level]||2,hint=true;
    function next(){
      stopTimer();
      if(i>=items.length)return finish({pts:pts,correct:ok,total:items.length,pct:Math.round(ok/items.length*100),bestStreak:best,level:opt.levelName});
      box.textContent='';
      var bar=el('div','g-bar'),a1=el('span'),a2=el('span');
      tl(a1,'g.qof',{n:i+1,m:items.length});a2.className='g-stat';a2.textContent=T('g.score')+': '+pts+' · '+T('g.streak')+': '+streak;
      bar.appendChild(a1);bar.appendChild(a2);
      var pr=el('div','g-prog'),pi=el('i');pi.style.width=(i/items.length*100)+'%';pr.appendChild(pi);box.appendChild(bar);box.appendChild(pr);
      var tb=null,tf=null,total=opt.sec||0,left=total,t0=0;
      if(total){tb=el('div','g-time');tf=el('i');tb.appendChild(tf);tb.setAttribute('role','timer');box.appendChild(tb);}
      var body=el('div'),fb=el('div','g-fb');fb.hidden=true;fb.setAttribute('aria-live','polite');var act=el('div','g-act');
      box.appendChild(body);box.appendChild(fb);box.appendChild(act);
      var done=false;
      function answer(good,why,partial){
        SFX.play(good?'ok':'bad');
        if(done)return;done=true;stopTimer();
        var gain=0;
        if(good){ok++;streak++;best=Math.max(best,streak);gain=points({level:lvl,streak:streak,left:left,total:total});}
        else{streak=0;}
        if(partial!=null){gain=partial;}
        pts+=Math.max(0,gain);
        fb.hidden=false;fb.textContent='';
        if(good)fb.appendChild(tick());
        if(good&&streak>=3){var sb=el('span','streak-b');sb.appendChild(ico('flame','sm'));sb.appendChild(document.createTextNode(' '+T('streak.n',{n:streak})));fb.appendChild(sb);}
        var s=el('strong',good?'ok':'bad');s.textContent=(good?T('g.correct'):(left<=0&&total?T('g.timeout'):T('g.wrong')))+' ';fb.appendChild(s);
        if(gain){fb.appendChild(el('span','g-gain','+'+gain+' '+T('g.points')+' '));}
        if(why)fb.appendChild(document.createTextNode(why));
        var nb=btn('','btn',function(){i++;next();});tl(nb,i+1<items.length?'g.next':'g.finish');act.appendChild(nb);nb.focus();
      }
      var ctx={level:lvl,levelName:opt.levelName,penalty:function(n){pts=Math.max(0,pts-n);a2.textContent=T('g.score')+': '+pts+' · '+T('g.streak')+': '+streak;},
        hintAvail:function(){return hint;},useHint:function(){hint=false;}};
      items[i](body,answer,ctx);
      if(total){t0=Date.now();timer=setInterval(function(){left=Math.max(0,total-(Date.now()-t0)/1000);tf.style.width=(left/total*100)+'%';tb.classList.toggle('low',left/total<0.3);if(left<=0){answer(false,'',0);}},200);}
    }
    next();
  }
  function mcq(q){return function(body,answer,ctx){
    body.appendChild(el('p','g-q',q.q));
    var opts=shuffle(q.o.map(function(t,k){return {t:t,ok:k===q.a};})),list=el('div','g-opts');
    function lock(){[].forEach.call(list.children,function(c){c.disabled=true;if(c.getAttribute('data-ok')==='1')c.classList.add('ok');});}
    opts.forEach(function(o){var b=btn(o.t,'g-opt',function(){lock();if(!o.ok)b.classList.add('bad');answer(o.ok,q.x);});b.setAttribute('data-ok',o.ok?'1':'0');list.appendChild(b);});
    body.appendChild(list);
    if(ctx.hintAvail()){var h=btn('','btn-quiet g-hint',function(){
      ctx.useHint();ctx.penalty(3);h.remove();
      var wrong=[].filter.call(list.children,function(c){return c.getAttribute('data-ok')==='0'&&!c.disabled;});
      shuffle(wrong).slice(0,2).forEach(function(c){c.disabled=true;c.classList.add('gone');});});tl(h,'g.hint');body.appendChild(h);}
  };}

  /* فقاعات المعرفة: خيارات تطفو بحركة فيزيائية مبسطة (طفو + تمايل جيبي)؛ اضغط الفقاعة الصحيحة فتنفجر */
  function bubbleItem(q,speed){return function(body,answer){
    body.appendChild(el('p','g-q',q.q));
    var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,H=300;
    var sea=el('div','bub-sea');sea.style.height=H+'px';body.appendChild(sea);
    var opts=shuffle(q.o.map(function(t,k){return {t:t,ok:k===q.a};})),bs=[],done=false,raf=0,last=0,t=0;
    opts.forEach(function(o,k){var b=btn('','bub',function(){pick(b,o);});b.appendChild(el('span','bub-t',o.t));b.setAttribute('data-ok',o.ok?'1':'0');
      var size=Math.min(132,Math.max(92,56+o.t.length*5));b.style.width=b.style.height=size+'px';
      sea.appendChild(b);bs.push({b:b,size:size,ph:k*1.7+Math.random(),f:0.9+Math.random()*0.6,off:(k/opts.length)*(H+size)+Math.random()*30,v:speed*(0.85+Math.random()*0.3)});});
    function place(){var W=sea.clientWidth||300;bs.forEach(function(p,k){
      var x=reduce?((k%2)*0.5+0.25)*W-p.size/2:((k+0.5)/bs.length)*W-p.size/2+Math.sin(t*p.f+p.ph)*Math.min(26,W/bs.length*0.22);x=Math.max(2,Math.min(W-p.size-2,x));
      var y=reduce?(k<2?20:H-p.size-20):H-(((t*p.v+p.off)%(H+p.size)));
      var sq=reduce?1:1+Math.sin(t*3+p.ph)*0.035;p.b.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0) scale('+(1/sq).toFixed(3)+','+sq.toFixed(3)+')';});}
    function loop(ts){if(done||!body.isConnected)return;var dt=Math.min(0.05,(ts-last)/1000||0.016);last=ts;t+=dt;place();raf=requestAnimationFrame(loop);}
    function pop(b,good){var r=b.getBoundingClientRect(),s=sea.getBoundingClientRect(),cx=r.left-s.left+r.width/2,cy=r.top-s.top+r.height/2;
      for(var i=0;i<10;i++){var d=el('i','bub-d');d.style.left=cx+'px';d.style.top=cy+'px';sea.appendChild(d);var a=i/10*6.283,dist=40+Math.random()*30;
        if(d.animate&&!reduce){var an=d.animate([{transform:'translate(0,0) scale(1)'},{transform:'translate('+Math.cos(a)*dist+'px,'+(Math.sin(a)*dist+16)+'px) scale(.2)'}],{duration:520,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'});an.onfinish=function(){this.effect&&0;};}
        setTimeout(function(n){return function(){n.remove();};}(d),600);}
      if(b.animate&&!reduce)b.animate([{scale:1,opacity:1},{scale:1.35,opacity:0}],{duration:260,easing:'ease-out',fill:'forwards'});else b.style.visibility='hidden';
      if(!good)return;}
    function pick(b,o){if(done)return;done=true;cancelAnimationFrame(raf);
      bs.forEach(function(p){p.b.disabled=true;if(p.b.getAttribute('data-ok')==='1'&&!o.ok)p.b.classList.add('ok');});
      b.classList.add(o.ok?'ok':'bad');pop(b,o.ok);if(!o.ok&&b.animate&&!reduce)b.animate([{rotate:'0deg'},{rotate:'-8deg'},{rotate:'8deg'},{rotate:'0deg'}],{duration:300});
      answer(o.ok,q.x);}
    place();if(!reduce)raf=requestAnimationFrame(loop);
  };}

  /* ===== ألعاب مولَّدة برمجياً (لا أسئلة معرفية ولا ذكاء اصطناعي أثناء اللعب) ===== */
  var COLS=[['#E5484D'],['#4C8DFF'],['#2FB36D'],['#F5C542'],['#9B6BFF']];
  function stroopItem(n){return function(body,answer){
    var w=ri(5),c;do{c=ri(5);}while(c===w);
    body.appendChild(el('p','g-q',T('stroop.ask')));
    var word=el('div','g-stroop',T('col.'+w));word.style.color=COLS[c][0];body.appendChild(word);
    var ids=[c,w];while(ids.length<n){var x=ri(5);if(ids.indexOf(x)<0)ids.push(x);}
    var list=el('div','g-opts');
    shuffle(ids).forEach(function(id){var b=btn(T('col.'+id),'g-opt',function(){[].forEach.call(list.children,function(k){k.disabled=true;if(k.getAttribute('data-ok')==='1')k.classList.add('ok');});if(id!==c)b.classList.add('bad');answer(id===c,T('stroop.why',{c:T('col.'+c)}));});b.setAttribute('data-ok',id===c?'1':'0');list.appendChild(b);});
    body.appendChild(list);};}
  function cmpExpr(lev){var a=ri(lev===1?9:lev===2?12:20)+2,b=ri(lev===1?9:lev===2?12:15)+2,k=ri(lev===1?2:3);
    if(k===0)return {t:a+' × '+b,v:a*b};if(k===1)return {t:(a*(lev+1))+' + '+b,v:a*(lev+1)+b};return {t:(a*b+ri(9))+' − '+ri(a),v:null};}
  function compareItem(lev){return function(body,answer){
    var x,y,t=0;do{x=cmpExpr(lev);y=cmpExpr(lev);if(x.v===null){var p=x.t.split(' − ');x.v=Number(p[0])-Number(p[1]);}if(y.v===null){var p2=y.t.split(' − ');y.v=Number(p2[0])-Number(p2[1]);}}while(x.v===y.v&&++t<50);
    body.appendChild(el('p','g-q',T('cmp.ask')));var list=el('div','g-opts g-two');
    [x,y].forEach(function(e,k){var o=[x,y][1-k],good=e.v>o.v;var b=btn('','g-opt g-num',function(){[].forEach.call(list.children,function(c){c.disabled=true;if(c.getAttribute('data-ok')==='1')c.classList.add('ok');});if(!good)b.classList.add('bad');answer(good,x.t+' = '+x.v+' ، '+y.t+' = '+y.v);});
      var sp=el('span','',e.t);sp.dir='ltr';b.appendChild(sp);b.setAttribute('data-ok',good?'1':'0');list.appendChild(b);});
    body.appendChild(list);};}
  function countItem(lev){return function(body,answer){
    var n=lev===1?3+ri(4):lev===2?5+ri(6):8+ri(7),ms=lev===1?2200:lev===2?1900:1700,dead=false;
    body.appendChild(el('p','g-q',T('count.ask')));
    var box2=el('div','cnt-box');box2.style.height='170px';body.appendChild(box2);
    var pts=[],tries=0;while(pts.length<n&&tries++<800){var px=ri(86)+4,py=ri(80)+6;if(pts.every(function(q){return Math.abs(q[0]-px)>11||Math.abs(q[1]-py)>16;}))pts.push([px,py]);}
    n=pts.length;pts.forEach(function(q,k){var d=el('i','cnt-dot');d.style.left=q[0]+'%';d.style.top=q[1]+'%';d.style.background=['#5EE0D0','#F5C542','#FF8A8A','#9B6BFF'][k%4];box2.appendChild(d);});
    var rest=el('div','g-opts');body.appendChild(rest);
    setTimeout(function(){if(!body.isConnected||dead)return;box2.textContent='';var q=el('b','cnt-q','؟');box2.appendChild(q);
      var ids=[n];while(ids.length<4){var v=Math.max(1,n+ri(5)-2);if(ids.indexOf(v)<0)ids.push(v);}
      shuffle(ids).forEach(function(v){var b=btn(String(v),'g-opt g-num',function(){dead=true;[].forEach.call(rest.children,function(c){c.disabled=true;if(c.textContent===String(n))c.classList.add('ok');});if(v!==n)b.classList.add('bad');answer(v===n,T('count.why',{n:n}));});rest.appendChild(b);});},ms);};}
  function schulteItem(size){return function(body,answer){
    body.appendChild(el('p','g-q',T('sch.ask',{n:size*size})));var nums=[];for(var i=1;i<=size*size;i++)nums.push(i);
    var grid=el('div','sch-grid');grid.style.gridTemplateColumns='repeat('+size+',1fr)';var nextN=1,fin=false;
    shuffle(nums).forEach(function(v){var b=btn(String(v),'sch-tile',function(){if(fin)return;if(v===nextN){b.classList.add('done');b.disabled=true;nextN++;SFX.tone(700,.06);if(nextN>size*size){fin=true;answer(true,'');}}else{b.classList.add('shake');SFX.play('bad');setTimeout(function(){b.classList.remove('shake');},300);}});grid.appendChild(b);});
    body.appendChild(grid);};}
  function oddItem(size,delta){return function(body,answer){
    body.appendChild(el('p','g-q',T('odd.ask')));var hue=ri(360),grid=el('div','odd-grid'),odd=ri(size*size);grid.style.gridTemplateColumns='repeat('+size+',1fr)';
    for(var i=0;i<size*size;i++){(function(k){var b=btn('','odd-tile',function(){if(grid.getAttribute('data-done'))return;grid.setAttribute('data-done','1');b.classList.add(k===odd?'ok':'bad');grid.children[odd].classList.add('ok');answer(k===odd,'');});b.setAttribute('aria-label',T('odd.tile',{n:k+1}));b.style.background='hsl('+hue+',62%,'+(k===odd?(52+delta):52)+'%)';grid.appendChild(b);})(i);}
    body.appendChild(grid);};}
  function multItem(k,count){return function(body,answer){
    body.appendChild(el('p','g-q',T('mult.ask',{k:k})));var cells=[],used={};
    while(cells.length<count){var m=k*(ri(Math.floor(60/k))+1);if(!used[m]){used[m]=1;cells.push(m);}}
    while(cells.length<16){var v=ri(58)+2;if(!used[v]&&v%k!==0){used[v]=1;cells.push(v);}}
    var left=count,grid=el('div','sch-grid');grid.style.gridTemplateColumns='repeat(4,1fr)';var fin=false;
    shuffle(cells).forEach(function(v){var b=btn(String(v),'sch-tile',function(){if(fin)return;if(v%k===0){b.classList.add('done');b.disabled=true;SFX.tone(700,.06);if(--left===0){fin=true;answer(true,'');}}else{fin=true;b.classList.add('bad');answer(false,T('mult.why',{v:v,k:k}));}});grid.appendChild(b);});
    body.appendChild(grid);};}
  function digitsItem(len,ms,rev){return function(body,answer){
    var code='';for(var i=0;i<len;i++)code+=ri(10);var typed='';
    body.appendChild(el('p','g-q',T(rev?'rev.ask':'dig.ask')));var disp=el('div','dig-disp',code);disp.dir='ltr';body.appendChild(disp);var pad=el('div','dig-pad');body.appendChild(pad);var fin=false;
    setTimeout(function(){if(!body.isConnected||fin)return;disp.textContent='•'.repeat(len);disp.classList.add('hid');
      for(var d=1;d<=10;d++){(function(v){var b=btn(String(v%10),'dig-key',function(){if(fin)return;typed+=v%10;disp.textContent=typed+'•'.repeat(len-typed.length);if(typed.length===len){fin=true;var want=rev?code.split('').reverse().join(''):code,good=typed===want;disp.textContent=code;disp.classList.remove('hid');disp.classList.add(good?'ok':'bad');answer(good,good?'':T('dig.why',{c:want}));}});pad.appendChild(b);})(d);}},ms);};}

  /* ===== ألعاب مهارة مستقلة ===== */
  function stackGame(lev){
    var N=15,spd={easy:150,medium:210,hard:290}[lev]||210;box.textContent='';
    var bar=el('div','g-bar'),a1=el('span'),a2=el('span','g-stat');a1.textContent=T('stk.floors',{n:0,m:N});bar.appendChild(a1);bar.appendChild(a2);box.appendChild(bar);
    box.appendChild(el('p','g-sub',T('stk.hint')));
    var arena=el('button','stk');arena.type='button';arena.setAttribute('aria-label',T('stk.drop'));arena.style.height=(N*24+30)+'px';box.appendChild(arena);
    var aw=arena.clientWidth||320,pl=Math.round(aw*0.46),pw=Math.round(aw*0.46),floors=0,perf=0,x=0,w=pw,dir=1,v=spd,cur=null,raf=0,last=0,over=false;
    function blk(l,wd,row,hue){var d=el('div','stk-b');d.style.cssText='left:'+l+'px;width:'+wd+'px;bottom:'+(row*24)+'px;background:linear-gradient(180deg,hsl('+hue+',70%,62%),hsl('+hue+',70%,45%))';arena.appendChild(d);return d;}
    blk(pl,pw,0,200);cur=blk(0,w,1,(1*23)%360);
    function loop(ts){if(over||!box.isConnected)return;var dt=Math.min(.05,(ts-last)/1000||.016);last=ts;x+=dir*v*dt;if(x<=0){x=0;dir=1;}if(x+w>=aw){x=aw-w;dir=-1;}cur.style.left=x+'px';raf=requestAnimationFrame(loop);}
    function end(win){over=true;cancelAnimationFrame(raf);arena.disabled=true;document.removeEventListener('keydown',key);
      var pts=floors*10+perf*5;setTimeout(function(){finish({pts:pts,correct:floors,total:N,pct:Math.round(floors/N*100),bestStreak:perf,level:lev});},win?500:350);}
    function drop(){if(over)return;var ov=Math.min(x+w,pl+pw)-Math.max(x,pl);
      if(ov<=0){cur.classList.add('stk-fall');SFX.play('bad');end(false);return;}
      var isP=Math.abs(x-pl)<5;if(isP){x=pl;w=pw;perf++;SFX.tone(880,.08);}else{var nx=Math.max(x,pl);w=Math.round(ov);x=nx;SFX.tone(520,.06);}
      cur.style.left=x+'px';cur.style.width=w+'px';if(isP)cur.classList.add('stk-perfect');
      pl=x;pw=w;floors++;a1.textContent=T('stk.floors',{n:floors,m:N});a2.textContent=perf?T('stk.perfect',{n:perf}):'';
      if(floors>=N){SFX.play('win');end(true);return;}
      v=v*1.025;x=dir>0?0:aw-w;cur=blk(x,w,floors+1,((floors+1)*23)%360);}
    function key(e){if(!box.isConnected){document.removeEventListener('keydown',key);return;}if(e.code==='Space'||e.key===' '){e.preventDefault();drop();}}
    arena.addEventListener('pointerdown',function(e){e.preventDefault();drop();});arena.addEventListener('keydown',function(e){e.stopPropagation();});document.addEventListener('keydown',key);
    raf=requestAnimationFrame(loop);}
  function rhythmGame(lev){
    var N=16,dur={easy:1500,medium:1100,hard:800}[lev]||1100,i=0,ok=0,perf=0,pts=0,streak=0,best=0,over=false;box.textContent='';
    var bar=el('div','g-bar'),a1=el('span'),a2=el('span','g-stat');bar.appendChild(a1);bar.appendChild(a2);box.appendChild(bar);box.appendChild(el('p','g-sub',T('rhy.hint')));
    var arena=el('button','rhy');arena.type='button';arena.setAttribute('aria-label',T('rhy.tap'));box.appendChild(arena);
    var msg=el('div','rhy-msg');msg.setAttribute('aria-live','polite');arena.appendChild(msg);
    var cur=null,t0=0,raf=0,judged=false;
    function upd(){a1.textContent=T('g.qof',{n:Math.min(i+1,N),m:N});a2.textContent=T('g.score')+': '+pts+' · '+T('g.streak')+': '+streak;}
    function spawn(){if(i>=N||!box.isConnected){fin();return;}upd();judged=false;var aw=arena.clientWidth||300,ah=arena.clientHeight||300,x=40+ri(Math.max(1,aw-80)),y=40+ri(Math.max(1,ah-80));
      cur=el('div','rhy-t');cur.style.left=x+'px';cur.style.top=y+'px';var ring=el('i','rhy-r'),dot=el('i','rhy-c');cur.appendChild(ring);cur.appendChild(dot);arena.appendChild(cur);t0=performance.now();
      (function frame(){if(judged||!cur||!box.isConnected)return;var e=performance.now()-t0,sc=1+2.2*Math.max(0,1-e/dur);dot.style.transform='translate(-50%,-50%) scale('+sc.toFixed(3)+')';if(e>dur+260){judge(null);return;}raf=requestAnimationFrame(frame);})();}
    function judge(e){if(judged||over)return;judged=true;cancelAnimationFrame(raf);var d=e===null?9e3:Math.abs(e-dur),grade=d<dur*0.09?'perfect':d<dur*0.2?'good':'miss';
      if(grade==='miss'){streak=0;SFX.play('bad');}else{ok++;streak++;best=Math.max(best,streak);var g=grade==='perfect'?30:15;if(grade==='perfect')perf++;pts+=g+Math.min(streak,10)*2;SFX.tone(grade==='perfect'?988:660,.08);}
      msg.textContent=T('rhy.'+grade);msg.className='rhy-msg '+grade;if(cur){cur.classList.add('rhy-done');var c=cur;setTimeout(function(){c.remove();},300);}cur=null;i++;upd();setTimeout(spawn,420);}
    function fin(){if(over)return;over=true;document.removeEventListener('keydown',key);finish({pts:pts,correct:ok,total:N,pct:Math.round(ok/N*100),bestStreak:best,level:lev});}
    function tap(){if(!cur||judged)return;var e=performance.now()-t0;if(e<dur*0.45){return;}judge(e);}
    function key(e){if(!box.isConnected){document.removeEventListener('keydown',key);return;}if(e.code==='Space'){e.preventDefault();tap();}}
    arena.addEventListener('pointerdown',function(e){e.preventDefault();tap();});document.addEventListener('keydown',key);setTimeout(spawn,600);}
  function mergeGame(lev){
    var goal={easy:128,medium:256,hard:512}[lev]||256,G=[],score=0,over=false,moved=0;box.textContent='';
    for(var r=0;r<4;r++)G.push([0,0,0,0]);
    var bar=el('div','g-bar'),a1=el('span'),a2=el('span','g-stat');bar.appendChild(a1);bar.appendChild(a2);box.appendChild(bar);box.appendChild(el('p','g-sub',T('mrg.hint',{g:goal})));
    var grid=el('div','mrg');grid.setAttribute('role','group');grid.setAttribute('aria-label',T('mrg.board'));grid.tabIndex=0;box.appendChild(grid);
    var pad=el('div','mrg-pad');[['↑','u'],['←','l'],['↓','d'],['→','r']].forEach(function(k){var b=btn(k[0],'btn alt',function(){mv(k[1]);});b.setAttribute('aria-label',T('mrg.'+k[1]));pad.appendChild(b);});box.appendChild(pad);
    function spawn(){var e=[];for(var r=0;r<4;r++)for(var c=0;c<4;c++)if(!G[r][c])e.push([r,c]);if(!e.length)return;var p=e[ri(e.length)];G[p[0]][p[1]]=RND()<0.9?2:4;}
    function draw(){grid.textContent='';var mx=0;for(var r=0;r<4;r++)for(var c=0;c<4;c++){var v=G[r][c];mx=Math.max(mx,v);var t=el('div','mrg-t'+(v?' v':''),v?String(v):'');if(v){var l=Math.log2(v);t.style.background='hsl('+((l*37+170)%360)+',62%,'+(l<3?64:l<6?54:46)+'%)';t.style.color=l<3?'#101827':'#fff';}grid.appendChild(t);}
      a1.textContent=T('mrg.score',{n:score});a2.textContent=T('mrg.best',{n:mx});return mx;}
    function line(a){var f=a.filter(function(x){return x;}),o=[];for(var i=0;i<f.length;i++){if(f[i]===f[i+1]){o.push(f[i]*2);score+=f[i]*2;i++;}else o.push(f[i]);}while(o.length<4)o.push(0);return o;}
    function can(){for(var r=0;r<4;r++)for(var c=0;c<4;c++){if(!G[r][c])return true;if(c<3&&G[r][c]===G[r][c+1])return true;if(r<3&&G[r][c]===G[r+1][c])return true;}return false;}
    function mv(d){if(over)return;var before=JSON.stringify(G),i,j,a;
      for(i=0;i<4;i++){if(d==='l'||d==='r'){a=G[i].slice();if(d==='r')a.reverse();a=line(a);if(d==='r')a.reverse();G[i]=a;}else{a=[];for(j=0;j<4;j++)a.push(G[j][i]);if(d==='d')a.reverse();a=line(a);if(d==='d')a.reverse();for(j=0;j<4;j++)G[j][i]=a[j];}}
      if(JSON.stringify(G)===before)return;moved++;SFX.tone(440+Math.min(moved,20)*10,.04);spawn();var mx=draw();
      if(mx>=goal||!can())end(mx);}
    function end(mx){over=true;document.removeEventListener('keydown',key);var pct=Math.min(100,Math.round(Math.log2(Math.max(2,mx))/Math.log2(goal)*100));setTimeout(function(){finish({pts:score,correct:Math.round(Math.log2(Math.max(2,mx))),total:Math.round(Math.log2(goal)),pct:pct,bestStreak:0,level:lev});},mx>=goal?500:350);}
    function key(e){if(!box.isConnected){document.removeEventListener('keydown',key);return;}var m={ArrowUp:'u',ArrowDown:'d',ArrowLeft:'l',ArrowRight:'r'}[e.key];if(m){e.preventDefault();mv(m);}}
    document.addEventListener('keydown',key);
    var sx=0,sy=0;grid.addEventListener('pointerdown',function(e){sx=e.clientX;sy=e.clientY;});grid.addEventListener('pointerup',function(e){var dx=e.clientX-sx,dy=e.clientY-sy;if(Math.max(Math.abs(dx),Math.abs(dy))<24)return;mv(Math.abs(dx)>Math.abs(dy)?(dx>0?'r':'l'):(dy>0?'d':'u'));});
    spawn();spawn();draw();}

  function opsignItem(lev){return function(body,answer){
    var ops=lev===1?['+','−']:lev===2?['+','−','×']:['+','−','×','÷'],a,b,c,op,t=0;
    function f(o,x,y){return o==='+'?x+y:o==='−'?x-y:o==='×'?x*y:(y?x/y:NaN);}
    do{op=ops[ri(ops.length)];a=ri(18)+2;b=ri(10)+2;if(op==='÷')a=a*b;c=f(op,a,b);t++;}while((!(c>=0)||ops.filter(function(o){return f(o,a,b)===c;}).length!==1)&&t<500);
    body.appendChild(el('p','g-q',T('ops.ask')));var eq=el('div','g-eq');eq.dir='ltr';eq.textContent=a+'  ?  '+b+'  =  '+c;body.appendChild(eq);
    var list=el('div','g-opts g-four');ops.forEach(function(o){var bt=btn(o,'g-opt g-num',function(){[].forEach.call(list.children,function(k){k.disabled=true;if(k.textContent===op)k.classList.add('ok');});if(o!==op)bt.classList.add('bad');eq.textContent=a+'  '+op+'  '+b+'  =  '+c;answer(o===op,'');});list.appendChild(bt);});body.appendChild(list);};}
  function numlineItem(lev){return function(body,answer){
    var max=lev===3?1000:100,tol=lev===1?0.08:lev===2?0.05:0.03,tgt=ri(max-8)+4;
    body.appendChild(el('p','g-q',T('nl.ask',{n:tgt})));var line=el('button','nl-line');line.type='button';line.setAttribute('aria-label',T('nl.line'));
    line.appendChild(el('span','nl-a','0'));line.appendChild(el('span','nl-b',String(max)));var mk=el('i','nl-m');line.appendChild(mk);body.appendChild(line);var done=false;
    line.addEventListener('click',function(e){if(done)return;done=true;var r=line.getBoundingClientRect(),x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),v=Math.round(x*max),good=Math.abs(v-tgt)<=tol*max;
      mk.style.left=(x*100)+'%';mk.classList.add('on');var tg=el('i','nl-t');tg.style.left=(tgt/max*100)+'%';line.appendChild(tg);answer(good,T('nl.why',{v:v,t:tgt}));});
    line.addEventListener('keydown',function(e){if(done)return;});};}
  function pathItem(len){return function(body,answer){
    body.appendChild(el('p','g-q',T('path.watch')));var grid=el('div','path-grid');var cells=[],seq=[];for(var i=0;i<9;i++){var b=btn('','path-c',null);b.disabled=true;b.setAttribute('aria-label',T('path.cell',{n:i+1}));cells.push(b);grid.appendChild(b);}
    for(var k=0;k<len;k++){var n;do{n=ri(9);}while(seq.length&&seq[seq.length-1]===n);seq.push(n);}body.appendChild(grid);
    var step=0,fin=false,t=0;
    seq.forEach(function(c,k){setTimeout(function(){if(!body.isConnected)return;cells[c].classList.add('lit');SFX.tone(400+c*60,.12);setTimeout(function(){cells[c].classList.remove('lit');},380);},500+k*650);});
    setTimeout(function(){if(!body.isConnected)return;body.firstChild.textContent=T('path.repeat');cells.forEach(function(b,i){b.disabled=false;b.onclick=function(){if(fin)return;SFX.tone(400+i*60,.1);if(i===seq[step]){b.classList.add('lit');setTimeout(function(){b.classList.remove('lit');},160);step++;if(step===seq.length){fin=true;answer(true,'');}}else{fin=true;b.classList.add('bad');cells[seq[step]].classList.add('ok');answer(false,'');}};});},500+len*650+250);};}
  function shadesItem(n){return function(body,answer){
    body.appendChild(el('p','g-q',T('shd.ask')));var hue=ri(360),ls=[];for(var i=0;i<n;i++)ls.push(18+Math.round(i*(64/(n-1))));
    var order=shuffle(ls),grid=el('div','shd-grid');grid.style.gridTemplateColumns='repeat('+Math.min(n,4)+',1fr)';var next=0,fin=false;
    order.forEach(function(l){var b=btn('','shd-t',function(){if(fin)return;if(l===ls[next]){b.classList.add('done');b.disabled=true;b.textContent=String(next+1);next++;SFX.tone(500+next*40,.06);if(next===n){fin=true;answer(true,'');}}else{fin=true;b.classList.add('bad');answer(false,'');}});b.setAttribute('aria-label',T('shd.tile'));b.style.background='hsl('+hue+',60%,'+l+'%)';grid.appendChild(b);});body.appendChild(grid);};}
  function intruderItem(k){return function(body,answer){
    body.appendChild(el('p','g-q',T('int.ask',{k:k})));var cells=[],used={};while(cells.length<15){var m=k*(ri(30)+1);if(!used[m]){used[m]=1;cells.push(m);}}
    var x;do{x=ri(88)+2;}while(used[x]||x%k===0);cells.push(x);var grid=el('div','sch-grid');grid.style.gridTemplateColumns='repeat(4,1fr)';var fin=false;
    shuffle(cells).forEach(function(v){var b=btn(String(v),'sch-tile',function(){if(fin)return;fin=true;b.classList.add(v===x?'done':'bad');[].forEach.call(grid.children,function(c){if(c.textContent===String(x))c.classList.add('done');});answer(v===x,T('int.why',{v:x,k:k}));});grid.appendChild(b);});body.appendChild(grid);};}
  function tf(q){return function(body,answer){
    body.appendChild(el('p','g-q',q.s));
    var list=el('div','g-opts g-two');
    [['صح','Yes',true],['خطأ','No',false]].forEach(function(p){
      var b=btn(window.BSR&&window.BSR.lang()==='en'?(p[2]?'True':'False'):p[0],'g-opt',function(){[].forEach.call(list.children,function(c){c.disabled=true;});var ok=p[2]===q.v;b.classList.add(ok?'ok':'bad');answer(ok,q.x);});
      b.setAttribute('data-v',p[2]?'1':'0');list.appendChild(b);});
    body.appendChild(list);
  };}
  function order(q){return function(body,answer){
    body.appendChild(el('p','g-q',q.q));
    var correct=q.items,cur=shuffle(correct),n=0;while(cur.join('|')===correct.join('|')&&n++<10)cur=shuffle(correct);
    var ul=el('ul','g-sort');
    function render(){
      ul.textContent='';
      cur.forEach(function(t,k){
        var li=el('li','g-item');li.setAttribute('data-k',k);
        li.appendChild(el('span','g-n',String(k+1)));li.appendChild(el('span','g-t',t));
        var c=el('span','g-mv');
        var up=btn('▲','g-arrow',function(){if(k>0){var x=cur[k];cur[k]=cur[k-1];cur[k-1]=x;render();ul.children[k-1].querySelector('.g-arrow').focus();}});up.setAttribute('aria-label',T('g.up'));
        var dn=btn('▼','g-arrow g-dn',function(){if(k<cur.length-1){var x=cur[k];cur[k]=cur[k+1];cur[k+1]=x;render();ul.children[k+1].querySelector('.g-dn').focus();}});dn.setAttribute('aria-label',T('g.down'));
        c.appendChild(up);c.appendChild(dn);li.appendChild(c);
        li.addEventListener('pointerdown',function(e){
          if(e.target.closest('button'))return;
          if(e.pointerType!=='mouse'&&!e.target.closest('.g-n'))return;
          e.preventDefault();
          /* السحب بالتحويل (transform) دون نقل العنصر في DOM: نقل العنصر أثناء اللمس يقطع تسلسل مؤشر اللمس، فيتوقف السحب بعد أول تبديل */
          var kids=[].slice.call(ul.children),pos=kids.indexOf(li),n=kids.length,y0=e.clientY;
          var rects=kids.map(function(x){return x.getBoundingClientRect();});
          var step=n>1?rects[1].top-rects[0].top:li.offsetHeight,target=pos;
          try{li.setPointerCapture(e.pointerId);}catch(x){}
          li.classList.add('drag');li.style.position='relative';li.style.zIndex='3';
          function mv(ev){
            var dy=ev.clientY-y0;li.style.transform='translateY('+dy+'px)';
            var c=rects[pos].top+rects[pos].height/2+dy,j=0;
            for(var q=0;q<n;q++){if(q!==pos&&rects[q].top+rects[q].height/2<c)j++;}
            target=j;
            kids.forEach(function(k,q){if(q===pos)return;var s=0;if(pos<q&&q<=j)s=-step;else if(j<=q&&q<pos)s=step;k.style.transition='transform .15s';k.style.transform=s?'translateY('+s+'px)':'';});
          }
          function up(){
            li.removeEventListener('pointermove',mv);li.removeEventListener('pointerup',up);li.removeEventListener('pointercancel',up);
            kids.forEach(function(k){k.style.transform='';k.style.transition='';});li.style.zIndex='';li.style.position='';
            if(target!==pos){var it=cur.splice(pos,1)[0];cur.splice(target,0,it);}
            render();
          }
          li.addEventListener('pointermove',mv);li.addEventListener('pointerup',up);li.addEventListener('pointercancel',up);
        });
        ul.appendChild(li);
      });
    }
    render();body.appendChild(ul);
    var go=btn('','btn',function(){
      var good=0;[].forEach.call(ul.children,function(li,k){var r=cur[k]===correct[k];if(r)good++;li.classList.add(r?'ok':'bad');[].forEach.call(li.querySelectorAll('button'),function(b){b.disabled=true;});});
      go.remove();
      var full=good===correct.length,gain=Math.round(good*points({level:2,streak:0,left:0,total:0})/correct.length*1.5);
      answer(full,T('g.order.is')+' '+correct.join(' ← ')+'. '+q.x,full?null:gain);
    });tl(go,'g.check');body.appendChild(go);
  };}
  function word(q,hard){return function(body,answer,ctx){
    var w=q.w,L=letters(w),left=hard?2:3,rev=0;
    var p=el('p','g-q');p.textContent=T('g.hintw')+': '+q.h;body.appendChild(p);
    var shown=el('div','g-word');function mask(){return L.map(function(c,k){return k<rev?c:'_';}).join(' ');}shown.textContent=mask();
    var inp=el('input','g-in');inp.type='text';inp.autocomplete='off';inp.setAttribute('aria-label',T('g.check'));
    var info=el('p','note');function upd(){info.textContent=T('g.attempts')+': '+left;}upd();
    function end(good,why){inp.disabled=true;go.disabled=true;if(rv)rv.disabled=true;shown.textContent=L.join(' ');answer(good,why||T('g.wordis')+' '+w+'.');}
    var go=btn('','btn',function(){
      if(!inp.value.trim())return;
      if(norm(inp.value)===norm(w)){var g=points({level:ctx.level,streak:0,left:0,total:0})+(L.length-rev)*2;return end(true,T('g.wordis')+' '+w+'.');}
      left--;inp.value='';if(rev<L.length-1)rev++;shown.textContent=mask();upd();
      if(left<=0)end(false);else inp.focus();});tl(go,'g.check');
    var rv=btn('','btn-quiet',function(){if(rev<L.length-1){rev++;ctx.penalty(2);shown.textContent=mask();}});tl(rv,'g.reveal');
    inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();go.click();}});
    body.appendChild(shown);body.appendChild(inp);body.appendChild(document.createTextNode(' '));body.appendChild(go);body.appendChild(rv);body.appendChild(info);
  };}
  function memory(lev){
    stopTimer();
    var need=lev==='easy'?4:6,sets=shuffle(BANK.mem),pairs=[];
    sets.forEach(function(s){if(pairs.length<(lev==='hard'?12:need))shuffle(s.pairs).forEach(function(p){if(pairs.length<(lev==='hard'?12:need))pairs.push(p);});});
    var cards=[];pairs.forEach(function(p,k){cards.push({k:k,t:p[0]});cards.push({k:k,t:p[1]});});cards=shuffle(cards);
    box.textContent='';
    var h=el('h3');tl(h,'g.memory.name');box.appendChild(h);
    var info=el('p','g-bar');var a=el('span'),b2=el('span');info.appendChild(a);info.appendChild(b2);
    var grid=el('div','g-mem'+(pairs.length>6?' g-mem6':''));
    var open=[],moves=0,found=0,lock=false,t0=Date.now(),clock=null;
    function stat(){a.textContent=T('g.moves')+': '+moves+' · '+T('g.pairs')+': '+found+'/'+pairs.length;b2.textContent=T('g.time')+': '+Math.floor((Date.now()-t0)/1000)+'s';}
    stat();timer=setInterval(stat,500);
    cards.forEach(function(c){
      var b=btn('؟','g-card',function(){
        if(lock||b.disabled||open.indexOf(b)>=0)return;
        b.textContent=c.t;b.classList.add('up');open.push(b);if(open.length<2)return;
        moves++;var x=open[0],y=open[1];
        if(x._c.k===y._c.k){x.disabled=y.disabled=true;x.classList.add('done');y.classList.add('done');open=[];found++;stat();
          if(found===pairs.length){var eff=Math.min(100,Math.round(pairs.length/moves*100)),secs=(Date.now()-t0)/1000,bonus=Math.max(0,Math.round(pairs.length*3-secs/10));
            setTimeout(function(){finish({pts:Math.round(pairs.length*10*eff/100)+bonus,correct:pairs.length,total:pairs.length,pct:eff,bestStreak:0,level:lev});},350);}
        }else{lock=true;stat();setTimeout(function(){[x,y].forEach(function(z){z.textContent='؟';z.classList.remove('up');});open=[];lock=false;},700);}
      });b._c=c;grid.appendChild(b);});
    box.appendChild(info);box.appendChild(grid);
  }

  /* ===== ألعاب جديدة: حساب سريع، أنماط، سيمون، تحدي الدقيقة، البقاء ===== */
  function ri(n){return Math.floor(RND()*n);}
  function numOptions(body,answer,ans,wrong,why,cls){
    var set=[ans],cand=wrong.concat([ans+1,ans-1,ans+2,ans-2,ans+10,ans-10,ans*2,ans+3]);
    shuffle(cand).forEach(function(c){if(set.length<4&&set.indexOf(c)<0&&c>=0&&Math.round(c)===c)set.push(c);});
    var k=3;while(set.length<4){if(set.indexOf(ans+k)<0)set.push(ans+k);k++;}
    var list=el('div','g-opts g-two');
    shuffle(set).forEach(function(v){var b=btn(String(v),'g-opt g-num',function(){[].forEach.call(list.children,function(c){c.disabled=true;if(c.getAttribute('data-ok')==='1')c.classList.add('ok');});var ok=v===ans;if(!ok)b.classList.add('bad');answer(ok,why);});b.setAttribute('data-ok',v===ans?'1':'0');list.appendChild(b);});
    body.appendChild(list);
  }
  function genMath(lev){
    var a,b,c,t,ans,op;
    if(lev==='easy'){a=2+ri(19);b=2+ri(19);if(ri(2)){t=a+' + '+b;ans=a+b;}else{if(b>a){c=a;a=b;b=c;}t=a+' − '+b;ans=a-b;}}
    else if(lev==='medium'){op=ri(3);
      if(op===0){a=3+ri(10);b=3+ri(10);t=a+' × '+b;ans=a*b;}
      else if(op===1){a=20+ri(80);b=10+ri(60);t=a+' + '+b;ans=a+b;}
      else{a=40+ri(60);b=10+ri(30);t=a+' − '+b;ans=a-b;}}
    else{op=ri(4);
      if(op===0){a=6+ri(10);b=6+ri(8);c=5+ri(40);t=a+' × '+b+' + '+c;ans=a*b+c;}
      else if(op===1){a=10+ri(40);b=3+ri(9);c=3+ri(9);t=a+' + '+b+' × '+c;ans=a+b*c;}
      else if(op===2){a=8+ri(8);b=7+ri(8);c=5+ri(30);t=a+' × '+b+' − '+c;ans=a*b-c;}
      else{b=4+ri(9);c=4+ri(11);t=(b*c)+' ÷ '+b;ans=c;}}
    return {text:t,ans:ans,why:t+' = '+ans};
  }
  function mathItem(lev){return function(body,answer){
    var e=genMath(lev),q=el('p','g-q g-math',e.text+' = ?');q.setAttribute('dir','ltr');body.appendChild(q);
    numOptions(body,answer,e.ans,[],e.why);
  };}
  function genPattern(lev){
    var a,d,r,s=[],i,kind,out;
    var kinds=lev==='easy'?['arith']:lev==='medium'?['arith','geo','sq','alt']:['fib','diff','tri','alt','geo'];
    kind=kinds[ri(kinds.length)];
    if(kind==='arith'){a=1+ri(12);d=2+ri(8);for(i=0;i<6;i++)s.push(a+d*i);out={why:'pattern.why.arith',v:{d:d}};}
    else if(kind==='geo'){a=1+ri(4);r=2+ri(2);for(i=0;i<6;i++)s.push(a*Math.pow(r,i));out={why:'pattern.why.geo',v:{r:r}};}
    else if(kind==='sq'){a=1+ri(5);for(i=0;i<6;i++)s.push((a+i)*(a+i));out={why:'pattern.why.sq',v:{}};}
    else if(kind==='fib'){a=1+ri(4);d=1+ri(5);s=[a,d];for(i=2;i<7;i++)s.push(s[i-1]+s[i-2]);out={why:'pattern.why.fib',v:{}};}
    else if(kind==='diff'){a=1+ri(6);d=1+ri(2);s=[a];for(i=1;i<7;i++)s.push(s[i-1]+d*i);out={why:'pattern.why.diff',v:{}};}
    else if(kind==='tri'){for(i=1;i<=6;i++)s.push(i*(i+1)/2);out={why:'pattern.why.tri',v:{}};}
    else{a=1+ri(8);var x=2+ri(4),y=x+1+ri(3);s=[a];for(i=1;i<7;i++)s.push(s[i-1]+(i%2?x:y));out={why:'pattern.why.alt',v:{a:x,b:y}};}
    out.shown=s.slice(0,s.length-1);out.ans=s[s.length-1];return out;
  }
  function patternItem(lev){return function(body,answer){
    var e=genPattern(lev),q=el('p','g-q g-math',e.shown.join(' ,  ')+' ,  ?');q.setAttribute('dir','ltr');
    var cap=tl(el('p','g-sub'),'pattern.q');body.appendChild(cap);body.appendChild(q);
    var why=T(e.why,e.v);numOptions(body,answer,e.ans,[e.ans+e.shown[1]-e.shown[0],e.ans+e.shown[e.shown.length-1]-e.shown[e.shown.length-2]],why);
  };}
  function simon(lev){
    stopTimer();box.textContent='';
    var target=lev==='easy'?5:lev==='medium'?8:12,gap=lev==='easy'?650:lev==='medium'?500:380;
    var h=el('h3');tl(h,'g.simon.name');box.appendChild(h);
    var bar=el('p','g-bar'),st=el('span'),sc=el('span');bar.appendChild(st);bar.appendChild(sc);box.appendChild(bar);
    var status=el('p','g-sub g-status');status.setAttribute('aria-live','polite');box.appendChild(status);
    var grid=el('div','g-simon');box.appendChild(grid);
    var NAMES=['simon.p1','simon.p2','simon.p3','simon.p4'],SH=['▲','●','■','◆'],pads=[],seq=[],pos=0,accept=false,alive=true,done=0,tok={};
    var FREQ=[392,494,587,698];
    for(var k=0;k<4;k++)(function(k){var b=btn(SH[k],'g-pad g-pad'+k,function(){press(k);});b.setAttribute('aria-label',T(NAMES[k]));b.disabled=true;pads.push(b);grid.appendChild(b);})(k);
    function lit(k,ms){pads[k].classList.add('on');SFX.tone(FREQ[k],ms/1000);setTimeout(function(){pads[k].classList.remove('on');},ms);}
    function setIn(v){accept=v;pads.forEach(function(b){b.disabled=!v;});}
    function round(){
      seq.push(ri(4));pos=0;setIn(false);
      st.textContent=T('simon.round',{n:seq.length,m:target});sc.textContent=T('g.score')+': '+done*10;
      status.textContent=T('simon.watch');
      var my=tok;seq.forEach(function(s,i){setTimeout(function(){if(my!==tok||!alive)return;lit(s,gap*.7);},700+i*gap);});
      setTimeout(function(){if(my!==tok||!alive)return;setIn(true);status.textContent=T('simon.go');},700+seq.length*gap);
    }
    function press(k){
      if(!accept||!alive)return;lit(k,200);
      if(k!==seq[pos]){alive=false;setIn(false);status.textContent=T('simon.fail');SFX.play('bad');setTimeout(function(){fin();},900);return;}
      pos++;
      if(pos===seq.length){done=seq.length;setIn(false);sc.textContent=T('g.score')+': '+done*10;SFX.play('ok');
        if(done>=target){alive=false;status.textContent=T('simon.win');setTimeout(function(){fin();},700);}
        else{status.textContent=T('simon.next');var my=tok;setTimeout(function(){if(my===tok)round();},900);}}
    }
    function fin(){tok={};var pct=Math.min(100,Math.round(done/target*100));finish({pts:done*10+(done>=target?20:0),correct:done,total:target,pct:pct,bestStreak:done,level:lev});}
    round();
  }
  function endless(lev,mode){
    stopTimer();box.textContent='';
    var cfg={blitz:{sec:60,target:lev==='easy'?8:lev==='medium'?12:16,lives:0},survival:{sec:0,target:lev==='easy'?8:lev==='medium'?10:12,lives:3}}[mode];
    var lvl=lev==='easy'?1:lev==='medium'?2:3;
    var mq=BANK.mcq.filter(function(q){return lvl===1?q.l===1:lvl===2?q.l<=2:true;}),tq=BANK.tf.filter(function(q){return lvl===1?q.l===1:lvl===2?q.l<=2:true;});
    var pool=shuffle(mq.map(function(q){return {k:'m',q:q};}).concat(tq.map(function(q){return {k:'t',q:q};}))).slice(0,60);
    var ok=0,asked=0,streak=0,best=0,pts=0,lives=cfg.lives,left=cfg.sec,t0=Date.now(),idx=0,over=false,tok={};
    var h=el('h3');tl(h,'g.'+mode+'.name');box.appendChild(h);
    var bar=el('p','g-bar'),a=el('span'),b2=el('span');bar.appendChild(a);bar.appendChild(b2);box.appendChild(bar);
    var tb=null,tf=null;if(cfg.sec){tb=el('div','g-time');tf=el('i');tb.appendChild(tf);tb.setAttribute('role','timer');box.appendChild(tb);}
    var body=el('div'),fb=el('div','g-fb');fb.setAttribute('aria-live','polite');box.appendChild(body);box.appendChild(fb);
    function stats(){a.textContent=T('g.score')+': '+pts+' · '+T('g.streak')+': '+streak;b2.textContent=cfg.lives?T('survival.lives')+': '+'♥'.repeat(Math.max(lives,0)):T('blitz.correct',{n:ok});}
    function end(){if(over)return;over=true;tok={};stopTimer();var pct=Math.min(100,Math.round(ok/cfg.target*100));
      finish({pts:pts,correct:Math.min(ok,cfg.target),total:cfg.target,pct:pct,bestStreak:best,level:lev});}
    function nextQ(){
      if(over)return;if(idx>=pool.length||(cfg.lives&&lives<=0)){end();return;}
      body.textContent='';fb.textContent='';var it=pool[idx++],my=tok,done=false;
      function answer(good,why){
        if(done||my!==tok)return;done=true;asked++;SFX.play(good?'ok':'bad');
        if(good){ok++;streak++;best=Math.max(best,streak);pts+=10+Math.min(streak,5)*2;}else{streak=0;if(cfg.lives)lives--;}
        stats();fb.textContent='';if(good)fb.appendChild(tick());
        var s=el('strong',good?'ok':'bad');s.textContent=good?T('g.correct'):T('g.wrong');fb.appendChild(s);
        if(mode==='survival'&&why){fb.appendChild(document.createTextNode(' '+why));}
        setTimeout(function(){if(my===tok)nextQ();},mode==='blitz'?450:(good?900:1700));
      }
      var ctx={hintAvail:function(){return false;},useHint:function(){},penalty:function(){}};
      (it.k==='m'?mcq(it.q):tf(it.q))(body,answer,ctx);
    }
    stats();
    if(cfg.sec){timer=setInterval(function(){left=Math.max(0,cfg.sec-(Date.now()-t0)/1000);tf.style.width=(left/cfg.sec*100)+'%';tb.classList.toggle('low',left/cfg.sec<0.25);if(left<=0)end();},200);}
    nextQ();
  }
  function start(lev){
    level=lev;curSeed=chSeed!=null?chSeed:Math.floor(Math.random()*2147483647);RND=mulberry(curSeed);var roundOpp=chSeed!=null?gcOpp:null;chSeed=null;if(!daily)gcOppRound=roundOpp;
    var secFor=function(){return SEC[lev==='prog'?'medium':lev];};
    var name=lev==='prog'?'medium':lev;
    if(slug==='mcq'){var qs=lev==='prog'?progressive('mcq',10):pick('mcq',pool('mcq',lev),10);run(qs.map(mcq),{level:name,levelName:lev,sec:secFor()});}
    else if(slug==='truefalse'){var ts=lev==='prog'?progressive('tf',10):pick('truefalse',pool('truefalse',lev),10);run(ts.map(tf),{level:name,levelName:lev,sec:Math.round(secFor()*0.6)});}
    else if(slug==='order'){run(pick('order',pool('order',lev),5).map(order),{level:name,levelName:lev,sec:0});}
    else if(slug==='word'){
      var ws=BANK.word,ln=function(x){return letters(x.w).length;};
      var pl=lev==='easy'?ws.filter(function(x){return ln(x)<=4;}):lev==='prog'?ws:ws.filter(function(x){return ln(x)>=5;});
      run(pick('word',pl.length>=5?pl:ws,5).map(function(q){return word(q,lev==='hard');}),{level:name,levelName:lev,sec:lev==='hard'?40:0});}
    else if(slug==='memory')memory(lev);
    else if(slug==='math'){var nm=lev==='prog'?'medium':lev,arr=[];for(var q=0;q<10;q++)arr.push(mathItem(nm));run(arr,{level:nm,levelName:lev,sec:nm==='easy'?15:nm==='medium'?20:30});}
    else if(slug==='pattern'){var nm2=lev==='prog'?'medium':lev,arr2=[];for(var q2=0;q2<8;q2++)arr2.push(patternItem(nm2));run(arr2,{level:nm2,levelName:lev,sec:nm2==='easy'?25:nm2==='medium'?30:40});}
    else if(slug==='simon')simon(lev==='prog'?'medium':lev);
    else if(slug==='stroop'){var nS=lev==='easy'?3:lev==='medium'?4:5,aS=[];for(var qS=0;qS<10;qS++)aS.push(stroopItem(nS));run(aS,{level:lev==='prog'?'medium':lev,levelName:lev,sec:lev==='easy'?8:lev==='hard'?4:6});}
    else if(slug==='compare'){var lC=lev==='easy'?1:lev==='hard'?3:2,aC=[];for(var qC=0;qC<10;qC++)aC.push(compareItem(lC));run(aC,{level:lev==='prog'?'medium':lev,levelName:lev,sec:lC===1?8:lC===2?6:5});}
    else if(slug==='count'){var lN=lev==='easy'?1:lev==='hard'?3:2,aN=[];for(var qN=0;qN<8;qN++)aN.push(countItem(lN));run(aN,{level:lev==='prog'?'medium':lev,levelName:lev,sec:12});}
    else if(slug==='schulte'){var sz=lev==='easy'?3:lev==='hard'?5:4,aH=[];for(var qH=0;qH<3;qH++)aH.push(schulteItem(sz));run(aH,{level:lev==='prog'?'medium':lev,levelName:lev,sec:sz===3?15:sz===4?30:50});}
    else if(slug==='odd'){var sO=lev==='easy'?3:lev==='hard'?6:5,dO=lev==='easy'?26:lev==='hard'?9:15,aO=[];for(var qO=0;qO<8;qO++)aO.push(oddItem(sO,dO));run(aO,{level:lev==='prog'?'medium':lev,levelName:lev,sec:lev==='easy'?10:lev==='hard'?15:12});}
    else if(slug==='multiples'){var ks=lev==='easy'?[2,5,10]:lev==='hard'?[6,7,8,9,12]:[3,4,6,7,9],aM=[];for(var qM=0;qM<6;qM++)aM.push(multItem(ks[ri(ks.length)],3+ri(3)));run(aM,{level:lev==='prog'?'medium':lev,levelName:lev,sec:lev==='easy'?14:lev==='hard'?18:16});}
    else if(slug==='digits'){var ln2=lev==='easy'?4:lev==='hard'?7:5,aD=[];for(var qD=0;qD<6;qD++)aD.push(digitsItem(ln2+(qD>=3?1:0),2200));run(aD,{level:lev==='prog'?'medium':lev,levelName:lev,sec:20});}
    else if(slug==='stack'){stackGame(lev==='prog'?'medium':lev);}
    else if(slug==='rhythm'){rhythmGame(lev==='prog'?'medium':lev);}
    else if(slug==='merge'){mergeGame(lev==='prog'?'medium':lev);}
    else if(slug==='opsign'){var lO=lev==='easy'?1:lev==='hard'?3:2,aP=[];for(var qP=0;qP<10;qP++)aP.push(opsignItem(lO));run(aP,{level:lev==='prog'?'medium':lev,levelName:lev,sec:lO===1?8:lO===2?8:7});}
    else if(slug==='numline'){var lL=lev==='easy'?1:lev==='hard'?3:2,aL=[];for(var qL=0;qL<8;qL++)aL.push(numlineItem(lL));run(aL,{level:lev==='prog'?'medium':lev,levelName:lev,sec:10});}
    else if(slug==='pathmem'){var b0=lev==='easy'?3:lev==='hard'?5:4,aA=[];for(var qA=0;qA<6;qA++)aA.push(pathItem(b0+Math.floor(qA/2)));run(aA,{level:lev==='prog'?'medium':lev,levelName:lev,sec:0});}
    else if(slug==='revdigits'){var l3=lev==='easy'?3:lev==='hard'?6:4,aR=[];for(var qR=0;qR<6;qR++)aR.push(digitsItem(l3+(qR>=3?1:0),2200,true));run(aR,{level:lev==='prog'?'medium':lev,levelName:lev,sec:20});}
    else if(slug==='shades'){var nS2=lev==='easy'?4:lev==='hard'?8:6,aS2=[];for(var qS2=0;qS2<6;qS2++)aS2.push(shadesItem(nS2));run(aS2,{level:lev==='prog'?'medium':lev,levelName:lev,sec:lev==='easy'?10:lev==='hard'?16:13});}
    else if(slug==='intruder'){var kI=lev==='easy'?[2,5,10]:lev==='hard'?[6,7,8,9,12]:[3,4,6,7,9],aI=[];for(var qI=0;qI<8;qI++)aI.push(intruderItem(kI[ri(kI.length)]));run(aI,{level:lev==='prog'?'medium':lev,levelName:lev,sec:lev==='easy'?9:lev==='hard'?12:10});}
    else if(slug==='bubbles'){var bq=lev==='prog'?progressive('mcq',8):pick('mcq',pool('mcq',lev),8),bn=lev==='prog'?'medium':lev;run(bq.map(function(q){return bubbleItem(q,bn==='easy'?34:bn==='medium'?48:64);}),{level:bn,levelName:lev,sec:bn==='easy'?25:bn==='medium'?20:15});}
    else if(slug==='blitz'||slug==='survival')endless(lev==='prog'?'medium':lev,slug);
  }
  /* تحدي اليوم: نفس الأسئلة لكل اللاعبين في اليوم بنفس البذرة */
  root._daily=function(date,done,opponent){
    daily=date;onDone=done;opponentScore=Number.isFinite(opponent)?opponent:null;level='medium';
    var r=mulberry(hash('basira-'+date)),m5=shuffle(BANK.mcq,r).slice(0,3),t2=shuffle(BANK.tf,r).slice(0,2);
    var items=m5.map(mcq).concat(t2.map(tf));
    run(items,{level:'medium',levelName:'medium',sec:20});
  };
  if(root.getAttribute('data-auto')==='daily')return;
  intro();
}

/* ===== لوحات الرئيسية: تحدي اليوم والتقدم ===== */
function dailyPanel(host){
  var gh=el('div','bsr-game');gh.id='daily-host';
  function render(){
    host.textContent='';var params=new URLSearchParams(location.search),challengeDate=params.get('challenge'),isChallenge=/^\d{4}-\d{2}-\d{2}$/.test(challengeDate||''),d=isChallenge?challengeDate:today(),opponent=params.has('score')?Number(params.get('score')):null,s=load(),done=s.daily&&s.daily[d];
    var top=el('div','daily-top');top.appendChild(ico('target'));var th=el('div');var h=el('h2');tl(h,'daily.title');th.appendChild(h);th.appendChild(tl(el('p','g-sub'),'daily.sub'));top.appendChild(th);host.appendChild(top);
    if(isChallenge&&Number.isFinite(opponent)){host.appendChild(tl(el('p','g-ach'),'challenge.invite',{s:opponent,date:d}));}
    if(done){host.appendChild(tl(el('p','g-ach'),'daily.done',{s:done.pts}));}
    var a=el('div','g-act'),b=btn('','btn',function(){
      host.textContent='';var g=el('div','bsr-game');g.setAttribute('data-auto','daily');host.appendChild(g);
      var back=function(mode){render();};
      mount(g,'mcq');g._daily(d,function(mode){render();},opponent);
    });tl(b,done?'daily.again':'daily.play');a.appendChild(b);host.appendChild(a);
  }
  render();document.addEventListener('basira:lang',render);
}
function profilePanel(host){
  function render(){
    var s=load(),li=levelInfo(s.xp||0);host.textContent='';
    var h=el('h2');tl(h,'profile.title');host.appendChild(h);
    var top=el('div','pf-top');
    var lv=el('div','pf-lv');lv.appendChild(tl(el('b'),'profile.level',{n:li.level}));lv.appendChild(tl(el('span','note'),'profile.xp',{a:li.into,b:li.need}));top.appendChild(lv);
    var bar=el('div','g-prog'),bi=el('i');bi.style.width=Math.round(li.into/li.need*100)+'%';bar.appendChild(bi);top.appendChild(bar);
    var days=Object.keys((function(){var o={};(s.hist||[]).forEach(function(r){o[new Date(r.t).toDateString()]=1;});return o;})()).length;
    top.appendChild(tl(el('p','note'),'profile.days',{n:days}));host.appendChild(top);
    var h2=el('h3');tl(h2,'profile.ach');host.appendChild(h2);
    var ul=el('ul','pf-ach');ACH.forEach(function(id){var li2=el('li',(s.ach&&s.ach[id])?'on':'off'),tx=el('span','txt');li2.appendChild(ico(ACHI[id]));tx.appendChild(tl(el('b'),'ach.'+id));tx.appendChild(tl(el('span','note'),'ach.'+id+'.d'));li2.appendChild(tx);ul.appendChild(li2);});host.appendChild(ul);
    var h3=el('h3');tl(h3,'profile.hist');host.appendChild(h3);
    if(!(s.hist&&s.hist.length))host.appendChild(tl(el('p','note'),'profile.none'));
    else{var hl=el('ul','pf-hist');s.hist.forEach(function(r){var l=el('li');l.textContent=T('g.'+r.slug+'.name')+' · '+T('g.'+(r.level==='prog'?'prog':r.level))+' · '+r.pts+' '+T('g.points')+' · '+r.pct+'%'+(r.daily?' · '+T('daily.title'):'');hl.appendChild(l);});host.appendChild(hl);}
    var rs=btn('','btn-quiet',function(){if(confirm(T('profile.confirm'))){try{localStorage.removeItem(KEY);}catch(e){}render();document.dispatchEvent(new CustomEvent('basira:progress'));}});tl(rs,'profile.reset');host.appendChild(rs);
  }
  render();document.addEventListener('basira:progress',render);document.addEventListener('basira:lang',render);
}


function habitPanel(host){
  function render(){
    var s=load(),h=streakInfo(s);host.textContent='';
    var top=el('div','hb-top');var fl=el('div','hb-flame');fl.appendChild(ico('flame','hbi'));var n=el('b','hb-n',String(h.streak));fl.appendChild(n);top.appendChild(fl);
    var tx=el('div','hb-tx');var t=el('h3');t.textContent=h.streak?T('habit.days',{n:h.streak}):T('habit.start');tx.appendChild(t);
    var p=el('p','hb-sub');p.textContent=h.playedToday?(h.rounds>=h.goal?T('habit.goal.done'):T('habit.safe')):(h.streak?T('habit.risk'):T('habit.first'));tx.appendChild(p);top.appendChild(tx);
    var ring=el('div','hb-ring');ring.style.setProperty('--p',Math.min(1,h.rounds/h.goal));var rt=el('span','',Math.min(h.rounds,h.goal)+'/'+h.goal);ring.appendChild(rt);var rl=el('small','');rl.textContent=T('habit.goal');ring.appendChild(rl);top.appendChild(ring);host.appendChild(top);
    var wk=el('ul','hb-week');var nm=T('habit.wd').split(',');h.week.forEach(function(x){var li=el('li',x.on?'on':'');var d=new Date(x.d+'T00:00:00Z').getUTCDay();li.appendChild(el('i'));li.appendChild(el('span','',nm[d]));wk.appendChild(li);});host.appendChild(wk);
    var nx=[3,7,14,30].filter(function(k){return k>h.streak;})[0];if(nx){var m=el('p','hb-next');m.textContent=T('habit.next',{n:nx-h.streak,d:nx,x:MILE[nx]});host.appendChild(m);}
    var det=el('details','hb-sync');var sm=el('summary');sm.textContent=T('habit.sync');det.appendChild(sm);
    var pp=el('p','hb-sub');pp.textContent=T('habit.sync.text');det.appendChild(pp);
    var ta=el('textarea');ta.setAttribute('rows','3');ta.setAttribute('aria-label',T('habit.sync'));ta.readOnly=false;det.appendChild(ta);
    var row=el('div','hb-row');var b1=btn('','btn alt',function(){ta.value=exportCode();ta.select();try{navigator.clipboard.writeText(ta.value);}catch(e){}msg.textContent=T('habit.copied');});b1.textContent=T('habit.export');
    var b2=btn('','btn alt',function(){msg.textContent=importCode(ta.value)?T('habit.imported'):T('habit.bad');});b2.textContent=T('habit.import');row.appendChild(b1);row.appendChild(b2);det.appendChild(row);var msg=el('p','hb-sub');msg.setAttribute('role','status');det.appendChild(msg);
    host.appendChild(det);
  }
  render();document.addEventListener('basira:progress',render);document.addEventListener('basira:lang',render);
}
function pstrip(){
  var h=document.getElementById('pstrip');if(!h)return;
  var s=load(),li=levelInfo(s.xp||0);h.textContent='';
  if(!(s.xp>0)){h.appendChild(tl(el('span','note'),'pstrip.new'));h.firstChild.style.color='#cfd5de';return;}
  var lv=ico('level','lvico');var x=el('div','xp'),sm=el('small');sm.textContent=T('pstrip.lv',{n:li.level})+' · '+T('pstrip.xp',{a:li.into,b:li.need});
  var b=el('div','bar'),i=el('i');i.style.width=Math.round(li.into/li.need*100)+'%';b.appendChild(i);x.appendChild(sm);x.appendChild(b);h.appendChild(lv);h.appendChild(x);
}
function rise(){
  var n=document.querySelectorAll('.sec,.hero-vis');if(!('IntersectionObserver' in window)){return;}
  document.documentElement.classList.add('js-rise');
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.08});
  [].forEach.call(n,function(x){x.setAttribute('data-rise','');io.observe(x);});
  setTimeout(function(){[].forEach.call(n,function(x){x.classList.add('in');});},2500);
}
function emptyState(){
  var c=document.getElementById('content');if(!c||document.getElementById('play')||c.querySelector('.post'))return false;
  if(c.querySelector('.empty-state'))return true;
  var d=el('section','empty-state');d.appendChild(ico('gem','big'));
  var h=el('h1');tl(h,'empty.title');d.appendChild(h);d.appendChild(tl(el('p'),'empty.sub'));
  var a=el('div','cta');var home=el('a','btn');home.href=(document.querySelector('.brand')||{}).href||'/';tl(home,'empty.home');a.appendChild(home);
  var pl=el('a','btn alt');pl.href=home.href.replace(/#.*/,'')+'#play';tl(pl,'empty.play');a.appendChild(pl);d.appendChild(a);c.appendChild(d);return true;
}
function init(){
  emptyState();
  var d=document.documentElement,tb=document.querySelectorAll('.js-theme'),ORDER=['dark','light','auto'],mq=window.matchMedia?matchMedia('(prefers-color-scheme: light)'):null;
  function pref(){var p=d.getAttribute('data-pref');return ORDER.indexOf(p)<0?'dark':p;}
  function apply(p){d.setAttribute('data-pref',p);d.setAttribute('data-theme',p==='auto'?(mq&&mq.matches?'light':'dark'):p);}
  function label(){var p=pref();[].forEach.call(tb,function(b){b.textContent=T('theme.mode',{m:T('theme.m.'+p)});b.setAttribute('aria-label',T('theme.mode',{m:T('theme.m.'+p)}));});}
  label();document.addEventListener('basira:lang',label);
  var sb=document.querySelectorAll('.js-sound');
  function slabel(){var on=SFX.isOn();[].forEach.call(sb,function(b){b.setAttribute('aria-pressed',on?'true':'false');b.textContent=T(on?'sound.on':'sound.off');});}
  slabel();document.addEventListener('basira:lang',slabel);
  [].forEach.call(sb,function(b){b.addEventListener('click',function(){SFX.set(!SFX.isOn());slabel();if(SFX.isOn())SFX.play('reward');});});
  if(mq&&mq.addEventListener)mq.addEventListener('change',function(){if(pref()==='auto'){apply('auto');label();}});
  [].forEach.call(tb,function(b){b.addEventListener('click',function(){
    var n=ORDER[(ORDER.indexOf(pref())+1)%ORDER.length];apply(n);
    try{localStorage.setItem('site-theme',n);}catch(e){}label();});});
  [].forEach.call(document.querySelectorAll('.bsr-game[data-game]'),function(r){mount(r,r.getAttribute('data-game'));});
  var pk=document.getElementById('picker'),host=document.getElementById('play-host');
  if(pk&&host){
    var bs=[].slice.call(pk.querySelectorAll('button.gcard')),root=document.documentElement,head=null,baseTitle=document.title;
    function gname(s){return T('g.'+s+'.name');}
    function stars(){bs.forEach(function(b){var st=(load().stats||{})[b.getAttribute('data-g')],n=b.querySelector('.gbest');if(n)n.textContent=st?('★ '+st.best+'%'):'';});}
    function buildHead(slug){
      if(!head){head=el('div','gview-head');var back=btn('','btn-quiet gview-back',function(){leave(true);});tl(back,'view.back');back.insertBefore(document.createTextNode('→ '),back.firstChild);back.setAttribute('data-arrow','1');head.appendChild(back);var t=el('h1','gview-title');head.appendChild(t);host.parentNode.insertBefore(head,pk);}
      head.querySelector('.gview-title').textContent=gname(slug);head.querySelector('.gview-title').setAttribute('data-i','g.'+slug+'.name');
    }
    function enter(slug,push){
      bs.forEach(function(x){x.setAttribute('aria-pressed',x.getAttribute('data-g')===slug?'true':'false');});
      host.removeAttribute('data-ready');mount(host,slug);host.hidden=false;buildHead(slug);
      root.classList.add('view-game');root.setAttribute('data-game-view',slug);
      document.title=gname(slug)+' | '+(T('brand')||'BASIRA');
      if(push!==false){try{history.pushState({g:slug},'','?game='+slug);}catch(e){}}
      window.scrollTo(0,0);
    }
    function leave(push){
      root.classList.remove('view-game');root.removeAttribute('data-game-view');host.hidden=true;host.textContent='';host.removeAttribute('data-ready');
      bs.forEach(function(x){x.setAttribute('aria-pressed','false');});document.title=baseTitle;
      if(push){try{history.pushState({},'',location.pathname);}catch(e){}}
      stars();var pl=document.getElementById('play');if(pl&&pl.scrollIntoView)pl.scrollIntoView({block:'start'});
    }
    host.hidden=true;
    bs.forEach(function(b){b.addEventListener('click',function(){enter(b.getAttribute('data-g'),true);});});
    [].forEach.call(document.querySelectorAll('.gfilter'),function(f){f.addEventListener('click',function(){
      [].forEach.call(document.querySelectorAll('.gfilter'),function(x){x.setAttribute('aria-pressed',x===f?'true':'false');});
      var c=f.getAttribute('data-f');bs.forEach(function(b){b.hidden=!(c==='all'||(' '+b.getAttribute('data-cat')+' ').indexOf(' '+c+' ')>=0);});});});
    window.addEventListener('popstate',function(){var g=new URLSearchParams(location.search).get('game');if(g&&META.some(function(m){return m[0]===g;}))enter(g,false);else leave(false);});
    document.addEventListener('basira:progress',stars);document.addEventListener('basira:lang',function(){if(head){var s=root.getAttribute('data-game-view');if(s){head.querySelector('.gview-title').textContent=gname(s);}}});
    stars();
    (function(){var pp=new URLSearchParams(location.search),g0=pp.get('game'),gc=(pp.get('gc')||'').split('.');if(g0&&gc.length===3&&/^\d+$/.test(gc[0])&&['easy','medium','hard'].indexOf(gc[1])>=0&&/^\d+$/.test(gc[2])&&META.some(function(m){return m[0]===g0;}))PEND={slug:g0,seed:+gc[0],level:gc[1],score:+gc[2]};})();
    var q0=new URLSearchParams(location.search).get('game');if(q0&&META.some(function(m){return m[0]===q0;}))enter(q0,false);
    window.BSR.openGame=function(s){enter(s,true);};window.BSR.leaveGame=function(){leave(true);};
    /* ميل ثلاثي الأبعاد للبطاقات (للمؤشر فقط) */
    if(window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
      bs.forEach(function(b){b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;b.style.setProperty('--rx',(-y*8).toFixed(1)+'deg');b.style.setProperty('--ry',(x*10).toFixed(1)+'deg');});b.addEventListener('pointerleave',function(){b.style.setProperty('--rx','0deg');b.style.setProperty('--ry','0deg');});});
      /* كشف النص مع التمرير: بالكلمات (تقطيع الحروف يكسر وصل العربية) */
      (function(){var sc=document.querySelector('.scrub');if(!sc)return;var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
        var spans=[];function build(){var t=sc.getAttribute('data-i')?T(sc.getAttribute('data-i')):sc.textContent;sc.setAttribute('aria-label',t);sc.textContent='';spans=t.split(/\s+/).map(function(w){var s=el('span','w',w);s.setAttribute('aria-hidden','true');sc.appendChild(s);sc.appendChild(document.createTextNode(' '));return s;});upd();}
        function upd(){if(reduce){spans.forEach(function(s){s.style.opacity=1;});return;}var r=sc.getBoundingClientRect(),p=Math.min(1,Math.max(0,(innerHeight*0.85-r.top)/(innerHeight*0.55+r.height)));spans.forEach(function(s,i){var a=i/spans.length,b=(i+1)/spans.length,k=Math.min(1,Math.max(0,(p-a*0.8)/(b*0.8-a*0.8+0.0001)));s.style.opacity=(0.2+0.8*k).toFixed(2);});}
        var tk=0;addEventListener('scroll',function(){if(!tk){tk=1;requestAnimationFrame(function(){tk=0;upd();});}},{passive:true});document.addEventListener('basira:lang',build);build();})();
      /* مؤشر مخصص على الشاشات ذات الماوس: يتحول إلى «العب» فوق البطاقات */
      (function(){if(!matchMedia('(pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;var c=el('div','cur');c.setAttribute('aria-hidden','true');c.appendChild(el('span','cur-t'));document.body.appendChild(c);document.documentElement.classList.add('has-cur');
        var x=0,y=0,cx=0,cy=0,on=false,last=0;addEventListener('pointermove',function(e){x=e.clientX;y=e.clientY;if(!on){on=true;cx=x;cy=y;c.classList.add('show');}var g=e.target.closest&&e.target.closest('.gcard'),b=e.target.closest&&e.target.closest('a,button,.g-opt');c.classList.toggle('play',!!g&&!document.body.classList.contains('x'));c.classList.toggle('btn',!g&&!!b);if(g)c.firstChild.textContent=T('card.play');},{passive:true});
        addEventListener('click',function(){setTimeout(function(){var t=document.elementFromPoint(x,y),g=t&&t.closest('.gcard'),b=t&&t.closest('a,button,.g-opt');c.classList.toggle('play',!!g);c.classList.toggle('btn',!g&&!!b);},120);},true);
        document.addEventListener('mouseleave',function(){c.classList.remove('show');on=false;});
        (function loop(t){var dt=Math.min(0.05,(t-last)/1000||0.016);last=t;var k=1-Math.exp(-16*dt);cx+=(x-cx)*k;cy+=(y-cy)*k;c.style.transform='translate3d('+cx.toFixed(1)+'px,'+cy.toFixed(1)+'px,0)';requestAnimationFrame(loop);})(0);})();
      /* ظهور العنوان بانزلاق من قناع (بلا تلاشي) */
      document.querySelectorAll('.mask-in').forEach(function(h){h.classList.add('go');});
      var mqs=document.querySelector('.mq');if(mqs&&!matchMedia('(prefers-reduced-motion: reduce)').matches){var tr=mqs.querySelectorAll('.mq-track'),tk=0;var upd=function(){tk=0;var r=mqs.getBoundingClientRect(),off=(innerHeight-r.top)*0.25;tr.forEach(function(t,i){t.style.transform='translate3d('+((i?-1:1)*(off%420)).toFixed(1)+'px,0,0)';});};addEventListener('scroll',function(){if(!tk){tk=1;requestAnimationFrame(upd);}},{passive:true});upd();}
      if(matchMedia('(pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.querySelectorAll('.cta .btn').forEach(function(b){b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)/5).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)/4).toFixed(1)+'px)';});b.addEventListener('pointerleave',function(){b.style.transform='';});});}
      var st=document.querySelector('.stage');if(st){document.addEventListener('pointermove',function(e){var x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;st.style.setProperty('--px',(x*14).toFixed(1)+'px');st.style.setProperty('--py',(y*10).toFixed(1)+'px');st.style.setProperty('--tx',(-y*10).toFixed(1)+'deg');st.style.setProperty('--ty',(x*14).toFixed(1)+'deg');},{passive:true});}
    }
  }
  pstrip();document.addEventListener('basira:progress',pstrip);document.addEventListener('basira:lang',pstrip);rise();
  var hh=document.getElementById('habit-panel');if(hh)habitPanel(hh);var dh=document.getElementById('daily-panel');if(dh)dailyPanel(dh);
  var ph=document.getElementById('profile-panel');if(ph)profilePanel(ph);
  document.addEventListener('basira:lang',function(){
    [].forEach.call(document.querySelectorAll('[data-i]'),function(n){if(n.hasAttribute('data-v')){try{n.textContent=T(n.getAttribute('data-i'),JSON.parse(n.getAttribute('data-v')));}catch(e){}}});
  });
}
window.BSR=window.BSR||{};window.BSR.sfx=SFX;window.BSR.emptyState=emptyState;window.BSR.engine={streakInfo:streakInfo,habit:habit,exportCode:exportCode,importCode:importCode,points:points,levelInfo:levelInfo,mulberry:mulberry,hash:hash,today:today,norm:norm};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
