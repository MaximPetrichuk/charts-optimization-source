import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
  title: {
    margin: '5px 25px',
    whiteSpace: 'pre-wrap',
  },
  wrapper: {
    position: 'relative',
    overflow: 'visible',
  },
  graphContainer: {
    userSelect: 'none',
    '& svg': {
      overflow: 'visible',
    },
  },
  levelSelect: {
    marginTop: ({ canvasOffset }) => canvasOffset,
  },
});
