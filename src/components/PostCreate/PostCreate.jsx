import React from 'react';
import { Dialog, IconButton, Slide, DialogContent, DialogTitle, TextField, InputLabel, Typography, DialogActions, Button, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	},
	inputField: {
		marginBottom: "1em",
	},
	inputLabel: {
		marginBottom: "5px",
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export function PostCreate(props) {
	const classes = useStyles();
	const action = props.action;
	const [open, setOpen] = React.useState(props.open);

	const [title, setTitle] = React.useState("");
	const [description, setDescription] = React.useState("");

	React.useEffect(() => {
		setOpen(props.open)
	}, [props.open]);

	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
		action(false);
	};

	const modifyTitle = (event) => {
		setTitle(event.target.value);
	};
	const modifyDescr = (event) => {
		setDescription(event.target.value);
	};

	const post = () => {
		if (title === "" || description === "") {
			// TODO: Add some sort of error message like a snackbar, but snackbars are being a bit difficult for me
			return;
		}
		// TODO: Add any other necessary validation
		// TODO: Get a function to add a new post
		
	};

	return (
		<React.Fragment>
			<Dialog 
				TransitionComponent={Transition} 
				disableBackdropClick
				fullWidth={true} 
				keepMounted 
				maxWidth={'md'} 
				onClose={handleClose} 
				open={open} 
				scroll={'body'} 
			>
				<Tooltip arrow placement="left" title="Changes won't be saved!">
					<IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</Tooltip>
				<DialogTitle>Create a Post</DialogTitle>
				<DialogContent>
					<form autoComplete="off">
						<TextField 
							className={classes.inputField}
							fullWidth 
							helperText="Make it descriptive; something to get people interested in your proposal!"
							label="Title" 
							onChange={modifyTitle}
							required 
							variant="filled"
							value={title}
						/>
						<TextField 
							className={classes.inputField}
							fullWidth 
							helperText="A short description of your proposal; make it as specific as possible!"
							label="Description" 
							multiline 
							onchange={modifyDescr}
							required
							rows="4"
							variant="outlined"
							value={description}
						/>
						<InputLabel htmlFor="postimg" className={classes.inputLabel}>Cover Image</InputLabel>
						<input type="file" id="postimg"/>
						<Typography variant="body2" style={{ marginTop: "5px" }}>* denotes required field</Typography>
					</form>
				</DialogContent>
				<DialogActions>
					<Button color="primary" onClick={handleClose}>
            			Discard
          			</Button>
          			<Button color="secondary" variant="contained" disableElevation>
						Post
          			</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}

export default PostCreate;