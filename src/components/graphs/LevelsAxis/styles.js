import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles({
  root: {
    position: 'relative',
    left: -10,
    top: ({ up, overflowLength }) => (up ? -overflowLength : 0),
  },
});
