import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.black.main,
    padding: 10,
    opacity: 0.8,
    color: theme.palette.white.main,
  },
}));
