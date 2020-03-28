import React from 'react';
import { Avatar, Button, Dialog, DialogContentText, DialogTitle, DialogContent, Grid, Slide, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	small: {
		width: theme.spacing(3),
		height: theme.spacing(3),
	},
	large: {
		width: theme.spacing(14),
		height: theme.spacing(14),
	},
	username: {
		paddingLeft: "15px",
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

// function ProfileModal(props) {
	

// 	return (

// 	);
// }

function ProfileTest(props) {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	}

	return (
		<React.Fragment>
			<Button variant="contained" color="secondary" onClick={handleClickOpen}>Profile Modal Test</Button>
			<Dialog open={open} onClose={handleClose} TransitionComponent={Transition} keepMounted fullWidth={true} maxWidth={'md'} scroll={'body'}>
				<DialogContent>
					<DialogContentText>
						<Grid container spacing={2}>
								<Avatar className={classes.large} />
								<Typography variant="h2" className={classes.username}>{"User Name\n"}</Typography>
								<Typography variant="subtitle1" className={classes.username}>Hometown</Typography>
						</Grid>
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</React.Fragment>
		
	);
}

export default ProfileTest;