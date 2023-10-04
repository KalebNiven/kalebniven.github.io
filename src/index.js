import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';  // Adjust the path according to your file structure
import './index.css';  // If you have a CSS file for global styles
import "@fortawesome/fontawesome-free/css/all.min.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
