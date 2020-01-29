import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Button, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

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
	},
	list: {
		width: 250,
	},
}));

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
				<ListItem button key='test1'>
					<ListItemIcon><MenuIcon /></ListItemIcon>
					<ListItemText primary="Test 1" />
				</ListItem>
			</List>
		</div>
	);
	return (
		<div>
		<AppBar position="static">
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
				<Button color="inherit">Log In/Sign Up</Button>
			</Toolbar>
			
		</AppBar>
		
		</div>
	);
}

export default Navbar;