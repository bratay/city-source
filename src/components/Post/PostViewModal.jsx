import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button,
         Card,
         CardActions,
         CardContent,
         CardMedia,
         Collapse,
         Dialog,
         DialogActions,
         DialogContent,
         DialogContentText,
         Grid,
         GridList,
         GridListTile,
         GridListTileBar,
         IconButton,
         List,
         ListSubheader,
         Modal,
         Typography } from '@material-ui/core'
import MessageIcon from '@material-ui/icons/Message'
import ShareIcon from '@material-ui/icons/Share'
import DeleteIcon from '@material-ui/icons/Delete';
import FavoriteBorderSharpIcon from '@material-ui/icons/FavoriteBorderSharp';
import Comment from './Comment.jsx'
import CommentField from './CommentField.jsx'
import { currentUserObj } from "../../signIn.js";

import { likePost } from '../../postBackEnd.js';
// import { getPostImage } from '../../imageStorageBackEnd.js';

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
    maxWidth: theme.spacing(100),
    maxHeight: theme.spacing(80),
    justify: 'center'
  },
  paper: {
    position: 'absolute',
    width: theme.spacing(100),
    height: theme.spacing(80),
    backgroundColor: theme.palette.background.paper,
    outline: 'none',
    padding: theme.spacing(6, 5, 4),
  },
  actionBar: {
    spacing: theme.spacing(50)
  },
  gridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  title: {
    flexGrow: 1,
    fontFamily: 'sans-serif',
    userSelect: 'none',
    color: "inherit",
  },
  like: {
    marginLeft: 'auto',
    alignItems: 'right',
  },
}));

const PostViewModal =  (props) => {
  const action = props.action

  const post = props.post

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

  const showLocalComments = (
    <Comment postID={post.postID} local={true} />
  );


  const showNonLocalComments = (
    <Comment postID={post.postID} local={false} />
  );

  const deleteButton = (currentUserObj !== null) ?
        (<IconButton className={classes.likes}
                     aria-label="delete post">
            <DeleteIcon color="primary"/>
          </IconButton>) : null

  const modal = (
        <Dialog open={open}
                onClose={() => {setOpen(false); action(false);}}
                fullWidth
                maxWidth={'md'}
                scroll={'body'} >
          <Collapse in={expandedPost}>
            <DialogContent style={{overflow: 'scroll'}}>
              <GridList className={classes.gridList} cellHeight={400} cols={1}>
                <GridListTile>
                  <img src={require("./citysource.png")}/>
                </GridListTile>
              </GridList>
              <Typography gutterBottom variant="h5" component="h2">
                {post.title}
              </Typography>
              <Typography gutterBottom variant="body1" style={{color: "#F06E38"}} component="p">
                {post.username}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {post.text}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button size="small" color="primary" startIcon={<MessageIcon />} onClick={handleExpandComments}>
                Comments
                </Button>
                <Button size="small" color="primary" startIcon={<ShareIcon />}>
                Share
              </Button>
              <IconButton className={classes.likes}
                          aria-label="like post">
                <FavoriteBorderSharpIcon color="primary"/>
              </IconButton>
              {deleteButton}
            </DialogActions>
          </Collapse>
          <Collapse in={expandedComments}>
            <DialogActions>
              <Button size="small" color="primary" startIcon={<MessageIcon />} onClick={handleExpandPost}>
                See post
              </Button>
            </DialogActions>
            <DialogContent>
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
                <Grid item xs={12} md={6}>
                  <CommentField />
                </Grid>
              </Grid>
            </DialogContent>
          </Collapse>
        </Dialog>
    );

  return modal;
}

export default PostViewModal;
