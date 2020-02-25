import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar,
         Button,
         Divider,
         Grid,
         List,
         ListItem,
         ListItemText,
         Modal,
         TextField,
         Typography } from '@material-ui/core'

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
    padding: theme.spacing(4, 4, 3),
  },
  name: {
    padding: theme.spacing(2),
  },
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
          <div style={{maxHeight: 450, overflow: 'auto'}}>
            <List>
              <ListItem button>
                <Avatar/>
                <ListItemText className={classes.name} primary="John Williams" />
              </ListItem>
              <ListItem button>
                <Avatar/>
                <ListItemText className={classes.name} primary="Karen Smith" />
              </ListItem>
              <ListItem button>
                <Avatar/>
                <ListItemText className={classes.name} primary="Robert Jones" />
              </ListItem>
              <ListItem button>
                <Avatar/>
                <ListItemText className={classes.name} primary="Mary Johnson" />
              </ListItem>
            </List>
          </div>
        </div>
      </Modal>
    );

  return modal;
}

export default ProfileSearchModal;
