import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeElements, matchesElement } from '../src/lib/elements.mjs';
import { groupTierCharacters } from '../src/lib/tier-search.mjs';
import { splitDescription } from '../src/lib/description-tokens.mjs';

test('description highlights whole element words without corrupting Device or voice', () => {
  const text = 'Blocker Device has a voice. Frost/Volt damage: 75% [Cooldown] 45s.';
  const parts = splitDescription(text);
  assert.equal(parts.join(''), text);
  assert.equal(parts.includes('ice'), false);
  assert.ok(parts.includes('Frost'));
  assert.ok(parts.includes('Volt'));
  assert.ok(parts.includes('75%'));
  assert.ok(parts.includes('[Cooldown]'));
});

test('simple elements, Frost alias and case/whitespace are canonicalized', () => {
  assert.deepEqual(normalizeElements(' frost '), ['Ice']);
  for (const element of ['Ice', 'Volt', 'Flame', 'Physical', 'Altered']) {
    assert.deepEqual(normalizeElements(element.toLowerCase()), [element]);
  }
});

test('real hybrid representations match either element, never unrelated elements', () => {
  for (const value of ['Frost/Volt', 'Ice-Volt', 'Volt-Ice', ' frost / volt ', 'Frost - Volt']) {
    assert.equal(matchesElement(value, 'Ice'), true, value);
    assert.equal(matchesElement(value, 'Frost'), true, value);
    assert.equal(matchesElement(value, 'Volt'), true, value);
    assert.equal(matchesElement(value, 'Flame'), false, value);
  }
  for (const value of ['Flame-Physical', 'Physical/Flame']) {
    assert.equal(matchesElement(value, 'Physical'), true);
    assert.equal(matchesElement(value, 'Flame'), true);
    assert.equal(matchesElement(value, 'Volt'), false);
  }
});

test('missing/unknown values do not invent an Altered affinity', () => {
  for (const value of [null, undefined, '', {}, 'Unknown', 'Frostbite']) {
    assert.deepEqual(normalizeElements(value), []);
    assert.equal(matchesElement(value, 'Altered'), false);
    assert.equal(matchesElement(value, 'All'), true);
  }
  assert.deepEqual(normalizeElements(['Frost', 'Volt', 'Ice']), ['Ice', 'Volt']);
});

const characters = [
  { id: 'helene', simulacrumName: 'Helene' },
  { id: 'gray-fox', simulacrumName: 'Gray Fox' },
  { id: 'other', simulacrumName: 'Other' },
];
test('tier search trims, ignores case and preserves unranked matches without changing rankings', () => {
  const config = { helene: 'S+', 'gray-fox': 'S' };
  const found = groupTierCharacters(characters, config, '  HeLeNe  ');
  assert.deepEqual(found['S+'], [characters[0]]);
  assert.equal(Object.values(found).flat().length, 1);
  assert.deepEqual(groupTierCharacters(characters, config, 'other').Unranked, [characters[2]]);
  assert.equal(Object.values(groupTierCharacters(characters, config, 'absent')).flat().length, 0);
  assert.equal(Object.values(groupTierCharacters(characters, config, '  ')).flat().length, 3);
});
