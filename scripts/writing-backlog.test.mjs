import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const requestedTitles = [
  '善用 dot，睡前聊一聊把脑袋清空',
  '使用网页版的 Codex 的技巧',
  'No means no。不要让 agent 说不要',
  '变废为宝，用家里闲置的机器养龙虾',
  '眼耳鼻舌身意——Agent 与人交互的未来',
  '色声香味触法——Agent 理解世界的未来',
  '把时间留给自己——Agent 时代给自己放个假',
  'Everything is prompt',
  'Code is cheap, show me your prompt——Agent 时代的新范式',
  '大模型是最高压缩比的压缩方式',
  '我眼中的 LLM 简史',
  '脑袋空空，人很轻松',
  '千万不要给网页版太高权限——记我的一次 Agent 安全事件',
];
const records = [];
for (const file of await readdir(new URL('src/content/posts/', root))) {
  if (!file.endsWith('.md')) continue;
  const source = await readFile(new URL(`src/content/posts/${file}`, root), 'utf8');
  if (!/^placeholder: true$/m.test(source)) continue;
  const [, frontmatter, body] = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  const data = Object.fromEntries(frontmatter.split('\n').map(line => {
    const divider = line.indexOf(':');
    return [line.slice(0, divider), JSON.parse(line.slice(divider + 1).trim())];
  }));
  records.push({id:file.slice(0,-3), data, body});
}
records.sort((a,b) => a.data.order - b.data.order);
const home = await readFile(new URL('dist/index.html', root), 'utf8');

test('all 13 original titles exist once in source, with no body, summary or date', () => {
  assert.deepEqual(records.map(record => record.data.title), requestedTitles);
  assert.equal(new Set(records.map(record => record.id)).size, 13);
  records.forEach(({data,body}) => {
    assert.equal(body.trim(), '');
    assert.equal(data.date, undefined);
    assert.equal(data.description, undefined);
    assert.equal(data.descriptionEn, undefined);
    assert.equal(data.topicConfirmed, false);
  });
});

test('all six topics stay ordered, provisional and correctly populated', () => {
  const groups = [...home.matchAll(/data-topic="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(groups, ['times','agents','graduate','leadership','undergraduate','notes']);
  assert.deepEqual(groups.map(group => records.filter(record => record.data.topic === group).length), [5,6,0,0,0,2]);
  for (const group of ['graduate','leadership','undergraduate']) {
    const section = home.match(new RegExp(`data-topic="${group}"[^>]*>([\\s\\S]*?)<\\/section>`))?.[1];
    assert.ok(section.includes('暂无待写文章') && section.includes('No planned articles yet'));
    assert.ok(!section.includes('data-planned-id'));
  }
});

test('Toolkit references only the confirmed Codex record, with the same title and planned status', () => {
  const selected = records.filter(record => record.data.toolkit === 'codex');
  assert.deepEqual(selected.map(record => record.data.order), [2]);
  const toolkit = home.match(/<section id="toolkit"[\s\S]*?<\/section>/)?.[0];
  const ids = [...toolkit.matchAll(/data-planned-id="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(ids, ['codex-web-tips']);
  assert.ok(toolkit.includes(selected[0].data.title));
  assert.ok(toolkit.includes('待写') && toolkit.includes('Planned'));
  records.forEach(record => assert.ok(!home.includes(`href="/posts/${record.id}/"`)));
});
