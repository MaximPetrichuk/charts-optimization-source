import React, { useState, useCallback } from 'react';
import Switch from '@material-ui/core/Switch';

import { analyticalProbabilityDistributionGraphData } from 'mocks/apd';
import timeSeriesJson from 'mocks/timeSeries.json';
import { getPreparedAnalyticalProbabilityGraphData } from 'helpers/graphs/apd';
import { getPreparedTimeSeriesData } from 'helpers/graphs/timeSeries';
import { camelizeKeys } from 'helpers/camelizer';
// 1st chart
import AnalyticalProbabilityOld from 'components/ApdOld';
import AnalyticalProbabilityDistribution from 'components/AnalyticalProbabilityDistribution';
// 2nd chart
import TimeSeriesOldChart from 'components/TsOldChart';
import TimeSeriesChart from 'components/TimeSeriesChart';

import './App.css';

const annualApdData = getPreparedAnalyticalProbabilityGraphData(
  analyticalProbabilityDistributionGraphData
);
const timeSeriesRawData = camelizeKeys(timeSeriesJson);
const timeSeriesData = getPreparedTimeSeriesData(timeSeriesRawData);

function App() {
  const [isNewApd, setIsNewApd] = useState(false);
  const [isNewTs, setIsNewTs] = useState(false);
  const switchApd = useCallback(
    ({ target }) => setIsNewApd(!!target.checked),
    []
  );
  const switchTs = useCallback(
    ({ target }) => setIsNewTs(!!target.checked),
    []
  );

  return (
    <div className="App App-header">
      <header>Charts optimization</header>
      <br />
      <div className="charts">
        <h3>Bar chart with range selection</h3>
        <small>
          (hint: try 4/6x slowdown in chrome performance tab, select bar/range
          on chart and compare performance)
        </small>
        <br />
        <br />
        <span>Before</span>
        <Switch onChange={switchApd} checked={isNewApd} />
        <span>After</span>
        {isNewApd ? (
          <AnalyticalProbabilityDistribution annualData={annualApdData} />
        ) : (
          <AnalyticalProbabilityOld
            graphData={analyticalProbabilityDistributionGraphData}
          />
        )}
        <br />
        <h3>Time series charts</h3>
        <p>for scaling use mouse wheel or multitouch</p>
        <p>you can also drag zoomed area with cursor</p>
        <small>(hint: pay attention to scale/drag performance)</small>
        <br />
        <br />
        <span>Before</span>
        <Switch onChange={switchTs} checked={isNewTs} />
        <span>After</span>
        {isNewTs ? (
          <TimeSeriesChart annualData={timeSeriesData} />
        ) : (
          <TimeSeriesOldChart annualData={timeSeriesData} />
        )}
      </div>
    </div>
  );
}

export default App;
