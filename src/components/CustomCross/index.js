import React from 'react';

/**
 * Cross of 2 lines for graph pointer
 * @param { number } x - pointer x
 * @param { number } y - pointer y
 * @param { number } offsetX - cross left offset
 * @param { number } offsetY - cross top offset
 * @param { number } width - cross width
 * @param { number } height - cross height
 * @param { string } color
 * @returns { JSX }
 */
const CustomCross = ({
  x,
  y,
  offsetX,
  offsetY,
  width,
  height,
  color = 'rgba(0,0,0,0.3)',
}) => (
  <div>
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        top: offsetY,
        left: x,
        height,
        border: 'none',
        borderLeft: `1px solid ${color}`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        top: y,
        left: offsetX,
        width,
        border: 'none',
        borderTop: `1px solid ${color}`,
      }}
    />
  </div>
);
export default CustomCross;
