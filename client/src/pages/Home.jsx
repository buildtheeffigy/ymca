import React from 'react'
import Cookies from 'js-cookie'
const Home = () => {
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
                            document.cookie ? <a href='/userdashboard'>Welcome, {JSON.parse(Cookies.get('user_id')).first_name}</a> : <a href="/add/">Sign Up!</a>
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
    <div>Home</div>
    </div>
  )
}

export default Home