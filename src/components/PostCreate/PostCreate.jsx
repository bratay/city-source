import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, IconButton, InputLabel, Slide, Snackbar, TextField, Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import escape from 'validator/lib/escape';
import { createpost, setPostInformation } from '../../postBackEnd.js';
import { storePostImage } from '../../imageStorageBackEnd.js';
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
		paddingBottom: "5px",
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
	const [location, setLocation] = React.useState(props.initLoc);
	const [coordinates, setCoordinates] = React.useState(props.initCoords);
	const [locErr, setLocErr] = React.useState(false);
	const [description, setDescription] = React.useState("");
	const [descErr, setDescErr] = React.useState(false);
	const [coverImg, setCoverImg] = React.useState(null);
	const [imgErr, setImgErr] = React.useState(false);

	const [successOpen, setSuccessOpen] = React.useState(false);
	const [errorOpen, setErrorOpen] = React.useState(false);

	React.useEffect(() => {
		setOpen(props.open)
	}, [props.open]);

	React.useEffect(() => {
		setLocation(props.initLoc);
	}, [props.initLoc]);

	React.useEffect(() => {
		setCoordinates(props.initCoords)
	}, [props.initCoords]);

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
		setCoordinates({lat: null, lng: null});
		setCoverImg(null);
		setImgErr(false);

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
		if (event.target.value === "") {
			setLocErr(true);
			setLocation("");
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
	const modifyCoverImg = (event) => {
		setCoverImg(event.target.files[0]);
		if (event.target.files[0].type.search(/image\/jpeg|image\/png/g) === -1 || event.target.files[0].size > 1000000) {
			setImgErr(true);
		}
		else {
			setImgErr(false);
		}
	};

	const handleSuccessClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setSuccessOpen(false);
	}
	const handleErrorClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setErrorOpen(false);
	}

	const submitPost = (event) => {
		// event.preventDefault();
		if (titleErr || descErr || imgErr || locErr || title === "" || location === "" || description === "") {
			// TODO: Add some sort of error message like a snackbar, but snackbars are being a bit difficult for me
			if (title === "") {
				setTitleErr(true);
			}
			if (description === "") {
				setDescErr(true);
			}
			if (location === "") {
				setLocErr(true);
			}
			setErrorOpen(true);
			return;
		}
		setTitle(escape(title));
		setDescription(escape(description));
		setLocation(escape(location));
		
		let postObj = {
			address: location,
			lat: coordinates.lat,
			long: coordinates.lng,
			pic: null,
			text: description,
			title: title
		}
		let createdPost = createpost(postObj);
		let postID = createdPost.postID;
		if(coverImg){
			storePostImage(postID, coverImg);
		}
		setSuccessOpen(true);
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
						<FormControl variant="filled" error={locErr} required fullWidth style={{marginBottom: "1em"}}>
							<InputLabel htmlFor="locationField">Location</InputLabel>
							<AutocompleteSearchBox 
								changeFunc={modifyLocation}
								inputProps={{
									error: locErr,
									fullWidth: true,
									id: 'locationField',
									required: true,
								}}
								initValue={location}
								initCoords={coordinates}
								presetVal={location}
								setCoords={setCoordinates} 
								setHometown={setLocation}
							/>
						</FormControl>
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
						<InputLabel htmlFor="postimg" className={classes.inputLabel} error={imgErr}>Cover Image</InputLabel>
						<input type="file" id="postimg" onChange={modifyCoverImg}/>
						<FormHelperText error={imgErr}>Must be .jpg or .png format less than 1 MB.</FormHelperText>
						
						<Typography variant="body2" style={{ marginTop: "5px" }}>* denotes required field</Typography>
					</form>
				</DialogContent>
				<DialogActions>
					<Button color="primary" onClick={handleClose}>
            			Discard
          			</Button>
          			<Button color="secondary" variant="contained" disableElevation onClick={submitPost}>
						Post
          			</Button>
				</DialogActions>
			</Dialog>
			<Snackbar
				action={
					<React.Fragment>
					  	<IconButton size="small" aria-label="close" color="inherit" onClick={handleSuccessClose}>
							<CloseIcon fontSize="small" />
					  	</IconButton>
					</React.Fragment>
				}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				open={successOpen}
				autoHideDuration={6000}
				onClose={handleSuccessClose}
				message="Post created successfully!"
			/>
			<Snackbar
				action={
					<React.Fragment>
					  	<IconButton size="small" aria-label="close" color="inherit" onClick={handleErrorClose}>
							<CloseIcon fontSize="small" />
					  	</IconButton>
					</React.Fragment>
				}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				open={errorOpen}
				autoHideDuration={6000}
				onClose={handleErrorClose}
				message="Post creation failed. Please check the highlighted fields."
			/>
		</React.Fragment>
	);
}

export default PostCreate;