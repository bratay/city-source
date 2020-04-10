import React from 'react';
import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, IconButton, InputLabel, LinearProgress, Slide, TextField, Typography, Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { setUserInformation } from "../../profileBackEnd.js";
import CloseIcon from '@material-ui/icons/Close';
import RoomIcon from '@material-ui/icons/Room';
import { currentUserObj } from "../../signIn.js";

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
	const [open, setOpen] = React.useState(props.open);

	const [bio, setBio] = React.useState(undefined);
	const [bioErr, setBioErr] = React.useState(false);
	const [homeErr, setHomeErr] = React.useState(false);
	const [hometown, setHometown] = React.useState(undefined);
	const [userErr, setUserErr] = React.useState(false);
	const [username, setUsername] = React.useState(undefined);

	

	React.useEffect(() => {
		setOpen(props.open);
		setUsername(currentUserObj.username);
		setHometown(currentUserObj.hometown);
		setBio(currentUserObj.bio);
	}, [props.open]);

	// React.useEffect(() => {
	// 	async function fetchUserObj() {
	// 		const obj = await getUserProfileObj(props.userId);
	// 		setUserObj(obj);
	// 		setUsernameLocal(obj.username);
	// 		setHometownLocal(obj.hometown);
	// 		setBioLocal(obj.bio);
	// 	}
	// 	// fetchUserObj();
	//  }, [props.open]);

	const handleClose = () => {
		setUserErr(false);
		setHomeErr(false);
		setBioErr(false);
		
		setOpen(false);
		action(false);
	};

	const saveChanges = (event) => {
		event.preventDefault();
		if (username === "" || hometown === "") {
			// TODO: Add some sort of error message like a snackbar, but snackbars are being a bit difficult for me
			return;
		}
		let updatedObj = {
			bio: String(bio),
			email: currentUserObj.email,
			hometown: String(hometown),
			// hometownCoor: currentUserObj.hometownCoor,
			hometownLat: 0,
			hometownLong: 0,
			picUrl: currentUserObj.picUrl,
			userID: currentUserObj.userID,
			userType: currentUserObj.userType,
			username: String(username),
		};
		setUserInformation(updatedObj);
	}

	const modifyName = (event) => {
		setUsername(event.target.value);
		if (event.target.value === "") {
			setUserErr(true);
		}
		else {
			setUserErr(false);
		}
	};
	const modifyHome = (event) => {
		setHometown(event.target.value);
		if (event.target.value === "") {
			setHomeErr(true);
		}
		else {
			setHomeErr(false);
		}
	};
	const modifyBio = (event) => {
		setBio(event.target.value);
	};

	if (currentUserObj.userID === "") {
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
													error={userErr}
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
															error={homeErr}
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
									error={bioErr}
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
							<form id="editProfile" autoComplete="off" onSubmit={saveChanges}>
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
							</form>
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button form="editProfile" color="primary" type="submit">
							Save Changes
						</Button>
					</DialogActions>
				</Dialog>
			</React.Fragment>
		);
	}
	
}

export default ProfileEdit;