import React from 'react';
import PropTypes from 'prop-types';

import { palette } from 'theme';

/**
 * Renders empty circle with border to use it as a pointer dot with charts
 * @param { number } x
 * @param { number } y
 * @param { string } color
 * @param { number } radius
 * @returns { JSX }
 */
const CustomPointer = ({ x, y, color, radius, fill }) => (
  <div
    style={{
      width: radius * 2,
      height: radius * 2,
      position: 'absolute',
      top: y,
      left: x,
      transform: 'translate(-50%, -50%)',
      borderRadius: '50%',
      backgroundColor: fill,
      border: `2px solid ${color}`,
    }}
  />
);

CustomPointer.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  color: PropTypes.string,
  radius: PropTypes.number,
  fill: PropTypes.string,
};

CustomPointer.defaultProps = {
  color: palette.black.main,
  fill: palette.white.main,
  radius: 4,
};

export default CustomPointer;
