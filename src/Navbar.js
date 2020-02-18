import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Avatar, Button, Drawer, Hidden, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Divider } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import RoomIcon from '@material-ui/icons/Room';
import StarIcon from '@material-ui/icons/Star';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import SearchIcon from '@material-ui/icons/Search'
import SignInModal from './components/SignInModal/SignInModal.jsx'

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
		fontFamily: 'Righteous',
		userSelect: 'none',
	},
	list: {
		width: 250,
	},
}));

function ListItemLink(props) {
	return <ListItem button component="a" {...props} />
}

function Navbar(props) {
	const classes = useStyles();
	const [state, setState] = React.useState({
		top: false,
		bottom: false,
		left: false,
		right: false,
	});

	const [signIn, setSignIn] = React.useState(false);

	const toggleDrawer = (side, open) => event => {
		if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}
		setState({ ...state, [side]: open });
	};

	const TopRight = () => {
			if (props.login === true) {
				return (
					<Hidden xsdown>
						<IconButton color="inherit">
							<NotificationsIcon />
						</IconButton>
						<IconButton className={classes.menuButton}>
							<Avatar />
						</IconButton>
					</Hidden>
				);
			}
			else {
				return (
					<React.Fragment>
						<Button color="inherit">About CitySource</Button>
						<Button color="inherit" onClick={() => {setSignIn(true)}} >Log In/Sign Up</Button>
					</React.Fragment>
				);
			}
		}

	const sideMenu = side => (
		<div className={classes.list} role="presentation" onClick={toggleDrawer(side, false)} onKeyDown={toggleDrawer(side, false)}>
			<List>
				<ListItemLink button key='home' href="/">
					<ListItemIcon><HomeIcon /></ListItemIcon>
					<ListItemText primary="Home" />
				</ListItemLink>
			</List>
			<Divider />
			<List>
			<ListItemLink button key='profileSearch' href="/profileSearch">
				<ListItemIcon><SearchIcon /></ListItemIcon>
				<ListItemText primary="Search" />
			</ListItemLink>
				<ListItemLink button key='recommended' href="/recommended">
					<ListItemIcon><StarIcon /></ListItemIcon>
					<ListItemText primary="Recommended" />
				</ListItemLink>
				<ListItemLink button key='trending' href="/trending">
					<ListItemIcon><TrendingUpIcon /></ListItemIcon>
					<ListItemText primary="Trending" />
				</ListItemLink>
				<ListItemLink button key='neighborhoods' href="/neighborhoods">
					<ListItemIcon><RoomIcon /></ListItemIcon>
					<ListItemText primary="Neighborhoods" />
				</ListItemLink>
			</List>
		</div>
	);

	return (
		<React.Fragment>
			<AppBar position="sticky">
				<Toolbar>
					<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer('left', true)}>
						<MenuIcon />
					</IconButton>
					<Drawer open={state.left} onClose={toggleDrawer('left', false)}>
						{sideMenu('left')}
					</Drawer>
					<Typography variant="h4" className={classes.title}>
						CitySource
					</Typography>
					<TopRight login={props.login} />
				</Toolbar>
			</AppBar>
			<SignInModal open={signIn} action={setSignIn} />
		</React.Fragment>
	);
}

export default Navbar;
