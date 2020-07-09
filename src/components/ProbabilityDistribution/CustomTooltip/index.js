import React from 'react';
import PropTypes from 'prop-types';

import { APD_HINT_BY_MODE } from 'constants/graphs';
import { isNullOrUndefined } from 'helpers/common';

import { useStyles } from './styles';

const xFormatter = (xFrom, xTo) =>
  [xFrom, xTo].some(isNullOrUndefined)
    ? `>=${xFrom}m/s`
    : `[${xFrom}m/s ; ${xTo}m/s]`;

const yFormatter = (yValue) => `${yValue}%`;

/**
 * CustomTooltip is component which renders tooltip for graph
 * @param {boolean} active is active tooltip now or not
 * @param {string} xLabel label for data from x axis
 * @param {number} xFrom value from x axis
 * @param {number} xTo value from x axis
 * @param {string} yLabel label for data from y axis
 * @param {number} yValue value from y axis
 * @param {string} mode mode of selection in graph
 */
const CustomTooltip = ({
  active,
  xLabel,
  xFrom,
  xTo,
  yValue,
  yLabel,
  mode,
}) => {
  const classes = useStyles();
  if (!active) {
    return null;
  }
  const hintText = APD_HINT_BY_MODE[mode];
  return (
    <div className={classes.container}>
      <div>{xLabel}</div>
      <div>{xFormatter(xFrom, xTo)}</div>
      <div>
        {yLabel}
:{yFormatter(yValue)}
      </div>
      <div>{hintText}</div>
    </div>
  );
};

CustomTooltip.propTypes = {
  xLabel: PropTypes.string.isRequired,
  xFrom: PropTypes.number,
  xTo: PropTypes.number,
  yValue: PropTypes.number.isRequired,
  yLabel: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
};

export default CustomTooltip;
