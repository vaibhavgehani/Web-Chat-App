import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


ReactDOM.render(
<Router><Route path="/" component={App}></Route></Router>, document.getElementById('root'));
serviceWorker.unregister();
