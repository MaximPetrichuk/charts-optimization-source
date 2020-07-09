import React from 'react';
import PropTypes from 'prop-types';

import { DEFAULT_AXIS_INDEX } from 'constants/graphs';
import SvgLevelSelect from 'components/SvgLevelSelect';

/**
 * Decorator for SvgLevelSelect, helps to use it with recharts `Customized` component
 * @note can be used with both polar (like pie chart) and biaxial (like bar chart) components
 * @param { string } type
 * @param { array } levels
 * @param { number } barWidth
 * @param { object } yAxisMap
 * @param { object } margin
 * @param { number } selectedLevel
 * @param { function } onSelect
 * @param { number } xOffset
 * @param { number } cx
 * @param { number } cy
 * @param { number } outerRadius
 * @returns { JSX }
 */
const CustomLevelsBar = ({
  type,
  levels,
  barWidth,
  yAxisMap,
  selectedLevel,
  onSelect,
  xOffset,
  outerRadius,
  margin,
  cx,
  cy,
}) => {
  const isPolarCoords = outerRadius && (cx ?? false) && (cy ?? false);
  const yStart = isPolarCoords
    ? (margin.top ?? 0) + cy - outerRadius
    : yAxisMap?.[DEFAULT_AXIS_INDEX]?.y;
  const height = isPolarCoords
    ? outerRadius * 2
    : yAxisMap?.[DEFAULT_AXIS_INDEX]?.height;

  return (
    <SvgLevelSelect
      type={type}
      axisOverflow={yStart}
      yOffset={2}
      xOffset={xOffset}
      width={barWidth}
      height={height}
      levels={levels}
      selectedLevel={selectedLevel}
      onSelect={onSelect}
    />
  );
};

CustomLevelsBar.propTypes = {
  type: PropTypes.string,
  levels: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ).isRequired,
  barWidth: PropTypes.number,
  yAxisMap: PropTypes.object,
  selectedLevel: PropTypes.number,
  onSelect: PropTypes.func,
  xOffset: PropTypes.number,
  cx: PropTypes.number,
  cy: PropTypes.number,
  margin: PropTypes.object,
  outerRadius: PropTypes.number,
};

export default CustomLevelsBar;
