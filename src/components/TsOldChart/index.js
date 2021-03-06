import React, { useCallback, useState } from 'react';
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  Tooltip,
} from 'recharts';
import formatDate from 'date-fns/format';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

import { getTickFormatterByValuesRange } from 'helpers/graphs/common';
import CustomPointer from 'components/CustomPointer';
import CustomCross from 'components/CustomCross';
import { DATE_FORMATS, EOL, LEFT, RIGHT } from 'constants/common';
import BaseTooltip from 'components/BaseTooltip';
import { useXScalableCanvas } from 'hooks/useXScalableAxis';
import { getXAxisOptionsByTimestampRange } from 'helpers/graphs/timeSeries';
import { CHART_SVG_ID, DEFAULT_LEVELS_BAR_WIDTH } from 'constants/graphs';
import { useUniqueId } from 'hooks/useUniqueId';
import { withCustomTooltipProps } from 'hocs/withCustomTooltipProps';
import KeyValueTooltip from 'components/KeyValueTooltip';
import { getPrettyNumber } from 'helpers/data';
import { palette } from 'theme';

import { useStyles } from './styles';

/**
 * wheel step in % of domain
 * @type {number}
 */
const WHEEL_STEP = 8;
const CANVAS_OFFSET = 25;
const MIN_DOMAIN_RANGE = 3600 * 24;
const AXIS_WIDTH = 30;
const X_CANVAS_OFFSET = AXIS_WIDTH + CANVAS_OFFSET;
const Y_CANVAS_OFFSET = CANVAS_OFFSET;
const TOOLTIP_X_OFFSET = 10;
const TOOLTIP_Y_OFFSET = -10;
const LEVELS_BAR_OFFSET = 10;
const LEVELS_FULL_WIDTH = LEVELS_BAR_OFFSET + DEFAULT_LEVELS_BAR_WIDTH;

const GRAPH_MARGIN = {
  left: CANVAS_OFFSET,
  right: CANVAS_OFFSET,
  top: CANVAS_OFFSET,
  bottom: CANVAS_OFFSET,
};

const CustomTooltip = withCustomTooltipProps(KeyValueTooltip, {
  propsToDisplay: ['x', 'y'],
  transform: {
    x: (time) => formatDate(new Date(time * 1000), DATE_FORMATS.ymdhmFormat),
    y: getPrettyNumber,
  },
  propsNames: {
    x: 'time',
    y: 'jonswap peak factor',
  },
});

/**
 * Local chart component
 * Chart render implemented here and wrapped with React.memo to avoid expensive drawing
 * @param { string } salt - id addition
 * @param {{ x, y }[]} data - mock data for chart to correctly display axises and grid
 * @param { number[] } xValues - x values (timestamps)
 * @param { number[] } yValues
 * @param { object } classes
 * @param { number } canvasWidth
 * @param { number } canvasHeight
 * @param { number[] } xDomain
 * @param { number[] } yDomain
 * @param { string } yLabel
 * @param { number[] } yTicks
 * @param { object } levels
 * @param { number } selectedLevel
 * @param { function } onLevelSelect
 * @returns { JSX }
 */
const ChartComponent = React.memo(
  ({
    salt,
    data,
    classes,
    canvasWidth,
    canvasHeight,
    xDomain,
    yDomain,
    yLabel,
    yTicks,
  }) => {
    const chartMargin = GRAPH_MARGIN;

    const chartWidth =
      canvasWidth + chartMargin.left + chartMargin.right + AXIS_WIDTH;
    const chartHeight =
      canvasHeight + GRAPH_MARGIN.top + GRAPH_MARGIN.bottom + AXIS_WIDTH;

    const { dateFormat, tickOptions } = getXAxisOptionsByTimestampRange(
      xDomain[1] - xDomain[0]
    );
    const xTickFormatter = useCallback(
      (tick) => formatDate(new Date(1000 * tick), dateFormat),
      [dateFormat]
    );
    const yTickFormatter = getTickFormatterByValuesRange(
      yDomain[1] - yDomain[0]
    );

    return (
      <div>
        <LineChart
          id={CHART_SVG_ID + salt}
          className={classes.graphContainer}
          width={chartWidth}
          height={chartHeight}
          margin={chartMargin}
          data={data}
        >
          <Line
            isAnimationActive={false}
            dot={false}
            stroke={palette.blue.main}
            type="monotone"
            dataKey="y"
          />
          <XAxis
            dataKey="x"
            type="number"
            interval={0}
            tickCount={10}
            tick={tickOptions}
            domain={xDomain}
            allowDataOverflow
            height={AXIS_WIDTH}
            tickFormatter={xTickFormatter}
          />
          <YAxis
            dataKey="y"
            type="number"
            ticks={yTicks}
            tick={{ fontSize: 12 }}
            scale="linear"
            interval={0}
            domain={yDomain}
            width={AXIS_WIDTH}
            tickFormatter={yTickFormatter}
            label={{
              value: yLabel,
              angle: -90,
              position: 'center',
              dx: -30,
            }}
          />
          <Tooltip content={<CustomTooltip boldValues />} payloadUniqBy="x" />
          <CartesianGrid strokeDasharray="3 3" />
        </LineChart>
      </div>
    );
  }
);

