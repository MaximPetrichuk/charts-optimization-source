import React from 'react';
import PropTypes from 'prop-types';

import { BOTTOM, LEFT, RIGHT, TOP } from 'constants/common';

import { useStyles } from './styles';

/**
 * Base tooltip, renders given children in half-transparent black tooltip
 * takes start point x, y coordinates and offset from this point if need
 * @param { number } x
 * @param { number } y
 * @param { number } offsetX
 * @param { number } offsetY
 * @param { string } yPosition TOP|BOTTOM - position in top / bottom from given x, y
 * @param { string } xPosition LEFT|RIGHT - position in left / right from given x, y
 * @param { React.ReactNode } children
 * @returns { JSX }
 */
const BaseTooltip = ({
  x,
  y,
  offsetX,
  offsetY,
  xPosition,
  yPosition,
  children,
}) => {
  const isLeftPosition = xPosition === LEFT;
  const isTopPosition = yPosition === TOP;

  const translate = {
    x: isLeftPosition ? '-100%' : '',
    y: isTopPosition ? '-100%' : '',
  };

  const classes = useStyles({
    x: isLeftPosition ? x - offsetX : x + offsetX,
    y: isTopPosition ? y - offsetY : y + offsetY,
    translate,
  });

  return <div className={classes.tooltipContainer}>{children}</div>;
};

BaseTooltip.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  children: PropTypes.node.isRequired,
  xPosition: PropTypes.oneOf([LEFT, RIGHT]),
  yPosition: PropTypes.oneOf([TOP, BOTTOM]),
};

BaseTooltip.defaultProps = {
  offsetX: 0,
  offsetY: 0,
  xPosition: RIGHT,
  yPosition: BOTTOM,
};

export default BaseTooltip;
