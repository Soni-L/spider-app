import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Navbar from './components/Navbar.tsx';
import { ThemeProvider } from '@mui/material';
import theme from './theme.ts';


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Navbar />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
