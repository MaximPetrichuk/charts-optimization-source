import React, { useState, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { range, reduce } from 'lodash';
import PropTypes from 'prop-types';

import { palette } from 'theme';
import { SELECT_MODE, SELECT_RANGE_MODE, RANGE_MODE } from 'constants/graphs';
import { getMinMax, inRange, isNullOrUndefined } from 'helpers/common';
import { getPrettyNumber } from 'helpers/data';

import CustomTooltip from './CustomTooltip';

/**
 * ProbabilityDistribution component. Renders Probability Distribution graph for given data
 * @param { object } graphData data of graph
 * @param { number } widthGraph width of graph
 * @param { number } heightGraph height of graph
 * @param { string } xlabel label for x axis
 * @param { string } ylabel label for y axis
 * @param { number } maxYValue max number of y axis
 * @param { array } yTicks values of y axis ticks
 * @returns {JSX}
 * @note should be used in svg context
 */
const ProbabilityDistribution = ({
  graphData,
  widthGraph = 500,
  heightGraph = 400,
  xlabel,
  yTicks,
  maxYValue,
  ylabel,
}) => {
  const [hoverColumn, setHoverColumn] = useState(null);
  const [mode, setMode] = useState(SELECT_MODE);
  const [selectedCols, setSelectedCols] = useState({
    start: null,
    end: null,
  });

  const getColorBar = useCallback(
    (idx) => {
      const { start, end } = selectedCols;
      const selectionColor = palette.blue.dark;

      const color =
        (mode === SELECT_MODE && idx === hoverColumn) ||
        (mode === RANGE_MODE && inRange(idx, ...getMinMax(start, end))) ||
        (mode === SELECT_RANGE_MODE &&
          inRange(idx, ...getMinMax(start, hoverColumn)))
          ? selectionColor
          : palette.blue.main;

      return color;
    },
    [hoverColumn, mode, selectedCols],
  );

  const onMouseAction = useCallback(
    (event) => {
      if (event && event.activeTooltipIndex !== hoverColumn) {
        setHoverColumn(event.activeTooltipIndex);
      }
    },
    [setHoverColumn, hoverColumn],
  );

  const onMouseLeave = useCallback(() => setHoverColumn(null), [
    setHoverColumn,
  ]);

  const onClick = useCallback(
    ({ idx }) => {
      if (mode === RANGE_MODE) {
        return setMode(SELECT_MODE);
      }

      setMode(mode === SELECT_MODE ? SELECT_RANGE_MODE : RANGE_MODE);
      setSelectedCols(({ start }) =>
        mode === SELECT_MODE ? { start: idx } : { start, end: idx },
      );
    },
    [setMode, mode],
  );

  const getOccurence = useCallback(() => {
    if (mode === SELECT_MODE && !isNullOrUndefined(hoverColumn)) {
      return getPrettyNumber(graphData[hoverColumn].gy);
    }

    const [min, max] = getMinMax(
      selectedCols.start,
      mode === SELECT_RANGE_MODE && !isNullOrUndefined(hoverColumn)
        ? hoverColumn
        : selectedCols.end,
    );

    return getPrettyNumber(
      reduce(
        range(0, max - min + 1, 1),
        (result, i) => result + graphData[min + i].gy,
        0,
      ),
    );
  }, [hoverColumn, selectedCols, mode, graphData]);

  const getRange = useCallback(() => {
    if (mode === SELECT_MODE && !isNullOrUndefined(hoverColumn)) {
      return {
        xFrom: graphData[hoverColumn].gx,
        xTo:
          hoverColumn !== graphData.length - 1
            ? graphData[hoverColumn + 1].gx
            : null,
      };
    }

    const [xFrom, xTo] = getMinMax(
      selectedCols.start,
      mode === SELECT_RANGE_MODE && !isNullOrUndefined(hoverColumn)
        ? hoverColumn
        : selectedCols.end,
    );

    return {
      xFrom,
      xTo,
    };
  }, [mode, hoverColumn, selectedCols, graphData]);

  const yValue = getOccurence();
  const { xFrom, xTo } = getRange();

  return (
    <BarChart
      width={widthGraph}
      height={heightGraph}
      data={graphData}
      barCategoryGap={0}
      onMouseMove={onMouseAction}
      onMouseEnter={onMouseAction}
      onMouseLeave={onMouseLeave}
    >
      <XAxis
        tick={{
          fontSize: 9,
        }}
        label={{ value: xlabel, position: 'bottom', offset: -10 }}
      />
      <YAxis
        ticks={yTicks}
        domain={[0, maxYValue]}
        tick={{
          fontSize: 9,
        }}
        label={{
          value: ylabel,
          angle: -90,
          position: 'center',
          offset: 0,
        }}
      />
      <CartesianGrid strokeDasharray="3 3" />
      <Bar dataKey="gy" onClick={onClick}>
        {graphData.map((item, index) => (
          <Cell
            cursor="pointer"
            key={`cell-${item.gx}`}
            fill={getColorBar(index)}
          />
        ))}
      </Bar>
      <Tooltip
        content={(
          <CustomTooltip
            mode={mode}
            xLabel="Wind speed"
            yLabel="Occurrence"
            xFrom={xFrom}
            xTo={xTo}
            yValue={yValue}
          />
        )}
        cursor={false}
      />
    </BarChart>
  );
};

ProbabilityDistribution.propTypes = {
  graphData: PropTypes.arrayOf(
    PropTypes.shape({
      gx: PropTypes.number.isRequired,
      gy: PropTypes.number.isRequired,
      idx: PropTypes.number.isRequired,
    }),
  ).isRequired,
  widthGraph: PropTypes.number,
  heightGraph: PropTypes.number,
  xlabel: PropTypes.string.isRequired,
  ylabel: PropTypes.string.isRequired,
  yTicks: PropTypes.arrayOf(PropTypes.number).isRequired,
  maxYValue: PropTypes.number.isRequired,
};

export default ProbabilityDistribution;
