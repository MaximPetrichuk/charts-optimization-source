import PropTypes from 'prop-types';
import React from 'react';

import SvgParametersBlock from 'components/SvgParametersBlock';
import { DEFAULT_AXIS_INDEX } from 'constants/graphs';

const Y_OFFSET = 10;

/**
 * Custom parameters block component.
 * Decorator for SvgParametersBlock, helps to use it with recharts as `Customized` component
 * @param { object } xAxisMap
 * @param { object } yAxisMap
 * @param { number } blockWidth
 * @param { number } leftOffset
 * @param { array } parameters
 * @param { number } fontSize
 * @returns { JSX }
 * @see SvgParametersBlock
 */
const CustomParametersBlock = ({
  xAxisMap,
  yAxisMap,
  blockWidth,
  leftOffset,
  parameters,
  fontSize,
}) => {
  const { x: xAxisStart, width: canvasWidth } = xAxisMap[DEFAULT_AXIS_INDEX];
  const { y: yAxisStart, height } = yAxisMap[DEFAULT_AXIS_INDEX];
  const x = xAxisStart + canvasWidth + leftOffset;

  return (
    <svg x={x} y={yAxisStart} width={blockWidth} height={height}>
      <SvgParametersBlock
        width={blockWidth}
        parameters={parameters}
        offsetY={Y_OFFSET}
        fontSize={fontSize}
      />
    </svg>
  );
};

CustomParametersBlock.propTypes = {
  blockWidth: PropTypes.number,
  xAxisMap: PropTypes.object,
  yAxisMap: PropTypes.object,
  leftOffset: PropTypes.number,
  parameters: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
  fontSize: PropTypes.number,
};

CustomParametersBlock.defaultProps = {
  blockWidth: 120,
  leftOffset: 20,
  fontSize: 12,
};

export default CustomParametersBlock;
