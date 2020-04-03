import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar,
         Button,
         Card,
         CardActions,
         CardContent,
         CardMedia,
         Divider,
         Grid,
         List,
         ListItem,
         ListItemText,
         Modal,
         TextField,
         Typography } from '@material-ui/core'
import MessageIcon from '@material-ui/icons/Message'
import ShareIcon from '@material-ui/icons/Share'

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
  card: {
    maxWidth: theme.spacing(90),
  },
  paper: {
    position: 'absolute',
    width: theme.spacing(100),
    height: theme.spacing(80),
    backgroundColor: theme.palette.background.paper,
    outline: 'none',
    padding: theme.spacing(6, 5, 4),
  },
  name: {
    padding: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontFamily: 'sans-serif',
    userSelect: 'none',
    color: "inherit",
  },
}));

const PostViewModal =  (props) => {
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
          <div style={{maxHeight: 600, overflow: 'auto'}}>
            <Card className={classes.card} >
              <CardMedia
                component="img"
                alt="postImg"
                height="300"
                image={require('./citysource.png')}
                title="My Project"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  My Project
                </Typography>
                <Typography gutterBottom variant="body1" style={{color: "#F06E38"}} component="p">
                  John Williams
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" startIcon={<MessageIcon />}>
                  Comments
                  </Button>
                  <Button size="small" color="primary" startIcon={<ShareIcon />}>
                  Share
                </Button>
              </CardActions>
            </Card>
          </div>
        </div>
      </Modal>
    );

  return modal;
}

export default PostViewModal;
