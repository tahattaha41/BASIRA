(function(){
  var d=document.documentElement,b=document.getElementById('theme-toggle');
  function label(){if(b)b.textContent=d.getAttribute('data-theme')==='dark'?'الوضع الفاتح':'الوضع الداكن';}
  label();
  if(b)b.addEventListener('click',function(){
    var dark=d.getAttribute('data-theme')!=='dark';
    if(dark)d.setAttribute('data-theme','dark');else d.removeAttribute('data-theme');
    try{localStorage.setItem('site-theme',dark?'dark':'light');}catch(e){}
    label();
  });
  var f=document.querySelector('form.find');
  if(f)f.addEventListener('submit',function(e){var q=f.querySelector('input[name=q]');if(q&&!q.value.trim()){e.preventDefault();q.focus();}});
})();
