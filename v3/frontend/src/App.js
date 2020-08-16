import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import GoogleApiWrapper from "./components/locations.component";
import './styles/main.scss';


function App() {
  return (
    <Router>
      <div className="container">
        <Route path="/" exact component={GoogleApiWrapper} />
      </div>
    </Router>
  );
}

export default App;
