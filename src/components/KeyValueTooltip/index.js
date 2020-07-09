import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';

import { useStyles } from './styles';

/**
 * Key - value tooltip. Simple tooltip to use in graphs.
 * Takes `data` which is key-value map and renders these values in black half-transparent box
 * @param {string} title - title to display in tooltip (if need)
 * @param {object} data - data to display in tooltip
 * @param {string} className - custom className
 * @param {string} align - text align
 * @param {bool} boldValues - bool whether make values font bold or not
 * @param {string} units - units to display in tooltip
 * @returns {JSX}
 */
const KeyValueTooltip = ({
  title,
  data,
  className,
  align,
  boldValues,
  units,
}) => {
  const classes = useStyles({ align });

  return (
    <div className={classNames(classes.container, className)}>
      {title && <Typography variant="subtitle2">{title}</Typography>}
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          {key}
          :&nbsp;
          {boldValues ? (
            <strong>{`${value} ${units}`}</strong>
          ) : (
            `${value} ${units}`
          )}
        </div>
      ))}
    </div>
  );
};

KeyValueTooltip.propTypes = {
  title: PropTypes.string,
  data: PropTypes.object.isRequired,
  className: PropTypes.string,
  align: PropTypes.oneOf(['left', 'right', 'center']),
  boldValues: PropTypes.bool,
  units: PropTypes.string,
};

KeyValueTooltip.defaultProps = {
  title: '',
  className: '',
  align: 'left',
  boldValues: false,
  units: '',
};

export default memo(KeyValueTooltip);
