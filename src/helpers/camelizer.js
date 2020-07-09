import * as humps from 'humps';

/**
 * Decamelize form data keys and values
 * @param {FormData} formData
 * @param {Object} [options]
 * @return {FormData}
 */
export const decamelizeFormDataKeys = (formData, options) => {
  const decamelizedFormData = new FormData();

  formData.forEach((value, key) => {
    const isFile = value instanceof File;
    const isFileList = value instanceof FileList;
    const decamelizedValue =
      isFile || isFileList ? value : humps.decamelizeKeys(value, options);

    decamelizedFormData.append(
      humps.decamelize(key, options),
      decamelizedValue,
    );
  });

  return decamelizedFormData;
};

/**
 * Decamelize object keys with ignore form data
 * @param {Object} data
 * @param {Object} [options]
 */
export const decamelizeKeys = (data, options) => {
  if (data instanceof FormData) {
    return decamelizeFormDataKeys(data, options);
  }

  return humps.decamelizeKeys(data, options);
};

/**
 * Camelizes value if it's necessary
 * @param { string } value
 */
export const toCamelCase = (value) => {
  if (!/[\s-_]/.test(value)) {
    return value;
  }
  return humps.camelize(value);
};

/**
 * Decamelize value
 * @param {String} value
 * @param {Object} [options]
 */
export const toSnakeUpperCase = (value, options) =>
  humps.decamelize(value, options).toUpperCase();

/**
 * Camelizes object keys
 * @param args
 */
export const camelizeKeys = (...args) => humps.camelizeKeys(...args);

/**
 * Camelizes object values
 * @param { object } objectToCamelize
 */
export const camelizeValues = (objectToCamelize) =>
  Object.entries(objectToCamelize).reduce((acc, [key, value]) => {
    acc[key] = humps.camelize(value);
    return acc;
  }, {});

/**
 * Camelizes both object keys and values
 * @param { object } objectToCamelize
 */
export const camelizeBoth = (objectToCamelize) =>
  Object.entries(objectToCamelize).reduce((acc, [key, value]) => {
    acc[humps.camelize(key)] = humps.camelize(value);
    return acc;
  }, {});
