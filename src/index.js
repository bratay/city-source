import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import Navbar from './Navbar';
import SignInModal from './components/SignInModal/SignInModal.jsx'
import theme from './theme';
import "./index.css";

ReactDOM.render(
	<ThemeProvider theme={theme}>
		<CssBaseline />
		<Navbar login={false} current="index"/>
		<SignInModal />
	</ThemeProvider>,
	document.querySelector('#root')
);
