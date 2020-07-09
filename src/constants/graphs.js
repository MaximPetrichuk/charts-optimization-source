export const VALUES_KEY = 'values';

export const DEFAULT_GRAPH_SELECT_VALUE = '0';

export const DEFAULT_GRAPH_VALUE = 0;

export const WEATHER_GRAPH_COMMON_PARAMS = {
  duration: {
    name: 'duration',
    label: 'Duration',
  },
  quantiles: {
    name: 'quantiles',
    label: 'Quantile',
  },
};

export const DEFAULT_GRAPH_WIDTH = 500;
export const DEFAULT_GRAPH_HEIGHT = 350;

export const DEFAULT_GRAPH_CANVAS_WIDTH = 420;
export const DEFAULT_GRAPH_CANVAS_HEIGHT = 350;

export const DEFAULT_LEVELS_BAR_WIDTH = 65;

export const MIN_ROSE_GRID_TICKS_AMOUNT = 3;
export const MIN_JPD_TICKS_AMOUNT = 6;
export const MIN_JPD_COLOR_TICKS_AMOUNT = 5;
export const MIN_WEATHER_GRAPH_TICKS_AMOUNT = 6;
export const MIN_CTS_GRAPH_TICKS_AMOUNT = 7;
export const MIN_TS_GRAPH_TICKS_AMOUNT = 8;
export const MIN_SCATTER_PLOT_TICKS_AMOUNT = 6;
export const MIN_ERROR_SCATTER_PLOT_TICKS_AMOUNT = 6;
export const MIN_EXTREME_PEAK_ROSE_TICKS_AMOUNT = 2;
export const MIN_RETURN_VALUE_TICKS_AMOUNT = 8;

export const VALID_GRID_TICKS_AMOUNT = { min: 2, max: 100 };

export const LEGAL_GRID_TICKS = [10, 5, 2, 1];

export const RAW_DATA_GRAPH_PARAMS_PATH = 'visualization.kwargs';
export const RAW_DATA_TITLE_PATH = 'visualization.web.dataLegend0';

export const WEATHER_GRAPH_VALUABLE_PARAMS = [
  'quantileName',
  'probabilityName',
  'probabilityMinName',
  'probabilityMaxName',
  'durationName',
  'ylabel',
];

export const DISTRIBUTION_ROSE_GRAPH_VALUABLE_PARAMS = [
  'varBinsName',
  'histogramName',
  'legendTitle',
  'dirBinsName',
];

export const INFINITY_LABEL = 'Infinity';

export const ANNUAL_INDEX = 0;

export const CTS_GRAPH_VALUABLE_PARAMS = ['yNames', 'xName'];

export const TS_GRAPH_VALUABLE_PARAMS = [
  'yNames',
  'xName',
  'ymin',
  'ymax',
  'ylabel',
];

export const MV_PROFILE_GRAPH_VALUABLE_PARAMS = [
  'yName',
  'xName',
  'x2Name',
  'invertY',
];

export const JPD_GRAPH_VALUABLE_PARAMS = [
  'xName',
  'yName',
  'cName',
  'cbarLabel',
];

export const APD_GRAPH_VALUABLE_PARAMS = ['yName', 'xName'];

export const APD_GRAPH_EXTRA_PARAMS = [
  {
    param: 'law',
    title: 'Univariate law',
  },
  {
    param: 'shapeParameter',
    title: 'Shape',
  },
  {
    param: 'locationParameter',
    title: 'Location',
  },
  {
    param: 'scaleParameter',
    title: 'Scale',
  },
];

export const SELECT_MODE = 'select';
export const SELECT_RANGE_MODE = 'selectRange';
export const SELECTED_RANGE_MODE = 'selectedRange';
export const RANGE_MODE = 'RANGE_MODE';

export const APD_HINT_BY_MODE = {
  [SELECT_MODE]: 'Click to start selection',
  [SELECT_RANGE_MODE]: 'Click to complete selection',
  [SELECTED_RANGE_MODE]: 'Click to deselect the range',
};

export const WIND_STATS_ID_PATTERN = 'WIN';
export const ALTITUDE_TYPE = 'altitude';
export const DEPTH_TYPE = 'depth';

