import { resolve, extname } from 'path';
import { readFileSync } from 'fs';
import _ from 'lodash';
import parsers from './parse.js';
//import format from './formatters/index.js';

const getFormat = (filepath) => extname(filepath).slice(1);

const getFixturePath = (filepath) => resolve(process.cwd(), filepath);

const readFile = (filepath) => readFileSync(getFixturePath(filepath, 'utf-8'));

const getDiffInformation = (data1, data2) => {
  const keys1 = Object.keys(data1);
  const keys2 = Object.keys(data2);

  const keys = _.sortBy(_.union(keys1, keys2));

  const result = keys.map((key) => {
    const value1 = data1[key];
    const value2 = data2[key];
    if (_.isEqual(value1, value2)) {
      return {
        type: 'unchanges',
        key,
        value: value1,
      };
    }
    if (value1 && value2 && value1 !== value2) {
      return {
        type: 'changed',
        key,
        value1,
        value2,
      };
    }
    if (!Object.hasOwn(data2, key)) {
      return {
        type: 'delited',
        key,
        value: value1,
      };
    }
    if (!Object.hasOwn(data1, key)) {
      return {
        type: 'added',
        key,
        value: value2,
      };
    }
    return {
      type: 'unchanged',
      key,
      value: value1,
    };
  });
  return result;
};

const genDiff = (filepath1, filepath2) => {
  const readFile1 = readFile(filepath1);
  const readFile2 = readFile(filepath2);

  const informationDiff = getDiffInformation(
    parsers(readFile1, getFormat(filepath1)),
    parsers(readFile2, getFormat(filepath2)),
  );
  // console.log(informationDiff);
  const result = informationDiff.map((diff) => {
    const typeDiff = diff.type;
    switch (typeDiff) {
      case 'delited':
        return `  - ${diff.key}: ${diff.value}`;
      case 'unchanges':
        return `    ${diff.key}: ${diff.value}`;
      case 'changed':
        return `  - ${diff.key}: ${diff.value1} \n  + ${diff.key}: ${diff.value2}`;
      case 'added':
        return `  + ${diff.key}: ${diff.value}`;
      default:
        return null;
    }
  });
  // console.log(`{\n${result.join('\n')}\n}`);
  return `{\n${result.join('\n')}\n}`;
};
export default genDiff;
