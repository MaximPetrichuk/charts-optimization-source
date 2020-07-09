import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { palette } from 'theme';
import { BOTTOM, LEFT, RIGHT, TOP } from 'constants/common';

const LINE_HEIGHT_FACTOR = 1.2;
const FIRST_LINE_OFFSET = '0.6em';
const COMMON_LINE_OFFSET = '1.2em';
const WIDE_LETTER_SPACING = 1.5;

/**
 * SVG tooltip (If you have possibility not to use svg, don't use it)
 * Useful for some cases, when built-in or custom div-based tooltips are slow or cannot be used at all
 * @param { number } x - tooltip x
 * @param { number } y - tooltip y
 * @param { { text: string, bold: bool, wide: bool }[] } lines - tooltip text as collection of lines objects
 * @param {{ x: number, y: number }} limits - limits for tooltips to not exceed
 * @param {{ x: number, y: number }} offset - offset from base x, y coordinates
 * @param { number } padding - common text padding value
 * @param { number } fontSize - font size
 * @param { * } widthUpdater - prop to control width calculation ('' by default to not recalculate for each render)
 * @param { number } fillOpacity - fill opacity
 * @param {{ x: string, y: string }} defaultPosition - default position relative to given x,y (right bottom by default)
 * @returns { JSX }
 */
const SvgTooltip = ({
  x,
  y,
  lines,
  limits,
  offset,
  padding,
  fontSize,
  widthUpdater,
  fillOpacity,
  defaultPosition,
}) => {
  const textRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    let maxLineWidth = 0;
    textRef.current.childNodes.forEach((node) => {
      const currentWidth = node.getComputedTextLength();
      maxLineWidth = currentWidth > maxLineWidth ? currentWidth : maxLineWidth;
    });
    setContainerWidth(maxLineWidth + padding * 2);
    // eslint-disable-next-line
  }, [widthUpdater, setContainerWidth]);

  const containerHeight = (LINE_HEIGHT_FACTOR * lines.length + 1) * fontSize;
  const maxX = x + offset.x + containerWidth;
  const maxY = y + offset.y + containerHeight;
  const xPosition = limits && maxX > limits.x ? LEFT : defaultPosition.x;
  const yPosition = limits && maxY > limits.y ? TOP : defaultPosition.y;
  const containerX =
    xPosition === RIGHT ? x + offset.x : x - (containerWidth + offset.x);
  const containerY =
    yPosition === BOTTOM ? y + offset.y : y - (containerHeight + offset.y);
  const textX = containerX + padding;
  const textY = containerY + padding;

  return (
    <g>
      {containerWidth && (
        <rect
          x={containerX}
          y={containerY}
          fill={palette.black.main}
          fillOpacity={fillOpacity}
          height={containerHeight}
          width={containerWidth}
          rx={3}
          ry={3}
        />
      )}
      <text
        y={textY}
        ref={textRef}
        fill={palette.grey.light}
        fontSize={fontSize}
        textLength="90%"
      >
        {lines.map(({ text, bold, wide }, index) => (
          <tspan
            key={text}
            x={textX}
            dy={index === 0 ? FIRST_LINE_OFFSET : COMMON_LINE_OFFSET}
            fontWeight={bold ? 'bold' : 'normal'}
            letterSpacing={wide ? WIDE_LETTER_SPACING : 'normal'}
          >
            {text}
          </tspan>
        ))}
      </text>
    </g>
  );
};

const coordinatesShape = {
  x: PropTypes.number,
  y: PropTypes.number,
};

SvgTooltip.propTypes = {
  lines: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      bold: PropTypes.bool,
    }),
  ),
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  defaultPosition: PropTypes.shape({
    x: PropTypes.oneOf([LEFT, RIGHT]),
    y: PropTypes.oneOf([TOP, BOTTOM]),
  }),
  padding: PropTypes.number,
  fontSize: PropTypes.number,
  fillOpacity: PropTypes.number,
  widthUpdater: PropTypes.any,
  offset: PropTypes.shape(coordinatesShape),
  limits: PropTypes.shape(coordinatesShape),
};

SvgTooltip.defaultProps = {
  limits: null,
  lines: [],
  offset: { x: 0, y: 30 },
  padding: 10,
  fontSize: 14,
  fillOpacity: 0.7,
  widthUpdater: '',
  defaultPosition: {
    x: RIGHT,
    y: BOTTOM,
  },
};

export default React.memo(SvgTooltip);