export const STATS_API_UNITS_TO_COMMON_UNITS = {
  'm.s-1': 'm/s',
  'm.s$^-$$^1$': 'm/s',
  degrees: '°',
  degree: '°',
};

export const STATS_API_SELECT_POSTFIX = 'Choice';

export const DEFAULT_AXIS_INDEX = 0;

export const PD_SELECT_OCCURENCE_KEY = 'count';

export const DP_VCLASS_TYPE = 'dp';

export const THETAW_VCLASS_TYPE = 'thetaw';

export const THETA_VCLASS_TYPE = 'theta';

export const PD_SELECT_TITLES_BY_VCLASS_TYPE = {
  [DP_VCLASS_TYPE]: 'dp',
  [THETAW_VCLASS_TYPE]: 'θ',
};

export const XY_NESTING_ORDER = 'xy_nesting';
export const YX_NESTING_ORDER = 'yx_nesting';

export const GRAPH_EMPTY_PLACEHOLDER = -999;

export const JPD_THRESHOLD_FACTOR = 256;

export const GRAPHS_WIDGETS = {
  months: 'monthSelect',
  vclass: 'vclassSelect',
};

// EVA - Extreme Value Analysis
export const EVA_MAIN_VARIABLES = 'mainVariable';
export const EVA_DATA_PATH = 'data[0]';
export const EVA_PERIODS = 'returnPeriods';
export const EVA_VARIANTS = 'variants';
export const EVA_VARIANT_PARAMS_TO_PICK = [
  'law',
  'returnValues',
  'returnValuesUpper',
  'returnValuesLower',
];

export const OFFSET_ANGLE = 90;

export const EPD_GRAPH_VALUABLE_PARAMS = ['yName', 'xName', 'cName'];

export const PROBABILITY_KEYS = {
  EJPD: 'cName',
  EPD: 'yName',
};

export const OMNIDIRECTIONAL_TITLE = 'Omnidirectional';

export const APD_GRAPH_TOOLTIP_TITLE_PATH = 'variables.variables.0.longName';

// TODO if there wouldn't be any real data from api, hardcode it on server side
export const RETURN_VALUE_X_AXIS_VARIABLE = {
  units: 'years',
  name: '',
  longName: 'Return Period',
};

export const EXTREME_PARAMETERS = [
  { key: 'law', name: 'Law' },
  { key: 'multivariateLaw', name: 'Multivariate law' },
  { key: 'sampleLength', name: 'Sample length' },
  { key: 'blockSize', name: 'Block size' },
  { key: 'threshold', name: 'Threshold', units: 'm' },
  { key: 'poissonLambda', name: 'Poisson Lambda' },
  { key: 'shapeParameter', name: 'Shape' },
  { key: 'scaleParameter', name: 'Scale', units: 'm' },
  { key: 'locationParameter', name: 'Location', units: 'm' },
  { key: 'independenceFactor', name: 'Independence factor', precision: 1 },
];

// className to use on transparent svg elements to not include them in rendering while saving as image
export const IGNORE_ON_SAVING_CLASS = 'svg-ignore-on-saving';

export const IMAGE_GRAPH_DATA_FORMAT = 'Image';
export const EXCEL_GRAPH_DATA_FORMAT = 'Excel';
export const MATLAB_GRAPH_DATA_FORMAT = 'Matlab';
export const NETCDF_GRAPH_DATA_FORMAT = 'NetCDF';

export const DEFAULT_GRAPH_DATA_LOADING_FORMATS = [
  IMAGE_GRAPH_DATA_FORMAT,
  EXCEL_GRAPH_DATA_FORMAT,
  MATLAB_GRAPH_DATA_FORMAT,
  NETCDF_GRAPH_DATA_FORMAT,
];

export const CHART_SVG_ID = 'chart-internal-svg';
export const CHART_TITLE_ID = 'chart-main-title';

export const DOWNLOADED_GRAPH_FILES_FORMATS = {
  [EXCEL_GRAPH_DATA_FORMAT]: 'xls',
  [MATLAB_GRAPH_DATA_FORMAT]: 'mat',
  [NETCDF_GRAPH_DATA_FORMAT]: 'nc',
};

export const CHART_CONTAINER_ID = 'stats-chart-container-id';

export const SVG_CAPTURE_MODE = 'svgSavingMode';
export const HTML_CAPTURE_MODE = 'htmlSavingMode';
