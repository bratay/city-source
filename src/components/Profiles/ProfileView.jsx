import React from 'react';
import { Avatar, Button, Card, CardMedia, Container, Dialog, DialogContent, DialogContentText, Divider, Grid, IconButton, LinearProgress, Slide, Typography, CardContent, CardActions } from '@material-ui/core';
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
	textBlur: {
		color: "transparent",
		textShadow: "0 0 20px rgba(0,0,0,0.5)",
		userSelect: 'none',
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
	const [userObj, setUserObj] = React.useState(null);

	React.useEffect(() => {
		setOpen(props.open)
	}, [props.open]);

	React.useEffect(() => {
		async function fetchUserObj() {
			const obj = await getUserProfileObj(userId);
			setUserObj(obj);
		}
		fetchUserObj();
	 }, [userId]);

	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
		action(false);
	};

	if (userObj === null) {
		const sampleBio = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus blandit sodales nisi, id scelerisque metus pharetra tincidunt. Nam porta pulvinar massa nunc.";
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
										</div>
									</Grid>
									<Grid item sm={12} md container>
										<Grid item sm={12} container direction="column" spacing={2} justify="flex-end">
											<Grid item xs>
												<Typography variant="h2" className={[classes.username, classes.textBlur]}>
													&#9600;&#9600;&#9600;&#9600;&nbsp;&#9600;&#9600;&#9600;&#9600;
												</Typography>
												<Typography variant="subtitle1" className={[classes.location, classes.textBlur]}>
													&#9600;&#9600;&#9600;&#9600;&nbsp;&#9600;&#9600;&#9600;&#9600;
												</Typography>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
								<LinearProgress style={{ marginBottom: "1em" }} />
								<Typography variant="body1" className={classes.textBlur}>{sampleBio}</Typography>
							</Container>
						</DialogContentText>
					</DialogContent>
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
					<DialogContent>
						<DialogContentText>
							<Container>
								<Grid container spacing={2} alignItems="flex-end" className={classes.userBasics}>
									<Grid item>
										<div className ={classes.avatarParent}>
											<Avatar className={classes.avatar} src={userObj.picUrl} />
											<VerifiedUserIcon color="secondary" fontSize="large" className={classes.devIcon} style={{ visibility: (userObj.userType ? "visible" : "hidden") }} />
										</div>
									</Grid>
									<Grid item sm={12} md container>
										<Grid item sm={12} container direction="column" spacing={2} justify="flex-end">
											<Grid item xs>
												<Typography variant="h2" className={classes.username}>
													{userObj.username}
												</Typography>
												<Typography variant="subtitle1" className={classes.location}>
													<RoomIcon fontSize="inherit" style={{ marginRight: "4px" }}/>{userObj.hometown}
												</Typography>
											</Grid>
										</Grid>
									</Grid>
								</Grid>
								<Divider style={{ marginBottom: "1em" }}/>
								<Typography variant="body1">{userObj.bio}</Typography>
								<br />
								<Typography variant="h4" gutterBottom style={{ textAlign: "center" }}>Recent Activity</Typography>
								<Card className={classes.post}>
									<div style ={{display: "flex",}}>
									<CardMedia
										style={{width: 151}}
										component="img"
										src="https://images.genius.com/662a88c1577b0d9816ee086e54909353.500x500x1.jpg"
									/>
									<CardContent>
										<Typography component="h5" variant="h5">
											New Parking Garage Opening Near Allen Fieldhouse
										</Typography>
										<Typography variant="body2">
											Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin mattis gravida urna at rhoncus. Fusce commodo lacinia lectus non turpis duis...
										</Typography>
										
									</CardContent>
									</div>	
									<CardActions>
										<Button size="small" color="primary" style={{marginLeft: 'auto',}}>
											Read More
										</Button>
									</CardActions>					
								</Card>
							</Container>
						</DialogContentText>
					</DialogContent>
				</Dialog>
			</React.Fragment>
		);
	}

	
}

export default ProfileDialog;