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

  /* ===== ألعاب الشخصيات: شخصيات أصلية من تصميمنا مرسومة بـSVG، الأسئلة من البنك المراجَع ولا ذكاء اصطناعي أثناء اللعب ===== */
  var CHR={
    owl:"<svg viewBox='0 0 80 90' aria-hidden='true'><g class='c-wl'><ellipse cx='12' cy='56' rx='9' ry='20' fill='#7A4B2A'/></g><g class='c-wr'><ellipse cx='68' cy='56' rx='9' ry='20' fill='#7A4B2A'/></g><ellipse cx='40' cy='54' rx='28' ry='32' fill='#A0663A'/><ellipse cx='40' cy='64' rx='17' ry='20' fill='#F4DDB8'/><path d='M16 28L10 8L28 20ZM64 28L70 8L52 20Z' fill='#7A4B2A'/><circle cx='28' cy='38' r='13' fill='#fff'/><circle cx='52' cy='38' r='13' fill='#fff'/><circle class='c-eye' cx='29' cy='39' r='6' fill='#141414'/><circle class='c-eye' cx='51' cy='39' r='6' fill='#141414'/><path d='M36 48L44 48L40 57Z' fill='#F5A524'/><path d='M30 84L30 90M50 84L50 90' stroke='#F5A524' stroke-width='5' stroke-linecap='round'/></svg>"
  };
  var REDUCE=function(){return matchMedia('(prefers-reduced-motion: reduce)').matches;};
  var OWL_IMG=null;
  function owlImg(){if(!OWL_IMG){OWL_IMG=new Image();OWL_IMG.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(CHR.owl.replace("<svg ","<svg xmlns='http://www.w3.org/2000/svg' width='80' height='90' "));}return OWL_IMG;}
  function lanternGame(lev){
    var cfg={easy:{bats:1,sp:46,drift:.55,decay:1.0,hit:12},medium:{bats:2,sp:62,drift:.8,decay:1.4,hit:15},hard:{bats:3,sp:80,drift:1.05,decay:1.9,hit:18}}[lev]||{bats:2,sp:62,drift:.8,decay:1.4,hit:15},N=10;
    function short(q){return q.o.every(function(o){return o.length<=18;});}
    var src=pool('mcq',lev).filter(short);if(src.length<N)src=BANK.mcq.filter(short);
    var qs=pick('mcq',src,N);box.textContent='';
    var bar=el('div','g-bar'),c1=el('span'),c2=el('span','g-stat');bar.appendChild(c1);bar.appendChild(c2);box.appendChild(bar);
    var meter=el('div','ltn-meter');meter.setAttribute('role','img');var mi=el('i');meter.appendChild(mi);box.appendChild(meter);
    var qEl=el('p','g-q');box.appendChild(qEl);var note=el('p','g-sub ltn-note');note.setAttribute('aria-live','polite');box.appendChild(note);
    var W=Math.max(280,Math.min(box.clientWidth||340,440)),H=Math.round(W*1.2),cv=el('canvas','ltn');cv.width=W;cv.height=H;cv.style.width=W+'px';cv.style.height=H+'px';cv.tabIndex=0;cv.setAttribute('aria-label',T('ltn.aria'));box.appendChild(cv);
    box.appendChild(el('p','g-sub',T('ltn.hint')));
    var g=cv.getContext('2d'),img=owlImg(),rnd=RND;
    var owl={x:W/2,y:H*0.72,vx:0,vy:0},tgt={x:W/2,y:H*0.72},energy=100,qi=-1,correct=0,streak=0,best=0,over=false,flash=0,shake=0,hurt=0,bornT=0,freeze=0,last=0,raf=0,t=0;
    var ff=[],bats=[],parts=[],keys={};
    function R(){return 56+energy*1.15;}
    function newQ(){qi++;if(qi>=N){end();return;}var q=qs[qi];qEl.textContent=q.q;c1.textContent=T('ltn.q',{n:qi+1,m:N});c2.textContent=streak>1?T('ltn.streak',{n:streak}):'';note.textContent='';
      var os=q.o.map(function(t,k){return {t:t,ok:k===q.a};});os=shuffle(os);ff=[];var tries=0;
      os.forEach(function(o,k){var x,y,ok2;do{x=40+rnd()*(W-80);y=60+rnd()*(H*0.55);ok2=Math.hypot(x-owl.x,y-owl.y)>R()*0.9&&ff.every(function(f){return Math.hypot(f.bx-x,f.by-y)>90;});tries++;}while(!ok2&&tries<200);
        g.font='700 13px system-ui,sans-serif';var words=o.t.split(' '),lines=[''],wd=0;words.forEach(function(w){var cur=lines[lines.length-1];if(cur&&g.measureText(cur+' '+w).width>108)lines.push(w);else lines[lines.length-1]=cur?cur+' '+w:w;});
        lines.forEach(function(l){wd=Math.max(wd,g.measureText(l).width);});
        ff.push({t:o.t,ok:o.ok,bx:x,by:y,x:x,y:y,ph:rnd()*6.28,lines:lines,w:wd+20,h:lines.length*16+10,state:0});});}
    function burst(x,y,col,n){for(var i=0;i<n;i++){var a=rnd()*6.283,s=40+rnd()*140;parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:.7+rnd()*.5,c:col});}}
    function spawnBat(){var side=rnd()<.5?-20:W+20;bats.push({x:side,y:20+rnd()*H*0.5,ph:rnd()*6,cd:0,flee:0});}
    for(var i=0;i<cfg.bats;i++)spawnBat();
    function setT(e){var r=cv.getBoundingClientRect();tgt.x=(e.clientX-r.left)*W/r.width;tgt.y=(e.clientY-r.top)*H/r.height;}
    cv.style.touchAction='none';cv.addEventListener('pointerdown',function(e){e.preventDefault();setT(e);try{cv.setPointerCapture(e.pointerId);}catch(x){}cv.focus();});cv.addEventListener('pointermove',function(e){if(e.buttons||e.pointerType==='mouse'||e.pointerType==='pen')setT(e);});
    function kd(e){if(!box.isConnected||over){document.removeEventListener('keydown',kd);document.removeEventListener('keyup',ku);return;}var k=e.key.toLowerCase();if(['arrowleft','arrowright','arrowup','arrowdown','a','d','w','s'].indexOf(k)>=0){keys[k]=1;e.preventDefault();}}
    function ku(e){delete keys[e.key.toLowerCase()];}document.addEventListener('keydown',kd);document.addEventListener('keyup',ku);
    function pickF(f){if(freeze>0||f.state)return;var q=qs[qi];freeze=1.6;
      qs[qi].done=1;
      if(f.ok){f.state=1;correct++;streak++;best=Math.max(best,streak);energy=Math.min(100,energy+14);flash=1;burst(f.x,f.y,'#FFD96B',26);SFX.play('ok');bats.forEach(function(b){b.flee=2.2;});note.textContent=T('ltn.right');}
      else{f.state=2;streak=0;energy-=cfg.hit;shake=.4;hurt=.5;burst(f.x,f.y,'#E5484D',16);SFX.play('bad');ff.forEach(function(x){if(x.ok)x.state=3;});note.textContent=T('ltn.wrong')+' '+q.x;}
      c2.textContent=streak>1?T('ltn.streak',{n:streak}):'';}
    function end(){if(over)return;over=true;cancelAnimationFrame(raf);document.removeEventListener('keydown',kd);document.removeEventListener('keyup',ku);var answered=qi>=N?N:Math.max(qi,0);
      var pts=correct*10+best*2;setTimeout(function(){finish({pts:pts,correct:correct,total:N,pct:Math.round(correct/N*100),bestStreak:best,level:lev});},450);}
    function upd(dt){t+=dt;
      var kx=(keys.arrowright||keys.d?1:0)-(keys.arrowleft||keys.a?1:0),ky=(keys.arrowdown||keys.s?1:0)-(keys.arrowup||keys.w?1:0);
      if(kx||ky){var rtl=document.documentElement.dir==='rtl';tgt.x=Math.max(14,Math.min(W-14,owl.x+kx*120));tgt.y=Math.max(14,Math.min(H-14,owl.y+ky*120));}
      var dx=tgt.x-owl.x,dy=tgt.y-owl.y,d=Math.hypot(dx,dy),sp=Math.min(d*5,300);if(d>1){owl.vx=dx/d*sp;owl.vy=dy/d*sp;}else{owl.vx=owl.vy=0;}
      owl.x+=owl.vx*dt;owl.y+=owl.vy*dt;owl.x=Math.max(14,Math.min(W-14,owl.x));owl.y=Math.max(14,Math.min(H-14,owl.y));
      energy-=cfg.decay*dt;if(freeze>0){freeze-=dt;if(freeze<=0&&!over){if(energy<=0){end();return;}newQ();}}
      ff.forEach(function(f){f.x=f.bx+Math.sin(t*cfg.drift+f.ph)*26;f.y=f.by+Math.cos(t*cfg.drift*1.3+f.ph)*18;
        if(!f.state&&freeze<=0&&Math.abs(owl.x-f.x)<f.w/2+10&&Math.abs(owl.y-f.y)<f.h/2+12)pickF(f);});
      bats.forEach(function(b){b.ph+=dt*11;b.cd-=dt;var dx2=owl.x-b.x,dy2=owl.y-b.y,dd=Math.hypot(dx2,dy2)||1,s=cfg.sp*(b.flee>0?-1.6:1);b.flee-=dt;
        b.x+=dx2/dd*s*dt+Math.sin(t*3+b.ph)*30*dt;b.y+=dy2/dd*s*dt+Math.cos(t*2+b.ph)*24*dt;b.x=Math.max(-40,Math.min(W+40,b.x));b.y=Math.max(-40,Math.min(H+40,b.y));
        if(dd<26&&b.cd<=0&&b.flee<=0){b.cd=1.4;b.flee=1.2;energy-=cfg.hit;shake=.35;hurt=.5;SFX.play('bad');burst(owl.x,owl.y,'#FF8A5B',12);}});
      parts.forEach(function(p){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=60*dt;p.l-=dt;});parts=parts.filter(function(p){return p.l>0;});
      flash=Math.max(0,flash-dt*1.4);shake=Math.max(0,shake-dt);hurt=Math.max(0,hurt-dt*1.6);
      if(energy<=0&&freeze<=0){energy=0;end();}
      mi.style.width=Math.max(0,energy)+'%';meter.setAttribute('aria-label',T('ltn.energy',{n:Math.round(Math.max(0,energy))}));meter.classList.toggle('low',energy<30);}
    function draw(){var sx=shake?(rnd()-.5)*10*shake:0,sy=shake?(rnd()-.5)*10*shake:0;g.save();g.translate(sx,sy);
      var bg=g.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#1B2440');bg.addColorStop(1,'#2B2036');g.fillStyle=bg;g.fillRect(-12,-12,W+24,H+24);
      g.fillStyle='#10162B';for(var i=0;i<7;i++){var x0=i*W/6;g.beginPath();g.moveTo(x0-22,-12);g.lineTo(x0+22,-12);g.lineTo(x0,30+((i*37)%46));g.fill();}
      g.fillStyle='#161B33';for(var j=0;j<6;j++){var x1=j*W/5+14;g.beginPath();g.moveTo(x1-26,H+12);g.lineTo(x1+26,H+12);g.lineTo(x1,H-26-((j*29)%30));g.fill();}
      ff.forEach(function(f){var a=f.state===3?1:1;g.save();g.translate(f.x,f.y);var pulse=1+Math.sin(t*5+f.ph)*.05;g.scale(pulse,pulse);
        g.fillStyle=f.state===1?'#2FB36D':f.state===2?'#B03A3A':f.state===3?'#2FB36D':'#FFE9A8';g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=2;
        var w=f.w,h=f.h,r=12;g.beginPath();g.moveTo(-w/2+r,-h/2);g.arcTo(w/2,-h/2,w/2,h/2,r);g.arcTo(w/2,h/2,-w/2,h/2,r);g.arcTo(-w/2,h/2,-w/2,-h/2,r);g.arcTo(-w/2,-h/2,w/2,-h/2,r);g.fill();g.stroke();
        g.fillStyle=(f.state===1||f.state===2||f.state===3)?'#fff':'#2A2110';g.font='700 13px system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';f.lines.forEach(function(l,k){g.fillText(l,0,(k-(f.lines.length-1)/2)*16);});g.restore();});
      bats.forEach(function(b){g.save();g.translate(b.x,b.y);var fl=Math.sin(b.ph)*.7;g.fillStyle='#0B0E1C';g.beginPath();g.ellipse(0,0,8,10,0,0,6.3);g.fill();
        [-1,1].forEach(function(s){g.beginPath();g.moveTo(s*6,-2);g.quadraticCurveTo(s*26,-16-fl*14,s*34,2+fl*8);g.quadraticCurveTo(s*22,0,s*16,10);g.quadraticCurveTo(s*10,4,s*6,8);g.fill();});g.restore();});
      parts.forEach(function(p){g.globalAlpha=Math.max(0,p.l);g.fillStyle=p.c;g.beginPath();g.arc(p.x,p.y,3,0,6.3);g.fill();});g.globalAlpha=1;
      var rr=R()*(1+Math.sin(t*9)*.015)+flash*140,lg=g.createRadialGradient(owl.x,owl.y,rr*.15,owl.x,owl.y,rr);lg.addColorStop(0,'rgba(6,9,20,0)');lg.addColorStop(.7,'rgba(6,9,20,.35)');lg.addColorStop(1,'rgba(6,9,20,.97)');
      g.fillStyle=lg;g.fillRect(-12,-12,W+24,H+24);
      ff.forEach(function(f){if(Math.hypot(f.x-owl.x,f.y-owl.y)>rr*.8){g.fillStyle='rgba(255,233,168,'+(.5+Math.sin(t*4+f.ph)*.3)+')';g.beginPath();g.arc(f.x,f.y,3,0,6.3);g.fill();}});
      bats.forEach(function(b){if(Math.hypot(b.x-owl.x,b.y-owl.y)>rr*.8){g.fillStyle='#FF4D4D';g.beginPath();g.arc(b.x-4,b.y-2,1.8,0,6.3);g.arc(b.x+4,b.y-2,1.8,0,6.3);g.fill();}});
      var wob=Math.sin(t*14)*(Math.hypot(owl.vx,owl.vy)>5?.06:.02);g.save();g.translate(owl.x,owl.y);g.rotate(owl.vx/900);g.scale(1+wob,1-wob);if(img.complete)g.drawImage(img,-22,-26,44,50);else{g.fillStyle='#A0663A';g.beginPath();g.arc(0,0,18,0,6.3);g.fill();}
      g.restore();g.fillStyle='rgba(255,200,90,.95)';g.beginPath();g.arc(owl.x+16,owl.y+8,5,0,6.3);g.fill();
      if(hurt>0){g.fillStyle='rgba(229,72,77,'+hurt*.45+')';g.fillRect(-12,-12,W+24,H+24);}
      g.restore();}
    function loop(ts){if(over||!box.isConnected){cancelAnimationFrame(raf);return;}var dt=Math.min(.05,(ts-last)/1000||.016);last=ts;upd(dt);if(!over)draw();raf=requestAnimationFrame(loop);}
    cv.__lantern=function(){return {owl:{x:owl.x,y:owl.y},tgt:tgt,energy:energy,qi:qi,correct:correct,over:over,W:W,H:H,ff:ff.map(function(f){return {x:f.x,y:f.y,ok:f.ok,t:f.t,state:f.state};}),bats:bats.length,R:R()};};
    newQ();raf=requestAnimationFrame(loop);
  }

  /* ===== ألعاب حقيقية بآليات مخترعة: لا أسئلة فيها، المهارة والتخطيط هما اللعبة ===== */
  function arcadeShell(cls,statusFns){box.textContent='';var bar=el('div','g-bar'),a=el('span'),b=el('span','g-stat');bar.appendChild(a);bar.appendChild(b);box.appendChild(bar);return {a:a,b:b};}
  function fitCanvas(ratio,max){var W=Math.max(280,Math.min(box.clientWidth||340,max||440)),H=Math.round(W*ratio),cv=el('canvas','ltn');cv.width=W;cv.height=H;cv.style.width=W+'px';cv.style.height=H+'px';cv.tabIndex=0;box.appendChild(cv);return {cv:cv,W:W,H:H,g:cv.getContext('2d')};}
  /* سرب الأضواء: قُد سرباً من اليراعات بفانوسك عبر ممر متعرّج مليء بالأشواك والخفافيش إلى الجرّة */
  function swarmGame(lev){
    var STAGES=5,N=14,need=Math.ceil(N*({easy:.4,medium:.5,hard:.6}[lev]||.5)),TL={easy:50,medium:42,hard:36}[lev]||42,hud=arcadeShell();
    var s=fitCanvas(1.35),cv=s.cv,W=s.W,H=s.H,g=s.g;cv.setAttribute('aria-label',T('sw.aria'));box.appendChild(el('p','g-sub',T('sw.hint')));
    var stage=0,saved=0,savedAll=0,cleared=0,fl=[],th=[],bats=[],parts=[],L={x:W/2,y:H-50},P={x:W/2,y:H-50},time=0,t=0,over=false,pause=0,last=0,raf=0,msg='',ph=0;
    function cx(y){return W/2+W*0.18*Math.sin(y/H*3.4+stage*1.3)*Math.min(1,(H-y)/120);}
    function setup(){fl=[];th=[];bats=[];parts=[];saved=0;time=TL;msg='';
      for(var i=0;i<N;i++)fl.push({x:W/2+(RND()-.5)*50,y:H-36+(RND()-.5)*20,vx:0,vy:0,ph:RND()*6});
      var n=4+stage*2+(lev==='hard'?2:0),tries=0;while(th.length<n&&tries<400){tries++;var y=90+RND()*(H-190),x=16+RND()*(W-32);if(Math.abs(x-cx(y))>(stage<2?88:74))th.push({x:x,y:y,r:11+RND()*6});}
      var nb=Math.max(0,stage-0)+(lev==='hard'?1:0);if(stage===0)nb=0;
      for(var k=0;k<nb;k++)bats.push({y:110+RND()*(H-260),x:RND()*W,dir:RND()<.5?-1:1,sp:(50+stage*12+RND()*30)});
      L.x=W/2;L.y=H-50;P.x=L.x;P.y=L.y;}
    function boom(x,y,c,n){for(var i=0;i<n;i++){var a=RND()*6.28,v=30+RND()*110;parts.push({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:.6+RND()*.5,c:c});}}
    function setP(e){var r=cv.getBoundingClientRect();P.x=(e.clientX-r.left)*W/r.width;P.y=(e.clientY-r.top)*H/r.height;}
    cv.style.touchAction='none';cv.addEventListener('pointerdown',function(e){e.preventDefault();setP(e);try{cv.setPointerCapture(e.pointerId);}catch(x){}});cv.addEventListener('pointermove',function(e){if(e.buttons||e.pointerType==='mouse')setP(e);});
    function finishStage(){var ok=saved>=need;if(ok){cleared++;savedAll+=saved;SFX.play('win');msg=T('sw.clear');pause=1.4;}else{msg=T('sw.fail',{n:saved,k:need});savedAll+=saved;pause=1.6;}
      setTimeout(function(){if(over)return;if(!ok||stage>=STAGES-1){end();}else{stage++;setup();}},pause*1000);pause=99;}
    function end(){if(over)return;over=true;cancelAnimationFrame(raf);var pts=savedAll*10+cleared*20;setTimeout(function(){finish({pts:pts,correct:cleared,total:STAGES,pct:Math.round(cleared/STAGES*100),bestStreak:savedAll,level:lev});},300);}
    function upd(dt){t+=dt;if(pause<99){time-=dt;
        var dx=P.x-L.x,dy=P.y-L.y,d=Math.hypot(dx,dy),m=Math.min(d,260*dt);if(d>1){L.x+=dx/d*m;L.y+=dy/d*m;}L.x=Math.max(8,Math.min(W-8,L.x));L.y=Math.max(8,Math.min(H-8,L.y));
        var alive=0;fl.forEach(function(f){if(f.dead||f.home)return;alive++;
          var ax=(L.x-f.x)*2.6,ay=(L.y-f.y)*2.6,dd=Math.hypot(L.x-f.x,L.y-f.y);if(dd<26){ax*=.25;ay*=.25;}
          fl.forEach(function(o){if(o===f||o.dead||o.home)return;var ddx=f.x-o.x,ddy=f.y-o.y,q=ddx*ddx+ddy*ddy;if(q<150&&q>0){var k=(150-q)/150*60;ax+=ddx/Math.sqrt(q)*k;ay+=ddy/Math.sqrt(q)*k;}});
          ax+=Math.sin(t*3+f.ph)*30;ay+=Math.cos(t*2.6+f.ph)*30;f.vx=(f.vx+ax*dt)*.93;f.vy=(f.vy+ay*dt)*.93;var sp=Math.hypot(f.vx,f.vy);if(sp>190){f.vx*=190/sp;f.vy*=190/sp;}
          f.x+=f.vx*dt;f.y+=f.vy*dt;f.x=Math.max(4,Math.min(W-4,f.x));f.y=Math.max(4,Math.min(H-4,f.y));
          for(var i=0;i<th.length;i++)if(Math.hypot(f.x-th[i].x,f.y-th[i].y)<th[i].r+3){f.dead=1;boom(f.x,f.y,'#E5484D',8);SFX.tone(220,.05);return;}
          for(var j=0;j<bats.length;j++)if(Math.hypot(f.x-bats[j].x,f.y-bats[j].y)<16){f.dead=1;boom(f.x,f.y,'#C77DFF',8);SFX.tone(200,.05);return;}
          if(f.y<72&&Math.abs(f.x-W/2)<80){f.home=1;saved++;boom(f.x,f.y,'#FFD96B',10);SFX.tone(660+saved*30,.06);}});
        bats.forEach(function(b){b.x+=b.dir*b.sp*dt;if(b.x<-20)b.dir=1;if(b.x>W+20)b.dir=-1;});
        parts.forEach(function(p){p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=dt;});parts=parts.filter(function(p){return p.l>0;});
        if(alive===0||time<=0)finishStage();}
      hud.a.textContent=T('sw.stage',{n:stage+1,m:STAGES});hud.b.textContent=T('sw.saved',{n:saved,k:need})+' · '+T('sw.time',{n:Math.max(0,Math.ceil(time))});}
    function draw(){var bg=g.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#1E2745');bg.addColorStop(1,'#120E22');g.fillStyle=bg;g.fillRect(0,0,W,H);
      g.strokeStyle='rgba(255,217,107,.08)';g.lineWidth=104;g.lineCap='round';g.beginPath();for(var y=H;y>=0;y-=8){var x=cx(y);y===H?g.moveTo(x,y):g.lineTo(x,y);}g.stroke();
      g.fillStyle='#2A1F3D';g.fillRect(W/2-72,0,144,6);g.fillStyle='rgba(255,217,107,.35)';g.beginPath();g.ellipse(W/2,0,80,72+Math.sin(t*3)*3,0,0,3.14);g.fill();g.fillStyle='#FFE08A';g.font='700 12px system-ui';g.textAlign='center';g.fillText(T('sw.home'),W/2,18);
      th.forEach(function(o){g.fillStyle='#7B1E2B';g.beginPath();for(var i=0;i<10;i++){var a=i/10*6.283,r=i%2?o.r*.55:o.r*1.25;g.lineTo(o.x+Math.cos(a)*r,o.y+Math.sin(a)*r);}g.closePath();g.fill();g.fillStyle='#E5484D';g.beginPath();g.arc(o.x,o.y,o.r*.45,0,6.3);g.fill();});
      bats.forEach(function(b){var f=Math.sin(t*14+b.x)*.7;g.fillStyle='#0B0716';g.beginPath();g.ellipse(b.x,b.y,7,8,0,0,6.3);g.fill();[-1,1].forEach(function(sg){g.beginPath();g.moveTo(b.x+sg*5,b.y-2);g.quadraticCurveTo(b.x+sg*22,b.y-14-f*12,b.x+sg*28,b.y+2+f*6);g.quadraticCurveTo(b.x+sg*18,b.y,b.x+sg*12,b.y+8);g.fill();});g.fillStyle='#C77DFF';g.fillRect(b.x-4,b.y-3,2,2);g.fillRect(b.x+2,b.y-3,2,2);});
      var gl=g.createRadialGradient(L.x,L.y,2,L.x,L.y,70);gl.addColorStop(0,'rgba(255,224,138,.5)');gl.addColorStop(1,'rgba(255,224,138,0)');g.fillStyle=gl;g.fillRect(L.x-70,L.y-70,140,140);
      g.globalCompositeOperation='lighter';fl.forEach(function(f){if(f.dead||f.home)return;var q=.55+.45*Math.sin(t*6+f.ph),gg=g.createRadialGradient(f.x,f.y,0,f.x,f.y,10);gg.addColorStop(0,'rgba(255,240,150,'+q+')');gg.addColorStop(1,'rgba(255,200,60,0)');g.fillStyle=gg;g.beginPath();g.arc(f.x,f.y,10,0,6.3);g.fill();});
      parts.forEach(function(p){g.globalAlpha=Math.max(0,p.l);g.fillStyle=p.c;g.beginPath();g.arc(p.x,p.y,2.6,0,6.3);g.fill();});g.globalAlpha=1;g.globalCompositeOperation='source-over';
      g.fillStyle='#FFB020';g.beginPath();g.arc(L.x,L.y,6,0,6.3);g.fill();g.strokeStyle='#fff';g.lineWidth=1.5;g.stroke();
      if(msg){g.fillStyle='rgba(8,10,22,.7)';g.fillRect(0,H/2-30,W,60);g.fillStyle='#fff';g.font='700 18px system-ui';g.textAlign='center';g.fillText(msg,W/2,H/2+6);}}
    function loop(ts){if(over||!box.isConnected){cancelAnimationFrame(raf);return;}var dt=Math.min(.05,(ts-last)/1000||.016);last=ts;upd(dt);draw();raf=requestAnimationFrame(loop);}
    cv.__cx=cx;cv.__swarm=function(){return {stage:stage,alive:fl.filter(function(f){return !f.dead&&!f.home;}).length,saved:saved,need:need,cleared:cleared,lantern:{x:L.x,y:L.y},W:W,H:H,over:over,bats:bats.length,thorns:th.length,th:th.map(function(o){return {x:o.x,y:o.y};})};};
    setup();raf=requestAnimationFrame(loop);}
  /* بومة الجاذبية: اقلب الجاذبية بين الأرض والسقف لتتفادى الأشواك وتجمع النجوم، والسرعة تزداد */
  function flipGame(lev){
    var base={easy:190,medium:230,hard:275}[lev]||230,hud=arcadeShell(),s=fitCanvas(.64),cv=s.cv,W=s.W,H=s.H,g=s.g;cv.setAttribute('aria-label',T('fl.aria'));box.appendChild(el('p','g-sub',T('fl.hint')));
    var FL=22,CE=22,OX=W*.26,SZ=26,owl={y:H-FL-SZ/2,vy:0,dir:1},obs=[],stars=[],x=0,v=base,dist=0,got=0,over=false,dead=0,last=0,raf=0,t=0,nextX=W*.9,img=owlImg(),trail=[],parts=[];
    function topY(){return CE+SZ/2;}function botY(){return H-FL-SZ/2;}
    function spawn(){var wd=26+RND()*(30+Math.min(40,dist/20)),side=RND()<.5?0:1,gap=v*.62+wd+70+RND()*130;nextX+=gap;obs.push({x:nextX,w:wd,side:side});
      if(RND()<.6){stars.push({x:nextX+wd+gap*.45,y:RND()<.5?topY()+14:botY()-14,got:0});}}
    function flip(){if(over)return;owl.dir=-owl.dir;owl.vy=owl.dir*60;SFX.tone(owl.dir>0?420:560,.04);}
    cv.addEventListener('pointerdown',function(e){e.preventDefault();flip();});
    function key(e){if(!box.isConnected||over){document.removeEventListener('keydown',key);return;}if(e.code==='Space'||e.key===' '||e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();flip();}}document.addEventListener('keydown',key);
    function end(){if(over)return;over=true;cancelAnimationFrame(raf);document.removeEventListener('keydown',key);var m=Math.floor(dist),pts=m+got*5;setTimeout(function(){finish({pts:pts,correct:Math.min(10,Math.floor(m/60)),total:10,pct:Math.min(100,Math.round(Math.min(10,m/60)*10)),bestStreak:got,level:lev});},700);}
    while(nextX<W*2)spawn();
    function upd(dt){t+=dt;if(dead){dead-=dt;if(dead<=0)end();return;}
      v=base+Math.min(160,dist*.9);x+=v*dt;dist+=v*dt/38;
      owl.vy+=owl.dir*1700*dt;owl.y+=owl.vy*dt;if(owl.y>botY()){owl.y=botY();owl.vy=0;}if(owl.y<topY()){owl.y=topY();owl.vy=0;}
      while(nextX<x+W*1.5)spawn();obs=obs.filter(function(o){return o.x+o.w>x-60;});stars=stars.filter(function(o){return o.x>x-60&&!o.got;});
      trail.push({y:owl.y,t:0});trail.forEach(function(q){q.t+=dt;});trail=trail.filter(function(q){return q.t<.3;});
      obs.forEach(function(o){var sx=o.x-x;if(sx<OX+SZ/2-6&&sx+o.w>OX-SZ/2+6){var hy=o.side?CE+34:H-FL-34;if(o.side&&owl.y-SZ/2+5<hy||!o.side&&owl.y+SZ/2-5>hy){dead=.6;SFX.play('bad');for(var i=0;i<20;i++){var a=RND()*6.28;parts.push({x:OX,y:owl.y,vx:Math.cos(a)*120,vy:Math.sin(a)*120,l:.6});}}}});
      stars.forEach(function(o){if(Math.abs(o.x-x-OX)<20&&Math.abs(o.y-owl.y)<26){o.got=1;got++;SFX.tone(880,.05);for(var i=0;i<8;i++){var a=RND()*6.28;parts.push({x:OX,y:o.y,vx:Math.cos(a)*80,vy:Math.sin(a)*80,l:.4,gold:1});}}});
      parts.forEach(function(p){p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=dt;});parts=parts.filter(function(p){return p.l>0;});
      hud.a.textContent=T('fl.dist',{n:Math.floor(dist)});hud.b.textContent=T('fl.stars',{n:got});}
    function draw(){var bg=g.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#1A2140');bg.addColorStop(1,'#2C1F3A');g.fillStyle=bg;g.fillRect(0,0,W,H);
      g.fillStyle='rgba(255,255,255,.35)';for(var i=0;i<26;i++){var sx=((i*97)%W-(x*(.1+(i%3)*.08)))%W;if(sx<0)sx+=W;g.fillRect(sx,(i*53)%(H-60)+20,2,2);}
      g.fillStyle='#10152B';g.fillRect(0,H-FL,W,FL);g.fillRect(0,0,W,CE);g.fillStyle='#FFD96B';g.fillRect(0,H-FL,W,2);g.fillRect(0,CE-2,W,2);
      obs.forEach(function(o){var sx=o.x-x;if(sx>W+10)return;g.fillStyle='#E5484D';g.beginPath();var n=Math.max(1,Math.round(o.w/22)),sw=o.w/n;for(var k=0;k<n;k++){var bx=sx+k*sw;if(o.side){g.moveTo(bx,CE);g.lineTo(bx+sw/2,CE+34);g.lineTo(bx+sw,CE);}else{g.moveTo(bx,H-FL);g.lineTo(bx+sw/2,H-FL-34);g.lineTo(bx+sw,H-FL);}}g.fill();});
      stars.forEach(function(o){var sx=o.x-x;g.fillStyle='#FFD96B';g.beginPath();for(var i=0;i<10;i++){var a=i/10*6.283-1.57,r=i%2?5:11;g.lineTo(sx+Math.cos(a)*r,o.y+Math.sin(a)*r);}g.fill();});
      trail.forEach(function(q){g.fillStyle='rgba(255,217,107,'+(.3-q.t)+')';g.beginPath();g.arc(OX-q.t*v*.5,q.y,8*(1-q.t*2),0,6.3);g.fill();});
      parts.forEach(function(p){g.globalAlpha=Math.max(0,p.l*2);g.fillStyle=p.gold?'#FFD96B':'#E5484D';g.beginPath();g.arc(p.x,p.y,3,0,6.3);g.fill();});g.globalAlpha=1;
      if(!dead){g.save();g.translate(OX,owl.y);if(owl.dir<0)g.scale(1,-1);g.rotate(Math.max(-.4,Math.min(.4,owl.vy/900)));if(img.complete)g.drawImage(img,-SZ/2-4,-SZ/2-4,SZ+8,SZ+8);else{g.fillStyle='#A0663A';g.fillRect(-SZ/2,-SZ/2,SZ,SZ);}g.restore();}}
    function loop(ts){if(over||!box.isConnected){cancelAnimationFrame(raf);return;}var dt=Math.min(.04,(ts-last)/1000||.016);last=ts;upd(dt);draw();raf=requestAnimationFrame(loop);}
    cv.__flip=function(){return {dead:!!dead||over,side:owl.dir>0?0:1,y:owl.y,dist:dist,got:got,v:v,OX:OX,obs:obs.map(function(o){return {x:o.x-x,w:o.w,side:o.side};}),W:W};};
    raf=requestAnimationFrame(loop);}
  /* مرايا النور: أدر المرايا حتى يصيب شعاع الفانوس كل البلورات؛ لكل مستوى حل مضمون ومثالي بعدد حركات معروف */
  var MIR_DIRS=[[1,0],[0,1],[-1,0],[0,-1]];
  function mirRefl(t,d){return t==='/'?[-d[1],-d[0]]:[d[1],d[0]];}
  function mirTrace(n,r0,grid){var x=0,y=r0,d=[1,0],pts=[[0,r0+.5]],cells={},guard=0;
    while(x>=0&&y>=0&&x<n&&y<n&&guard++<400){cells[x+','+y]=1;var m=grid[y][x];if(m){d=mirRefl(m,d);pts.push([x+.5,y+.5]);}x+=d[0];y+=d[1];}
    var ex=Math.max(0,Math.min(n,x+(d[0]<0?1:0))),ey=Math.max(0,Math.min(n,y+(d[1]<0?1:0)));var last=pts[pts.length-1];
    pts.push(d[0]?[d[0]>0?n:0,last[1]]:[last[0],d[1]>0?n:0]);return {pts:pts,cells:cells};}
  function mirGen(n,m,nc){
    for(var attempt=0;attempt<300;attempt++){
      var r0=1+Math.floor(RND()*(n-2)),x=0,y=r0,d=[1,0],grid=[],mir=[],vis={},ok=true,i,j;for(i=0;i<n;i++){grid.push([]);for(j=0;j<n;j++)grid[i].push(null);}
      vis['0,'+r0]=1;
      while(mir.length<m&&ok){var run=1+Math.floor(RND()*3),nx=x,ny=y,moved=0;
        for(i=0;i<run;i++){var tx=nx+d[0],ty=ny+d[1];if(tx<0||ty<0||tx>=n||ty>=n||vis[tx+','+ty])break;nx=tx;ny=ty;vis[nx+','+ny]=1;moved++;}
        if(!moved){ok=false;break;}
        var opts=shuffle(['/','\\']),pl=false;
        for(i=0;i<2;i++){var nd=mirRefl(opts[i],d),ax=nx+nd[0],ay=ny+nd[1];if(ax>=0&&ay>=0&&ax<n&&ay<n&&!vis[ax+','+ay]){grid[ny][nx]=opts[i];mir.push([nx,ny]);d=nd;x=nx;y=ny;pl=true;break;}}
        if(!pl){ok=false;break;}}
      if(!ok||mir.length<m)continue;
      var tr=mirTrace(n,r0,grid),straight=[];Object.keys(tr.cells).forEach(function(k){var p=k.split(',').map(Number);if(!grid[p[1]][p[0]]&&p[0]>0)straight.push(p);});
      if(straight.length<nc)continue;var cr=shuffle(straight).slice(0,nc);
      for(i=0;i<n;i++)for(j=0;j<n;j++)if(!grid[i][j]&&!tr.cells[j+','+i]&&RND()<.16)grid[i][j]=RND()<.5?'/':'\\';
      var scrN=Math.max(2,Math.ceil(m*.6)),scr=shuffle(mir).slice(0,scrN);scr.forEach(function(c){grid[c[1]][c[0]]=grid[c[1]][c[0]]==='/'?'\\':'/';});
      var t2=mirTrace(n,r0,grid);if(cr.every(function(c){return t2.cells[c[0]+','+c[1]];}))continue;
      return {n:n,r0:r0,grid:grid,crystals:cr,scr:scr};}
    return null;}
  function mirrorsGame(lev){
    var LV=[[5,3,2],[5,4,2],[6,5,3],[6,6,3],[7,8,3]],STAGES=LV.length,idx=0,totalStars=0,solved=0,hud=arcadeShell(),holder=el('div','mir-wrap');box.appendChild(holder);box.appendChild(el('p','g-sub',T('mr.hint')));var note=el('p','g-sub ltn-note');note.setAttribute('aria-live','polite');box.appendChild(note);
    function level(){holder.textContent='';note.textContent='';var cfg=LV[idx],P=mirGen(cfg[0],cfg[1]+(lev==='hard'?1:0),cfg[2]);if(!P){P=mirGen(cfg[0],cfg[1],cfg[2]);}
      var n=P.n,grid=P.grid,moves=0,won=false,orig=grid.map(function(r){return r.slice();}),par=P.scr.length;
      var wrap=el('div','mir');wrap.style.setProperty('--n',n);var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 '+n+' '+n);svg.setAttribute('class','mir-beam');svg.setAttribute('aria-hidden','true');
      var btns=[];for(var y=0;y<n;y++)for(var x=0;x<n;x++){(function(x,y){var b=el('button','mir-c');b.type='button';b.setAttribute('data-x',x);b.setAttribute('data-y',y);b.addEventListener('click',function(){if(won)return;if(!grid[y][x])return;grid[y][x]=grid[y][x]==='/'?'\\':'/';moves++;SFX.tone(520,.04);draw();});wrap.appendChild(b);btns.push(b);})(x,y);}
      wrap.appendChild(svg);holder.appendChild(wrap);
      var ctl=el('div','mir-ctl'),rs=btn(T('mr.reset'),'btn ghost',function(){if(won)return;grid=orig.map(function(r){return r.slice();});moves=0;draw();});ctl.appendChild(rs);holder.appendChild(ctl);
      function draw(){var tr=mirTrace(n,P.r0,grid),NS='http://www.w3.org/2000/svg',lit=0;svg.textContent='';
        var pl=document.createElementNS(NS,'polyline');pl.setAttribute('points',tr.pts.map(function(p){return p[0]+','+p[1];}).join(' '));pl.setAttribute('class','mir-ray');svg.appendChild(pl);
        P.crystals.forEach(function(c){var on=!!tr.cells[c[0]+','+c[1]];if(on)lit++;var d=document.createElementNS(NS,'polygon');var cx=c[0]+.5,cy=c[1]+.5;d.setAttribute('points',cx+','+(cy-.26)+' '+(cx+.2)+','+cy+' '+cx+','+(cy+.26)+' '+(cx-.2)+','+cy);d.setAttribute('class','mir-gem'+(on?' on':''));svg.appendChild(d);});
        btns.forEach(function(b){var x=+b.getAttribute('data-x'),y=+b.getAttribute('data-y'),m=grid[y][x];b.textContent='';b.setAttribute('aria-label',m?(m==='/'?T('mr.m1'):T('mr.m2')):T('mr.empty'));b.classList.toggle('has',!!m);if(m){var s2=document.createElementNS(NS,'svg');s2.setAttribute('viewBox','0 0 10 10');var ln=document.createElementNS(NS,'line');if(m==='/'){ln.setAttribute('x1',1.5);ln.setAttribute('y1',8.5);ln.setAttribute('x2',8.5);ln.setAttribute('y2',1.5);}else{ln.setAttribute('x1',1.5);ln.setAttribute('y1',1.5);ln.setAttribute('x2',8.5);ln.setAttribute('y2',8.5);}ln.setAttribute('class','mir-m');s2.appendChild(ln);b.appendChild(s2);}});
        var src=document.createElementNS(NS,'circle');src.setAttribute('cx',.12);src.setAttribute('cy',P.r0+.5);src.setAttribute('r',.16);src.setAttribute('class','mir-src');svg.appendChild(src);
        hud.a.textContent=T('mr.level',{n:idx+1,m:STAGES});hud.b.textContent=T('mr.lit',{n:lit,m:P.crystals.length})+' · '+T('mr.moves',{n:moves,p:par});
        wrap.__st={lit:lit,total:P.crystals.length,moves:moves,par:par,scr:P.scr.slice(),level:idx+1};
        if(lit===P.crystals.length&&!won){won=true;var stars=moves<=par?3:moves<=par+2?2:1;totalStars+=stars;solved++;SFX.play('win');note.textContent=T('mr.done')+' '+'★'.repeat(stars)+'☆'.repeat(3-stars);
          setTimeout(function(){if(!box.isConnected)return;idx++;if(idx>=STAGES){finish({pts:totalStars*10+solved*10,correct:solved,total:STAGES,pct:Math.round(solved/STAGES*100),bestStreak:totalStars,level:lev});}else level();},1400);}}
      draw();}
    level();}

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
    var tb=null,tfill=null;if(cfg.sec){tb=el('div','g-time');tfill=el('i');tb.appendChild(tfill);tb.setAttribute('role','timer');box.appendChild(tb);}
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
    if(cfg.sec){timer=setInterval(function(){left=Math.max(0,cfg.sec-(Date.now()-t0)/1000);tfill.style.width=(left/cfg.sec*100)+'%';tb.classList.toggle('low',left/cfg.sec<0.25);if(left<=0)end();},200);}
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
    else if(slug==='swarm')swarmGame(lev==='prog'?'medium':lev);
    else if(slug==='flip')flipGame(lev==='prog'?'medium':lev);
    else if(slug==='mirrors')mirrorsGame(lev==='prog'?'medium':lev);
    else if(slug==='lantern')lanternGame(lev==='prog'?'medium':lev);
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
/* صفحة الإدارة داخل الموقع: تُحمَّل في إطار srcdoc معزول التنسيق من نفس نسخة الأصول، وتحتاج كلمة مرور شكلية ثم توكن GitHub للتعديل */
function mountAdmin(){
  var host=document.getElementById('basira-admin');if(!host&&/[?&]admin=1(&|$)/.test(location.search)){host=document.createElement('div');host.id='basira-admin';document.body.prepend(host);}
  if(!host||host.getAttribute('data-ready'))return;host.setAttribute('data-ready','1');
  var sc=document.querySelector('script[src*="basira.js"]');if(!sc)return;
  try{localStorage.setItem('basira.internal','1');}catch(e){}
  var m=document.createElement('meta');m.name='robots';m.content='noindex,nofollow';document.head.appendChild(m);
  var url=sc.src.replace(/basira\.js(\?.*)?$/,'admin/index.html');
  host.textContent=document.documentElement.lang==='en'?'Loading admin panel…':'جارٍ تحميل لوحة الإدارة…';
  fetch(url).then(function(r){if(!r.ok)throw new Error(r.status);return r.text();}).then(function(h){
    var f=document.createElement('iframe');f.title='BASIRA admin';f.className='admin-frame';f.srcdoc=h;host.textContent='';host.appendChild(f);document.body.classList.add('is-admin');
  }).catch(function(){host.textContent=document.documentElement.lang==='en'?'Could not load the admin panel.':'تعذّر تحميل لوحة الإدارة.';});
}
function init(){
  emptyState();mountAdmin();
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
