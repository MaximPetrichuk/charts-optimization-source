import { get } from 'lodash';

import {
  EQUAL_XY_VALUES_AMOUNT_EXPECTED,
  INVALID_LEVEL_TYPE,
  INVALID_MIN_MAX_RANGE,
  INVALID_TICKS_AMOUNT,
} from 'constants/errors';
import {
  WIND_STATS_ID_PATTERN,
  ALTITUDE_TYPE,
  DEPTH_TYPE,
  STATS_API_UNITS_TO_COMMON_UNITS,
  RAW_DATA_TITLE_PATH,
  VALID_GRID_TICKS_AMOUNT,
  LEGAL_GRID_TICKS,
} from 'constants/graphs';
import { getPrettyNumber } from 'helpers/data';
import { STATS_TEMPLATE_VARIABLE_REGEXP, UNIT_REGEXP } from 'constants/regexp';
import { floatRound, inRange } from 'helpers/common';

/**
 * returns type for levels selector depends on stats id
 * @param statsId
 * @returns {string}
 */
export const getLevelsTypeByStatsId = (statsId) =>
  statsId.substring(0, 3) === WIND_STATS_ID_PATTERN
    ? ALTITUDE_TYPE
    : DEPTH_TYPE;

/**
 * get title addition with current level value based on level type
 * @param { string } levelType
 * @param { number } value
 * @returns { string }
 */
export const getTitleAdditionByLevelType = (levelType, value) => {
  if (![ALTITUDE_TYPE, DEPTH_TYPE].includes(levelType)) {
    throw Error(INVALID_LEVEL_TYPE);
  }
  if (levelType === DEPTH_TYPE && +value === 0) {
    return 'Surface';
  }
  const ucFirstLevelType = `${levelType[0].toUpperCase()}${levelType.slice(1)}`;
  const preparedString = `${ucFirstLevelType} = ${getPrettyNumber(value, 1)} m`;
  return levelType === ALTITUDE_TYPE
    ? `${preparedString} from sea level`
    : preparedString;
};

/**
 * returns prepared units from statistics api
 * @param { string } units
 * @returns { string }
 */
export const getPreparedUnits = (units) =>
  STATS_API_UNITS_TO_COMMON_UNITS[units] || units;

/**
 * returns prepared title (template variables and extra spaces trimmed) from graph data
 * @param rawGraphData
 * @returns { string }
 */
export const getTitleFromRawGraphData = (rawGraphData) => {
  const title = get(rawGraphData, RAW_DATA_TITLE_PATH, '').replace(
    STATS_TEMPLATE_VARIABLE_REGEXP,
    '',
  );
  return title.trim();
};

/**
 * returns path based on given xValues yValues and canvas size
 * x, y domain can be passed to limit calculated values
 * @note x and y values array should have equal sizes
 * @param { number[] } xValues
 * @param { number[] } yValues
 * @param { number } canvasWidth
 * @param { number } canvasHeight
 * @param { number[] } xDomain
 * @param { number[] } yDomain
 * @returns { string }
 */
export const getLinePathByValues = ({
  xValues,
  yValues,
  canvasWidth,
  canvasHeight,
  xDomain = [],
  yDomain = [],
}) => {
  if (xValues.length !== yValues.length) {
    throw Error(EQUAL_XY_VALUES_AMOUNT_EXPECTED);
  }
  const xMin = Number.isFinite(xDomain[0])
    ? xDomain[0]
    : Math.min.apply(null, xValues);
  const xMax = Number.isFinite(xDomain[1])
    ? xDomain[1]
    : Math.max.apply(null, xValues);
  const yMin = Number.isFinite(yDomain[0])
    ? yDomain[0]
    : Math.min.apply(null, yValues);
  const yMax = Number.isFinite(yDomain[1])
    ? yDomain[1]
    : Math.max.apply(null, yValues);

  const xScaleDivision = canvasWidth / (xMax - xMin);
  const yScaleDivision = canvasHeight / (yMax - yMin);
  let path = 'M';

  for (let i = 0; i < xValues.length; i += 1) {
    if (
      xValues[i] < xMin ||
      xValues[i] > xMax ||
      yValues[i] < yMin ||
      yValues[i] > yMax
    ) {
      continue;
    }
    // floatRound - helper для округления при работе с дробными числами
    path += `${floatRound((xValues[i] - xMin) * xScaleDivision, 1)},`;
    path += floatRound(canvasHeight - (yValues[i] - yMin) * yScaleDivision, 1);
    path += 'L';
  }

  return path.slice(0, -1);
};

