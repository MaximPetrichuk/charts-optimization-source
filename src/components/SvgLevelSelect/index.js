import React, { memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import { getPrettyNumber } from 'helpers/data';
import { ALTITUDE_TYPE, DEPTH_TYPE } from 'constants/graphs';
import { palette } from 'theme';
import { floatRound } from 'helpers/common';

import { useStyles } from './styles';

const LONG_MODE_AMOUNT = 30;
const BASIC_HEIGHT = 350;
const LONG_MODE_HEIGHT = 450;
const LINES_COLOR = palette.grey.light;
const RECT_FILL = palette.blue.graph;
const SELECTED_RECT_FILL = palette.blue.main;
const LABEL_WIDTH = 15;
const RECT_WIDTH = 15;
const FONT_SIZE_BASIC = 10;
const FONT_SIZE_LONG_MODE = 8;
const ARROW_WIDTH = 10;
const ARROW_HEIGHT = 14;

/**
 * Renders block with level selection using svg
 * @param { array } levels - array of levels values
 * @param { string } type - select type (altitude|depth)
 * @param { number } selectedLevel - selected level index
 * @param { function } onSelect - callback, takes level index as argument
 * @param { number } width - whole bar width
 * @param { number } height - height
 * @param { number } xOffset
 * @param { number } yOffset
 * @param { number } axisOverflow - length of axis part above or below rectangles
 * @returns { JSX }
 */
const SvgLevelSelect = ({
  levels,
  type,
  selectedLevel,
  onSelect,
  width,
  height: heightFromProps,
  xOffset,
  yOffset,
  axisOverflow,
}) => {
  const classes = useStyles();
  const isLongMode = levels.length > LONG_MODE_AMOUNT;
  const height = {
    true: BASIC_HEIGHT,
    [!!heightFromProps]: heightFromProps,
    [!heightFromProps && isLongMode]: LONG_MODE_HEIGHT,
  }.true;

  const up = type === ALTITUDE_TYPE;

  const onClickLevel = useCallback(
    ({ currentTarget }) => {
      const index = currentTarget.getAttribute('data-index');

      if (!index) {
        return false;
      }
      const levelIndex = up ? levels.length - 1 - index : index;
      onSelect(+levelIndex);
    },
    [onSelect, levels, up],
  );

  const preparedLevels = useMemo(() => {
    const roundedLevels = levels.map((level) => getPrettyNumber(level, 0));
    return up ? roundedLevels.reverse() : roundedLevels;
  }, [levels, up]);

  const lastIndex = levels.length - 1;
  const selectedIndex = up ? lastIndex - selectedLevel : selectedLevel;

  const {
    fullHeight,
    labelX,
    labelY,
    axisX,
    tickX,
    rectHeight,
    rectStartY,
    tickFontSize,
    arrowPath,
    axisY1,
    axisY2,
  } = useMemo(() => {
    const lineX = xOffset + LABEL_WIDTH;
    const heightFull = height + axisOverflow;
    const y1 = up ? heightFull : yOffset;
    const y2 = up ? yOffset : heightFull + yOffset;
    const arrowStartY = up ? y2 + ARROW_HEIGHT : y2 - ARROW_HEIGHT;

    let pathArrow = `M${lineX - ARROW_WIDTH / 2},${arrowStartY}`;
    pathArrow += `L${lineX + ARROW_WIDTH / 2},${arrowStartY}`;
    pathArrow += `L${lineX},${y2}Z`;

    return {
      axisY1: y1,
      axisY2: y2,
      arrowPath: pathArrow,
      fullHeight: heightFull,
      labelX: xOffset,
      labelY: axisOverflow + ~~(height / 2),
      axisX: lineX,
      tickX: lineX + RECT_WIDTH + 3,
      rectHeight: floatRound(height / preparedLevels.length, 2),
      rectStartY: up ? axisOverflow : yOffset,
      tickFontSize: isLongMode ? FONT_SIZE_LONG_MODE : FONT_SIZE_BASIC,
    };
  }, [height, axisOverflow, yOffset, xOffset, preparedLevels, up, isLongMode]);

  return (
    <svg width={width} height={fullHeight}>
      <text
        x={labelX}
        y={labelY}
        fill={LINES_COLOR}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(-90, ${labelX}, ${labelY})`}
      >
        {`Choose your ${type} (m)`}
      </text>
      <line
        stroke={LINES_COLOR}
        x1={axisX}
        y1={axisY1}
        x2={axisX}
        y2={axisY2}
        strokeWidth="1"
      />
      <path d={arrowPath} fill={LINES_COLOR} stroke={LINES_COLOR} />
      {preparedLevels.map((level, index) => {
        const rectY = rectStartY + index * rectHeight;

        return (
          <React.Fragment key={level}>
            <rect
              x={axisX}
              y={rectStartY + index * rectHeight}
              width={RECT_WIDTH}
              height={rectHeight}
              data-index={index}
              fill={index === selectedIndex ? SELECTED_RECT_FILL : RECT_FILL}
              stroke="black"
              className={classes.rect}
              onClick={onClickLevel}
              tabIndex="0"
              aria-label="select-level"
              role="button"
            />
            <text
              x={tickX}
              y={rectY + 2}
              fontSize={tickFontSize}
              textAnchor="start"
              dominantBaseline="hanging"
            >
              {level}
            </text>
          </React.Fragment>
        );
      })}
    </svg>
  );
};

SvgLevelSelect.propTypes = {
  type: PropTypes.oneOf([ALTITUDE_TYPE, DEPTH_TYPE]).isRequired,
  levels: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ).isRequired,
  selectedLevel: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  xOffset: PropTypes.number,
  yOffset: PropTypes.number,
};

SvgLevelSelect.defaultProps = {
  xOffset: 0,
  yOffset: 0,
  selectedLevel: 0,
};

export default memo(SvgLevelSelect);
