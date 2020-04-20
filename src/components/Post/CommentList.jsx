import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { List,
         ListSubheader } from '@material-ui/core'

import Comment from './Comment.jsx'
import { getCommentsFromPost } from '../../commentBackEnd.js';

const useStyles = makeStyles(theme => ({
 name: {
   padding: theme.spacing(0, 1, 1),
 },
}));

const CommentList = (props) => {

  const classes = useStyles();
  const postID = props.postID;
  const local = props.local;
  const action = props.action;

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

   // function isLocal(comment) {
   //   return(comment.local === true)
   // }
   //
   // function isNotLocal(comment) {
   //   return(!comment.local === false)
   // }
   //
   // let c = [];
   //
   // if (local){
   //   c = comments.filter(isLocal);
   //   console.log(c)
   // }
   // else{
   //   c = comments.filter(isNotLocal);
   //   console.log(c)
   // }

  const commentsList = comments.map((comment) =>
    <Comment username={comment.userName}
             commentText={comment.comment}
             userID={comment.userID}
             local={local}
    />
  );

  return (
    <React.Fragment>
      <List
        subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Local
                </ListSubheader>
              }
      >
        {commentsList}
      </List>
    </React.Fragment>
  );
}

export default CommentList;
