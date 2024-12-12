import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Web3Provider } from './config/Web3Context';
import { GlobalStates } from './globalStates.js/GlobalStates';



ReactDOM.render(
  <React.StrictMode>
    <GlobalStates>
      <Web3Provider>
        <App />
      </Web3Provider>
    </GlobalStates>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
