import { useCallback, useState, useMemo } from 'react';

import {
  SELECT_MODE,
  SELECT_RANGE_MODE,
  SELECTED_RANGE_MODE,
} from 'constants/graphs';
import { cyclicSequence } from 'helpers/common';

const INITIAL_RANGE = {
  start: null,
  end: null,
};

// mode sequence in correct order to iterate
const MODE_SEQUENCE = [SELECT_MODE, SELECT_RANGE_MODE, SELECTED_RANGE_MODE];

/**
 * Hook to use with range select component. 3 basic modes: before selection, in process, when selection is completed
 * @note each selection item should contain `data-index` attribute
 * @note hook provides 2 arguments for callbacks - original event and current selection mode
 * provides handlers to use with your selection coponent:
 *   `handleClick` and `handleEnter` should be passed to selection items handlers
 *   `handleRangeLeave` can be passed to selection items wrappers handler
 * @param {function(event, mode): *} onClick - on item click callback (passed mode arg is new mode after click)
 * @param {function(event, mode): *} onEnter - on item enter callback
 * @param {function(event, mode): *} onRangeLeave - on range component leave callback
 * @returns {{
 *   mode: string,
 *   handleEnter: function,
 *   handleClick: function,
 *   range: { start, end },
 *   handleRangeLeave: function,
 *}}
 */
export const useRangeSelect = ({
  onClick = null,
  onEnter = null,
  onRangeLeave = null,
} = {}) => {
  const [range, setRange] = useState(INITIAL_RANGE);
  const nextMode = useMemo(() => cyclicSequence(MODE_SEQUENCE), []);
  const [mode, setMode] = useState(() => nextMode());

  const onItemEnter = (event) => {
    const index = +event.currentTarget.getAttribute('data-index');

    if (mode !== SELECTED_RANGE_MODE) {
      setRange(({ start }) =>
        mode === SELECT_MODE
          ? { start: index, end: index }
          : { start, end: index }
      );
    }

    return onEnter && onEnter(event, mode);
  };

  const onItemClick = (event) => {
    const index = +event.currentTarget.getAttribute('data-index');
    const newMode = nextMode();

    setRange(({ start }) =>
      newMode === SELECTED_RANGE_MODE
        ? { start, end: index }
        : { start: index, end: index }
    );
    setMode(newMode);

    return onClick && onClick(event, newMode);
  };

  const onLeave = (event) => {
    if (mode === SELECT_MODE) {
      setRange(INITIAL_RANGE);
    }
    return onRangeLeave && onRangeLeave(event, mode);
  };

  return {
    mode,
    range,
    handleEnter: useCallback(onItemEnter, [setRange, mode, onEnter]),
    handleClick: useCallback(onItemClick, [setRange, setMode, onClick]),
    handleRangeLeave: useCallback(onLeave, [mode, onRangeLeave]),
  };
};
