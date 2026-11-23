(function(){
'use strict';
var BANK={{BANK_JSON}};
var META={{GAMES_META}};
var KEY='basira.v2',PASS=0.7;
var ROUND={mcq:10,truefalse:10,order:5,word:5};
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{};}catch(e){return {};}}
function save(s){try{localStorage.setItem(KEY,JSON.stringify(s));}catch(e){}}
function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;}
function btn(text,cls,fn){var b=el('button',cls,text);b.type='button';b.addEventListener('click',fn);return b;}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function pick(slug,pool,n){
  var s=load(),seen=(s.seen&&s.seen[slug])||[];
  var fresh=pool.filter(function(x){return seen.indexOf(x.id)<0;});
  if(fresh.length<n){fresh=pool;seen=[];}
  var chosen=shuffle(fresh).slice(0,n);
  s.seen=s.seen||{};s.seen[slug]=seen.concat(chosen.map(function(x){return x.id;}));save(s);
  return chosen;
}
function norm(t){return String(t).replace(/[ً-ْـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/\s+/g,'').trim();}
function meta(slug){for(var i=0;i<META.length;i++)if(META[i][0]===slug)return META[i];return null;}

function mount(root,slug){
  var m=meta(slug);if(!m||root.getAttribute('data-ready')===slug)return;
  root.setAttribute('data-ready',slug);root.textContent='';
  var best=((load().stats||{})[slug]||{}).best;
  var box=el('div');root.appendChild(box);
  function intro(){
    box.textContent='';
    box.appendChild(el('h3','',m[1]));
    box.appendChild(el('p','g-sub',m[2]+' · المستوى: '+m[3]));
    if(best!=null)box.appendChild(el('p','note','أفضل نتيجة لك على هذا الجهاز: '+best+'%'));
    var a=el('div','g-act');a.appendChild(btn('ابدأ','btn',start));box.appendChild(a);
  }
  function finish(score,total){
    var pct=Math.round(score/total*100),s=load();
    s.stats=s.stats||{};var st=s.stats[slug]||{plays:0,best:0};
    st.plays++;st.best=Math.max(st.best,pct);s.stats[slug]=st;save(s);best=st.best;
    box.textContent='';
    var e=el('div','g-end');
    e.appendChild(el('p','g-score',score+' / '+total));
    e.appendChild(el('p','',pct>=PASS*100?'أحسنت! اجتزت الجولة ('+pct+'%)':'نتيجتك '+pct+'%. حاول مرة أخرى'));
    e.appendChild(el('p','note','أفضل نتيجة: '+st.best+'%. تُحفظ نتائجك على جهازك فقط.'));
    var a=el('div','g-act');a.style.justifyContent='center';
    a.appendChild(btn('جولة جديدة','btn',start));e.appendChild(a);box.appendChild(e);
  }
  // مشغّل أسئلة متتابعة: كل عنصر دالة draw(body, answer(ok, explanation))
  function run(items){
    var i=0,score=0;
    function next(){
      if(i>=items.length)return finish(score,items.length);
      box.textContent='';
      var bar=el('div','g-bar');bar.appendChild(el('span','','السؤال '+(i+1)+' من '+items.length));bar.appendChild(el('span','','النقاط: '+score));
      var pr=el('div','g-prog'),pi=el('i');pi.style.width=(i/items.length*100)+'%';pr.appendChild(pi);
      var body=el('div'),fb=el('div','g-fb');fb.hidden=true;fb.setAttribute('aria-live','polite');
      var act=el('div','g-act');
      box.appendChild(bar);box.appendChild(pr);box.appendChild(body);box.appendChild(fb);box.appendChild(act);
      var done=false;
      items[i](body,function(ok,why){
        if(done)return;done=true;if(ok)score++;
        fb.hidden=false;fb.textContent='';
        fb.appendChild(el('strong',ok?'ok':'bad',ok?'إجابة صحيحة. ':'إجابة غير صحيحة. '));
        if(why)fb.appendChild(document.createTextNode(why));
        act.appendChild(btn(i+1<items.length?'التالي':'النتيجة','btn',function(){i++;next();}));
        act.firstChild.focus();
      });
    }
    next();
  }
  function mcq(q){return function(body,answer){
    body.appendChild(el('p','g-q',q.q));
    var opts=q.o.map(function(t,k){return {t:t,ok:k===q.a};}),list=el('div','g-opts');
    shuffle(opts).forEach(function(o){
      var b=btn(o.t,'g-opt',function(){
        [].forEach.call(list.children,function(c,idx){c.disabled=true;});
        b.classList.add(o.ok?'ok':'bad');
        [].forEach.call(list.children,function(c){if(c.getAttribute('data-ok')==='1')c.classList.add('ok');});
        answer(o.ok,q.x);
      });
      b.setAttribute('data-ok',o.ok?'1':'0');list.appendChild(b);
    });
    body.appendChild(list);
  };}
  function tf(q){return function(body,answer){
    body.appendChild(el('p','g-q',q.s));
    var list=el('div','g-opts');
    [['صح',true],['خطأ',false]].forEach(function(p){
      var b=btn(p[0],'g-opt',function(){
        [].forEach.call(list.children,function(c){c.disabled=true;});
        var ok=p[1]===q.v;b.classList.add(ok?'ok':'bad');answer(ok,q.x);
      });list.appendChild(b);
    });
    body.appendChild(list);
  };}
  function order(q){return function(body,answer){
    body.appendChild(el('p','g-q',q.q));
    var correct=q.items,mix=shuffle(correct),tries=0;
    while(mix.join('|')===correct.join('|')&&tries++<10)mix=shuffle(correct);
    var slots=el('ol','g-ord'),pool=el('div','g-opts'),chosen=[];
    correct.forEach(function(){slots.appendChild(el('li'));});
    mix.forEach(function(t){
      var b=btn(t,'g-opt',function(){
        b.disabled=true;chosen.push(t);
        var li=slots.children[chosen.length-1];li.textContent=(chosen.length)+'. '+t;li.className='fill';
        if(chosen.length===correct.length){
          var ok=chosen.join('|')===correct.join('|');
          [].forEach.call(slots.children,function(c,k){c.classList.add(chosen[k]===correct[k]?'ok':'bad');c.style.borderColor=chosen[k]===correct[k]?'var(--ok)':'var(--bad)';});
          answer(ok,'الترتيب الصحيح: '+correct.join(' ← ')+'. '+q.x);
        }
      });pool.appendChild(b);
    });
    body.appendChild(slots);body.appendChild(el('p','note','اضغط على الأحداث بالترتيب من الأقدم إلى الأحدث'));body.appendChild(pool);
  };}
  function word(q){return function(body,answer){
    var w=q.w,left=3;
    body.appendChild(el('p','g-q','خمّن الكلمة. التلميح: '+q.h));
    var shown=el('div','g-word');function mask(n){var chars=w.split('');return chars.map(function(c,k){return k<n?c:'_';}).join(' ');}
    var rev=0;shown.textContent=mask(0);
    var inp=el('input','g-in');inp.type='text';inp.setAttribute('aria-label','إجابتك');inp.autocomplete='off';
    var info=el('p','note','المحاولات المتبقية: '+left);
    var go=btn('تحقق','btn',function(){
      var ok=norm(inp.value)===norm(w);
      if(ok){inp.disabled=true;go.disabled=true;shown.textContent=w.split('').join(' ');return answer(true,'الكلمة: '+w+'.');}
      left--;rev++;shown.textContent=mask(rev);info.textContent='المحاولات المتبقية: '+left;inp.value='';
      if(left<=0){inp.disabled=true;go.disabled=true;shown.textContent=w.split('').join(' ');answer(false,'الكلمة: '+w+'.');}else inp.focus();
    });
    inp.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();go.click();}});
    body.appendChild(shown);body.appendChild(inp);body.appendChild(document.createTextNode(' '));body.appendChild(go);body.appendChild(info);
  };}
  function memory(){
    var set=pick('memory',BANK.mem,1)[0],cards=[];
    set.pairs.forEach(function(p,k){cards.push({k:k,t:p[0]});cards.push({k:k,t:p[1]});});
    cards=shuffle(cards);
    box.textContent='';
    box.appendChild(el('h3','',m[1]+': '+set.title));
    box.appendChild(el('p','g-sub','طابق '+set.kind));
    var bar=el('p','note','المحاولات: 0'),grid=el('div','g-mem'),open=[],moves=0,found=0,lock=false;
    cards.forEach(function(c){
      var b=btn('؟','g-card',function(){
        if(lock||b.disabled||open.indexOf(b)>=0)return;
        b.textContent=c.t;b.classList.add('up');open.push(b);
        if(open.length<2)return;
        moves++;bar.textContent='المحاولات: '+moves;
        var x=open[0],y=open[1];
        if(x._c.k===y._c.k){x.disabled=y.disabled=true;x.classList.add('done');y.classList.add('done');open=[];found++;
          if(found===set.pairs.length){var sc=Math.max(0,Math.min(100,Math.round(set.pairs.length/moves*100)));setTimeout(function(){finish(sc,100);},300);}
        }else{lock=true;setTimeout(function(){[x,y].forEach(function(z){z.textContent='؟';z.classList.remove('up');});open=[];lock=false;},700);}
      });
      b._c=c;grid.appendChild(b);
    });
    box.appendChild(bar);box.appendChild(grid);
  }
  function start(){
    if(slug==='mcq')run(pick(slug,BANK.mcq,ROUND.mcq).map(mcq));
    else if(slug==='truefalse')run(pick(slug,BANK.tf,ROUND.truefalse).map(tf));
    else if(slug==='order')run(pick(slug,BANK.order,ROUND.order).map(order));
    else if(slug==='word')run(pick(slug,BANK.word,ROUND.word).map(word));
    else if(slug==='memory')memory();
  }
  intro();
}

