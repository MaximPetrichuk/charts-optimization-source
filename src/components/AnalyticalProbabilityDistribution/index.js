import React, { useState, useMemo, useRef } from 'react';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import { range as lodashRange } from 'lodash';
import { BarChart, CartesianGrid, Customized, XAxis, YAxis } from 'recharts';

import CustomLevelsBar from 'components/CustomLevelsBar';
import { CHART_SVG_ID, DEFAULT_LEVELS_BAR_WIDTH } from 'constants/graphs';
import CustomParametersBlock from 'components/CustomParametersBlock';
import { useUniqueId } from 'hooks/useUniqueId';

import BarChartWithRangeSelection from '../BarChartWithRangeSelection';

import { useStyles } from './styles';

const LEVELS_BAR_OFFSET = 10;

const PARAMETERS_WIDTH = 120;
const PARAMETERS_OFFSET = 10;
const PARAMETERS_FULL_WIDTH = PARAMETERS_WIDTH + PARAMETERS_OFFSET;

const CANVAS_OFFSET = 30;
const GRAPH_MARGIN = {
  left: CANVAS_OFFSET / 2,
  right: CANVAS_OFFSET / 2 + PARAMETERS_FULL_WIDTH,
  top: CANVAS_OFFSET,
  bottom: CANVAS_OFFSET,
};

/**
 * AnalyticalProbabilityDistribution component. Renders Analytical Probability Distribution graph for given data
 * @param { object[] } annualData - graph annual Data in array (by levels)
 * @param { number } graphWidth width of graph
 * @param { number } yTickStep number between two ticks in y axis
 * @param { number } projectId - current project id
 * @returns { JSX }
 */
const AnalyticalProbabilityDistribution = ({
  annualData,
  graphWidth,
  yTickStep,
}) => {
  const salt = useUniqueId();
  const [currentLevel, setCurrentLevel] = useState(0);
  const classes = useStyles();
  const graphContainer = useRef(null);
  const graphHeight = graphWidth * 0.8;

  const {
    data,
    yTicks,
    xUnits,
    extraParams,
    maxYValue,
    yLabel,
    xLabel,
    levels,
    tooltipTitle,
    withLevelsSelect,
  } = useMemo(() => {
    const hasLevels = Array.isArray(annualData) && !!annualData[0].levels;
    const currentData = hasLevels ? annualData[currentLevel] : annualData;
    return {
      ...currentData,
      withLevelsSelect: hasLevels,
      yTicks: lodashRange(
        Math.floor(currentData.minYValue),
        currentData.maxYValue,
        yTickStep
      ),
    };
  }, [annualData, yTickStep, currentLevel]);

  const chartMargin = withLevelsSelect
    ? { ...GRAPH_MARGIN, left: DEFAULT_LEVELS_BAR_WIDTH }
    : GRAPH_MARGIN;
  const chartWidth = graphWidth + chartMargin.left + chartMargin.right;
  const chartHeight = graphHeight + GRAPH_MARGIN.top + GRAPH_MARGIN.bottom;

  return (
    <Grid justify="center" container>
      <Grid item>
        <Grid justify="center" container>
          <Grid item className={classes.graphWrapper}>
            <BarChart
              id={CHART_SVG_ID + salt}
              ref={graphContainer}
              data={data}
              width={chartWidth}
              height={chartHeight}
              margin={chartMargin}
              barCategoryGap={0}
              className={classes.graphContainer}
            >
              <XAxis
                tick={{ fontSize: 9 }}
                label={{ value: xLabel, position: 'bottom', offset: -10 }}
              />
              <YAxis
                ticks={yTicks}
                domain={[0, maxYValue]}
                tick={{
                  fontSize: 9,
                }}
                label={{
                  value: yLabel,
                  angle: -90,
                  position: 'center',
                  offset: 0,
                }}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Customized
                key={1}
                xUnits={xUnits}
                data={data}
                tooltipTitle={tooltipTitle}
                graphContainer={graphContainer}
                component={BarChartWithRangeSelection}
                classes={classes}
              />
              {withLevelsSelect && (
                <Customized
                  key={2}
                  levels={levels.values}
                  type={levels.type}
                  barWidth={DEFAULT_LEVELS_BAR_WIDTH}
                  selectedLevel={currentLevel}
                  onSelect={setCurrentLevel}
                  xOffset={LEVELS_BAR_OFFSET}
                  component={CustomLevelsBar}
                />
              )}
              <Customized
                key={3}
                component={CustomParametersBlock}
                leftOffset={PARAMETERS_OFFSET}
                blockWidth={PARAMETERS_WIDTH}
                parameters={extraParams}
              />
            </BarChart>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const graphDataShape = {
  levels: PropTypes.shape({
    type: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
  xUnits: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  minYValue: PropTypes.number.isRequired,
  maxYValue: PropTypes.number.isRequired,
  tooltipTitle: PropTypes.string,
  title: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      xValue: PropTypes.number.isRequired,
      yValue: PropTypes.number.isRequired,
    })
  ).isRequired,
  extraParams: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      title: PropTypes.string,
      value: PropTypes.any,
    })
  ).isRequired,
};

AnalyticalProbabilityDistribution.propTypes = {
  annualData: PropTypes.arrayOf(PropTypes.shape(graphDataShape)),
  graphWidth: PropTypes.number,
  yTickStep: PropTypes.number,
};

AnalyticalProbabilityDistribution.defaultProps = {
  yTickStep: 1,
  graphWidth: 500,
};

export default AnalyticalProbabilityDistribution;
