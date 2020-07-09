import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

export const useStyles = makeStyles(({ palette }) => ({
  container: {
    zIndex: 2,
    padding: 5,
    borderRadius: 5,
    color: palette.lightGrey.light,
    backgroundColor: fade(palette.black.main, 0.6),
    textAlign: ({ align }) => align,
    userSelect: 'none',
  },
}));
