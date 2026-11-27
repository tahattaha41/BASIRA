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
    owl:"<svg viewBox='0 0 80 90' aria-hidden='true'><g class='c-wl'><ellipse cx='12' cy='56' rx='9' ry='20' fill='#7A4B2A'/></g><g class='c-wr'><ellipse cx='68' cy='56' rx='9' ry='20' fill='#7A4B2A'/></g><ellipse cx='40' cy='54' rx='28' ry='32' fill='#A0663A'/><ellipse cx='40' cy='64' rx='17' ry='20' fill='#F4DDB8'/><path d='M16 28L10 8L28 20ZM64 28L70 8L52 20Z' fill='#7A4B2A'/><circle cx='28' cy='38' r='13' fill='#fff'/><circle cx='52' cy='38' r='13' fill='#fff'/><circle class='c-eye' cx='29' cy='39' r='6' fill='#141414'/><circle class='c-eye' cx='51' cy='39' r='6' fill='#141414'/><path d='M36 48L44 48L40 57Z' fill='#F5A524'/><path d='M30 84L30 90M50 84L50 90' stroke='#F5A524' stroke-width='5' stroke-linecap='round'/></svg>",
    imp:"<svg viewBox='0 0 90 90' aria-hidden='true'><path d='M20 26L12 4L34 18ZM70 26L78 4L56 18Z' fill='#5B2A86'/><path d='M12 62C8 36 26 20 45 20C64 20 82 36 78 62C76 78 62 86 45 86C28 86 14 78 12 62Z' fill='#8E4BD1'/><circle cx='32' cy='48' r='10' fill='#fff'/><circle cx='58' cy='48' r='10' fill='#fff'/><circle class='c-eye' cx='33' cy='49' r='5' fill='#2A0F45'/><circle class='c-eye' cx='57' cy='49' r='5' fill='#2A0F45'/><path d='M26 38L40 43M64 38L50 43' stroke='#2A0F45' stroke-width='4' stroke-linecap='round'/><path d='M28 66Q45 78 62 66' fill='#2A0F45'/><path d='M34 68L38 74L42 68M48 68L52 74L56 68' fill='#fff'/></svg>",
    cat:"<svg viewBox='0 0 70 80' aria-hidden='true'><path d='M52 60C66 58 68 40 62 34' fill='none' stroke='#E08A3C' stroke-width='8' stroke-linecap='round' class='c-tail'/><ellipse cx='34' cy='56' rx='20' ry='20' fill='#F0A04B'/><path d='M12 26L14 6L30 18ZM56 26L54 6L38 18Z' fill='#F0A04B'/><ellipse cx='34' cy='32' rx='22' ry='18' fill='#F0A04B'/><circle cx='26' cy='30' r='4' fill='#141414' class='c-eye'/><circle cx='42' cy='30' r='4' fill='#141414' class='c-eye'/><path d='M31 38L37 38L34 42Z' fill='#E5484D'/><path d='M8 36L22 38M8 44L22 42M60 36L46 38M60 44L46 42' stroke='#fff' stroke-width='1.6'/><path d='M24 74L24 80M44 74L44 80' stroke='#C46E1F' stroke-width='6' stroke-linecap='round' class='c-leg'/></svg>",
    frog:"<svg viewBox='0 0 80 60' aria-hidden='true'><ellipse cx='40' cy='38' rx='28' ry='18' fill='#4CB86B'/><ellipse cx='40' cy='44' rx='18' ry='9' fill='#B9EBC4'/><circle cx='24' cy='18' r='11' fill='#4CB86B'/><circle cx='56' cy='18' r='11' fill='#4CB86B'/><circle cx='24' cy='18' r='7' fill='#fff'/><circle cx='56' cy='18' r='7' fill='#fff'/><circle class='c-eye' cx='25' cy='19' r='3.5' fill='#141414'/><circle class='c-eye' cx='55' cy='19' r='3.5' fill='#141414'/><path d='M30 38Q40 46 50 38' fill='none' stroke='#1E6B3A' stroke-width='3' stroke-linecap='round'/><ellipse cx='12' cy='52' rx='10' ry='5' fill='#3A9F5A'/><ellipse cx='68' cy='52' rx='10' ry='5' fill='#3A9F5A'/></svg>",
    mole:"<svg viewBox='0 0 70 70' aria-hidden='true'><ellipse cx='35' cy='44' rx='26' ry='26' fill='#8A6A4F'/><ellipse cx='35' cy='52' rx='16' ry='13' fill='#C9A98A'/><circle cx='25' cy='36' r='4.5' fill='#141414' class='c-eye'/><circle cx='45' cy='36' r='4.5' fill='#141414' class='c-eye'/><ellipse cx='35' cy='45' rx='7' ry='5' fill='#E58FA0'/><path d='M30 54Q35 58 40 54' fill='none' stroke='#5B4331' stroke-width='2.5' stroke-linecap='round'/><ellipse cx='12' cy='56' rx='7' ry='5' fill='#6E5240'/><ellipse cx='58' cy='56' rx='7' ry='5' fill='#6E5240'/></svg>"
  };
  function chr(kind,cls){var d=el('span','chr chr-'+kind+(cls?' '+cls:''));d.innerHTML=CHR[kind];d.setAttribute('aria-hidden','true');return d;}
  function optsOf(q,n){var all=q.o.map(function(t,k){return {t:t,ok:k===q.a};}),good=all.filter(function(o){return o.ok;})[0],bad=shuffle(all.filter(function(o){return !o.ok;})).slice(0,n-1);return shuffle([good].concat(bad));}
  var REDUCE=function(){return matchMedia('(prefers-reduced-motion: reduce)').matches;};
  /* معركة المعرفة: بطل ضد وحش؛ الإجابة الصحيحة تضرب الوحش والخاطئة تؤذيك */
  function battleItem(q,st){return function(body,answer){
    var sc=el('div','btl');var hero=el('div','btl-s btl-h'),mon=el('div','btl-s btl-m');
    var hb=el('div','btl-hp'),hi=el('i');hb.appendChild(hi);hb.setAttribute('role','img');hb.setAttribute('aria-label',T('btl.you'));
    var mb=el('div','btl-hp btl-hp-m'),mi=el('i');mb.appendChild(mi);mb.setAttribute('role','img');mb.setAttribute('aria-label',T('btl.foe'));
    hero.appendChild(hb);hero.appendChild(chr('owl'));mon.appendChild(mb);mon.appendChild(chr('imp'));sc.appendChild(hero);sc.appendChild(mon);body.appendChild(sc);
    function hp(){hi.style.width=Math.max(0,st.me)+'%';mi.style.width=Math.max(0,st.foe)+'%';hb.setAttribute('data-hp',Math.max(0,st.me));mb.setAttribute('data-hp',Math.max(0,st.foe));}hp();
    body.appendChild(el('p','g-q',q.q));var list=el('div','g-opts'),done=false;
    optsOf(q,4).forEach(function(o){var b=btn(o.t,'g-opt',function(){if(done)return;done=true;
      [].forEach.call(list.children,function(c){c.disabled=true;if(c.getAttribute('data-ok')==='1')c.classList.add('ok');});
      if(o.ok){st.foe-=st.dmg;hero.classList.add('atk');mon.classList.add('hit');}else{b.classList.add('bad');st.me-=25;mon.classList.add('atk');hero.classList.add('hit');}
      hp();answer(o.ok,q.x);});b.setAttribute('data-ok',o.ok?'1':'0');list.appendChild(b);});
    body.appendChild(list);
  };}
  /* ممر المعرفة: عدّاء على ثلاثة مسارات؛ بوابات الإجابات تقترب منه فاختر مساره */
  function lanesItem(q,st,dur){return function(body,answer){
    body.appendChild(el('p','g-q',q.q));var os=optsOf(q,3),done=false,tm=0;
    var road=el('div','lns');body.appendChild(road);var cols=[],gates=[];
    var runner=chr('cat','lns-r');road.appendChild(runner);
    function place(){runner.style.insetInlineStart=(st.lane*33.333+16.666)+'%';cols.forEach(function(c,k){c.setAttribute('aria-pressed',k===st.lane?'true':'false');});}
    function arrive(){if(done)return;done=true;clearTimeout(tm);var o=os[st.lane];gates.forEach(function(g,k){g.classList.add(os[k].ok?'ok':(k===st.lane?'bad':'off'));});runner.classList.add(o.ok?'cheer':'stumble');answer(o.ok,q.x);}
    os.forEach(function(o,k){
      var g=el('div','lns-g');g.setAttribute('data-ok',o.ok?'1':'0');g.appendChild(el('span','',o.t));g.style.insetInlineStart=(k*33.333)+'%';g.style.transitionDuration=dur+'ms';road.appendChild(g);gates.push(g);
      var c=btn('','lns-c',function(){if(done)return;st.lane=k;place();dash();});c.setAttribute('aria-label',o.t);c.style.insetInlineStart=(k*33.333)+'%';road.appendChild(c);cols.push(c);});
    function dash(){gates.forEach(function(g){g.style.transitionDuration='600ms';});clearTimeout(tm);tm=setTimeout(arrive,640);}
    place();
    requestAnimationFrame(function(){requestAnimationFrame(function(){if(done)return;road.classList.add('go');tm=setTimeout(arrive,dur+40);});});
    function key(e){if(!body.isConnected||done){document.removeEventListener('keydown',key);return;}
      var rtl=document.documentElement.dir==='rtl',d=e.key==='ArrowLeft'?(rtl?1:-1):e.key==='ArrowRight'?(rtl?-1:1):0;if(!d)return;e.preventDefault();st.lane=Math.max(0,Math.min(2,st.lane+d));place();}
    document.addEventListener('keydown',key);
  };}
  /* الضفدع القفّاز: اختر ورقة النيلوفر الصحيحة فيقفز إليها، والخاطئة تغرق */
  function hopperItem(q,st){return function(body,answer){
    body.appendChild(el('p','g-q',q.q));var pond=el('div','hop');body.appendChild(pond);
    var frog=chr('frog','hop-f');pond.appendChild(frog);var os=optsOf(q,3),pads=el('div','hop-p');pond.appendChild(pads);var done=false;
    os.forEach(function(o){var b=btn('','hop-l',function(){if(done)return;done=true;
      [].forEach.call(pads.children,function(c){c.disabled=true;if(c.getAttribute('data-ok')==='1')c.classList.add('ok');});
      var pr=pond.getBoundingClientRect(),br=b.getBoundingClientRect(),fr=frog.getBoundingClientRect();
      var dx=(br.left+br.width/2)-(fr.left+fr.width/2),dy=(br.top+br.height/2)-(fr.top+fr.height/2)-8;
      if(frog.animate&&!REDUCE()){frog.animate([{transform:'translate(0,0)'},{transform:'translate('+dx*0.5+'px,'+(dy-70)+'px) scale(1.12)',offset:.5},{transform:'translate('+dx+'px,'+dy+'px)'}],{duration:620,easing:'ease-in-out',fill:'forwards'});}
      else frog.style.transform='translate('+dx+'px,'+dy+'px)';
      if(!o.ok){b.classList.add('bad');setTimeout(function(){frog.classList.add('sink');},560);}else{b.classList.add('ok');}
      setTimeout(function(){answer(o.ok,q.x);},REDUCE()?0:640);});
      b.setAttribute('data-ok',o.ok?'1':'0');b.appendChild(el('span','',o.t));pads.appendChild(b);});
  };}
  /* خُلد الإجابات: خلدان يطلعان من الجحور وكل واحد يحمل إجابة؛ اضغط الخُلد الصحيح وهو ظاهر */
  function molesItem(q,up,gap){return function(body,answer){
    body.appendChild(el('p','g-q',q.q));var field=el('div','mol');body.appendChild(field);
    var os=optsOf(q,4),spots=shuffle([0,1,2,3,4,5]).slice(0,4),holes=[],done=false,tm=0,order=[],cur=-1;
    for(var i=0;i<6;i++){var h=btn('','mol-h',null);h.type='button';var m=el('span','mol-m');m.appendChild(chr('mole'));var sg=el('span','mol-s');m.appendChild(sg);h.appendChild(m);h.appendChild(el('span','mol-d'));field.appendChild(h);holes.push(h);}
    os.forEach(function(o,k){var h=holes[spots[k]];h.setAttribute('data-ok',o.ok?'1':'0');h.setAttribute('data-k',k);h.querySelector('.mol-s').textContent=o.t;h.setAttribute('aria-label',o.t);});
    holes.forEach(function(h){h.addEventListener('click',function(){if(done||h.getAttribute('data-k')===null||!h.classList.contains('up'))return;
      done=true;clearTimeout(tm);var ok=h.getAttribute('data-ok')==='1';h.classList.add(ok?'ok':'bad');
      holes.forEach(function(x){if(x.getAttribute('data-ok')==='1')x.classList.add('up','ok');});
      answer(ok,q.x);});});
    function nextPop(){if(done||!body.isConnected)return;if(cur>=0)holes[spots[cur]].classList.remove('up');
      if(!order.length)order=shuffle([0,1,2,3]);cur=order.pop();holes[spots[cur]].classList.add('up');tm=setTimeout(function(){if(done)return;holes[spots[cur]].classList.remove('up');tm=setTimeout(nextPop,gap);},up);}
    nextPop();
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
    else if(slug==='battle'){var nb=lev==='prog'?'medium':lev,qb=pick('mcq',pool('mcq',nb),8),stB={me:100,foe:100,dmg:nb==='easy'?20:nb==='medium'?16:13};run(qb.map(function(q){return battleItem(q,stB);}),{level:nb,levelName:lev,sec:nb==='easy'?25:nb==='medium'?20:15});}
    else if(slug==='lanes'){var nl=lev==='prog'?'medium':lev,ql=pick('mcq',pool('mcq',nl),8),stL={lane:1},dL=nl==='easy'?9000:nl==='medium'?7000:5000;run(ql.map(function(q){return lanesItem(q,stL,dL);}),{level:nl,levelName:lev,sec:0});}
    else if(slug==='hopper'){var nh=lev==='prog'?'medium':lev,qh=pick('mcq',pool('mcq',nh),8);run(qh.map(function(q){return hopperItem(q,{});}),{level:nh,levelName:lev,sec:nh==='easy'?25:nh==='medium'?20:15});}
    else if(slug==='moles'){var nm3=lev==='prog'?'medium':lev,qm=pick('mcq',pool('mcq',nm3),8),upM=nm3==='easy'?1700:nm3==='medium'?1300:950;run(qm.map(function(q){return molesItem(q,upM,350);}),{level:nm3,levelName:lev,sec:nm3==='easy'?30:nm3==='medium'?26:22});}
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
  var host=document.getElementById('basira-admin');if(!host||host.getAttribute('data-ready'))return;host.setAttribute('data-ready','1');
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
