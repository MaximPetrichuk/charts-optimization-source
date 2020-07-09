import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

export const useStyles = makeStyles(({ palette }) => ({
  tooltipContainer: {
    position: 'absolute',
    top: ({ y }) => y,
    left: ({ x }) => x,
    transform: ({ translate }) =>
      `translate(${translate.x || 0}, ${translate.y || 0})`,
    padding: 5,
    borderRadius: 5,
    color: palette.lightGrey.light,
    whiteSpace: 'pre',
    backgroundColor: fade(palette.black.main, 0.6),
  },
}));
