import React from 'react';
import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { PostViewModal } from '../Post/PostViewModal';

const useStyles = makeStyles(theme => ({
	post: {
		marginBottom: "1em",
	},
}));

export function PostItem(props) {
	const classes = useStyles();
	const post = props.postObj;
	const [showPost, setShowPost] = React.useState(false);

	const PostImg = () => {
		if (post.pic !== null) {
			return (
				<CardMedia
					style={{width: 151}}
					component="img"
					src={post.pic}
				/>
			);
		}
		else {
			return null;
		}
	}

	const PostDialog = showPost ? (
		<PostViewModal action={setShowPost} open={showPost} post={post} />
	) : null;

	const openPost = () => {
		setShowPost(true);
	}
	
	let textTruncate = post.text;
	if (post.text.length > 140) {
		textTruncate = post.text.slice(0, 141);
		textTruncate = textTruncate.replace(/\s*\S*$/, "...");
	}

	return (
		<React.Fragment>
			<Card className={classes.post}>
				<div style ={{display: "flex",}}>
					<PostImg/>
					<CardContent>
						<Typography component="h5" variant="h5">
							{post.title}
						</Typography>
						<Typography variant="body2">
							{textTruncate}
						</Typography>
					</CardContent>
				</div>	
				<CardActions>
					<Button size="small" color="primary" style={{marginLeft: 'auto',}} onClick={openPost}>
						Read More
					</Button>
				</CardActions>					
			</Card>
			{PostDialog}
		</React.Fragment>
	);
}