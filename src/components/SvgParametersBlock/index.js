import React, { memo } from 'react';
import PropTypes from 'prop-types';

const TEXT_DY_BIG = 1.8;
const TEXT_DY_SMALL = 1.2;

/**
 * Svg Parameters block
 * @param { number } width
 * @param { number } fontSize
 * @param { array } parameters
 * @param { number } offsetY
 * @returns { JSX }
 */
const SvgParametersBlock = ({ width, fontSize, parameters, offsetY }) => {
  const height =
    (TEXT_DY_BIG + TEXT_DY_SMALL) * fontSize * (parameters.length + 1) +
    offsetY * 2;

  return (
    <svg width={width} height={height}>
      <text y={0} fontSize={fontSize}>
        <tspan x={0} dy={`${TEXT_DY_SMALL}em`} fontWeight="bold">
          Parameters
        </tspan>
        {parameters.map(({ name, value }) => (
          <React.Fragment key={name}>
            <tspan x={0} dy={`${TEXT_DY_BIG}em`}>
              {name}
:
</tspan>
            <tspan x={0} dy={`${TEXT_DY_SMALL}em`}>
              {value}
            </tspan>
          </React.Fragment>
        ))}
      </text>
    </svg>
  );
};

SvgParametersBlock.propTypes = {
  width: PropTypes.number.isRequired,
  fontSize: PropTypes.number,
  parameters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
  offsetY: PropTypes.number,
};

SvgParametersBlock.defaultProps = {
  fontSize: 12,
  offsetY: 10,
};

export default memo(SvgParametersBlock);