/**
 * Time series graph. Chart canvas can be zoomed by wheel and dragged by mouse
 * @param { Object } annualData
 * @param { number } canvasWidth
 * @param { number } canvasHeight
 * @param { number } projectId
 * @returns { JSX }
 */
const TsOld = ({ annualData, canvasWidth, canvasHeight }) => {
  const salt = useUniqueId();
  const classes = useStyles({ canvasOffset: CANVAS_OFFSET });

  const [pointer] = useState(null);
  const [levelIndex, setLevelIndex] = useState(0);

  const { data, levels, yLabel, yTooltipLabel, units } = annualData;
  const withLevels = !!(levels && Object.keys(levels).length);
  const xCanvasOffset = withLevels
    ? X_CANVAS_OFFSET + LEVELS_FULL_WIDTH
    : X_CANVAS_OFFSET;

  const { xValues, yValues, yDomain, yTicks, xMin, xMax, graphData } = data[
    levelIndex
  ];

  const { xDomain, wrapperRef } = useXScalableCanvas({
    canvasWidth,
    wheelStep: WHEEL_STEP,
    xCanvasOffset,
    initialDomain: [xMin, xMax],
    minDomainRange: MIN_DOMAIN_RANGE,
  });

  const canvasCenterX = X_CANVAS_OFFSET + 0.5 * canvasWidth;

  return (
    <Grid justify="center" container>
      <Grid item>
        <Grid justify="center" container>
          <Grid item>
            <div ref={wrapperRef} className={classes.wrapper}>
              <ChartComponent
                salt={salt}
                data={graphData}
                xValues={xValues}
                yValues={yValues}
                classes={classes}
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                selectedLevel={levelIndex}
                onLevelSelect={setLevelIndex}
                xDomain={xDomain}
                yDomain={yDomain}
                yTicks={yTicks}
                yLabel={yLabel}
                levels={levels}
              />
              {!!pointer && (
                <>
                  <BaseTooltip
                    y={0}
                    x={pointer.x}
                    xPosition={pointer.x > canvasCenterX ? LEFT : RIGHT}
                    offsetX={TOOLTIP_X_OFFSET}
                    offsetY={TOOLTIP_Y_OFFSET}
                  >
                    {formatDate(
                      new Date(pointer.xValue * 1000),
                      DATE_FORMATS.ymdhmFormat
                    )}
                    {EOL}
                    {yTooltipLabel}
                    :&nbsp;
                    <strong>
                      {pointer.yValue.toFixed(2)} {units}
                    </strong>
                  </BaseTooltip>
                  <CustomPointer x={pointer.x} y={pointer.y} />
                  <CustomCross
                    x={pointer.x}
                    y={pointer.y}
                    height={canvasHeight}
                    width={canvasWidth}
                    offsetX={X_CANVAS_OFFSET}
                    offsetY={Y_CANVAS_OFFSET}
                  />
                </>
              )}
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const dataShape = {
  title: PropTypes.string,
  xValues: PropTypes.arrayOf(PropTypes.number),
  yValues: PropTypes.arrayOf(PropTypes.number),
  yDomain: PropTypes.arrayOf(PropTypes.number),
  yTicks: PropTypes.arrayOf(PropTypes.number),
  xMin: PropTypes.number,
  xMax: PropTypes.number,
  graphData: PropTypes.arrayOf(PropTypes.object),
};

TsOld.propTypes = {
  canvasWidth: PropTypes.number,
  canvasHeight: PropTypes.number,
  annualData: PropTypes.shape({
    data: PropTypes.oneOfType([
      PropTypes.shape(dataShape),
      PropTypes.arrayOf(PropTypes.shape(dataShape)),
    ]),
    levels: PropTypes.object,
    yLabel: PropTypes.string,
    yTooltipLabel: PropTypes.string,
  }),
};

TsOld.defaultProps = {
  canvasWidth: 550,
  canvasHeight: 400,
};

export default React.memo(TsOld);
