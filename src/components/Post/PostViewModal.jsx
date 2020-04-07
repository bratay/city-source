import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar,
         Button,
         Card,
         CardActions,
         CardContent,
         CardMedia,
         Collapse,
         Divider,
         Grid,
         List,
         ListItem,
         ListItemText,
         ListSubheader,
         Modal,
         TextField,
         Typography } from '@material-ui/core'
import MessageIcon from '@material-ui/icons/Message'
import ShareIcon from '@material-ui/icons/Share'
import Comment from './Comment.jsx'

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
    maxHeight: theme.spacing(70)
  },
  paper: {
    position: 'absolute',
    width: theme.spacing(100),
    height: theme.spacing(80),
    backgroundColor: theme.palette.background.paper,
    outline: 'none',
    padding: theme.spacing(6, 5, 4),
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
  const [expandedComments, setExpandedComments] = React.useState(false);
  const [expandedPost, setExpandedPost] = React.useState(true);

  React.useEffect(() => {
    setOpen(props.open)
  }, [props.open])

  const handleExpandComments = () => {
    setExpandedComments(true);
    setExpandedPost(false);
  }

  const handleExpandPost = () => {
    setExpandedComments(false);
    setExpandedPost(true);
  }

  const localComments = [1, 2, 3, 4]
  const nonLocalComments = [5, 6]

  const showLocalComments = localComments.map(() =>
    <Comment />
  );

  const showNonLocalComments = nonLocalComments.map(() =>
    <Comment />
  );

  const modal = (
      <Modal
        open={open}
        onClose={() => {setOpen(false); action(false);}}
      >
        <div style={modalStyle} className={classes.paper}>
          <div style={{maxHeight: 600, overflow: 'auto'}}>
            <Card className={classes.card} >
              <Collapse in={expandedPost}>
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
                  <Button size="small" color="primary" startIcon={<MessageIcon />} onClick={handleExpandComments}>
                    Comments
                    </Button>
                    <Button size="small" color="primary" startIcon={<ShareIcon />}>
                    Share
                  </Button>
                </CardActions>
              </Collapse>
              <Collapse in={expandedComments}>
                <CardActions>
                  <Button size="small" color="primary" startIcon={<MessageIcon />} onClick={handleExpandPost}>
                    See post
                  </Button>
                </CardActions>
                <CardContent>
                  <Grid container direction="row" spacing={2}>
                    <Grid item xs={6} md={6}>
                      <List
                        subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                  Local
                                </ListSubheader>
                              }
                      >
                        {showLocalComments}
                      </List>
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <List
                        subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                  Non-local
                                </ListSubheader>
                              }
                      >
                        {showNonLocalComments}
                      </List>
                    </Grid>
                  </Grid>
                </CardContent>
              </Collapse>
            </Card>
          </div>
        </div>
      </Modal>
    );

  return modal;
}

export default PostViewModal;
