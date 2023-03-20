import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap/dist/js/bootstrap.js';
import {Button} from 'react-bootstrap';

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Users from "./pages/Users";
import Add from "./pages/Add";
import Update from "./pages/update";
import Home from "./pages/Home";
import Programs from "./pages/Programs";
import Login from './pages/Login';
import Logout from "./pages/Logout";
import Schedules from "./pages/Schedules";
import CreateProgram from "./pages/CreateProgram";
import UserDashboard from "./pages/UserDashboard";
import Registrations from "./pages/Registrations";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Users" element={<Users/>}/>
        <Route path="/Add" element={<Add/>}/>
        <Route path="/update" element={<Update/>}/>
        <Route path="/Programs" element={<Programs/>}/>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/Logout" element={<Logout/>}/>
        <Route path="/Schedules" element={<Schedules/>}/>
        <Route path="/CreateProgram" element={<CreateProgram/>}/>
        <Route path="/UserDashboard" element={<UserDashboard/>}/>
        <Route path="/Registrations" element={<Registrations/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
