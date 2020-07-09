import React, { memo } from 'react';
import { pick } from 'lodash/object';

import { INVALID_TOOLTIP_OPTIONS } from 'constants/errors';

/**
 * hoc to use with recharts for custom tooltips.
 * Wraps tooltip component, adding wanted props from graph data and transformations
 * @param { React.ReactElement } component
 * @param { object } options
 * @param { string[] } options.propsToDisplay - props to be displayed, would be passed in tooltip as `data` prop
 * @param { string[] } options.propsToPass - additional props from graph data to be passed as common `props`
 * @param { key: function() } options.transform - values transformations (add unit, round value or any other)
 * @returns {React.ReactElement}
 * @example withCustomTooltipProps(MyTooltip, {
 *   propsToDisplay: ['name', 'age'],
 *   propsToPass: ['gender'],
 *   transform: { age: (age) => age - 10 },
 * })
 */
export const withCustomTooltipProps = (component, options) => {
  const {
    propsToDisplay = [],
    propsToPass = [],
    transform = {},
    propsNames = null,
  } = options;
  const WrappedComponent = component;

  if (
    !Array.isArray(propsToDisplay) ||
    !Array.isArray(propsToPass) ||
    !propsToDisplay.length
  ) {
    throw Error(INVALID_TOOLTIP_OPTIONS);
  }

  return memo(({ payload, active, units = '', ...rest }) => {
    if (!active) {
      return null;
    }

    const [initialProps] = payload;
    const data = pick(initialProps.payload, propsToDisplay);
    if (Object.keys(transform).length) {
      Object.entries(transform).forEach(([key, transformer]) => {
        data[key] = transformer(data[key], units);
      });
    }
    const preparedData = propsNames
      ? Object.entries(propsNames).reduce((acc, [key, name]) => {
          acc[name] = data[key];
          return acc;
        }, {})
      : data;
    const additionalProps = pick(initialProps.payload, propsToPass);
    const props = { ...additionalProps, ...rest };

    return <WrappedComponent {...props} data={preparedData} />;
  });
};
