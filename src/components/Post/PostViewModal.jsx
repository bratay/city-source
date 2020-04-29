import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button,
         Collapse,
         Dialog,
         DialogActions,
         DialogContent,
         DialogTitle,
         Grid,
         GridList,
         GridListTile,
         IconButton,
         List,
         ListSubheader,
         TextField,
         Typography } from '@material-ui/core'
import MessageIcon from '@material-ui/icons/Message'
import ShareIcon from '@material-ui/icons/Share'
import DeleteIcon from '@material-ui/icons/Delete';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderSharpIcon from '@material-ui/icons/FavoriteBorderSharp';
import Comment from './Comment.jsx'
import CommentList from './CommentList.jsx'

import { currentUserObj } from "../../signIn.js";
import { deletePost, likePost, dislikePost, getUserInLikes, getLikeCount } from '../../postBackEnd.js';
import { createComment } from '../../commentBackEnd.js';

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

export const PostViewModal =  (props) => {
  const action = props.action

  const post = props.post

  const classes = useStyles();
  const [open, setOpen] = React.useState(props.open);
  const [expandedComments, setExpandedComments] = React.useState(false);
  const [expandedPost, setExpandedPost] = React.useState(true);
  const [comment, addComment] = React.useState(0);
  const [commentString, updateCommentString] = React.useState("");
  const [liked, setLiked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(props.open)
  }, [props.open])

  React.useEffect(() => {
    async function getNumLikes(){
      const numLikes = await getLikeCount(post.postID);
      setLikeCount(numLikes);
    }
    getNumLikes();
  }, [])

  React.useEffect(() => {
    async function getLiked(){
      const isLiked = await getUserInLikes(post.postID, currentUserObj.userID);
      setLiked(isLiked);
    }
    getLiked();
  }, [])

  const handleExpandComments = () => {
    setExpandedComments(true);
    setExpandedPost(false);
  }

  const handleExpandPost = () => {
    setExpandedComments(false);
    setExpandedPost(true);
  }

  const clickLike = async () => {
    setLiked(true);
    await likePost(post.postID);
  }

  const clickUnlike = async () => {
    setLiked(false);
    await dislikePost(post.postID);
  }

  async function addNewComment(){
    await createComment(commentString, post.postID)
    updateCommentString("")
    addComment(comment+1)
  }

  async function deleteThisPost(){
    await deletePost(post.postID)
    setDeleteDialogOpen(false)
    setOpen(false)
  }

  const deleteButton = (currentUserObj.userID === post.userID) ?
        (<IconButton className={classes.likes}
                     aria-label="delete post"
                     onClick={() => {setDeleteDialogOpen(true)}}>
            <DeleteIcon color="primary"/>
          </IconButton>) : null

  const deleteDialog = (deleteDialogOpen) ?
      (
        <Dialog
          open={deleteDialogOpen}
          onClose={() => {setDeleteDialogOpen(false)}}
        >
          <DialogTitle>{"Do you want to delete this post?"}</DialogTitle>
          <DialogActions>
            <Button onClick={deleteThisPost} color="primary">
              Yes
            </Button>
            <Button onClick={() => {setDeleteDialogOpen(false)}} color="primary" autoFocus>
              No
            </Button>
          </DialogActions>
        </Dialog>
      ) : null

  const likeButton = (currentUserObj.userID != "" ) && (liked ?
    (<React.Fragment>
      <IconButton className={classes.likes}
                 aria-label="like post"
                 onClick={clickUnlike}>
        <FavoriteIcon color="primary"/>
      </IconButton>
      {likeCount}
       </React.Fragment>) :
    (<IconButton className={classes.likes}
                 aria-label="like post"
                 onClick={clickLike}>
        <FavoriteBorderSharpIcon color="primary"/>
      </IconButton>));

  const commentField = (currentUserObj.userID != "") ?
    ( <React.Fragment>
        <TextField label="Add Comment"
                   variant="outlined"
                   multiline
                   fullWidth
                   value={commentString}
                   onChange={(e) => {updateCommentString(e.target.value);}}/>
       <IconButton type="submit"
                   className={classes.iconButton}
                   aria-label="search"
                   onClick={addNewComment}>
         <ChevronRightIcon />
       </IconButton>
     </React.Fragment>
    ) : null;

  const modal = (
        <Dialog open={open}
                onClose={() => {setOpen(false); action(false);}}
                fullWidth
                maxWidth={'md'}
                scroll={'paper'} >
          <Collapse in={expandedPost}>
            <DialogContent style={{overflow: 'scroll'}}>
              <GridList className={classes.gridList} cellHeight={400} cols={1}>
               <GridListTile>
                 <img src={post.pic}/>
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
              {likeButton}
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
                  <CommentList postID={post.postID} local={true} num={comment} />
                </Grid>
                <Grid item xs={6} md={6}>
                  <CommentList postID={post.postID} local={false} num={comment} />
                </Grid>
              </Grid>
              <DialogActions>
                {commentField}
              </DialogActions>
            </DialogContent>
          </Collapse>
        </Dialog>
    );

  return (
    <React.Fragment>
      {modal}
      {deleteDialog}
    </React.Fragment>
  );
}

export default PostViewModal;
