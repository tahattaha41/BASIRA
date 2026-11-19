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
})();
