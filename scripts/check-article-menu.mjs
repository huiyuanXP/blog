const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
import fs from 'node:fs';
const dir=process.env.EVIDENCE_DIR || '/tmp/blog-menu-evidence';fs.mkdirSync(dir,{recursive:true});
const baseUrl=process.env.PREVIEW_URL || 'http://127.0.0.1:14322';
const browser=await chromium.launch({headless:true});const results=[];
function check(ok,label){if(!ok)throw Error(label);results.push('PASS '+label)}
try {
for(const width of [1440,390])for(const style of ['minimal','expressive'])for(const lang of ['zh','en']) {
 const c=await browser.newContext({viewport:{width,height:900}});const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(baseUrl + '/');await p.locator(`button[data-style="${style}"]`).click();await p.locator('.style-overlay').waitFor({state:'hidden'});if(lang==='en')await p.locator('#lang-toggle').click();
 const trigger=p.locator('.article-menu-trigger'), links=p.locator('#article-menu-links');const label=`${width}-${style}-${lang}`;
 await trigger.hover();check(await links.isVisible(),label+' hover opens');await links.locator('a').first().hover();check(await links.isVisible(),label+' hover moves into menu');await p.mouse.move(width-1,899);check(await links.isHidden(),label+' unpinned leave closes');
 await trigger.hover();await trigger.click();await p.mouse.move(width-1,899);check(await links.isVisible(),label+' hover click leave stays pinned');check(await trigger.getAttribute('aria-expanded')==='true',label+' aria open');
 check(await links.locator('a').first().evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));}),label+' menu links not clipped or covered');
 check(await links.evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;}),label+' full menu fits viewport');
 await p.screenshot({path:`${dir}/${label}-pinned.png`});
 await trigger.click();check(await links.isHidden(),label+' second click closes');
 await trigger.click();await p.locator('.hero .meaning').click();check(await links.isHidden(),label+' outside closes');
 await trigger.click();await p.keyboard.press('Escape');check(await links.isHidden(),label+' Escape closes');check(await trigger.evaluate(el=>el===document.activeElement),label+' Escape restores focus');
 await p.mouse.move(width-1,899);await trigger.focus();await p.keyboard.press('Enter');check(await links.isVisible(),label+' keyboard opens');await p.keyboard.press('Escape');await p.keyboard.press('ArrowDown');check(await links.locator('a').first().evaluate(el=>el===document.activeElement),label+' ArrowDown enters links');
 const titles=await links.locator(`a [data-lang="${lang}"]`).allTextContents();check(titles.length===2&&titles.every(Boolean),label+' two bilingual articles');
 for(const slug of ['agent-swarm','langchain-end']) {await trigger.click();await links.locator(`a[href="/posts/${slug}/"]`).click();check(p.url().endsWith(`/posts/${slug}/`),label+' '+slug+' link');check(await p.locator('.post-content').isVisible(),label+' '+slug+' body');await p.goto(baseUrl + '/');}
 check(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),label+' no horizontal overflow');check(errors.length===0,label+' no JS errors');await c.close();
}
const c=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const p=await c.newPage();await p.goto(baseUrl + '/');await p.locator('button[data-style="minimal"]').tap();await p.locator('.style-overlay').waitFor({state:'hidden'});await p.locator('.article-menu-trigger').tap();check(await p.locator('#article-menu-links').isVisible(),'touch opens');await p.locator('.hero .meaning').tap();check(await p.locator('#article-menu-links').isHidden(),'touch outside closes');await c.close();
} finally {fs.writeFileSync(dir+'/results.txt',results.join('\n')+'\n');await browser.close();}
console.log(results.join('\n'));
