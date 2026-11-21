/* محرك ألعاب BASIRA: أسئلة مراجَعة مخزنة داخل القالب، بلا خادم ولا ذكاء اصطناعي أثناء اللعب.
   الحفظ محلي (localStorage) على هذا الجهاز فقط. */
(function(){
  var B={{BANK_JSON}},META={{GAMES_META}},KEY='basira.v1',PTS=[0,10,15,20],LVN=['','سهل','متوسط','صعب'],PASS=0.7;
  var KB='ابتثجحخدذرزسشصضطظعغفقكلمنهويةء',NORM={'أ':'ا','إ':'ا','آ':'ا','ؤ':'و','ئ':'ي','ى':'ي'};
  var RULES={
    mcq:['اختر الإجابة الصحيحة من أربع. يظهر التفسير بعد كل سؤال.',['أسئلة مباشرة، بلا مؤقت.','أسئلة أصعب قليلاً، بلا مؤقت.','أصعب الأسئلة، و20 ثانية لكل سؤال.']],
    truefalse:['احكم على كل جملة بأنها صح أو خطأ. يظهر التفسير بعد كل جملة.',['جمل مباشرة، بلا مؤقت.','جمل أدق، بلا مؤقت.','أدق الجمل، و20 ثانية لكل جملة.']],
    order:['رتّب العناصر بالتسلسل الصحيح باستعمال أزرار الأسهم ثم اضغط «تحقق». المحاولة الواحدة لكل سؤال.',['تسلسلات واضحة.','تسلسلات متوسطة.','أصعب التسلسلات المتاحة.']],
    memory:['اقلب بطاقتين في كل محاولة وطابق كل عنصر مع ما يقابله. كل محاولة هي قلب بطاقتين.',['4 أزواج.','6 أزواج.','6 أزواج بحدّ أقصى 14 محاولة، وإلا تخسر.']],
    word:['خمّن الكلمة المخفية بالضغط على الحروف. كل حرف خاطئ يستهلك محاولة. خمس كلمات في كل جولة.',['8 محاولات خاطئة مسموحة والتلميح ظاهر.','6 محاولات والتلميح ظاهر.','4 محاولات والتلميح يكلّف محاولة.']]
  };
  var ROUND={mcq:10,truefalse:10,order:5,word:5};

  /* ---- أدوات ---- */
  function E(t,c,x){var n=document.createElement(t);if(c)n.className=c;if(x!=null)n.textContent=x;return n;}
  function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}
  function load(){try{var s=JSON.parse(localStorage.getItem(KEY));if(s&&typeof s==='object'){s.g=s.g||{};s.seen=s.seen||{};s.lv=s.lv||{};return s;}}catch(e){}return {g:{},seen:{},lv:{}};}
  function save(s){try{localStorage.setItem(KEY,JSON.stringify(s));return true;}catch(e){return false;}}
  function nrm(c){return NORM[c]||c;}
  function stop(root){(root.__iv||[]).forEach(clearInterval);(root.__to||[]).forEach(clearTimeout);root.__iv=[];root.__to=[];}
  function later(root,fn,ms){var t=setTimeout(fn,ms);(root.__to=root.__to||[]).push(t);return t;}
  function every(root,fn,ms){var t=setInterval(fn,ms);(root.__iv=root.__iv||[]).push(t);return t;}
  function fmt(n){return Math.floor(n/60)+':'+('0'+(n%60)).slice(-2);}
  function choose(key,arr,n,lv){
    var seen=load().seen[key]||[],tiers=lv===1?[[1],[2],[3]]:lv===2?[[2],[1],[3]]:[[3,2],[1]],out=[];
    tiers.forEach(function(t){
      if(out.length>=n)return;
      var c=arr.filter(function(q){return t.indexOf(q.l)>-1;});
      out=out.concat(shuffle(c.filter(function(q){return seen.indexOf(q.id)<0;})),shuffle(c.filter(function(q){return seen.indexOf(q.id)>-1;})));
    });
    out=out.slice(0,n);
    var s=load(),sn=(s.seen[key]||[]).concat(out.map(function(q){return q.id;}));s.seen[key]=sn.slice(-60);save(s);
    return out;
  }

  /* ---- الشاشة الأولى ---- */
  function intro(root,key){
    stop(root);root.textContent='';root.__lv=load().lv[key]||1;
    var r=RULES[key],box=E('div','bg-intro');
    box.appendChild(E('p','bg-rules',r[0]));
    var grp=E('div','bg-lvs');grp.setAttribute('role','radiogroup');grp.setAttribute('aria-label','المستوى');
    var best=E('p','bg-best'),desc=E('p','bg-lvd');
    function paint(){
      var s=load(),b=(s.g[key]&&s.g[key].best&&s.g[key].best[root.__lv])||0;
      desc.textContent=r[1][root.__lv-1];
      best.textContent=b?('أفضل نتيجة لك في هذا المستوى: '+b+' نقطة (محفوظة على هذا الجهاز)'):'لا توجد نتيجة محفوظة لهذا المستوى بعد.';
      for(var i=0;i<grp.children.length;i++){var on=(i+1)===root.__lv;grp.children[i].setAttribute('aria-checked',on?'true':'false');grp.children[i].tabIndex=on?0:-1;}
    }
    [1,2,3].forEach(function(l){
      var b=E('button','bg-lv',LVN[l]);b.type='button';b.setAttribute('role','radio');
      b.addEventListener('click',function(){root.__lv=l;paint();});
      b.addEventListener('keydown',function(e){
        var d=e.key==='ArrowLeft'?1:e.key==='ArrowRight'?-1:0;if(!d)return;e.preventDefault();
        root.__lv=Math.min(3,Math.max(1,root.__lv+d));paint();grp.children[root.__lv-1].focus();
      });
      grp.appendChild(b);
    });
    var go=E('button','btn play bg-go','ابدأ اللعب');go.type='button';
    go.addEventListener('click',function(){var s=load();s.lv[key]=root.__lv;save(s);start(root,key);});
    box.appendChild(grp);box.appendChild(desc);box.appendChild(best);box.appendChild(go);root.appendChild(box);paint();
  }

  /* ---- بدء جولة ---- */
  function start(root,key){
    stop(root);var lv=root.__lv;
    var st={key:key,lv:lv,i:0,score:0,right:0,answered:0,log:[],locked:false,done:false};
    if(key==='memory'){memory(root,st);return;}
    var pool={mcq:B.mcq,truefalse:B.tf,order:B.order,word:B.word}[key];
    if(key==='word')pool=B.word.map(function(w){return {id:w.id,l:w.w.length<=4?1:w.w.length===5?2:3,w:w.w,h:w.h,t:w.t};});
    st.qs=choose(key,pool,ROUND[key],lv);st.n=st.qs.length;
    question(root,st);
  }
  function head(root,st,label){
    var h=E('div','bg-head'),bar=E('div','bg-bar'),i=E('i');i.style.width=Math.round(st.i*100/(st.n||1))+'%';bar.appendChild(i);
    var row=E('div','bg-row');row.appendChild(E('span',null,label));row.appendChild(E('span','bg-sc','النقاط: '+st.score));
    var tm=E('span','bg-timer');row.appendChild(tm);h.appendChild(bar);h.appendChild(row);return {el:h,timer:tm};
  }
  function question(root,st){
    stop(root);root.textContent='';st.locked=false;
    var q=st.qs[st.i],h=head(root,st,'السؤال '+(st.i+1)+' من '+st.n);root.appendChild(h.el);
    var body=E('div','bg-body'),fb=E('div','bg-fb');fb.setAttribute('aria-live','polite');fb.hidden=true;
    root.appendChild(body);root.appendChild(fb);
    function settle(ok,detail,extra){
      if(st.locked)return;st.locked=true;stop(root);h.timer.textContent='';
      st.answered++;if(ok){st.right++;st.score+=PTS[st.lv]+(extra||0);}
      h.el.querySelector('.bg-sc').textContent='النقاط: '+st.score;
      fb.hidden=false;fb.className='bg-fb '+(ok?'ok':'bad');fb.textContent='';
      fb.appendChild(E('b',null,detail.title));if(detail.text)fb.appendChild(E('p',null,detail.text));
      st.log.push({q:detail.q,ok:ok,a:detail.a});
      var last=st.i+1>=st.n,nx=E('button','btn bg-next',last?'عرض النتيجة':'التالي');nx.type='button';
      nx.addEventListener('click',function(){if(last)finish(root,st);else{st.i++;question(root,st);}});
      fb.appendChild(nx);nx.focus();
    }
    if(st.key==='mcq')buildMcq(body,q,settle,st);
    else if(st.key==='truefalse')buildTf(body,q,settle,st);
    else if(st.key==='order')buildOrder(body,q,settle,st);
    else buildWord(body,q,settle,st);
    if(st.lv===3&&(st.key==='mcq'||st.key==='truefalse')){
      var left=20;h.timer.textContent='⏱ '+fmt(left);
      every(root,function(){left--;h.timer.textContent='⏱ '+fmt(Math.max(left,0));if(left<=0)expire();},1000);
      var expire=function(){
        var btns=body.querySelectorAll('button');for(var i=0;i<btns.length;i++)btns[i].disabled=true;
        settle(false,{title:'انتهى الوقت',text:'الإجابة الصحيحة: '+(st.key==='mcq'?q.o[q.a]:(q.v?'صح':'خطأ'))+'. '+q.x,q:q.q||q.s,a:'انتهى الوقت'});
      };
    }
  }

  /* ---- اختيار من متعدد ---- */
  function buildMcq(body,q,settle,st){
    body.appendChild(E('h3','bg-q',q.q));
    var opts=shuffle(q.o.map(function(t,i){return {t:t,c:i===q.a};})),list=E('div','bg-opts'),bs=[];
    opts.forEach(function(o,i){
      var b=E('button','bg-opt');b.type='button';b.appendChild(E('span','bg-ol','أبجد'.charAt(i)));b.appendChild(E('span',null,o.t));bs.push(b);
      b.addEventListener('click',function(){
        if(st.locked)return;
        bs.forEach(function(x,k){x.disabled=true;if(opts[k].c){x.classList.add('ok');x.appendChild(E('b','bg-mk','✓'));}else if(x===b){x.classList.add('bad');x.appendChild(E('b','bg-mk','✕'));}else x.classList.add('dim');});
        settle(o.c,{title:o.c?'إجابة صحيحة':'إجابة خاطئة',text:q.x,q:q.q,a:o.t});
      });
      list.appendChild(b);
    });
    body.appendChild(list);
  }
  /* ---- صح أم خطأ ---- */
  function buildTf(body,q,settle,st){
    body.appendChild(E('h3','bg-q',q.s));
    var row=E('div','bg-tf');
    [[true,'صح'],[false,'خطأ']].forEach(function(p){
      var b=E('button','bg-opt bg-big',p[1]);b.type='button';
      b.addEventListener('click',function(){
        if(st.locked)return;var ok=p[0]===q.v,all=row.children;
        for(var i=0;i<all.length;i++)all[i].disabled=true;
        b.classList.add(ok?'ok':'bad');b.appendChild(E('b','bg-mk',ok?'✓':'✕'));
        settle(ok,{title:ok?'إجابة صحيحة':'إجابة خاطئة',text:'الجملة '+(q.v?'صحيحة':'خاطئة')+'. '+q.x,q:q.s,a:p[1]});
      });
      row.appendChild(b);
    });
    body.appendChild(row);
  }
  /* ---- ترتيب ---- */
  function buildOrder(body,q,settle,st){
    body.appendChild(E('h3','bg-q',q.q));
    var cur=q.items.map(function(t,i){return {t:t,k:i};}),tries=0;
    do{cur=shuffle(cur);tries++;}while(tries<20&&cur.every(function(c,i){return c.k===i;}));
    var list=E('ol','bg-rows'),checked=false;
    function paint(res){
      list.textContent='';
      cur.forEach(function(c,i){
        var li=E('li','bg-row2'+(res?(c.k===i?' ok':' bad'):''));li.appendChild(E('span','bg-rt',c.t));
        if(!res){
          var up=E('button','bg-mv','▲'),dn=E('button','bg-mv','▼');up.type=dn.type='button';
          up.setAttribute('aria-label','حرّك «'+c.t+'» للأعلى');dn.setAttribute('aria-label','حرّك «'+c.t+'» للأسفل');
          up.disabled=i===0;dn.disabled=i===cur.length-1;
          up.addEventListener('click',function(){var t=cur[i-1];cur[i-1]=cur[i];cur[i]=t;paint();var b=list.children[i-1].children[1];if(b)b.focus();});
          dn.addEventListener('click',function(){var t=cur[i+1];cur[i+1]=cur[i];cur[i]=t;paint();var b=list.children[i+1].children[2];if(b)b.focus();});
          li.appendChild(up);li.appendChild(dn);
        }else li.appendChild(E('b','bg-mk',c.k===i?'✓':'✕'));
        list.appendChild(li);
      });
    }
    paint(false);body.appendChild(list);
    var chk=E('button','btn bg-check','تحقق');chk.type='button';
    chk.addEventListener('click',function(){
      if(checked||st.locked)return;checked=true;paint(true);chk.hidden=true;
      var ok=cur.every(function(c,i){return c.k===i;}),mine=cur.map(function(c){return c.t;}).join(' ← ');
      settle(ok,{title:ok?'ترتيب صحيح':'الترتيب غير صحيح',text:(ok?'':'الترتيب الصحيح: '+q.items.join(' ← ')+'. ')+q.x,q:q.q,a:mine});
    });
    body.appendChild(chk);
  }
  /* ---- خمّن الكلمة ---- */
  function buildWord(body,q,settle,st){
    var max=[0,8,6,4][st.lv],wrong=0,got={},hintShown=st.lv<3,over=false;
    var letters=q.w.split(''),info=E('p','bg-hint'),tiles=E('div','bg-tiles'),left=E('p','bg-left'),keys=E('div','bg-keys');
    tiles.setAttribute('dir','rtl');
    body.appendChild(E('p','bg-q2','الكلمة من قسم «'+q.t+'»'));body.appendChild(info);body.appendChild(tiles);body.appendChild(left);body.appendChild(keys);
    var hintBtn=null;
    function paint(reveal){
      info.textContent=hintShown?('تلميح: '+q.h):'';
      tiles.textContent='';
      letters.forEach(function(c){var on=reveal||got[nrm(c)],t=E('span','bg-tile'+(on?' on':''),on?c:'');tiles.appendChild(t);});
      tiles.setAttribute('aria-label','الكلمة: '+letters.map(function(c){return got[nrm(c)]?c:'_';}).join(' '));
      left.textContent='المحاولات الخاطئة المتبقية: '+(max-wrong);
    }
    function check(){
      if(over)return;
      var won=letters.every(function(c){return got[nrm(c)];});
      if(won){over=true;lock();paint(false);settle(true,{title:'أحسنت: «'+q.w+'»',text:'الكلمة من قسم '+q.t+'.',q:q.h,a:q.w},2*(max-wrong));}
      else if(wrong>=max){over=true;lock();paint(true);settle(false,{title:'نفدت المحاولات',text:'الكلمة هي «'+q.w+'».',q:q.h,a:q.w});}
    }
    function lock(){var b=keys.querySelectorAll('button');for(var i=0;i<b.length;i++)b[i].disabled=true;if(hintBtn)hintBtn.disabled=true;}
    KB.split('').forEach(function(c){
      var b=E('button','bg-key',c);b.type='button';
      b.addEventListener('click',function(){
        if(over||b.disabled)return;b.disabled=true;
        if(letters.some(function(x){return nrm(x)===c;})){got[c]=true;b.classList.add('ok');}else{wrong++;b.classList.add('bad');}
        paint(false);check();
      });
      keys.appendChild(b);
    });
    if(!hintShown){
      hintBtn=E('button','btn alt bg-hintbtn','أظهر التلميح (يكلّف محاولة)');hintBtn.type='button';
      hintBtn.addEventListener('click',function(){if(over||hintShown)return;hintShown=true;wrong++;hintBtn.hidden=true;paint(false);check();});
      body.insertBefore(hintBtn,tiles);
    }
    paint(false);
  }

  /* ---- لعبة الذاكرة ---- */
  function memory(root,st){
    stop(root);root.textContent='';
    var lv=st.lv,np=lv===1?4:6,limit=lv===3?14:0,set=B.mem[Math.floor(Math.random()*B.mem.length)];
    var pairs=shuffle(set.pairs).slice(0,np),cards=[];
    pairs.forEach(function(p,i){cards.push({p:i,t:p[0]});cards.push({p:i,t:p[1]});});
    cards=shuffle(cards);
    var moves=0,matched=0,open=[],lock=false,fin=false;
    var h=E('div','bg-head'),row=E('div','bg-row'),mv=E('span',null),info=E('span','bg-sc');row.appendChild(mv);row.appendChild(info);h.appendChild(row);
    root.appendChild(h);root.appendChild(E('p','bg-q2','«'+set.title+'»: طابق '+set.kind));
    var grid=E('div','bg-grid g'+(np===4?'2':'3')),fb=E('div','bg-fb');fb.setAttribute('aria-live','polite');fb.hidden=true;
    var btns=[];
    function stat(){mv.textContent='المحاولات: '+moves+(limit?' من '+limit:'');info.textContent='الأزواج: '+matched+' من '+np;}
    function paint(i){var c=cards[i],b=btns[i];b.className='bg-card'+(c.done?' done':c.up?' up':'');b.firstChild.textContent=(c.up||c.done)?c.t:'';b.setAttribute('aria-label',(c.up||c.done)?c.t+(c.done?' (متطابقة)':''):'بطاقة مغلقة '+(i+1));b.disabled=!!c.done;}
    cards.forEach(function(c,i){
      var b=E('button','bg-card');b.type='button';b.appendChild(E('span'));btns.push(b);
      b.addEventListener('click',function(){
        if(fin||lock||c.up||c.done)return;
        c.up=true;open.push(i);paint(i);
        if(open.length<2)return;
        moves++;var a=cards[open[0]],bb=cards[open[1]],oi=open.slice();open=[];
        if(a.p===bb.p){
          a.done=bb.done=true;a.up=bb.up=false;matched++;paint(oi[0]);paint(oi[1]);stat();
          if(matched===np)end(true);
        }else{
          lock=true;stat();
          later(root,function(){a.up=bb.up=false;paint(oi[0]);paint(oi[1]);lock=false;if(limit&&moves>=limit)end(false);},900);
        }
      });
      grid.appendChild(b);paint(i);
    });
    function end(win){
      if(fin)return;fin=true;
      var pts=win?Math.max(0,np*PTS[lv]-(moves-np)*2):0;st.score=pts;st.n=1;st.answered=0;
      finish(root,st,{win:win,headline:win?'أكملت اللعبة':'انتهت المحاولات',
        lines:[win?('أطابقت كل الأزواج في '+moves+' محاولة.'):('لم تكتمل الأزواج: طابقت '+matched+' من '+np+' ضمن '+limit+' محاولة.'),'الحد الأدنى الممكن للمحاولات: '+np+'.'],points:pts,max:np*PTS[lv]});
    }
    root.appendChild(grid);root.appendChild(fb);stat();
  }

  /* ---- النهاية والحفظ ---- */
  function finish(root,st,custom){
    if(st.done)return;st.done=true;stop(root);root.textContent='';
    var key=st.key,max=custom?custom.max:st.n*PTS[st.lv],win,head,lines=[];
    if(custom){win=custom.win;head=custom.headline;lines=custom.lines;}
    else{
      var pct=st.n?st.right/st.n:0;win=pct>=PASS;
      head=win?'نجحت في الجولة':'لم تبلغ حدّ النجاح';
      lines=['الإجابات الصحيحة: '+st.right+' من '+st.n+' ('+Math.round(pct*100)+'%).',win?'حدّ النجاح 70% وقد بلغته.':'حدّ النجاح 70%. جرّب مجدداً بأسئلة جديدة.'];
    }
    var s=load(),g=s.g[key]=s.g[key]||{plays:0,right:0,answered:0,best:{}},prev=g.best[st.lv]||0;
    g.plays++;g.right+=st.right||0;g.answered+=st.answered||0;
    var record=st.score>prev;if(record)g.best[st.lv]=st.score;
    var saved=save(s);
    var end=E('div','bg-end '+(win?'win':'lose'));
    end.appendChild(E('div','bg-big2',st.score+' نقطة'));
    end.appendChild(E('h3',null,head));
    lines.forEach(function(l){end.appendChild(E('p',null,l));});
    end.appendChild(E('p','bg-meta','المستوى: '+LVN[st.lv]+(max?' · الحد الأقصى: '+max+' نقطة':'')));
    if(record&&st.score>0)end.appendChild(E('p','bg-record','رقم قياسي جديد لك في هذا المستوى'));
    else if(prev)end.appendChild(E('p','bg-meta','أفضل نتيجة سابقة: '+prev+' نقطة'));
    end.appendChild(E('p','bg-meta',saved?'تُحفظ نتائجك على هذا الجهاز فقط ولا تنتقل بين الأجهزة.':'تعذّر الحفظ في هذا المتصفح (قد يمنعه وضع التصفح الخاص).'));
    if(st.log&&st.log.length){
      var d=E('details','bg-rev'),sm=E('summary',null,'راجع إجاباتك');d.appendChild(sm);
      var ul=E('ul');st.log.forEach(function(r){var li=E('li',r.ok?'ok':'bad');li.appendChild(E('b',null,(r.ok?'✓ ':'✕ ')+r.q));li.appendChild(E('span',null,' — إجابتك: '+r.a));ul.appendChild(li);});
      d.appendChild(ul);end.appendChild(d);
    }
    var row=E('div','bg-actions'),again=E('button','btn play','العب مجدداً'),chg=E('button','btn alt','غيّر المستوى');again.type=chg.type='button';
    again.addEventListener('click',function(){start(root,key);});chg.addEventListener('click',function(){intro(root,key);});
    row.appendChild(again);row.appendChild(chg);end.appendChild(row);root.appendChild(end);
    again.focus();fillProgress();
  }

  /* ---- لوحة التقدم على الصفحة الرئيسية ---- */
  function fillProgress(){
    var box=document.getElementById('bsr-progress');if(!box)return;
    var s=load(),keys=Object.keys(s.g),tot=0;box.textContent='';
    keys.forEach(function(k){tot+=s.g[k].plays||0;});
    if(!tot){box.appendChild(E('p',null,'لم تلعب أي جولة بعد على هذا الجهاز. ابدأ بأي لعبة وسيظهر تقدّمك هنا.'));}
    else{
      var tb=E('table','bg-stats'),cap=E('caption',null,'نتائجك على هذا الجهاز'),thead=E('tr');
      tb.appendChild(cap);['اللعبة','الجولات','أفضل نتيجة','الدقة'].forEach(function(t){var th=E('th',null,t);th.scope='col';thead.appendChild(th);});tb.appendChild(thead);
      META.forEach(function(m){
        var g=s.g[m[0]];if(!g)return;var best=0;for(var l in g.best)best=Math.max(best,g.best[l]);
        var tr=E('tr');tr.appendChild(E('th',null,m[1]));tr.children[0].scope='row';tr.appendChild(E('td',null,String(g.plays)));tr.appendChild(E('td',null,best+' نقطة'));
        tr.appendChild(E('td',null,g.answered?Math.round(g.right*100/g.answered)+'%':'—'));tb.appendChild(tr);
      });
      box.appendChild(tb);
      var clr=E('button','btn-quiet','مسح بيانات هذا الجهاز');clr.type='button';
      clr.addEventListener('click',function(){if(confirm('سيُحذف تقدّمك المحفوظ على هذا الجهاز. هل تريد المتابعة؟')){try{localStorage.removeItem(KEY);}catch(e){}fillProgress();}});
      box.appendChild(clr);
    }
    box.appendChild(E('p','note','التقدم محفوظ في متصفحك فقط، ولا يوجد حساب ولا مزامنة بين الأجهزة بعد. مسح بيانات المتصفح يحذفه.'));
  }

  function mount(root){
    if(root.__bsr)return;var key=root.getAttribute('data-game');if(!RULES[key])return;
    root.__bsr=1;root.__reset=function(){intro(root,key);};intro(root,key);
  }
  function init(){
    var gs=document.querySelectorAll('.bsr-game');
    for(var i=0;i<gs.length;i++){if(!gs[i].closest('.pane'))mount(gs[i]);}
    var rs=document.querySelectorAll('input[name=gm]');
    function sync(){
      for(var i=0;i<rs.length;i++){
        var m=document.querySelector('.pane.p-'+rs[i].id.slice(3)+' .bsr-game');if(!m)continue;
        if(rs[i].checked)mount(m);else if(m.__bsr)m.__reset();
      }
    }
    for(var j=0;j<rs.length;j++)rs[j].addEventListener('change',sync);
    sync();fillProgress();
  }
  init();
})();
