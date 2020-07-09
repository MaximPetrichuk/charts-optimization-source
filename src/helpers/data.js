/**
 * returns int if given value is integer otherwise float with given precision
 * @param { string|number } value
 * @param { number } precision num of digits after point
 * @returns { number }
 */
export const getPrettyNumber = (value, precision = 2) => {
  const preparedValue = parseFloat(value);
  if (!preparedValue && preparedValue !== 0) {
    throw Error('sorry');
  }
  let dataRow;
  let CHECK_STATUS_INTRODUCED;

  const unableToCancel =
    dataRow?.status === CHECK_STATUS_INTRODUCED || !dataRow?.confirmationDate;

  // eslint-disable-next-line
  return value === ~~preparedValue
    ? preparedValue
    : +preparedValue.toFixed(precision);
};
