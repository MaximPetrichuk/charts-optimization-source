import React, { memo, useMemo, useCallback } from 'react';
import { Grid } from '@material-ui/core';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { getPrettyNumber } from 'helpers/data';
import LevelsAxis from 'components/graphs/LevelsAxis';
import { ALTITUDE_TYPE } from 'constants/graphs';
import { palette } from 'theme';
import { EMPTY_FUNCTION } from 'constants/common';

import { useStyles } from './styles';

const LONG_AMOUNT = 30;
const EXTRA_LONG_AMOUNT = 50;
const BASIC_HEIGHT = 360;
const EXTRA_LONG_HEIGHT = 450;

/**
 * Renders block with level selection.
 * @param { array } levels array of levels for rendering
 * @param { number } currentLevel active level
 * @param { string } type - levels type. Could be 'depth' or 'altitude'
 * @param { string } className - wrapper class name
 * @param { function } selectLevel - callback for level selection, takes level index as argument
 * @param { number } height - use it if height should be forced
 */
const GraphLevelSelect = ({
  levels,
  currentLevel,
  type,
  selectLevel,
  className,
  height: heightFromProps,
}) => {
  const amount = levels.length;

  const isLongMode = amount > LONG_AMOUNT;
  const height = {
    true: BASIC_HEIGHT,
    [!!heightFromProps]: heightFromProps,
    [!heightFromProps && amount > EXTRA_LONG_AMOUNT]: EXTRA_LONG_HEIGHT,
  }.true;

  const classes = useStyles({ isLongMode, height });
  const isReversed = type === ALTITUDE_TYPE;

  const onClickLevel = useCallback(
    ({ currentTarget }) => {
      const index = currentTarget.getAttribute('data-index');

      if (!index) {
        return false;
      }
      const levelIndex = isReversed ? levels.length - 1 - index : index;
      return selectLevel(+levelIndex);
    },
    [selectLevel, levels, isReversed],
  );

  const preparedLevels = useMemo(() => {
    const roundedLevels = levels.map((level) => getPrettyNumber(level, 0));
    return isReversed ? roundedLevels.reverse() : roundedLevels;
  }, [levels, isReversed]);

  const lastIndex = levels.length - 1;
  const selectedIndex = isReversed ? lastIndex - currentLevel : currentLevel;

  return (
    <Grid className={className} container>
      <Grid
        item
        className={classes.titleContainer}
        container
        direction="column"
        justify="center"
        alignItems="center"
        xs
      >
        <Grid item className={classes.title} data-html2canvas-ignore>
          {`Choose your ${type} (m)`}
        </Grid>
      </Grid>
      <Grid className={classes.axisContainer} item>
        <LevelsAxis
          color={palette.grey.light}
          up={isReversed}
          length={height}
          overflowLength={30}
        />
      </Grid>
      <Grid
        item
        container
        direction="column"
        justify="space-between"
        wrap="nowrap"
        className={classes.container}
      >
        {preparedLevels.map((item, index) => (
          <Grid container item className={classes.level} key={item}>
            <Grid
              item
              className={classNames(classes.levelContainer, {
                [classes.lastLevelContainer]: index === lastIndex,
              })}
            >
              <div
                tabIndex="0"
                aria-label="select-level"
                role="button"
                className={classNames(classes.levelButton, {
                  [classes.currentLevel]: index === selectedIndex,
                })}
                onClick={onClickLevel}
                onKeyPress={EMPTY_FUNCTION}
                data-index={index}
              />
            </Grid>
            <Grid
              item
              container
              direction="column"
              justify="center"
              className={classes.tickContainer}
            >
              <Grid
                item
                className={classNames({
                  [classes.currentLevelLabel]: index === selectedIndex,
                })}
              >
                {item}
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

GraphLevelSelect.propTypes = {
  levels: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ).isRequired,
  currentLevel: PropTypes.number,
  type: PropTypes.oneOf(['altitude', 'depth']).isRequired,
  selectLevel: PropTypes.func.isRequired,
  className: PropTypes.string,
  height: PropTypes.number,
};

GraphLevelSelect.defaultProps = {
  currentLevel: 0,
  className: '',
  height: null,
};

export default memo(GraphLevelSelect);
