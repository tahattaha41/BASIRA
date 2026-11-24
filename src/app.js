(function(){
'use strict';
var BANK={{BANK_JSON}};
var META={{GAMES_META}};
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
          var pos=[].indexOf.call(ul.children,li);try{li.setPointerCapture(e.pointerId);}catch(x){}
          li.classList.add('drag');
          function mv(ev){
            var kids=[].slice.call(ul.children),j=pos;
            for(var q=0;q<kids.length;q++){var r=kids[q].getBoundingClientRect();if(ev.clientY>=r.top&&ev.clientY<=r.bottom){j=q;break;}}
            if(j!==pos){var it=cur.splice(pos,1)[0];cur.splice(j,0,it);if(j>pos)ul.insertBefore(li,kids[j].nextSibling);else ul.insertBefore(li,kids[j]);pos=j;
              [].forEach.call(ul.children,function(c,i){c.querySelector('.g-n').textContent=String(i+1);});}
          }
          function up(){li.removeEventListener('pointermove',mv);li.removeEventListener('pointerup',up);li.removeEventListener('pointercancel',up);render();}
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
