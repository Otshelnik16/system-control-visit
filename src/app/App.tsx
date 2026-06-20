import { BrowserRouter } from "react-router-dom";
import { Router } from "../router/router";
import "./App.module.scss";

const App = () => {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
};

export default App;