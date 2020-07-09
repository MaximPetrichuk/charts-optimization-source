export const DOM_EVENT = 'domEvent';
export const CUSTOM_EVENT = 'customEvent';

export const EMPTY_VALUE = {};
export const EMPTY_ARRAY = [];
export const EMPTY_FUNCTION = () => null;
export const EOL = '\r\n';

export const STATUS_SUCCESS = 'success';
export const STATUS_ERROR = 'error';
export const STATUS_LOADING = 'loading';
export const STATUS_NOT_REQUESTED = 'notRequested';
export const STATUS_PENDING = 'pending';

export const AUTH_TOKEN_KEY = 'authToken';
export const SETTINGS_KEY = 'settings';

export const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const MANAGER_ROLE = 'manager';
export const USER_ROLE = 'user';

export const ASC = 'ascending';
export const DESC = 'descending';

export const TOP = 'top';
export const LEFT = 'left';
export const RIGHT = 'right';
export const BOTTOM = 'bottom';

export const DATE_FORMATS = {
  shortMonthFormat: 'yyyy MMM d',
  digitsFormat: 'MM/dd/yyyy',
  longFormat: "MMMM d yyyy 'at' HH:mm",
  yFormat: 'yyyy',
  ymFormat: 'yyyy/MM',
  ymdFormat: 'yyyy/MM/dd',
  ymdhmFormat: 'yyyy/MM/dd HH:mm',
  commonFormat: 'yyyy-MM-dd',
};

export const CARDINAL_POINTS = {
  N: 'N',
  NE: 'N-E',
  ES: 'E-S',
  S: 'S',
  SW: 'S-W',
  E: 'E',
  WN: 'W-N',
  W: 'W',
};

export const CARDINAL_BY_ANGLE = {
  0: CARDINAL_POINTS.N,
  45: CARDINAL_POINTS.NE,
  90: CARDINAL_POINTS.E,
  135: CARDINAL_POINTS.ES,
  180: CARDINAL_POINTS.S,
  225: CARDINAL_POINTS.SW,
  270: CARDINAL_POINTS.W,
  315: CARDINAL_POINTS.WN,
};

export const CARDINAL_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

export const TRANSITION_TIMEOUT = 500;

export const SHORT_TIME_UNITS = {
  hours: 'h',
  minutes: 'mn',
  seconds: 'ss',
};

export const TIMESTAMPS = {
  hour: 3600,
  day: 3600 * 24,
  year: 3600 * 24 * 365.24,
};

export const ERA_START_MOMENT_DATE_STRING = '0001-01-01T00:00:00+00:00';

export const ZIP_FILE_TYPE = 'application/zip';
export const OCTET_STREAM_FILE_TYPE = 'application/octet-stream';
