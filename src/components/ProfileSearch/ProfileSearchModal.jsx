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
         Typography } from '@material-ui/core';
import ProfileItem from './ProfileItem.jsx';
import ProfileList from './ProfileList.jsx';
import { dynamicProfileSearch } from '../../profileSearch.js';
import { profileSearchList } from '../../profileSearch.js';

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

  async function search(e) {
    console.log(e.target.value);
    await dynamicProfileSearch(e.target.value);
    console.log(profileSearchList);
  };

  const modal = (
      <Modal
        open={open}
        onClose={() => {setOpen(false); action(false);}}
      >
        <div style={modalStyle} className={classes.paper}>
          <TextField onChange={(e) => {search(e)}} id="profile-search-field" label="Search" variant="outlined" fullWidth />
          <div style={{maxHeight: 450, overflow: 'auto'}}>
            <ProfileList/>
          </div>
        </div>
      </Modal>
    );

  return modal;
}

export default ProfileSearchModal;
