import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import {
  APD_HINT_BY_MODE,
  DEFAULT_AXIS_INDEX,
  SELECT_MODE,
  SELECT_RANGE_MODE,
  SELECTED_RANGE_MODE,
} from 'constants/graphs';
import { useRangeSelect } from 'hooks/useRangeSelect';
import { getAscendingRange, inRange } from 'helpers/common';
import { getPrettyNumber } from 'helpers/data';
import { palette } from 'theme';

import SvgTooltip from '../SvgTooltip';

const LIMITS_OFFSET = 5;
const BAND_FILL = palette.blue.main;
const BAND_STROKE = palette.lightGrey.main;

/**
 * returns range text for tooltip
 * @param from
 * @param to
 * @param units
 * @returns {string}
 */
const getRangeTextForTooltip = ({ from, to, units }) =>
  to
    ? `[${getPrettyNumber(from)}${units} - ${getPrettyNumber(to)}${units}]`
    : `>= ${getPrettyNumber(from)}${units}`;

/**
 * returns occurrence value by range. (sum of range occurrences)
 * @param { number } start - start range index
 * @param { number } end - end range index
 * @param { [{ yValue: number }, ...] } data - graph data collection
 * @returns { number }
 */
const getOccurrenceByRange = ({ start, end, data }) => {
  if (start !== null && start === end) {
    return data[start].yValue;
  }
  let occurence = 0;
  for (let index = start; index <= end; index += 1) {
    const item = data[index];
    occurence += item ? item.yValue : 0;
  }

  return getPrettyNumber(occurence);
};

/**
 * Customized bar chart with range selection. Uses own svg tooltip
 * Created to avoid extra rerendering (Grid, Axises and chart rerender seems to be very expensive)
 * @param { object } classes
 * @param {{ xAxisId: { width, x } }} xAxisMap - x axis parameters
 * @param { [{ height, niceTicks, padding }] } yAxisMap - y axis parameters
 * @param { array } orderedTooltipTicks - x tick coordinates provided by recharts
 * @param { number } tooltipAxisBandSize - bar band width
 * @param { React.ElementRef } graphContainer - graph element ref, helps to count relative x, y
 * @param { string } tooltipTitle - title for tooltip
 * @param { object } margin - graph margin
 * @param { string } xUnits - x asis units
 * @param { array } data - graph data collection
 * @returns { JSX }
 */
const BarChartWithRangeSelection = ({
  classes,
  xAxisMap,
  yAxisMap,
  orderedTooltipTicks,
  tooltipAxisBandSize,
  graphContainer,
  tooltipTitle,
  margin,
  xUnits,
  data,
}) => {
  const [tooltipY, setTooltipY] = useState(null);

  const updateTooltipY = useCallback(
    (event, mode) => {
      if (mode !== SELECT_MODE) {
        return;
      }
      const { container: graphElement } = graphContainer.current;
      const { y: graphY } = graphElement.getBoundingClientRect();
      setTooltipY(event.clientY - graphY);
    },
    [setTooltipY, graphContainer],
  );

  const {
    handleEnter,
    handleClick,
    handleRangeLeave,
    mode,
    range,
  } = useRangeSelect({
    onEnter: updateTooltipY,
  });

  const {
    fullHeight,
    bandWidth,
    scaleDivision,
    tooltipLimits,
  } = useMemo(() => {
    const {
      height: yAxisHeight,
      niceTicks: yTickValues,
      padding = {},
    } = yAxisMap[DEFAULT_AXIS_INDEX];
    const { width: xAxisWidth, x: xOffset } = xAxisMap[DEFAULT_AXIS_INDEX];
    const yMaxTickHeight = yAxisHeight - (padding.top || 0);
    const yMaxTickValue = yTickValues[yTickValues.length - 1];
    const containerHeight = (margin.top || 0) + yAxisHeight;
    const containerWidth = xOffset + xAxisWidth;

    return {
      fullHeight: containerHeight,
      scaleDivision: yMaxTickHeight / yMaxTickValue,
      bandWidth: Math.floor(tooltipAxisBandSize),
      tooltipLimits: {
        y: containerHeight - LIMITS_OFFSET,
        x: containerWidth - LIMITS_OFFSET,
      },
    };
  }, [xAxisMap, yAxisMap, margin, tooltipAxisBandSize]);

  const isSelectMode = mode === SELECT_MODE;
  const { start, end } = getAscendingRange(range.start, range.end);
  const showTooltip = start !== null && end !== null;

  const { xValue: from } = showTooltip ? data[start] ?? {} : {};
  const { xValue: to } = showTooltip ? data[end + 1] ?? {} : {};
  const occurrence = showTooltip
    ? getOccurrenceByRange({ start, end, data })
    : null;

  const { coordinate: tooltipX } = showTooltip
    ? orderedTooltipTicks[start]
    : {};

  const lines = showTooltip
    ? [
        { text: tooltipTitle, bold: true },
        { text: getRangeTextForTooltip({ from, to, units: xUnits }) },
        { text: `Occurrence: ${getPrettyNumber(occurrence)}%`, bold: true },
        { text: APD_HINT_BY_MODE[mode] },
      ]
    : [];

  return (
    <g>
      <g onMouseLeave={handleRangeLeave}>
        {orderedTooltipTicks.map(({ coordinate }, index) => {
          const x = coordinate;
          const { yValue } = data[index];
          const height = yValue * scaleDivision;
          const indexInRange = !isSelectMode
            ? inRange(index, start, end)
            : false;
          const rectangleClass = classNames(classes.band, {
            [classes.hoverable]: isSelectMode,
            [classes.selectRange]: indexInRange && mode === SELECT_RANGE_MODE,
            [classes.selectedRange]:
              indexInRange && mode === SELECTED_RANGE_MODE,
          });

          return (
            <rect
              x={x}
              y={fullHeight - height}
              fill={BAND_FILL}
              stroke={BAND_STROKE}
              key={x}
              width={bandWidth}
              height={height}
              data-index={index}
              onClick={handleClick}
              onMouseEnter={handleEnter}
              className={rectangleClass}
            />
          );
        })}
      </g>
      {showTooltip && (
        <SvgTooltip
          lines={lines}
          x={tooltipX}
          y={tooltipY}
          widthUpdater={mode}
          limits={tooltipLimits}
        />
      )}
    </g>
  );
};

BarChartWithRangeSelection.propTypes = {
  classes: PropTypes.object,
  xAxisMap: PropTypes.object,
  yAxisMap: PropTypes.object,
  orderedTooltipTicks: PropTypes.array,
  tooltipAxisBandSize: PropTypes.number,
  graphContainer: PropTypes.shape({ current: PropTypes.any }),
  tooltipTitle: PropTypes.string,
  margin: PropTypes.object,
  xUnits: PropTypes.string,
  data: PropTypes.array,
};

export default BarChartWithRangeSelection;
