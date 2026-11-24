(function(){
'use strict';
var DICT={"ar":{"brand":"BASIRA | بصيرة","nav.games":"الألعاب","nav.topics":"المعرفة","nav.articles":"المقالات","nav.verify":"كيف نتحقق","search.ph":"ابحث في المقالات","search.btn":"بحث","search.label":"ابحث في الموقع","lang.switch":"English","theme.dark":"الوضع الداكن","theme.light":"الوضع الفاتح","hero.eyebrow":"Think. Discover. Play. · فكّر. اكتشف. العب.","hero.title":"اعرف أكثر، ثم تحدَّ نفسك","hero.lede":"معلومات موثّقة بالمصادر وألعاب ذهنية بالعربية. تلعب فوراً بلا تسجيل، وتُحفظ نتائجك على جهازك فقط.","hero.cta":"ابدأ اللعب","hero.cta2":"تصفّح المعرفة","games.title":"الألعاب","topics.title":"أقسام المعرفة","latest.title":"أحدث المقالات","verify.title":"كيف نتحقق","verify.text":"كل رقم أو تاريخ في مقالاتنا له مصدر مذكور، وأسئلة الألعاب تُراجع قبل ظهورها ولا تُولَّد أثناء اللعب.","verify.link":"اقرأ منهجنا","foot.note":"معلومات موثّقة وألعاب ذهنية بالعربية، تعمل بلا تسجيل.","foot.topics":"أقسام المعرفة","foot.about":"عن الموقع","foot.pending":"الصفحات التعريفية قيد الإعداد","lang.note":"محتوى الأسئلة والمقالات الإنجليزية قيد المراجعة، لذلك تظهر الأسئلة بالعربية الآن.","noscript":"الألعاب والتحدي اليومي تحتاج تفعيل JavaScript في متصفحك.","t.العلوم":"العلوم","t.التاريخ والحضارات":"التاريخ والحضارات","t.الجغرافيا والدول":"الجغرافيا والدول","t.التكنولوجيا":"التكنولوجيا","t.الثقافة العامة":"الثقافة العامة","t.الرياضيات والمنطق":"الرياضيات والمنطق","t.اللغة والأدب":"اللغة والأدب","t.الفضاء والفلك":"الفضاء والفلك","g.mcq.name":"اختبارات متعددة الخيارات","g.mcq.desc":"أربع إجابات وتفسير بعد كل سؤال","g.truefalse.name":"صح أم خطأ","g.truefalse.desc":"جمل سريعة تختبر دقة معلوماتك","g.order.name":"ترتيب الأحداث","g.order.desc":"رتّب وقائع بالتسلسل الصحيح","g.memory.name":"لعبة الذاكرة","g.memory.desc":"اكتشف الأزواج بأقل عدد من المحاولات","g.word.name":"خمّن الكلمة","g.word.desc":"كلمة مخفية وتلميحات تساعدك","g.start":"ابدأ","g.next":"التالي","g.finish":"النتيجة","g.again":"جولة جديدة","g.back":"رجوع","g.best":"أفضل نتيجة","g.score":"النقاط","g.streak":"سلسلة","g.time":"الوقت","g.level":"المستوى","g.easy":"سهل","g.medium":"متوسط","g.hard":"صعب","g.prog":"متدرج","g.pick":"اختر المستوى","g.qof":"السؤال {n} من {m}","g.hint":"حذف إجابتين (−3 نقاط)","g.correct":"إجابة صحيحة.","g.wrong":"إجابة غير صحيحة.","g.timeout":"انتهى الوقت.","g.check":"تحقق","g.up":"أعلى","g.down":"أسفل","g.moves":"المحاولات","g.pairs":"الأزواج","g.reveal":"اكشف حرفاً (−2 نقطة)","g.attempts":"المحاولات المتبقية","g.hintw":"التلميح","g.wordis":"الكلمة:","g.order.is":"الترتيب الصحيح:","g.result.pass":"أحسنت! اجتزت الجولة","g.result.fail":"حاول مرة أخرى لتتحسن","g.xp":"+{n} نقطة خبرة","g.newbest":"رقم قياسي جديد","g.local":"تُحفظ نتائجك على جهازك فقط.","g.points":"نقطة","g.rules.mcq":"أجب عن أسئلة الاختيار من متعدد قبل انتهاء الوقت. الإجابات السريعة والمتتالية تمنحك نقاطاً أكثر، ولك حذف إجابتين مرة واحدة في الجولة.","g.rules.truefalse":"احكم على كل عبارة بصح أو خطأ بسرعة. كل إجابة صحيحة متتالية ترفع مضاعف السلسلة.","g.rules.order":"رتّب الأحداث من الأقدم إلى الأحدث بالسحب والإفلات أو بأزرار الأعلى والأسفل، ثم اضغط تحقق. تُحتسب نقطة لكل حدث في مكانه الصحيح.","g.rules.memory":"اقلب بطاقتين لتجد الأزواج المتطابقة بأقل عدد من المحاولات. كلما زاد المستوى زادت البطاقات.","g.rules.word":"خمّن الكلمة المخفية من التلميح. لك ثلاث محاولات، ويمكنك كشف حرف مقابل نقطتين.","g.timer.on":"مؤقت","g.items":"{n} أسئلة","daily.title":"تحدي اليوم","daily.sub":"خمسة أسئلة هي نفسها لجميع اللاعبين اليوم. تُحتسب خبرة التحدي مرة واحدة يومياً.","daily.play":"العب التحدي","daily.done":"أنجزت تحدي اليوم: {s} نقطة","daily.again":"أعد المحاولة (بلا خبرة إضافية)","profile.title":"تقدمك","profile.level":"المستوى {n}","profile.xp":"{a} / {b} خبرة","profile.ach":"الإنجازات","profile.hist":"آخر الجولات","profile.none":"لا توجد جولات بعد. ابدأ لعبة وسيظهر تقدمك هنا.","profile.days":"أيام اللعب: {n}","profile.reset":"مسح بياناتي من هذا الجهاز","profile.confirm":"سيُمسح كل تقدمك على هذا الجهاز. متأكد؟","ach.first":"أول جولة","ach.first.d":"أكمل أي جولة","ach.perfect":"جولة كاملة","ach.perfect.d":"أجب عن كل الأسئلة بشكل صحيح","ach.streak5":"سلسلة 5","ach.streak5.d":"5 إجابات صحيحة متتالية","ach.streak10":"سلسلة 10","ach.streak10.d":"10 إجابات صحيحة متتالية","ach.all":"الألعاب الخمس","ach.all.d":"العب كل الألعاب الخمس","ach.daily3":"ثلاثة أيام","ach.daily3.d":"أنجز تحدي اليوم في 3 أيام مختلفة","ach.lvl5":"المستوى 5","ach.lvl5.d":"ابلغ المستوى 5","ach.hard":"تحدٍّ صعب","ach.hard.d":"اجتز جولة بمستوى صعب بنسبة 70% فأكثر","challenge.title":"تحدي صديق","challenge.invite":"صديقك يتحداك في تحدي {date} بنتيجة {s} نقطة. العب الأسئلة نفسها وقارن نتيجتك.","challenge.share":"تحدَّ صديقاً","challenge.share.text":"تحداك في بصيرة! نتيجتي {score} نقطة. العب نفس التحدي: {url}","challenge.copied":"تم نسخ رابط التحدي","challenge.copy.prompt":"انسخ رابط التحدي وشاركه","challenge.opponent":"نتيجة صديقك: {s}","challenge.won":"تفوقت على صديقك!","challenge.lost":"صديقك حقق نتيجة أعلى","challenge.tie":"تعادلتما","admin.link":"إدارة الموقع","page.about":"من نحن","page.verify":"كيف نتحقق","page.editorial":"سياسة التحرير","page.contact":"اتصل بنا","page.privacy":"الخصوصية","page.terms":"الشروط","skip":"تجاوز إلى المحتوى","card.play":"العب الآن","pstrip.lv":"المستوى {n}","pstrip.xp":"{a} / {b} خبرة","pstrip.new":"ابدأ أول جولة واكسب الخبرة","streak.n":"سلسلة {n}","cheer.1":"ممتاز","cheer.2":"رائع","cheer.3":"أسطوري","theme.mode":"المظهر: {m}","theme.m.dark":"داكن","theme.m.light":"فاتح","theme.m.auto":"تلقائي","lvl.up":"مستوى جديد: المستوى {n}","sound.on":"الصوت: مفعّل","sound.off":"الصوت: مغلق","cta.title":"خلّصت القراءة؟ اختبر نفسك","cta.sub":"خمس ألعاب بأسئلة مراجَعة وتحدي يومي، وتقدمك يُحفظ على جهازك","cta.btn":"العب الآن","empty.title":"لا يوجد شيء هنا","empty.sub":"الصفحة غير موجودة أو لا توجد نتائج مطابقة. جرّب البحث أو ابدأ لعبة.","empty.home":"الرئيسية","empty.play":"العب الآن"},"en":{"brand":"BASIRA | بصيرة","nav.games":"Games","nav.topics":"Knowledge","nav.articles":"Articles","nav.verify":"How we verify","search.ph":"Search articles","search.btn":"Search","search.label":"Search the site","lang.switch":"العربية","theme.dark":"Dark mode","theme.light":"Light mode","hero.eyebrow":"Think. Discover. Play.","hero.title":"Learn something, then challenge yourself","hero.lede":"Sourced knowledge and brain games in Arabic and English. Play right away with no sign-up; your results stay on your device.","hero.cta":"Start playing","hero.cta2":"Browse knowledge","games.title":"Games","topics.title":"Knowledge sections","latest.title":"Latest articles","verify.title":"How we verify","verify.text":"Every figure and date in our articles has a cited source, and game questions are reviewed before they appear, never generated while you play.","verify.link":"Read our method","foot.note":"Sourced knowledge and brain games, no sign-up needed.","foot.topics":"Knowledge sections","foot.about":"About","foot.pending":"Info pages are being prepared","lang.note":"English questions and articles are still under review, so questions are shown in Arabic for now.","noscript":"Games and the daily challenge need JavaScript enabled in your browser.","t.العلوم":"Science","t.التاريخ والحضارات":"History & Civilizations","t.الجغرافيا والدول":"Geography & Countries","t.التكنولوجيا":"Technology","t.الثقافة العامة":"General Knowledge","t.الرياضيات والمنطق":"Math & Logic","t.اللغة والأدب":"Language & Literature","t.الفضاء والفلك":"Space & Astronomy","g.mcq.name":"Multiple choice","g.mcq.desc":"Four answers, with an explanation after each","g.truefalse.name":"True or false","g.truefalse.desc":"Quick statements that test your accuracy","g.order.name":"Timeline order","g.order.desc":"Put events in the right order","g.memory.name":"Memory","g.memory.desc":"Find the pairs in as few tries as possible","g.word.name":"Guess the word","g.word.desc":"A hidden word and hints that help","g.start":"Start","g.next":"Next","g.finish":"Results","g.again":"New round","g.back":"Back","g.best":"Best","g.score":"Points","g.streak":"Streak","g.time":"Time","g.level":"Level","g.easy":"Easy","g.medium":"Medium","g.hard":"Hard","g.prog":"Progressive","g.pick":"Choose a level","g.qof":"Question {n} of {m}","g.hint":"Remove two answers (−3 pts)","g.correct":"Correct.","g.wrong":"Incorrect.","g.timeout":"Time's up.","g.check":"Check","g.up":"Up","g.down":"Down","g.moves":"Moves","g.pairs":"Pairs","g.reveal":"Reveal a letter (−2 pts)","g.attempts":"Attempts left","g.hintw":"Hint","g.wordis":"The word:","g.order.is":"Correct order:","g.result.pass":"Well done! You passed the round","g.result.fail":"Try again to improve","g.xp":"+{n} XP","g.newbest":"New personal best","g.local":"Your results are saved on this device only.","g.points":"pts","g.rules.mcq":"Answer multiple-choice questions before time runs out. Fast, consecutive answers earn more points, and you can remove two answers once per round.","g.rules.truefalse":"Judge each statement true or false, quickly. Each consecutive correct answer raises your streak multiplier.","g.rules.order":"Put the events in order from earliest to latest by drag and drop or the up and down buttons, then press Check. You get a point for each event in its right place.","g.rules.memory":"Flip two cards to find matching pairs in as few moves as possible. Higher levels have more cards.","g.rules.word":"Guess the hidden word from its hint. You have three attempts, and you can reveal a letter for two points.","g.timer.on":"Timed","g.items":"{n} questions","daily.title":"Daily challenge","daily.sub":"Five questions, the same for every player today. Challenge XP counts once per day.","daily.play":"Play the challenge","daily.done":"Daily challenge done: {s} points","daily.again":"Retry (no extra XP)","profile.title":"Your progress","profile.level":"Level {n}","profile.xp":"{a} / {b} XP","profile.ach":"Achievements","profile.hist":"Recent rounds","profile.none":"No rounds yet. Start a game and your progress will show here.","profile.days":"Days played: {n}","profile.reset":"Clear my data on this device","profile.confirm":"This will erase all your progress on this device. Sure?","ach.first":"First round","ach.first.d":"Complete any round","ach.perfect":"Perfect round","ach.perfect.d":"Answer every question correctly","ach.streak5":"Streak 5","ach.streak5.d":"5 correct answers in a row","ach.streak10":"Streak 10","ach.streak10.d":"10 correct answers in a row","ach.all":"All five games","ach.all.d":"Play all five games","ach.daily3":"Three days","ach.daily3.d":"Finish the daily challenge on 3 different days","ach.lvl5":"Level 5","ach.lvl5.d":"Reach level 5","ach.hard":"Hard challenge","ach.hard.d":"Pass a hard round with 70% or more","challenge.title":"Friend challenge","challenge.invite":"Your friend challenges you on {date} with {s} points. Play the same questions and compare your result.","challenge.share":"Challenge a friend","challenge.share.text":"I challenge you on BASIRA! My score: {score} points. Play the same challenge: {url}","challenge.copied":"Challenge link copied","challenge.copy.prompt":"Copy and share this challenge link","challenge.opponent":"Your friend's score: {s}","challenge.won":"You beat your friend!","challenge.lost":"Your friend scored higher","challenge.tie":"It's a tie","admin.link":"Site administration","page.about":"About","page.verify":"How we verify","page.editorial":"Editorial policy","page.contact":"Contact","page.privacy":"Privacy","page.terms":"Terms","skip":"Skip to content","card.play":"Play now","pstrip.lv":"Level {n}","pstrip.xp":"{a} / {b} XP","pstrip.new":"Play a round to earn XP","streak.n":"Streak {n}","cheer.1":"Nice","cheer.2":"Great","cheer.3":"Legendary","theme.mode":"Theme: {m}","theme.m.dark":"Dark","theme.m.light":"Light","theme.m.auto":"Auto","lvl.up":"Level up: Level {n}","sound.on":"Sound: On","sound.off":"Sound: Off","cta.title":"Done reading? Test yourself","cta.sub":"Five games with reviewed questions and a daily challenge; your progress stays on your device","cta.btn":"Play now","empty.title":"Nothing here","empty.sub":"The page does not exist or no results match. Try searching or start a game.","empty.home":"Home","empty.play":"Play now"}};
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
var META=[["mcq","اختبارات متعددة الخيارات","أربع إجابات وتفسير بعد كل سؤال","متوسط"],["truefalse","صح أم خطأ","جمل سريعة تختبر دقة معلوماتك","سهل"],["order","ترتيب الأحداث","رتّب وقائع بالتسلسل الصحيح","صعب"],["memory","لعبة الذاكرة","اكتشف الأزواج بأقل عدد من المحاولات","سهل"],["word","خمّن الكلمة","كلمة مخفية وتلميح يساعدك","متوسط"]];
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
function shuffle(a,rnd){a=a.slice();rnd=rnd||Math.random;for(var i=a.length-1;i>0;i--){var j=Math.floor(rnd()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
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
  function set(v){on=!!v;try{localStorage.setItem(KEY,on?'on':'off');}catch(e){}}
  return {play:play,set:set,isOn:function(){return on;}};
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
var ACHI={first:'xp',perfect:'gem',streak5:'flame',streak10:'flame',all:'trophy',daily3:'target',lvl5:'level',hard:'trophy'};
var ACH=['first','perfect','streak5','streak10','all','daily3','lvl5','hard'];
function unlock(s,r){
  s.ach=s.ach||{};var got=[];
  function g(id,c){if(c&&!s.ach[id]){s.ach[id]=Date.now();got.push(id);}}
  g('first',true);g('perfect',r.pct===100&&r.total>0);g('streak5',r.bestStreak>=5);g('streak10',r.bestStreak>=10);
  g('all',Object.keys(s.stats||{}).length>=5);g('daily3',Object.keys(s.daily||{}).length>=3);
  g('lvl5',levelInfo(s.xp||0).level>=5);g('hard',r.level==='hard'&&r.pct>=70);
  return got;
}
function record(r){ // يحفظ نتيجة جولة ويُرجع ملخصاً
  var s=load();s.stats=s.stats||{};s.hist=s.hist||[];s.xp=s.xp||0;
  var st=s.stats[r.slug]||{plays:0,best:0,bestPts:0},isBest=r.pct>st.best&&st.plays>0;
  st.plays++;st.best=Math.max(st.best,r.pct);st.bestPts=Math.max(st.bestPts,r.pts);s.stats[r.slug]=st;
  var xp=0;
  if(r.daily){s.daily=s.daily||{};if(!s.daily[r.daily]){s.daily[r.daily]={pts:r.pts,pct:r.pct};xp=Math.round(r.pts/2)+10;}}
  else xp=Math.round(r.pts/2)+(r.pct>=PASS*100?10:0);
  s.xp+=xp;
  s.hist.unshift({t:Date.now(),slug:r.slug,level:r.level,pts:r.pts,pct:r.pct,daily:r.daily||null});s.hist=s.hist.slice(0,10);
  var got=unlock(s,r);save(s);
  try{document.dispatchEvent(new CustomEvent('basira:progress'));}catch(e){}
  return {xp:xp,isBest:isBest,ach:got,best:st.best};
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
  var level='medium',timer=null,onDone=null,daily=null,opponentScore=null;
  function stopTimer(){if(timer){clearInterval(timer);timer=null;}}
  function intro(){
    stopTimer();box.textContent='';
    var h=el('h3');tl(h,'g.'+slug+'.name');box.appendChild(h);
    box.appendChild(tl(el('p','g-sub'),'g.rules.'+slug));
    var st=(load().stats||{})[slug];
    if(st){var p=el('p','note');p.textContent=T('g.best')+': '+st.best+'%';box.appendChild(p);}
    box.appendChild(tl(el('p','g-lab'),'g.pick'));
    var row=el('div','g-lv');
    var opts=slug==='memory'?['easy','medium','hard']:slug==='order'?['easy','medium','hard']:['prog','easy','medium','hard'];
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
    out.ach.forEach(function(id){var p=el('p','g-ach');p.textContent='★ '+T('ach.'+id);e.appendChild(p);});
    var bp=el('p','note');bp.textContent=T('g.best')+': '+out.best+'%';e.appendChild(bp);
    e.appendChild(tl(el('p','note'),'g.local'));
    if(opponentScore!==null){var cmp=el('p','g-ach');cmp.textContent=T('challenge.opponent',{s:opponentScore})+' · '+(r.pts>opponentScore?T('challenge.won'):r.pts<opponentScore?T('challenge.lost'):T('challenge.tie'));e.appendChild(cmp);}
    var a=el('div','g-act');a.style.justifyContent='center';
    var again=btn('','btn',function(){if(onDone&&daily){onDone();}else start(level);});tl(again,daily?'daily.again':'g.again');a.appendChild(again);
    if(daily){var share=btn('','btn alt',function(){
      var u=new URL(location.href);u.search='';u.searchParams.set('challenge',daily);u.searchParams.set('score',String(r.pts));u.searchParams.set('pct',String(r.pct));
      var msg=T('challenge.share.text',{url:u.toString(),score:r.pts});
      if(navigator.share){navigator.share({title:T('challenge.title'),text:msg,url:u.toString()}).catch(function(){});}
      else if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(u.toString()).then(function(){share.textContent=T('challenge.copied');}).catch(function(){prompt(T('challenge.copy.prompt'),u.toString());});}
      else prompt(T('challenge.copy.prompt'),u.toString());
    });tl(share,'challenge.share');a.appendChild(share);}
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
  function start(lev){
    level=lev;
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
    var bs=pk.querySelectorAll('button');
    [].forEach.call(bs,function(b){b.addEventListener('click',function(){
      [].forEach.call(bs,function(x){x.setAttribute('aria-pressed','false');});
      b.setAttribute('aria-pressed','true');host.removeAttribute('data-ready');mount(host,b.getAttribute('data-g'));if(b._user&&host.scrollIntoView)host.scrollIntoView({behavior:'smooth',block:'start'});});b.addEventListener('pointerdown',function(){b._user=1;});});
    bs[0].click();
  }
  pstrip();document.addEventListener('basira:progress',pstrip);document.addEventListener('basira:lang',pstrip);rise();
  var dh=document.getElementById('daily-panel');if(dh)dailyPanel(dh);
  var ph=document.getElementById('profile-panel');if(ph)profilePanel(ph);
  document.addEventListener('basira:lang',function(){
    [].forEach.call(document.querySelectorAll('[data-i]'),function(n){if(n.hasAttribute('data-v')){try{n.textContent=T(n.getAttribute('data-i'),JSON.parse(n.getAttribute('data-v')));}catch(e){}}});
  });
}
window.BSR=window.BSR||{};window.BSR.sfx=SFX;window.BSR.emptyState=emptyState;window.BSR.engine={points:points,levelInfo:levelInfo,mulberry:mulberry,hash:hash,today:today,norm:norm};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
