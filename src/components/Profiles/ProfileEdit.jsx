import React from 'react';
import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, Grid, IconButton, InputLabel, LinearProgress, Slide, Snackbar, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { setUserInformation } from "../../profileBackEnd.js";
import CloseIcon from '@material-ui/icons/Close';
import RoomIcon from '@material-ui/icons/Room';
import { currentUserObj } from "../../signIn.js";
import { AutocompleteSearchBox } from "../MapUI/AutocompleteSearchBox";
import escape from 'validator/lib/escape';

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
	locationBox: {
		position: "absolute",
	}
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
	const [homeCoord, setHomeCoord] = React.useState(undefined);
	const [userErr, setUserErr] = React.useState(false);
	const [username, setUsername] = React.useState(undefined);

	const [successOpen, setSuccessOpen] = React.useState(false);
	const [errorOpen, setErrorOpen] = React.useState(false);
	

	React.useEffect(() => {
		setOpen(props.open);
		setUsername(currentUserObj.username);
		setHometown(currentUserObj.hometown);
		setHomeCoord({lat: currentUserObj.hometownLat, lng: currentUserObj.hometownLong});
		setBio(currentUserObj.bio);
	}, [props.open]);

	const handleClose = () => {
		setUserErr(false);
		setHomeErr(false);
		setBioErr(false);
		
		setOpen(false);
		action(false);
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

	const saveChanges = (event) => {
		event.preventDefault();
		if (username === "" || hometown === "" || homeCoord === undefined || userErr || homeErr || bioErr) {
			if (username === "") {
				setUserErr(true);
			}
			if (hometown === "" || homeCoord === undefined) {
				setHomeErr(true);
			}
			setErrorOpen(true);
			return;
		}
		let updatedObj = {
			bio: escape(bio),
			email: currentUserObj.email,
			hometown: escape(hometown),
			hometownLat: homeCoord.lat,
			hometownLong: homeCoord.lng,
			picUrl: currentUserObj.picUrl,
			userID: currentUserObj.userID,
			userType: currentUserObj.userType,
			username: escape(username),
		};
		setUserInformation(updatedObj);
		setSuccessOpen(true);
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
		if (event.target.value === "") {
			setHomeErr(true);
			setHometown("");
			setHomeCoord(undefined);
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
													<FormControl variant="filled" fullWidth disabled>
														<InputLabel htmlFor="hometownField">Hometown</InputLabel>
														<AutocompleteSearchBox 
															inputProps={{
																disabled: true,
																fullWidth: true,
																id: 'hometownField',
																required: true,
															}}
															setCoords={setHomeCoord} 
															setHometown={setHometown}
														/>
													</FormControl>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
								<LinearProgress />
								<TextField 
									disabled 
									error={bioErr}
									fullWidth 
									id="bioField"
									label="Bio"
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
													error={userErr}
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
														<FormControl variant="filled" error={homeErr} required fullWidth>
															<InputLabel htmlFor="hometownField">Hometown</InputLabel>
															<AutocompleteSearchBox 
																changeFunc={modifyHome}
																inputProps={{
																	error: homeErr,
																	fullWidth: true,
																	id: 'hometownField',
																	required: true,
																}}
																presetVal={hometown}
																setCoords={setHomeCoord} 
																setHometown={setHometown}
															/>
														</FormControl>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
								<Divider style={{ marginBottom: "1em" }}/>
									<TextField 
										error={bioErr}
										fullWidth 
										id="bioField" 
										label="Bio"
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
					message="Profile saved successfully!"
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
					message="Your profile could not be saved. Please check the highlighted fields."
				/>
			</React.Fragment>
		);
	}
	
}

export default ProfileEdit;