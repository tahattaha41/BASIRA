(function(){
  var d=document.documentElement,bs=document.querySelectorAll('.js-theme'),nav=document.getElementById('nav-t');
  function label(){var t=d.getAttribute('data-theme')==='dark'?'الوضع الفاتح':'الوضع الداكن';for(var i=0;i<bs.length;i++)bs[i].textContent=t;}
  label();
  for(var i=0;i<bs.length;i++)bs[i].addEventListener('click',function(){
    var dark=d.getAttribute('data-theme')!=='dark';
    if(dark)d.setAttribute('data-theme','dark');else d.removeAttribute('data-theme');
    try{localStorage.setItem('site-theme',dark?'dark':'light');}catch(e){}
    label();
  });
  function closeNav(){if(nav)nav.checked=false;}
  var dl=document.querySelectorAll('.drawer a');for(i=0;i<dl.length;i++)dl[i].addEventListener('click',closeNav);
  var lb=document.querySelectorAll('label[role=button]');
  for(i=0;i<lb.length;i++)lb[i].addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();this.click();}});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeNav();var s=document.querySelector('.sdrop');if(s)s.removeAttribute('open');}});
  var fs=document.querySelectorAll('form.find');
  for(i=0;i<fs.length;i++)fs[i].addEventListener('submit',function(e){
    var q=this.querySelector('input[name=q]');
    if(q&&!q.value.trim()){e.preventDefault();q.focus();return;}
    var b=this.querySelector('button');if(b){b.classList.add('busy');b.setAttribute('aria-busy','true');}
  });

  /* سؤال اليوم: أسئلة مراجَعة مخزنة في القالب. بلا خادم وبلا نقاط، والنتيجة لهذه الجلسة فقط. */
  var Q={{QUIZ_JSON}},live=document.getElementById('live');
  if(live&&Q.length){
    var $=function(id){return document.getElementById(id);},qe=$('lv-q'),oe=$('lv-o'),fb=$('lv-fb'),nx=$('lv-next'),sc=$('lv-score'),nn=$('lv-n');
    var day=Math.floor(new Date().getTime()/86400000),idx=day%Q.length,done=0,right=0,locked=false;
    var AR='أبجد';
    function show(){
      var q=Q[idx];locked=false;qe.textContent=q.q;oe.innerHTML='';fb.hidden=true;fb.className='live-fb';nx.hidden=true;
      nn.textContent=(done+1)+' من '+Q.length;sc.textContent=done?('الصحيحة: '+right+' من '+done):'';
      q.o.forEach(function(t,i){
        var b=document.createElement('button');b.type='button';b.className='lo';
        var l=document.createElement('span');l.className='ol';l.textContent=AR.charAt(i);
        var s2=document.createElement('span');s2.textContent=t;b.appendChild(l);b.appendChild(s2);
        b.addEventListener('click',function(){pick(i,b);});oe.appendChild(b);
      });
    }
    function pick(i,btn){
      if(locked)return;locked=true;var q=Q[idx],ok=i===q.a,bs=oe.children;done++;if(ok)right++;
      for(var k=0;k<bs.length;k++){bs[k].disabled=true;if(k===q.a)bs[k].classList.add('ok');else if(k===i)bs[k].classList.add('bad');else bs[k].classList.add('dim');}
      fb.hidden=false;fb.className='live-fb '+(ok?'ok':'bad');
      fb.innerHTML='';var t=document.createElement('b');t.textContent=ok?'إجابة صحيحة':'إجابة خاطئة';var p=document.createElement('p');p.textContent=q.x;fb.appendChild(t);fb.appendChild(p);
      sc.textContent='الصحيحة: '+right+' من '+done;
      nx.hidden=false;nx.textContent=done>=Q.length?'النتيجة':'سؤال آخر';nx.focus();
    }
    nx.addEventListener('click',function(){
      if(done>=Q.length){
        live.innerHTML='';var w=document.createElement('div');w.className='live-end';
        var h=document.createElement('h2');h.textContent='أكملت الجولة: '+right+' من '+Q.length;
        var p=document.createElement('p');p.textContent='النتيجة لهذه الجلسة فقط ولا تُحفظ.';
        var r=document.createElement('button');r.className='btn';r.type='button';r.textContent='أعد الجولة';
        r.addEventListener('click',function(){location.reload();});
        w.appendChild(h);w.appendChild(p);w.appendChild(r);live.appendChild(w);r.focus();return;
      }
      idx=(idx+1)%Q.length;show();
    });
    show();
  }
})();
