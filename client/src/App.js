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
import Logout from "./pages/Logout";
import Schedules from "./pages/Schedules";
import Registrations from "./pages/Registrations";
import DeleteAccount from "./pages/DeleteAccount";
import Enroll from "./pages/Enroll";
import HardDelete from "./pages/HardDelete";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Users" element={<Users/>}/>
        <Route path="/Add" element={<Add/>}/>
        <Route path="/update" element={<Update/>}/>
        <Route path="/Programs" element={<Schedules/>}/>
        <Route path="/Logout" element={<Logout/>}/>
        <Route path="/Enroll" element={<Enroll/>}/>
        <Route path="/Registrations" element={<Registrations/>}/>
        <Route path="/DeleteAccount" element={<DeleteAccount/>}/>
        <Route path="/HardDelete" element={<HardDelete/>}/>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
