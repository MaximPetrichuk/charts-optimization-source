import { min, max, range, reduce, get, pick, floor } from 'lodash';

import {
  VALUES_KEY,
  RAW_DATA_GRAPH_PARAMS_PATH,
  APD_GRAPH_VALUABLE_PARAMS,
  APD_GRAPH_EXTRA_PARAMS,
  APD_GRAPH_TOOLTIP_TITLE_PATH,
} from 'constants/graphs';
import { INVALID_GRAPH_DATA } from 'constants/errors';
import { camelizeBoth } from 'helpers/camelizer';
import { getPrettyNumber } from 'helpers/data';
import {
  getLevelsTypeByStatsId,
  getPreparedUnits,
  getTitleAdditionByLevelType,
  getTitleFromRawGraphData,
} from 'helpers/graphs/common';

export const getPreparedGraphData = (
  graphData,
  yTickStep,
  currentLevel = 0,
) => {
  const rawGraphParams = get(graphData, RAW_DATA_GRAPH_PARAMS_PATH, null);
  if (!rawGraphParams) {
    throw Error(INVALID_GRAPH_DATA);
  }

  const { yName, xName } = camelizeBoth(
    pick(rawGraphParams, APD_GRAPH_VALUABLE_PARAMS),
  );
  const xValues = graphData[xName][VALUES_KEY][currentLevel];
  const yValues = graphData[yName][VALUES_KEY][currentLevel];
  const data = xValues.map((item, idx) => ({
    gx: item,
    gy: yValues[idx],
    idx,
  }));
  const [maxYValue, minYValue] = [max(yValues), min(yValues)];
  const yTicks = range(floor(minYValue), maxYValue, yTickStep);
  const extraParams = reduce(
    APD_GRAPH_EXTRA_PARAMS,
    (result, item) => {
      const value = graphData[item.param][VALUES_KEY][currentLevel][0];
      result.push({
        title: item.title,
        value: Number.isFinite(value) ? getPrettyNumber(value) : value,
        key: item.param,
      });
      return result;
    },
    [],
  );
  const { ylabel, xlabel } = rawGraphParams;
  return [data, yTicks, extraParams, maxYValue, ylabel, xlabel];
};

/**
 * returns prepared APD graph extra params by graph data
 * @param { object } rawGraphData
 * @param { number|null } levelIndex
 * @returns { array }
 */
const getPreparedApdExtraParams = (rawGraphData, levelIndex = null) =>
  APD_GRAPH_EXTRA_PARAMS.reduce((acc, { param, title }) => {
    if (!rawGraphData[param]) {
      return acc;
    }
    const paramPath =
      levelIndex !== null
        ? [param, VALUES_KEY, levelIndex, 0]
        : [param, VALUES_KEY, 0];
    const value = get(rawGraphData, paramPath, '');
    acc.push({
      name: title,
      key: param,
      value: !Number.isNaN(+value) ? getPrettyNumber(value) : value,
    });
    return acc;
  }, []);

/**
 * returns prepared AnalyticalProbabilityDistribution graph data
 * if there's no levels in graph data return object
 * if there's levels, returns an array where item is graphData for some level
 * (e.g. 0 index item is data for levels[0] level and so on)
 * @param rawGraphData
 * @returns {{
      data: array,
      extraParams: array,
      minYValue: number,
      maxYValue: number,,
      ylabel: string,
      xlabel: string,
      xUnits: string,
      levels: array,
      tooltipTitle: string,
    }} or array of such objects
 */
export const getPreparedAnalyticalProbabilityGraphData = (rawGraphData) => {
  const rawGraphParams = get(rawGraphData, RAW_DATA_GRAPH_PARAMS_PATH, null);
  if (!rawGraphParams) {
    throw Error(INVALID_GRAPH_DATA);
  }

  const { yName, xName } = camelizeBoth(
    pick(rawGraphParams, APD_GRAPH_VALUABLE_PARAMS),
  );

  const xValuesParams = rawGraphData[xName];
  const yValuesParams = rawGraphData[yName];
  const { ylabel: yLabel, xlabel: xLabel } = rawGraphParams;
  const xUnits = getPreparedUnits(xValuesParams.attributes.units);
  const tooltipTitle = get(rawGraphData, APD_GRAPH_TOOLTIP_TITLE_PATH, '');
  const title = getTitleFromRawGraphData(rawGraphData);
  const levels =
    rawGraphData.level && rawGraphData.level[VALUES_KEY]
      ? {
          type: getLevelsTypeByStatsId(rawGraphData.id),
          values: rawGraphData.level[VALUES_KEY],
        }
      : {};
  const hasLevels = !!Object.keys(levels).length;

  if (!hasLevels) {
    const extraParams = getPreparedApdExtraParams(rawGraphData);
    const xValues = xValuesParams[VALUES_KEY];
    const yValues = yValuesParams[VALUES_KEY];
    const maxYValue = Math.max(...yValues);
    const minYValue = Math.min(...yValues);
    const data = xValues.map((item, index) => ({
      xValue: getPrettyNumber(item),
      yValue: getPrettyNumber(yValues[index]),
    }));

    return {
      data,
      title,
      extraParams,
      minYValue,
      maxYValue,
      yLabel,
      xLabel,
      xUnits,
      levels,
      tooltipTitle,
    };
  }

  const xValuesByLevel = xValuesParams[VALUES_KEY];
  const yValuesByLevel = yValuesParams[VALUES_KEY];

  return xValuesByLevel.reduce((acc, xValues, levelIndex) => {
    const levelTitleAddition = getTitleAdditionByLevelType(
      levels.type,
      levels.values[levelIndex],
    );
    const preparedTitle = `${title}\n${levelTitleAddition}`;
    const extraParams = getPreparedApdExtraParams(rawGraphData, levelIndex);
    const yValues = yValuesByLevel[levelIndex];
    const maxYValue = Math.max(...yValues);
    const minYValue = Math.min(...yValues);
    const data = xValues.map((item, index) => ({
      xValue: getPrettyNumber(item),
      yValue: getPrettyNumber(yValues[index]),
    }));

    acc.push({
      data,
      title: preparedTitle,
      extraParams,
      minYValue,
      maxYValue,
      yLabel,
      xLabel,
      xUnits,
      levels,
      tooltipTitle,
    });

    return acc;
  }, []);
};
