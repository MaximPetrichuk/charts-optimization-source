import React from 'react';
import PropTypes from 'prop-types';

import { DEFAULT_AXIS_INDEX } from 'constants/graphs';
import SvgPathLine from 'components/SvgPathLine';
import { palette } from 'theme';

/**
 * Custom line chart component, renders SVG path line
 * @note Supposed to be used as recharts `Customized` component
 * @param { string } path
 * @param { string } color
 * @param { Object } margin
 * @param xAxisMap
 * @returns { JSX }
 */
const CustomLineChart = ({ path, color, margin, xAxisMap }) => {
  const { x } = xAxisMap[DEFAULT_AXIS_INDEX];
  const { top: y = 0 } = margin || {};

  return (
    <svg x={x} y={y}>
      <SvgPathLine path={path} color={color} />
    </svg>
  );
};

CustomLineChart.propTypes = {
  path: PropTypes.string.isRequired,
  color: PropTypes.string,
  xAxisMap: PropTypes.object,
  margin: PropTypes.object,
};

CustomLineChart.defaultProps = {
  color: palette.blue.deep,
};

export default CustomLineChart;
