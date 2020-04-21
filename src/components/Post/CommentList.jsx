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
  const [num, setNum] = React.useState(props.num) //this is so stupid. so dumb and i hate myself

  React.useEffect(() => {
    setNum(props.num)
    async function getComments() {
      if (postID != null){
        const c = await getCommentsFromPost(postID);
        setComments(c);
      }
    }
    getComments();
 }, [props.num])

  const commentsList = comments.map((comment) =>
    <Comment username={comment.userName}
             commentText={comment.comment}
             userID={comment.userID}
             local={local}
             localComment={comment.local}
             picUrl={comment.picURI}
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
