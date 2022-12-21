import React from 'react';
import ReactDOM from 'react-dom';
import ReactAppView from './components/ReactAppView';
let viewTree = React.createElement(ReactAppView, null);
let where = document.getElementById("reactapp");
ReactDOM.render(viewTree, where);