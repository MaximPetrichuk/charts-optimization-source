import React, { useState, useMemo, useCallback } from 'react';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';

import ProbabilityDistribution from 'components/ProbabilityDistribution';
import { VALUES_KEY } from 'constants/graphs';
import GraphLevelSelect from 'components/graphs/GraphLevelSelect';
import { getPreparedGraphData } from 'helpers/graphs/apd';

import { useStyles } from './styles';
import ParamsLegend from './ParamsLegend';

/**
 * AnalyticalProbabilityDistribution component. Renders Analytical Probability Distribution graph for given data
 * @param { object } graphData monthly data of graph
 * @param { number } widthGraph width of graph
 * @param { number } yTickStep number between two ticks in y axis
 * @returns {JSX}
 * @note should be used in svg context
 */
const ApdOld = ({ graphData, widthGraph = 500, yTickStep = 1 }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const classes = useStyles();
  const heightGraph = widthGraph * 0.8;
  const onClickLevel = useCallback((level) => setCurrentLevel(level), [
    setCurrentLevel,
  ]);
  const [data, yTicks, extraParams, maxYValue, ylabel, xlabel] = useMemo(
    () => getPreparedGraphData(graphData, yTickStep, currentLevel),
    [graphData, yTickStep, currentLevel],
  );

  return (
    <Grid justify="center" container>
      <Grid item>
        <GraphLevelSelect
          type="altitude"
          levels={graphData.level[VALUES_KEY]}
          currentLevel={currentLevel}
          selectLevel={onClickLevel}
        />
      </Grid>
      <Grid item>
        <ProbabilityDistribution
          graphData={data}
          yTicks={yTicks}
          widthGraph={widthGraph}
          heightGraph={heightGraph}
          xlabel={xlabel}
          ylabel={ylabel}
          maxYValue={maxYValue}
        />
      </Grid>
      <Grid item className={classes.paramsContainer}>
        <ParamsLegend params={extraParams} />
      </Grid>
    </Grid>
  );
};

ApdOld.propTypes = {
  graphData: PropTypes.any.isRequired,
  widthGraph: PropTypes.number,
  yTickStep: PropTypes.number,
};

export default ApdOld;
