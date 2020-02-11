import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import Navbar from './Navbar';
import theme from './theme';
import "./index.css";
import * as firebase from 'firebase';
import ProfileTest from './Profile';

// Firebase App configuration
var firebaseConfig = {
	apiKey: "AIzaSyCGnqKQ3XqAuYctdKp49E_xOEnomZxaSQk",
	authDomain: "city-source-8a88a.firebaseapp.com",
	databaseURL: "https://city-source-8a88a.firebaseio.com",
	projectId: "city-source-8a88a",
	storageBucket: "city-source-8a88a.appspot.com",
	messagingSenderId: "116800112457",
	appId: "1:116800112457:web:e63f46689ea51c11437c98",
	measurementId: "G-D07D7LCMPR"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.firestore()

ReactDOM.render(
	<ThemeProvider theme={theme}>
		<CssBaseline />
		<Navbar login={true} current="index" />
		<ProfileTest />
	</ThemeProvider>,
	document.querySelector('#root')
);
