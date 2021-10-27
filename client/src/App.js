import './App.css';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import InterfacePage from "./InterfacePage";
import MainPage from "./MainPage";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/task/:id/interface/:id">
          <InterfacePage />
        </Route>
        <Route path="/main" exact>
          <MainPage />
        </Route>
        <Redirect to="/main"/>
      </Switch>
    </Router>
  );
}

export default App;
