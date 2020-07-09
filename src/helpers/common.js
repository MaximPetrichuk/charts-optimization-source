/**
 * Get [min, max] array from two given numbers
 * @param { number } a
 * @param { number } b
 * @returns { array }
 */
import { IS_NOT_NUMBER } from 'constants/errors';

export const getMinMax = (a, b) => (a < b ? [a, b] : [b, a]);

/**
 * tests value to be in range from a to b
 * @param {number} value
 * @param {number} start
 * @param {number} end
 */
export const inRange = (value, start, end) => start <= value && value <= end;

export const isNullOrUndefined = (value) =>
  value === null || typeof value === 'undefined';

/**
 * returns function build from given sequence. Each call will return next sequence value.
 * after last value, 1 value will be returned again and so on
 * @param { array } sequence
 * @returns {function(): *}
 * @example
 *   const seqNext = cyclicSequenceGenerator([1,2,3])
 *   seqNext() // 1
 *   seqNext() // 2
 */
export const cyclicSequence = (sequence) => {
  if (!Array.isArray(sequence)) {
    throw Error('array expected');
  }

  const generator = (function* recursiveGenerator() {
    yield* sequence;
    return yield* recursiveGenerator();
  })();

  return () => generator.next().value;
};

/**
 * returns ascending range object from given range limits in any order
 * @param { number } a - one range limit
 * @param { number } b - other range limit
 * @returns {{ start: number, end: number }}
 */
export const getAscendingRange = (a, b) =>
  a <= b ? { start: a, end: b } : { start: b, end: a };

/**
 * rounds given float value. By default precision is 4 digits after comma
 * it's enough in most cases
 * @param value
 * @param precision
 * @returns { number }
 */
export const floatRound = (value, precision = 4) => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

/**
 * returns index of closest to needle element in array
 * @note performance is better if given array is sorted, in this case pass isSorted: true
 * (binary search principle is used)
 * @param { array } array
 * @param { number } needle
 * @param { boolean } isSorted
 * @returns { number }
 * @note uses binary search to increase performance
 */
export function findClosestIndex({
  array: initialArray,
  needle,
  isSorted = false,
}) {
  if (!Number.isFinite(needle)) {
    throw Error(IS_NOT_NUMBER);
  }
  let start = 0;
  let end = initialArray.length - 1;
  let middle;
  let closestIndex;
  const array = isSorted
    ? initialArray
    : initialArray.slice(0).sort((a, b) => a - b);

  if (needle <= array[start]) {
    closestIndex = start;
  } else if (needle >= array[end]) {
    closestIndex = end;
  } else {
    closestIndex =
      Math.abs(array[start] - needle) < Math.abs(array[end] - needle)
        ? start
        : end;

    while (end > start + 1) {
      middle = ~~((start + end) / 2);
      if (array[middle] === needle) {
        closestIndex = middle;
        break;
      }
      closestIndex =
        Math.abs(array[middle] - needle) <
        Math.abs(array[closestIndex] - needle)
          ? middle
          : closestIndex;
      if (needle > array[middle]) {
        start = middle;
        continue;
      }
      end = middle;
    }
  }

  if (isSorted) {
    return closestIndex;
  }

  for (let i = 0; i < initialArray.length; i += 1) {
    if (initialArray[i] === array[closestIndex]) {
      return i;
    }
  }
}

/**
 * returns array without given value, check is ===
 * @param array
 * @param needle
 * @returns {[]}
 */
export function arrayExclude(array, needle) {
  const result = [];
  for (let i = 0; i < array.length; i += 1) {
    if (array[i] === needle) {
      continue;
    }
    result.push(array[i]);
  }

  return result;
}
