import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

let theme = createMuiTheme({
	palette: {
		primary: {
			main: '#ef6c00',
		},
		secondary: {
			main: '#0277bd',
		},
	},
});

// theme = responsiveFontSizes(theme);

export default theme;