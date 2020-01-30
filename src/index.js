import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import Navbar from './Navbar';
import theme from './theme';
import "./index.css";

ReactDOM.render(
	<ThemeProvider theme={theme}>
		<CssBaseline />
		<Navbar login={false} current="index"/>
	</ThemeProvider>,
	document.querySelector('#root')
);
