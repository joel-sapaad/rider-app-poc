import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import 'mapbox-gl/dist/mapbox-gl.css';
import "semantic-ui-css/semantic.min.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
