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

        console.log(c)
        setComments(c);

        // const filtered = comments.filter(function (comment) {
        //   console.log(comment);
        //   console.log(comment.local);
        //   return (comment.local == false);
        // });
        //
        // console.log(filtered);
        // setComments(filtered);
      }
    }
    getComments();
 }, [])

  const commentsList = comments.map((comment) =>
    <Comment username={comment.userName}
             commentText={comment.comment}
             userID={comment.userID}
             local={local}
             localComment={comment.local}
    />
  );

  const subheader = local ? "Local" : "Non-local";

  return (
    <React.Fragment>
      <List
        subheader={
                <ListSubheader component="div"
                               id="nested-list-subheader"
                               color="primary"
                >
                  {subheader}
                </ListSubheader>
              }
      >
        <div style={{maxHeight: 400, overflow: 'auto'}}>
          {commentsList}
        </div>
      </List>
    </React.Fragment>
  );
}

export default CommentList;
