(()=>{const root=document.querySelector('.harness-article');if(!root)return;

const $=s=>root.querySelector(s), $$=s=>Array.from(root.querySelectorAll(s));
const nav=$('nav');
const measureNav=()=>document.documentElement.style.setProperty('--article-nav-height',nav.getBoundingClientRect().height+'px');
measureNav();
new ResizeObserver(measureNav).observe(nav);
$('#outline').onclick=()=>{$$('details').forEach(d=>d.open=false);root.classList.remove('reading')};
$('#lecture').onclick=()=>{$$('.talk').forEach(d=>d.open=true);root.classList.add('reading')};
$('#expandall').onclick=()=>$$('details:not(.diagram):not(.skill-source)').forEach(d=>d.open=true);
$$('.diagram').forEach(d=>d.addEventListener('toggle',()=>{if(d.open){let f=d.querySelector('iframe');if(!f.hasAttribute('src'))f.src=f.dataset.src}}));
const modal=$('#image-modal');$$('.image-button').forEach(b=>b.onclick=()=>{let i=b.querySelector('img');$('#large-image').src=i.src;$('#image-caption').textContent=i.alt;modal.showModal()});$('#close-image').onclick=()=>modal.close();modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});
$('#search').addEventListener('input',e=>{let q=e.target.value.trim().toLowerCase(),count=0;$$('.searchable').forEach(x=>{let match=!q||x.textContent.toLowerCase().includes(q);x.classList.toggle('hidden',!match);if(match)count++});$('#noresults').hidden=count>0;$('#search-state').textContent=q?'找到 '+count+' 个相关条目':''});
window.addEventListener('scroll',()=>{let h=document.documentElement;$('#progress').style.width=(100*h.scrollTop/Math.max(1,h.scrollHeight-h.clientHeight))+'%'},{passive:true});
window.addEventListener('beforeprint',()=>$$('details:not(.diagram):not(.skill-source)').forEach(d=>d.open=true));


root.querySelectorAll('.copy-source').forEach(button=>button.addEventListener('click',async()=>{
 const text=button.parentElement.querySelector('textarea');let ok=false;
 try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text.value);ok=true}}catch(e){}
 if(!ok){text.focus();text.select();try{ok=document.execCommand('copy')}catch(e){}}
 button.textContent=ok?'已复制':'已选中，请按 Ctrl/Cmd + C';
 setTimeout(()=>{button.textContent='复制全文'},2500);
}));

})();
