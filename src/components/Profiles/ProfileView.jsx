import React from 'react';
import { Avatar, Button, Card, Container, Dialog, DialogActions, DialogContent, DialogContentText, Divider, Grid, IconButton, Slide, Snackbar, TextField, Tooltip, Typography, InputBase } from '@material-ui/core';
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
	username: {
		marginBottom: "5px",
	},
	location: {
		
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

export function ProfileDialog(props) {
	const action = props.action;
	const userId = props.userId;
	const classes = useStyles();
	const [open, setOpen] = React.useState(props.open);

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

	return (
		<React.Fragment>
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
											<Typography variant="h2" className={classes.username}>
												User Name
											</Typography>
											<Typography variant="subtitle1" className={classes.location}>
												<RoomIcon fontSize="inherit" style={{ marginRight: "4px" }}/>Hometown
											</Typography>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
							<Divider style={{ marginBottom: "1em" }}/>
							<Typography variant="body1">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam id elit nec velit finibus lacinia. Quisque ex nunc, bibendum vitae ligula eu, vestibulum rutrum ligula. Nulla facilisi. Morbi lobortis, nibh at sagittis sodales, lorem massa dignissim augue, ut aliquam quam justo sit amet nunc. Ut at magna dignissim, faucibus mauris sed, auctor purus. Aenean vehicula sagittis diam vel imperdiet. Integer et ante tellus. </Typography>
							<br />
							<Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>Recent Activity</Typography>
							<Card className={classes.post}>
								Post content here or something idk yet
							</Card>
							<Card>
								Post content here or something idk yet
							</Card>
						</Container>
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</React.Fragment>
	);
}

export default ProfileDialog;