import React from "react";
import Weather from "./Weather.js";

import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Your current Weather</h1>
        <Weather />
      </header>
    </div>
  );
}

export default App;
