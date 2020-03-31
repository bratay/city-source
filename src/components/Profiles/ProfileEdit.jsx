import React from 'react';
import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, IconButton, InputLabel, LinearProgress, Slide, TextField, Typography, Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getUserProfileObj } from "../../profileBackEnd.js";
import CloseIcon from '@material-ui/icons/Close';
import RoomIcon from '@material-ui/icons/Room';

const useStyles = makeStyles(theme => ({
	avatar: {
		position: "relative",
		top: 0,
		left: 0,
		width: theme.spacing(14),
		height: theme.spacing(14),
		marginLeft: "auto",
		marginRight: "auto",
	},
	closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500],
	},
	editHead: {
		marginTop: theme.spacing(2),
	},
	avatarParent: {
		position: 'relative',
		top: 0,
		left: 0,
	},
	devIcon: {
		position: 'absolute',
		bottom: "0px",
		right: "0px",
	},
	userBasics: { 
		marginBottom: "1em",
		marginTop: "1em",
	},
	post: {
		marginBottom: "1em",
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

export function ProfileEdit(props) {
	const action = props.action;
	const classes = useStyles();
	const [userObj, setUserObj] = React.useState(null);
	const [open, setOpen] = React.useState(props.open);

	const [username, setUsername] = React.useState(undefined);
	const [hometown, setHometown] = React.useState(undefined);
	const [bio, setBio] = React.useState(undefined);

	let modified = false;

	React.useEffect(() => {
		setOpen(props.open)
	}, [props.open]);

	React.useEffect(() => {
		async function fetchUserObj() {
			const obj = await getUserProfileObj(props.userId);
			setUserObj(obj);
			setUsername(obj.username);
			setHometown(obj.hometown);
			setBio(obj.bio);
		}
		fetchUserObj();
	 }, [props.open]);

	const handleClose = () => {
		setOpen(false);
		action(false);
	};

	const saveChanges = () => {
		if (username === "" || hometown === "") {
			// TODO: Add some sort of error message like a snackbar, but snackbars are being a bit difficult for me
			return;
		}
		// TODO: Add any other necessary validation
		Object.defineProperties(userObj, {
			username: {
				value: username,
			},
			hometown: {
				value: hometown,
			},
			bio: {
				value: bio,
			},
		});
		
		// TODO: At this point, userObj is updated and ready to be sent back to the DB
	};

	const modifyName = (event) => {
		setUsername(event.target.value);
	};
	const modifyHome = (event) => {
		setHometown(event.target.value);
	};
	const modifyBio = (event) => {
		setBio(event.target.value);
	};

	if (userObj === null) {
		return (
			<React.Fragment>
				<Dialog open={open} onClose={handleClose} TransitionComponent={Transition} keepMounted fullWidth={true} maxWidth={'md'} scroll={'body'}>
				<IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
					  <CloseIcon />
				</IconButton>
					<DialogContent>
						<DialogContentText>
							<Container>
								<Typography variant="h3" className={classes.editHead}>Edit Profile</Typography>
								<Grid container spacing={2} alignItems="flex-end" className={classes.userBasics}>
									<Grid item sm={12} md container>
										<Grid item sm={12} container direction="column" spacing={2} justify="flex-end">
											<Grid item xs>
												<InputLabel htmlFor="usernameField" className={classes.inputLabel}>Display Name *</InputLabel>
												<TextField 
													className={classes.inputField} 
													disabled
													fullWidth
													id="usernameField" 
													onChange={modifyName} 
													required
													variant="filled"
												/>
												<Grid container spacing={1} alignItems="flex-end">
													<Grid item>
														<RoomIcon />
													</Grid>
													<Grid item>
														<InputLabel htmlFor="hometownField" className={classes.inputLabel}>Hometown *</InputLabel>
														<TextField 
															disabled
															fullWidth 
															id="hometownField" 
															onChange={modifyHome} 
															required
															variant="filled"
														/>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
								<LinearProgress />
								<InputLabel htmlFor="bioField" className={classes.inputLabel}>Bio</InputLabel>
								<TextField 
									disabled 
									fullWidth 
									id="bioField"
									multiline 
									onChange={modifyBio} 
									rows="4" 
									variant="outlined"
								/>
								<Typography variant="body2">* denotes required field</Typography>
							</Container>
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button color="primary">
							Save Changes
						  </Button>
					</DialogActions>
				</Dialog>
			</React.Fragment>
		);
	}
	else {
		return (
			<React.Fragment>
				<Dialog open={open} onClose={handleClose} TransitionComponent={Transition} keepMounted fullWidth={true} maxWidth={'md'} scroll={'body'}>
				<IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
					  <CloseIcon />
				</IconButton>
				<DialogTitle>Edit Your Profile</DialogTitle>
					<DialogContent>
						<DialogContentText>
							<Container>
								<Grid container spacing={2} alignItems="flex-end" className={classes.userBasics}>
									<Grid item sm={12} md container>
										<Grid item sm={12} container direction="column" spacing={2} justify="flex-end">
											<Grid item xs>
												<TextField 
													className={classes.inputField}
													fullWidth 
													id="usernameField"
													label="Display Name"
													onChange={modifyName} 
													required
													value={username}
													variant="filled"
												/>
												<Grid container spacing={1} alignItems="flex-end">
													<Grid item>
														<RoomIcon />
													</Grid>
													<Grid item>
														<TextField
															fullWidth 
															id="hometownField"
															label="Hometown"
															onChange={modifyHome} 
															required
															value={hometown}
															variant="filled"
														/>
														
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
								<Divider style={{ marginBottom: "1em" }}/>
									<InputLabel htmlFor="bioField" className={classes.inputLabel}>Bio</InputLabel>
									<TextField 
										fullWidth 
										id="bioField" 
										multiline 
										onChange={modifyBio} 
										rows="4" 
										value={bio}
										variant="outlined"
									/>
								<Typography variant="body2">* denotes required field</Typography>
							</Container>
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={saveChanges} color="primary">
							Save Changes
						</Button>
					</DialogActions>
				</Dialog>
			</React.Fragment>
		);
	}
	
}

export default ProfileEdit;