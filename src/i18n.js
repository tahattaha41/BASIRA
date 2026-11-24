(function(){
'use strict';
var DICT={{I18N_JSON}};
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
