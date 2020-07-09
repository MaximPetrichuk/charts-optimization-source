import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { useStyles } from './styles';

/**
 * Levels selector axis.
 * @param { bool } up - whether axis is up direction
 * @param { string } color - stroke and fill axis color
 * @param { number } length - select length
 * @param { number } overflowLength length of Y axis overflow part
 * @returns {JSX}
 */
const LevelsAxis = ({ up, color, length, overflowLength }) => {
  const classes = useStyles({ up, overflowLength });
  const fullLength = length + overflowLength;

  return (
    <svg className={classes.root} width="20" height={fullLength}>
      <defs>
        <marker
          id="levels-axis"
          viewBox="0 -10 25 25"
          refX="20"
          refY="0"
          markerWidth="16"
          markerHeight="20"
          orient="auto"
        >
          <path fill={color} stroke={color} d="M 0 -8 L 20 0 L 0 8" />
        </marker>
      </defs>
      <line
        stroke={color}
        x1="10"
        y1={up ? fullLength : 0}
        x2="10"
        y2={up ? 0 : fullLength}
        strokeWidth="1"
        markerEnd="url(#levels-axis)"
      />
    </svg>
  );
};

LevelsAxis.propTypes = {
  up: PropTypes.bool,
  color: PropTypes.string,
  length: PropTypes.number.isRequired,
  overflowLength: PropTypes.number,
};

LevelsAxis.defaultProps = {
  up: false,
  color: 'black',
  overflowLength: 50,
};

export default memo(LevelsAxis);
