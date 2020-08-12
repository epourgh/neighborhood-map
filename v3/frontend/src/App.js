import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import Locations from "./components/locations.component";
import './styles/main.scss';


function App() {
  return (
    <Router>
      <div className="container">
        <Route path="/" exact component={Locations} />
      </div>
    </Router>
  );
}

export default App;
