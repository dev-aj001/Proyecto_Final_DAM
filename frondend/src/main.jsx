import React from 'react'
import ReactDOM from 'react-dom/client'
//import App from './App.jsx'
import './share/css/allPages.css'
//FIC: Add
import AppAllModules from './AppAllModules';

//FIC: For Redux
import { Provider } from "react-redux";
import store from '../src/security/redux/store/store';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6c47b8',
    },
    secondary: {
      main: '#9575cd',
    },
    background: {
      default: '#ffffff',
      paper: '#fefefe',
    },
    text: {
      primary: '#6c47b8',
      secondary: '#c4c4d4',
      disabled: '#78909c',
    },
    error: {
      main: '#c62828',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <App /> */}
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <AppAllModules />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
);