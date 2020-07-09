import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(({ palette }) => ({
  title: {
    margin: '5px 25px',
    whiteSpace: 'pre-wrap',
  },
  graphWrapper: {
    zIndex: 1,
  },
  paramsContainer: {
    marginLeft: 20,
  },
  graphContainer: {
    '& svg': {
      overflow: 'visible',
    },
  },
  band: {
    fill: palette.blue.main,
    stroke: palette.lightGrey.main,
    '&$selectRange': {
      fill: palette.blue.dark,
    },
    '&$selectedRange': {
      fill: palette.blue.dark,
    },
    '&$hoverable': {
      '&:hover': {
        fill: palette.blue.dark,
      },
    },
  },
  hoverable: {},
  selectRange: {},
  selectedRange: {},
}));
