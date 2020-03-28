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
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function ProfileEdit(props) {
	const userId = props.userId;
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	}

	const saveChanges = () => {
		modified = false;
	}

	const onModify = () => {
		modified = true;
	}

	let profileObj = getUserProfileObj(userId);

	let modified = false;

	return (
		<React.Fragment>
			<Button variant="contained" color="secondary" onClick={handleClickOpen}>Profile Edit Test</Button>
			<Dialog open={open} onClose={handleClose} TransitionComponent={Transition} keepMounted fullWidth={true} maxWidth={'md'} scroll={'body'}>
			<IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
          		<CloseIcon />
        	</IconButton>
				<DialogContent>
					<DialogContentText>
						<Container>
							<Grid container spacing={2} alignItems="flex-end" className={classes.userBasics}>
								<Grid item>
									<div className ={classes.avatarParent}>
										<Avatar className={classes.avatar} />
										<VerifiedUserIcon color="secondary" fontSize="large" className={classes.devIcon} />
									</div>
								</Grid>
								<Grid item sm={12} md container>
									<Grid item sm={12} container direction="column" spacing={2} justify="flex-end">
										<Grid item xs>
											<TextField id="name" label="Name" fullWidth onChange={onModify} />
											<Grid container spacing={1} alignItems="flex-end">
												<Grid item>
													<RoomIcon />
												</Grid>
												<Grid item>
													<TextField id="input-with-icon-grid" label="Hometown" fullWidth onChange={onModify} />
												</Grid>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
							<Divider style={{ marginBottom: "1em" }}/>
							<TextField id="bio" label="Bio" multiline fullWidth rows="4" variant="outlined" onChange={onModify} />
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