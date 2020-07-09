import { useCallback, useEffect, useRef, useState } from 'react';

import { isPassiveListenersSupported } from 'helpers/dom';

/**
 * Hook implementing graph canvas scale and drag behaviour
 * Scale happens on wheel event, drag acts when mouse is pressed
 * Returns actual xDomain with scale and drag applied and current xDragPosition ref
 * @note Returned ref should be assigned to graph wrapper element
 * @param { number } wheelStep - scale step in percent
 * @param { number } canvasWidth - chart canvas width
 * @param { number } xCanvasOffset - x offset from wrapper left to canvas left
 * @param { number } minDomainRange - minimal allowed x domain range (domain[1] - domain[0])
 * @param { number } initialDomain - initial x domain
 * @returns {{
 *   xDomain: [],
 *   xDragPosition: React.MutableRefObject,
 *   wrapperRef: { current: Element }
 * }}
 */
export const useXScalableCanvas = ({
  wheelStep,
  canvasWidth,
  xCanvasOffset,
  minDomainRange,
  initialDomain: [xMin, xMax],
}) => {
  /**
   * @type {{ current: Element }}
   */
  const wrapperRef = useRef(null);
  const xDragPosition = useRef(null);
  const [xDomain, setXDomain] = useState([xMin, xMax]);

  const onMouseDown = useCallback(
    ({ clientX }) => {
      xDragPosition.current = clientX;
    },
    [xDragPosition]
  );

  const onMouseUp = useCallback(() => {
    xDragPosition.current = null;
  }, [xDragPosition]);

  const onDrag = useCallback(
    (currentX) => {
      const xOffset = xDragPosition.current - currentX;
      const offsetFraction = xOffset / canvasWidth;
      xDragPosition.current = currentX;

      setXDomain((prevDomain) => {
        const range = prevDomain[1] - prevDomain[0];
        const xStartValue = prevDomain[0] + range * offsetFraction;
        const xEndValue = prevDomain[1] + range * offsetFraction;

        return xStartValue <= xMin || xEndValue >= xMax
          ? prevDomain
          : [xStartValue, xEndValue];
      });
    },
    [setXDomain, canvasWidth, xMin, xMax, xDragPosition]
  );

  const onMouseMove = useCallback(
    (event) => xDragPosition.current && onDrag(event.clientX),
    [xDragPosition, onDrag]
  );

  const onWheel = useCallback(
    (event) => {
      event.preventDefault();
      const { x: chartX } = wrapperRef.current.getBoundingClientRect();
      // координаты курсора относительно холста
      const mouseCanvasX = event.clientX - (xCanvasOffset + chartX);
      // доля холста слева и справа от курсора
      const leftFraction = mouseCanvasX / canvasWidth;
      const rightFraction = 1 - leftFraction;
      // шаг прокрутки в процентах
      const step = event.deltaY < 0 ? wheelStep : -wheelStep;
      // считаем значение новой области с учетом положения курсора
      return setXDomain((prevDomain) => {
        const range = prevDomain[1] - prevDomain[0];
        const startX = prevDomain[0] + (range * leftFraction * step) / 100;
        const endX = prevDomain[1] - (range * rightFraction * step) / 100;
        if (endX - startX < minDomainRange) {
          return prevDomain;
        }

        return [Math.max(startX, xMin), Math.min(endX, xMax)];
      });
    },
    [
      wheelStep,
      wrapperRef,
      canvasWidth,
      setXDomain,
      xCanvasOffset,
      minDomainRange,
      xMin,
      xMax,
    ]
  );

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const passiveListenersSupported = isPassiveListenersSupported();
    wrapper.addEventListener(
      'wheel',
      onWheel,
      passiveListenersSupported ? { passive: false } : false
    );
    wrapper.addEventListener('mousedown', onMouseDown);
    wrapper.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      wrapper.removeEventListener('wheel', onWheel);
      wrapper.removeEventListener('mousedown', onMouseDown);
      wrapper.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [wrapperRef, onDrag, onWheel, onMouseMove, onMouseDown, onMouseUp]);

  return { xDomain, wrapperRef, xDragPosition };
};