/**
 * returns appropriate tick precision for given values range
 * @param { number } valuesRange
 * @returns {number}
 */
export const getTickPrecisionByRange = (valuesRange) =>
  ({
    true: 0,
    [valuesRange < 50]: 1,
    [valuesRange < 5]: 2,
  }.true);

/**
 * returns suitable tick formatter by values range
 * @param { number } valuesRange
 * @returns { function }
 */
export const getTickFormatterByValuesRange = (valuesRange) => {
  const precision = getTickPrecisionByRange(valuesRange);

  return precision > 0 ? (tick) => tick.toFixed(precision) : Math.round;
};

/**
 * returns suitable grid tick for given min max values and minimal ticks amount
 * legal ticks: 1, 2, 5, 10 multipled by 10^n (like money denomination: 0.01, 1, 2, 5, 100, 200, ...)
 * @param { number } min - minValue, 0 by default
 * @param { number } max - maxValue
 * @param { number } minTicks - minimum ticks amount
 * @returns { number }
 * @example
 *   in: ({ max: 25, minTicks: 4 })  out: 5
 *   in: ({ max: 1, minTicks: 8 }) out: 0.1
 *   in: ({ max: 800, minTicks: 30 }) out: 20
 *   in: { min: 5, max: 20, minTicks: 4 } out: 2
 */
export const getGridTickByMinMax = ({ min = 0, max, minTicks }) => {
  if (max <= min) {
    throw Error(INVALID_MIN_MAX_RANGE);
  }
  const { min: minTicksValid, max: maxTicksValid } = VALID_GRID_TICKS_AMOUNT;
  if (!inRange(minTicks, minTicksValid, maxTicksValid)) {
    throw Error(INVALID_TICKS_AMOUNT);
  }

  const maxAllowedTick = floatRound((max - min) / minTicks);
  const tenPow = Math.floor(Math.log10(maxAllowedTick));
  const factor = 10 ** tenPow;
  const legalTick = LEGAL_GRID_TICKS.find(
    (tick) => maxAllowedTick >= tick * factor,
  );

  return floatRound(factor * legalTick);
};

/**
 * returns grid ticks collection based on given max value and min ticks amount
 * @note `floatRound` is necessary to avoid float calculations issues
 * @see getGridTickByMinMax method for algorithm details
 * @param { number } min - min value
 * @param { number } max - max
 * @param { number } minTicks - minimal wanted ticks amount (not including min value tick)
 * @param { boolean } valueAsMaxTick - if true, last tick would be max value, otherwise next nearest tick
 * @returns { number[] }
 */
export const getGridTicksByMinMax = ({
  min = 0,
  max,
  minTicks,
  valueAsMaxTick = false,
}) => {
  if (max <= min) {
    throw Error(INVALID_MIN_MAX_RANGE);
  }
  const { min: minTicksValid, max: maxTicksValid } = VALID_GRID_TICKS_AMOUNT;
  if (!inRange(minTicks, minTicksValid, maxTicksValid)) {
    throw Error(INVALID_TICKS_AMOUNT);
  }

  const tick = getGridTickByMinMax({ min, max, minTicks });
  const ticksAmount = Math.ceil(floatRound((max - min) / tick));
  const ticks = Array(ticksAmount)
    .fill(null)
    .reduce(
      (acc, _, index) => {
        acc.push(floatRound(min + (index + 1) * tick));
        return acc;
      },
      [floatRound(min)],
    );

  if (valueAsMaxTick) {
    ticks[ticksAmount] = floatRound(max);
  }

  return ticks;
};

/**
 * returns label part and units part from given axis label
 * @param axisLabel
 * @returns {{label: *, units: *}}
 */
export const getPartsFromAxisLabel = (axisLabel) => {
  const [, label, units] = UNIT_REGEXP.exec(axisLabel) || [];
  return {
    label,
    units,
  };
};
