/**
 * standard regexp (RFC 5322 Official Standard)
 * @type {RegExp}
 */
export const EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * url regexp
 * @type {RegExp}
 */
export const URL_REGEXP = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

/**
 * number regexp
 * @type {RegExp}
 */
export const NUMBER_REGEXP = /^(-)?(\d+)[.]?(\d+)?$/;

/**
 * number regexp
 * @type {RegExp}
 */
export const NUMBER_REGEXP_WITH_COMMA = /^-?\d*?([,.])?(\d*)?$/;

/**
 * space regexp
 * @type {RegExp}
 */
export const SPACE_REGEXP = /[\s]/;

/**
 * unit regexp for graph labels. First matching group is label second - units
 * @type {RegExp}
 */
export const UNIT_REGEXP = /(.*)\s\[(.*)\]/;

/**
 * regexp for template variables in stats data ('some ${VAR} text')
 * @type {RegExp}
 */
export const STATS_TEMPLATE_VARIABLE_REGEXP = /[\s]*\${.*}/;

/**
 * regexp for units template in stats data (ex.: 'some var [%]')
 */
export const STATS_UNITS_REGEXP = /\[.*]/g;

/**
 * FIXME: do we really need/use this constant? Remove if not.
 * regexp for string that contains at least one uppercase letter and at least one number
 * may also contain latin and special characters
 * @type {RegExp}
 */
export const INCLUDES_UPPERCASE_AND_NUMBER = /([A-Z]+.*\d+)|(\d+.*[A-Z]+)/;

/**
 * Regexp for password, contains at least one uppercase letter, lowecase letter and digit.
 * May also contain special characters. The length is not limited.
 * @type {RegExp}
 */
export const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

/**
 * vclass type regexp. Helps to parse stats_id and get vclass type
 * vclass is some additional widget for graph
 * @type {RegExp}
 */
export const VCLASS_TYPE_REGEXP = /-([\w]*)-vclass/;

/**
 * regexp for series of numbers from 1 to 99
 * @type {RegExp}
 */
export const ONE_TO_NINETY_NINE_NUMBERS_SERIES_REGEXP = /^(([1-9]|[1-9][0-9]),)*([1-9]|[1-9][0-9])$/;

/**
 * regexp for planning table coordinates(ex.: B5:K10)
 * @type {RegExp}
 */
export const PLANNING_TABLE_COORDINATES_REGEXP = /^[a-zA-Z]\d+:[a-zA-Z]\d+$/;

/**
 * regexp to get first word from camelCased name
 * @type {RegExp}
 */
export const FIRST_CAMEL_CASE_WORD_REGEXP = /^[\w]+(?=[A-Z])/;

/**
 * regexp to check if stats id is for monthly data
 * @type {RegExp}
 */
export const STATS_ID_MONTH_REGEXP = /month/;

/**
 * regexp to check any word character with - and -
 * @type {RegExp}
 */
export const PROJECT_NAME_REGEXP = /^[-\w]+$/;

/**
 * regexp for deprecated characters
 * @type {RegExp}
 */
export const PROJECT_NAME_DEPRECATED_REGEXP = /[^-\w]/;
