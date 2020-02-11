import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Avatar, Button, Divider, Drawer, Hidden, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import RoomIcon from '@material-ui/icons/Room';
import SettingsIcon from '@material-ui/icons/Settings';
import StarIcon from '@material-ui/icons/Star';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import { googleSignIn } from './signIn';

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

function AccountMenu(props) {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	}

	const open = Boolean(anchorEl);
	const id = open ? 'account-menu' : undefined;

	return (
		<React.Fragment>
			<IconButton className={classes.menuButton} aria-describedby={id} onClick={handleClick}>
				<Avatar />
			</IconButton>
			<Menu 
				id={id} 
				open={open} 
				anchorEl={anchorEl} 
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
			>
				<MenuItem onClick={handleClose}>
					<ListItemIcon>
						<AccountCircleIcon />
					</ListItemIcon>
					<ListItemText primary="Profile" />
				</MenuItem>
				<MenuItem onClick={handleClose}>
					<ListItemIcon>
						<SettingsIcon />
					</ListItemIcon>
					<ListItemText primary="Settings" />
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleClose}>
					<ListItemIcon>
						<ExitToAppIcon />
					</ListItemIcon>
					<ListItemText primary="Log Out" />
				</MenuItem>
			</Menu>
		</React.Fragment>
	);
}

function TopRight(props) {
	if (props.login === true) {
		return (
			<Hidden xsdown>
				<IconButton color="inherit" aria-describedby="notifications">
					<NotificationsIcon />
				</IconButton>
				<AccountMenu />
			</Hidden>
		);
	}
	else {
		return (
			<React.Fragment>
				<Button color="inherit">About CitySource</Button>
				<Button color="inherit" onClick = {googleSignIn} >Log In/Sign Up</Button>
			</React.Fragment>
		);
	}
}

function Navbar(props) {
	const classes = useStyles();
	const [state, setState] = React.useState({
		top: false,
		bottom: false,
		left: false,
		right: false,
	});
	const toggleDrawer = (side, open) => event => {
		if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}
		setState({ ...state, [side]: open });
	};
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
	);
}

export default Navbar;