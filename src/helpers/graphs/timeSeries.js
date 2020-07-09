import { get, pick } from 'lodash';

import {
  TS_GRAPH_VALUABLE_PARAMS,
  RAW_DATA_GRAPH_PARAMS_PATH,
  VALUES_KEY,
  MIN_CTS_GRAPH_TICKS_AMOUNT,
  MIN_TS_GRAPH_TICKS_AMOUNT,
  GRAPH_EMPTY_PLACEHOLDER,
  CTS_GRAPH_VALUABLE_PARAMS,
} from 'constants/graphs';
import { INVALID_GRAPH_DATA } from 'constants/errors';
import { toCamelCase } from 'helpers/camelizer';
import { DATE_FORMATS, EOL, TIMESTAMPS } from 'constants/common';
import { arrayExclude } from 'helpers/common';

import {
  getGridTicksByMinMax,
  getLevelsTypeByStatsId,
  getPartsFromAxisLabel,
  getPreparedUnits,
  getTitleAdditionByLevelType,
  getTitleFromRawGraphData,
} from './common';

/**
 * returns prepared timeSeries graph data
 * @param rawGraphData
 * @returns {{
 *   yTooltipLabel: string,
 *   levels: { values: [], type: string } | {}
 *   data: Array<{
 *     title: string,
 *     xValues: number[],
 *     yValues: number[],
 *     yDomain: number[],
 *     yTicks: number[],
 *     xMin: number,
 *     xMax: number,
 *     graphData: Array<{x, y}>,
 *   }>,
 *   units: string,
 *   yLabel: string,
 * }}
 */
export const getPreparedTimeSeriesData = (rawGraphData) => {
  const rawGraphParams = get(rawGraphData, RAW_DATA_GRAPH_PARAMS_PATH, null);
  if (!rawGraphParams) {
    throw Error(INVALID_GRAPH_DATA);
  }

  const {
    yNames: [yNameRaw],
    xName: xNameRaw,
    ylabel: yLabel,
    ymin: yMinFromParams,
    ymax: yMaxFromParams,
  } = pick(rawGraphParams, TS_GRAPH_VALUABLE_PARAMS);

  const title = getTitleFromRawGraphData(rawGraphData);
  const levels =
    rawGraphData.level && rawGraphData.level[VALUES_KEY]
      ? {
          type: getLevelsTypeByStatsId(rawGraphData.id),
          values: rawGraphData.level[VALUES_KEY],
        }
      : {};

  const hasLevels = !!Object.keys(levels).length;
  const [xName, yName] = [toCamelCase(xNameRaw), toCamelCase(yNameRaw)];
  const yValuesByLevels = rawGraphData[yName][VALUES_KEY];
  const xValuesByLevels = rawGraphData[xName][VALUES_KEY];
  const yTicksFromParams =
    yMaxFromParams && yMinFromParams
      ? getGridTicksByMinMax({
          min: yMinFromParams,
          max: yMaxFromParams,
          minTicks: MIN_TS_GRAPH_TICKS_AMOUNT,
          valueAsMaxTick: true,
        })
      : null;
  const { label: yTooltipLabel, units: yRawUnits } = getPartsFromAxisLabel(
    yLabel,
  );
  const units = getPreparedUnits(yRawUnits);
  const data = xValuesByLevels.reduce((acc, unixDays, levelIndex) => {
    const preparedTitle = hasLevels
      ? `${title + EOL}${getTitleAdditionByLevelType(
          levels.type,
          levels.values[levelIndex],
        )}`
      : title;
    const graphData = [];
    const xValues = [];
    const yValues = [];

    for (let i = 0; i < unixDays.length; i += 1) {
      const y = yValuesByLevels[levelIndex][i];
      if (y === GRAPH_EMPTY_PLACEHOLDER) {
        continue;
      }
      const timestamp = unixDays[i] * 24 * 3600;
      graphData.push({ y, x: timestamp });
      xValues.push(timestamp);
      yValues.push(y);
    }
    const yMax = yMaxFromParams || Math.max.apply(null, yValues);
    const yMin = yMinFromParams || Math.min.apply(null, yValues);
    const yTicks =
      yTicksFromParams ||
      getGridTicksByMinMax({
        min: yMin,
        max: yMax,
        minTicks: MIN_TS_GRAPH_TICKS_AMOUNT,
      });

    acc.push({
      graphData,
      xValues,
      yValues,
      yTicks,
      yDomain: [yMin, yTicks[yTicks.length - 1]],
      xMin: xValues[0],
      xMax: xValues[xValues.length - 1],
      title: preparedTitle,
    });

    return acc;
  }, []);

  return {
    data,
    units,
    levels,
    yLabel,
    yTooltipLabel,
  };
};

