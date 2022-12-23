import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Link } from "react-router-dom";
import States from './components/states/States'
import Example from './components/example/Example'


ReactDOM.render(
  <HashRouter>
    <Link to="/states">States</Link>
    <Link to="/example"> Example</Link>
    <Route path="/states" component = {States} />
    <Route path="/example" component = {Example} />
	</HashRouter>,
  document.getElementById('reactapp'),
);