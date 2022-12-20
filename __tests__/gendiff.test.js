import path from 'path';
import fs from 'fs';
import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';

import gendiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');
const correct = readFixture('expected1.txt');

test('difference', () => {
  expect(gendiff('__fixtures__/file1.json', '__fixtures__/file2.json')).toBe(correct);
  // expect(gendiff('__fixtures__/file1.yml', '__fixtures__/file2.yml')).toBe(correct);
});
