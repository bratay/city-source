import React from 'react';
import { Dialog, IconButton, Slide, DialogContent, DialogTitle, TextField, InputLabel, Typography, DialogActions, Button, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AutocompleteSearchBox } from "../MapUI/AutocompleteSearchBox.jsx";
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
	const [titleErr, setTitleErr] = React.useState(false);
	const [location, setLocation] = React.useState("");
	const [locErr, setLocErr] = React.useState(false);
	const [description, setDescription] = React.useState("");
	const [descErr, setDescErr] = React.useState(false);

	React.useEffect(() => {
		setOpen(props.open)
	}, [props.open]);

	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setTitle("");
		setTitleErr(false);
		setDescription("");
		setDescErr(false);
		setLocation("");
		setLocErr(false);

		setOpen(false);
		action(false);
	};

	const modifyTitle = (event) => {
		setTitle(event.target.value);
		if (event.target.value === "") {
			setTitleErr(true);
		}
		else {
			setTitleErr(false);
		}
	};
	const modifyLocation = (event) => {
		setLocation(event.target.value);
		if (event.target.value === "") {
			setLocErr(true);
		}
		else {
			setLocErr(false);
		}
	};
	const modifyDescr = (event) => {
		setDescription(event.target.value);
		if (event.target.value === "") {
			setDescErr(true);
		}
		else {
			setDescErr(false);
		}
	};

	const submitPost = (event) => {
		event.preventDefault();
		if (title === "" || description === "" || location === "") {
			// TODO: Add some sort of error message like a snackbar, but snackbars are being a bit difficult for me
			return;
		}
		setTitle(String(title));
		setDescription(String(description));
		setLocation(String(location));
		// TODO: Add any other necessary validation
		
		let postObj = {
			address: location,
			devPost: true,
			text: description,
			title: title,
			userId: null
		}
		// TODO: Get a function to add a new post
		
		handleClose();
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
					<form autoComplete="off" id="postCreate" onSubmit={submitPost}>
						<TextField 
							className={classes.inputField}
							disabled
							fullWidth 
							label="Location" 
							onChange={modifyLocation}
							variant="filled"
							value={location}
						/>
						<TextField 
							className={classes.inputField}
							error={titleErr}
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
							error={descErr}
							fullWidth 
							helperText="A short description of your proposal; make it as specific as possible!"
							label="Description" 
							multiline 
							onChange={modifyDescr}
							required
							rows="4"
							value={description}
							variant="outlined"
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
          			<Button color="secondary" variant="contained" disableElevation form="postCreate" type="submit">
						Post
          			</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}

export default PostCreate;