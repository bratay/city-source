import React from 'react';
import { Avatar, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, Divider, Grid, IconButton, Slide, Snackbar, TextField, Tooltip, Typography, InputBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getUserProfileObj } from "../../profileBackEnd.js";
import CloseIcon from '@material-ui/icons/Close';
import RoomIcon from '@material-ui/icons/Room';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

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
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export function ProfileEdit(props) {
	const action = props.action;

	const userId = props.userId;
	const classes = useStyles();
	const [open, setOpen] = React.useState(props.open);

	let modified = false;

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

	let userObj = {
		bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id elit nec velit finibus lacinia. Quisque ex nunc, bibendum vitae ligula eu, vestibulum rutrum ligula. Nulla facilisi. Morbi lobortis, nibh at sagittis sodales, lorem massa dignissim augue, ut aliquam quam justo sit amet nunc. Ut at magna dignissim, faucibus mauris sed, auctor purus. Aenean vehicula sagittis diam vel imperdiet. Integer et ante tellus. ",
		hometown: "Washington, IA",
		hometownCoor: [0,0],
		email: "",
		picUrl: "https://i.imgur.com/PCg1Avs.png",
		userID: 0,
		username: "Micl Jrod",
		userType: 0
	}

	const [username, setUsername] = React.useState(userObj.username);
	const [hometown, setHometown] = React.useState(userObj.hometown);
	const [bio, setBio] = React.useState(userObj.bio);

	const saveChanges = () => {
		modified = false;
		userObj.username = username;
		userObj.hometown = hometown;
		userObj.bio = bio;
	};

	const modifyName = (event) => {
		modified = true;
		setUsername(event.target.value);
	};
	const modifyHome = (event) => {
		modified = true;
		setHometown(event.target.value);
	};
	const modifyBio = (event) => {
		modified = true;
		setBio(event.target.value);
	};

	// let profileObj = getUserProfileObj(userId);

	

	return (
		<React.Fragment>
			<Dialog open={open} onClose={handleClose} TransitionComponent={Transition} keepMounted fullWidth={true} maxWidth={'md'} scroll={'body'}>
			<IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
          		<CloseIcon />
        	</IconButton>
				<DialogContent>
					<DialogContentText>
						<Container>
							<Typography variant="h3">Edit Profile</Typography>
							<Grid container spacing={2} alignItems="flex-end" className={classes.userBasics}>
								<Grid item>
									<div className ={classes.avatarParent}>
										<Avatar className={classes.avatar} src={userObj.picUrl} />
									</div>
								</Grid>
								<Grid item sm={12} md container>
									<Grid item sm={12} container direction="column" spacing={2} justify="flex-end">
										<Grid item xs>
											<TextField 
												className={classes.inputField} 
												defaultValue={userObj.username} 
												fullWidth 
												id="usernameField"
												label="Name" 
												onChange={modifyName} 
												required 
												value={username} 
											/>
											<Grid container spacing={1} alignItems="flex-end">
												<Grid item>
													<RoomIcon />
												</Grid>
												<Grid item>
													<TextField 
														defaultValue={userObj.hometown}
														fullWidth 
														id="hometownField" 
														label="Hometown" 
														onChange={modifyHome} 
														required
														value={hometown}
													/>
												</Grid>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
							<Divider style={{ marginBottom: "1em" }}/>
							<TextField 
								defaultValue={userObj.bio} 
								fullWidth 
								id="bioField" 
								label="Bio" 
								multiline 
								onChange={modifyBio} 
								rows="4" 
								value={bio}
								variant="outlined"
							/>
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

export default ProfileEdit;