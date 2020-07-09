import { fade, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(({ palette }) => ({
  rect: {
    cursor: 'pointer',
    outline: 'none',
    '&:hover': {
      fill: fade(palette.blue.graph, 0.6),
    },
  },
}));
