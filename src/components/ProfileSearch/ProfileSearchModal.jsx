import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Modal, TextField, Typography } from '@material-ui/core'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 500,
    height: 600,
    backgroundColor: theme.palette.background.paper,
    borderRadius: '25px',
    outline: 'none',
    padding: theme.spacing(2, 4, 3),
  },
  text: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  textField: {
    width: 200,
  }
}));

const ProfileSearchModal =  (props) => {
  const action = props.action

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(props.open);

  React.useEffect(() => {
    setOpen(props.open)
  }, [props.open])

  const modal = (
      <Modal
        open={open}
        onClose={() => {setOpen(false); action(false);}}
      >
        <div style={modalStyle} className={classes.paper}>
          <TextField id="profile-search-field" label="Search" variant="outlined" fullWidth />
        </div>
      </Modal>
    );

  return modal;
}

export default ProfileSearchModal;
