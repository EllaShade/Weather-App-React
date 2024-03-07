import React from "react";
import Weather from "./Weather.js";

import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello World</h1>
        <Weather city="Zurich" />
      </header>
    </div>
  );
}

export default App;
