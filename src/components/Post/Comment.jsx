import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Avatar,
         ListItem,
         ListItemText } from '@material-ui/core'

import { getCommentsFromPost } from '../../commentBackEnd.js';

const useStyles = makeStyles(theme => ({
 name: {
   padding: theme.spacing(0, 1, 1),
 },
}));

const Comment = (props) => {

  const classes = useStyles();
  const postID = props.postID;
  const local = props.local;

  const [comments, setComments] = React.useState([])

  React.useEffect(() => {
    async function getComments() {
      if (postID != null){
        const c = await getCommentsFromPost(postID);
        console.log("comments", c);
        setComments(c);
      }
    }
    getComments();
 }, [])

   function isLocal(comment) {
     return(comment.local === true)
   }

   function isNotLocal(comment) {
     return(!comment.local === false)
   }

   let c = [];

   if (local){
     c = comments.filter(isLocal);
     console.log(c)
   }
   else{
     c = comments.filter(isNotLocal);
     console.log(c)
   }

  const commentsList = c.map((comment) =>
    <ListItem button>
      {console.log(comment.comment)}
      <Avatar/>
      <ListItemText
        primary={comment.userName}
        secondary={comment.comment}
        className={classes.name}
      />
    </ListItem>
  );

  console.log("commentslist: ", commentsList)

  return (
    <React.Fragment>
      {commentsList}
    </React.Fragment>
  );
}

export default Comment;
