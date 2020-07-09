import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  container: {
    zIndex: 1,
    width: 60,
    height: ({ height }) => height,
    lineHeight: ({ isLongMode }) => (isLongMode ? 1 : 'normal'),
    borderLeft: `solid 1px ${theme.palette.black.main}`,
  },
  levelContainer: {
    background: theme.palette.blue.graph,
    width: 20,
    borderTop: `solid 0.5px ${theme.palette.black.main}`,
    borderRight: `solid 0.5px ${theme.palette.black.main}`,
    marginRight: 5,
    '&:hover': {
      background: theme.palette.blue.light,
    },
  },
  level: {
    flex: 1,
  },
  tickContainer: {
    flex: 1,
    fontSize: ({ isLongMode }) => (isLongMode ? 7 : 9),
  },
  lastLevelContainer: {
    borderBottom: `solid 1px ${theme.palette.black.main}`,
  },
  currentLevel: {
    background: theme.palette.blue.main,
  },
  currentLevelLabel: {
    fontWeight: 700,
  },
  titleContainer: {
    width: 10,
    position: 'relative',
  },
  title: {
    width: 200,
    transform: 'rotate(-90deg)',
    position: 'absolute',
    left: -110,
  },
  axisContainer: {
    width: 0,
  },
  levelButton: {
    outline: 'none',
    width: '100%',
    height: '100%',
    padding: 0,
    margin: 0,
    cursor: 'pointer',
  },
}));
