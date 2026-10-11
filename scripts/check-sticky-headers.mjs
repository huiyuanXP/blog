import assert from 'node:assert/strict';
import fs from 'node:fs';
const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({headless:true, ...(process.env.BROWSER_CHANNEL ? {channel:process.env.BROWSER_CHANNEL} : {})});
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:14327';
const evidence = process.env.EVIDENCE_DIR || '/tmp/blog-sticky-headers';
fs.mkdirSync(evidence,{recursive:true});
try {
 for (const width of [1440,390]) for (const style of ['minimal','expressive']) {
  const context=await browser.newContext({viewport:{width,height:900}});
  await context.addInitScript(style=>{if(window===window.top)localStorage.setItem('blog-style',JSON.stringify({style}))},style);
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/posts/next-token-agent-harness/');
  await page.locator('#skills').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>{const h=document.querySelector('#site-surface > header').getBoundingClientRect();const n=document.querySelector('.harness-article > nav').getBoundingClientRect();return Math.abs(h.top)<1 && Math.abs(n.top-h.bottom)<2});
  assert.equal(await page.locator('.harness-article #theme').count(),0);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:`${evidence}/${style}-${width}.png`});
  await page.locator('.harness-article > nav a[href="#harness"]').click();
  await page.waitForFunction(()=>{const n=document.querySelector('.harness-article > nav').getBoundingClientRect();const s=document.querySelector('#harness').getBoundingClientRect();return s.top>=n.bottom-2 && s.top<n.bottom+80});
  assert.deepEqual(errors,[]);
  await page.goto(base+'/posts/agent-swarm/');
  await page.evaluate(()=>scrollTo(0,600));
  assert.ok(await page.locator('#site-surface > header').evaluate(e=>Math.abs(e.getBoundingClientRect().top)<1));
  await context.close();
 }
 console.log('PASS: both themes, desktop/mobile stacked headers, anchors, ordinary article header, no overflow or page errors');
} finally {await browser.close()}
