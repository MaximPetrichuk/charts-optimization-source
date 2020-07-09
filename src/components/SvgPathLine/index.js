import React from 'react';

/**
 * Simple svg path line without fill
 * @note use it in svg context
 * @param { string } color
 * @param { string } path
 * @param { object } props
 * @returns { JSX }
 */
const SvgPathLine = ({ color, path, ...props }) => (
  <path {...props} stroke={color} fill="none" d={path} />
);
export default SvgPathLine;
