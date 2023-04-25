import React from 'react'
import {useNavigate} from "react-router-dom"
import Cookies from 'js-cookie'
import iiii from './YMCA-Logo-2010.png'
//Deletes all cookies.
const AdminHome =()=>{

  return( <div>
    <header>
          <div class="container">
                <div class="row">
                    <div class="col-sm">
                    <a href="/AdminHome"><img src={iiii} height='100px' style={{verticalAlign:"baseline"}}></img></a>
                    </div>
                    <div class="col-sm">
                    <a href="/AdminProgram/">Programs</a>
                    </div>
                    <div class="col-sm">
                    <a href="/EnrollmentSearch/">Enrollments</a>
                    </div>
                    <div class="col-sm">
                    <a href="/about/">About</a>
                    </div>
                    <div class="col-sm">
                    {
                        document.cookie ? <a href='/AdminHome'>Welcome, {Cookies.get('new_family_name')}</a> : <a href="/AdminHome">Sign Up  or Log In!</a>
                    }
                    </div>
                    <div class="col-sm">
                    {
                        document.cookie ? <a href="/Users/">Users</a> : <div></div>
                    }
                    </div>
                    <div class="col-sm">
                    {
                        document.cookie ? <a href="/Logout/">Logout</a> : <div></div>
                    }
                    </div>

                </div>
          </div>

    </header>

    <h3>Welcome to the admin account</h3>
    </div>

  )
}

export default AdminHome
