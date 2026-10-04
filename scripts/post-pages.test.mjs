import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const files = (await readdir(new URL('src/content/posts/', root))).filter(name => name.endsWith('.md'));
const home = await readFile(new URL('dist/index.html', root), 'utf8');

test('every Markdown post has a homepage link and its own built page', async () => {
  for (const file of files) {
    const slug = file.slice(0, -3);
    assert.ok(home.includes(`href="/posts/${slug}/"`), `${slug}: homepage entry missing`);
    const source = await readFile(new URL(`src/content/posts/${file}`, root), 'utf8');
    const page = await readFile(new URL(`dist/posts/${slug}/index.html`, root), 'utf8');
    const title = source.match(/^title:\s*['"]?(.*?)['"]?$/m)?.[1];
    assert.ok(title && page.includes(title), `${slug}: title missing`);
    if (/^placeholder: true$/m.test(source)) {
      assert.ok(page.includes('内容待补充') && page.includes('Content coming soon'), `${slug}: bilingual placeholder missing`);
      assert.ok(!page.includes('2026/10/05'), `${slug}: creation date shown as publication date`);
    }
  }
});

test('Hello World is removed from source, homepage and generated routes', async () => {
  assert.ok(!files.includes('hello-world.md'));
  assert.ok(!home.includes('/posts/hello-world/'));
  await assert.rejects(access(new URL('dist/posts/hello-world/index.html', root)));
});
