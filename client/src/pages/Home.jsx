import React from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
const Home = () => {
  const navigate = useNavigate();

  async function createProgRedirect(e){
    navigate("/CreateProgram/");
}

async function RegRedirect(e){
  navigate("/Registrations/");
}

  return (
    <div>
        <header>
                <div class="container">
                    <div class="row">
                        <div class="col-sm">
                        <img src='https://capitalymca.org/wp-content/uploads/2017/08/y-trenton-site-icon.png' height='75px'></img>
                        </div>
                        <div class="col-sm">
                        <a href="/programs/">Programs</a>
                        </div>
                        <div class="col-sm">
                        <a href="/schedules/">Schedules</a>
                        </div>
                        <div class="col-sm">
                        <a href="/about/">About</a>
                        </div>
                        <div class="col-sm">
                        {
                            document.cookie ? <a href='/userdashboard'>Welcome, {Cookies.get('new_family_name')}</a> : <a href="/add/">Sign Up!</a>
                        }
                        </div>
                        <div class="col-sm">
                        {
                            document.cookie ? <a href="/Logout/">Logout</a> : <a href="/Login/">Log In</a>
                        }
                        </div>
                        
                </div>
                </div>
    </header>
    <div>Home
          <div>
                {
                  document.cookie ? (JSON.parse(Cookies.get('user_id')).private == 1 ? 
                  (<div><button class="btn btn-secondary btn-lg" onClick={() => createProgRedirect()}>Create Program!</button> <button class="btn btn-secondary btn-lg" onClick={() => RegRedirect()}>Registrations</button></div>) //admin stuff
                  : <a href="/Login/">user</a>)  // normal users
                  : <a href='Logout'>not logged in</a> // not logged in duh
                  
                }
          </div>

    </div>
    </div>
  )
}

export default Home