function init(){
  var d=document.documentElement,tb=document.querySelectorAll('.js-theme');
  function label(){var k=d.getAttribute('data-theme')==='dark'?'theme.light':'theme.dark';[].forEach.call(tb,function(b){b.textContent=window.BSR?window.BSR.t(k):k;});}
  label();document.addEventListener('basira:lang',label);
  [].forEach.call(tb,function(b){b.addEventListener('click',function(){
    var dark=d.getAttribute('data-theme')!=='dark';
    if(dark)d.setAttribute('data-theme','dark');else d.removeAttribute('data-theme');
    try{localStorage.setItem('site-theme',dark?'dark':'light');}catch(e){}label();});});
  [].forEach.call(document.querySelectorAll('.bsr-game[data-game]'),function(r){mount(r,r.getAttribute('data-game'));});
  var pk=document.getElementById('picker'),host=document.getElementById('play-host');
  if(pk&&host){
    var bs=pk.querySelectorAll('button');
    [].forEach.call(bs,function(b){b.addEventListener('click',function(){
      [].forEach.call(bs,function(x){x.setAttribute('aria-pressed','false');});
      b.setAttribute('aria-pressed','true');host.removeAttribute('data-ready');host.setAttribute('data-game',b.getAttribute('data-g'));mount(host,b.getAttribute('data-g'));});});
    bs[0].click();
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
