import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const files = (await readdir(new URL('src/content/posts/', root))).filter(name => name.endsWith('.md'));
const home = await readFile(new URL('dist/index.html', root), 'utf8');

test('every Markdown record has a homepage reference and its own built page', async () => {
  for (const file of files) {
    const slug = file.slice(0, -3);
    const source = await readFile(new URL(`src/content/posts/${file}`, root), 'utf8');
    const page = await readFile(new URL(`dist/posts/${slug}/index.html`, root), 'utf8');
    const title = source.match(/^title:\s*['"]?(.*?)['"]?$/m)?.[1];
    assert.ok(title && page.includes(title), `${slug}: title missing`);
    if (/^placeholder: true$/m.test(source)) {
      assert.ok(home.includes(`data-planned-id="${slug}"`), `${slug}: planned entry missing`);
      assert.ok(!home.includes(`href="/posts/${slug}/"`), `${slug}: unpublished article has a reading link`);
      assert.ok(page.includes('待写') && page.includes('Planned'), `${slug}: bilingual planned status missing`);
      assert.ok(!/^date:|^description(?:En)?:/m.test(source), `${slug}: invented date or summary`);
    } else {
      assert.ok(home.includes(`href="/posts/${slug}/"`), `${slug}: published entry missing`);
    }
  }
});

test('Hello World is removed from source, homepage and generated routes', async () => {
  assert.ok(!files.includes('hello-world.md'));
  assert.ok(!home.includes('/posts/hello-world/'));
  await assert.rejects(access(new URL('dist/posts/hello-world/index.html', root)));
});

test('Blog groups published dates in descending order and featured entries from Markdown', async () => {
  const timeline = home.match(/data-blog-view="timeline"[^>]*>([\s\S]*?)<\/details>/)?.[1];
  const featured = home.match(/data-blog-view="featured"[^>]*>([\s\S]*?)<\/details>/)?.[1];
  assert.ok(timeline && featured, 'both Blog columns must be present');
  const dates = [...timeline.matchAll(/datetime="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(dates, [...dates].sort().reverse());
  const selected = [];
  for (const file of files) {
    const source = await readFile(new URL(`src/content/posts/${file}`, root), 'utf8');
    if (/^featured: true$/m.test(source) && !/^placeholder: true$/m.test(source)) selected.push(file.slice(0, -3));
  }
  const links = [...featured.matchAll(/href="\/posts\/([^/]+)\/"/g)].map(match => match[1]);
  assert.deepEqual(links.sort(), selected.sort());
  assert.ok(!home.includes('hero-rule') && !home.includes('EXPLORE BELOW'));
});

test('every article guides readers back to Blog and selects the Blog navigation', async () => {
  for (const file of files) {
    const page = await readFile(new URL(`dist/posts/${file.slice(0, -3)}/index.html`, root), 'utf8');
    assert.ok(page.includes('href="/#blog" class="back-link"'), `${file}: back link misses Blog`);
    assert.ok(page.includes('href="/#blog" class="article-return"'), `${file}: end link misses Blog`);
    assert.ok(page.includes('href="/#blog" aria-current="page"'), `${file}: Blog navigation is not selected`);
  }
});
