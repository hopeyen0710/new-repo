import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const root = new URL('../', import.meta.url);

test('static game entry and styles exist', async () => {
  for (const file of ['index.html', 'styles.css', 'src/game.js']) {
    assert.ok(existsSync(new URL(file, root)), `${file} should exist`);
  }
});

test('game initializes a bounded three.js island and first-person controls', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');
  const game = await readFile(new URL('src/game.js', root), 'utf8');
  assert.match(html, /type=["']module["']/);
  assert.match(game, /PerspectiveCamera/);
  assert.match(game, /PointerLockControls/);
  assert.match(game, /WebGLRenderer/);
  assert.match(game, /ISLAND_SIZE/);
  assert.match(game, /jump/i);
  assert.match(game, /NearestFilter/);
});
