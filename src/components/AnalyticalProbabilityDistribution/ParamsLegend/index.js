import React from 'react';
import PropTypes from 'prop-types';

import { useStyles } from './styles';

/**
 * Renders param element
 * @param { string } title
 * @param { string } value
 * @param { string } className
 * @returns { JSX }
 */
const ParamElement = ({ title, value, className }) => (
  <div className={className}>
    <div>
      <strong>
{title}:</strong>
    </div>
    <div>{value}</div>
  </div>
);

/**
 * Renders block of graph extra parameters
 * @param {array} params - parameters collection
 */
const ParamsLegend = ({ params }) => {
  const classes = useStyles();
  return (
    <div>
      <p>Parameters:</p>
      {params.map(({ key, title, value }) => (
        <ParamElement
          className={classes.paramElement}
          key={key}
          title={title}
          value={value}
        />
      ))}
    </div>
  );
};

ParamsLegend.propTypes = {
  params: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      title: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ),
};

export default ParamsLegend;