/**
 * returns prepared concomitant time series graph data
 * @param rawGraphData
 * @returns {{
 *   title: string,
 *   xValues: number[],
 *   xMin: number,
 *   xMax: number,
 *   yValues: number[],
 *   yDomains: number[],
 *   yTicks: number[],
 *   yUnits: string[],
 *   yLabels: string,
 *   selectOptions: string[],
 *   tooltipLabels: string[],
 * }}
 */
export const getPreparedConcomitantTimeSeriesData = (rawGraphData) => {
  const rawGraphParams = get(rawGraphData, RAW_DATA_GRAPH_PARAMS_PATH, null);
  if (!rawGraphParams) {
    throw Error(INVALID_GRAPH_DATA);
  }

  const { yNames: yNamesRaw, xName: xNameRaw } = pick(
    rawGraphParams,
    CTS_GRAPH_VALUABLE_PARAMS,
  );
  const { variables, names: yNamesFromVariables } = rawGraphData.variables;
  if (yNamesFromVariables.length !== yNamesRaw.length) {
    throw Error(INVALID_GRAPH_DATA);
  }

  const xName = toCamelCase(xNameRaw);
  const title = getTitleFromRawGraphData(rawGraphData);
  const xValuesRaw = rawGraphData[xName][VALUES_KEY][0];

  const xValues = [];
  for (let i = 0; i < xValuesRaw.length; i += 1) {
    if (xValuesRaw[i] === GRAPH_EMPTY_PLACEHOLDER) {
      continue;
    }
    const timestamp = xValuesRaw[i] * 24 * 3600;
    xValues.push(timestamp);
  }

  const {
    yTicks,
    yValues,
    yDomains,
    selectOptions,
    tooltipLabels,
    yLabels,
    yUnits,
  } = variables.reduce(
    (acc, { units: rawUnits, name: rawName, longName }) => {
      const name = toCamelCase(rawName);
      const units = getPreparedUnits(rawUnits);
      const values = arrayExclude(
        rawGraphData[name][VALUES_KEY][0],
        GRAPH_EMPTY_PLACEHOLDER,
      );
      const yMin = Math.min.apply(null, values);
      const yMax = Math.max.apply(null, values);
      const domain = [yMin, yMax];
      const ticks = getGridTicksByMinMax({
        min: yMin,
        max: yMax,
        minTicks: MIN_CTS_GRAPH_TICKS_AMOUNT,
      });

      acc.yTicks.push(ticks);
      acc.yValues.push(values);
      acc.yDomains.push(domain);
      acc.selectOptions.push(longName);
      acc.yLabels.push(`${longName} [${rawUnits}]`);
      acc.tooltipLabels.push(longName);
      acc.yUnits.push(units);

      return acc;
    },
    {
      yTicks: [],
      yUnits: [],
      yLabels: [],
      yValues: [],
      yDomains: [],
      selectOptions: [],
      tooltipLabels: [],
    },
  );

  return {
    title,
    xValues,
    yValues,
    yTicks,
    yDomains,
    selectOptions,
    tooltipLabels,
    xMin: xValues[0],
    xMax: xValues[xValues.length - 1],
    yLabels,
    yUnits,
  };
};

/**
 * returns X axis (time) options for time series charts by given axis range
 * options supposed to make ticks more readable and fit current scale
 * @param timestampRange
 * @see https://recharts.org/en-US/api/XAxis
 * @returns {{
 *  dateFormat: string,
 *  tickOptions: Object,
 * }}
 */
export const getXAxisOptionsByTimestampRange = (timestampRange) => {
  switch (true) {
    case timestampRange < TIMESTAMPS.day * 10:
      return {
        dateFormat: DATE_FORMATS.ymdhmFormat,
        tickOptions: {
          angle: -25,
          fontSize: 10,
          dy: 10,
          dx: -10,
        },
      };
    case timestampRange < TIMESTAMPS.year:
      return {
        dateFormat: DATE_FORMATS.ymdFormat,
        tickOptions: {
          angle: -25,
          fontSize: 11,
          dy: 10,
          dx: -5,
        },
      };
    case timestampRange < TIMESTAMPS.year * 10:
      return {
        dateFormat: DATE_FORMATS.ymFormat,
        tickOptions: {
          angle: -25,
          fontSize: 12,
          dy: 5,
          dx: -5,
        },
      };
    default:
      return {
        dateFormat: DATE_FORMATS.yFormat,
        tickOptions: { angle: -25, fontSize: 12 },
      };
  }
};
