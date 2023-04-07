import React, { useState } from 'react'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import axios from "axios"
import iiii from './YMCA-Logo-2010.png'
const Registrations = () => {
    const [programs, setPrograms] = useState([])

    useEffect(() => {
        const fetchAllPrograms = async ()=>{
          try{
              const res = await axios.get("http://localhost:8802/registrations");
              setPrograms(res.data)
          }catch(err){
              console.log(err)
          }
        }
        fetchAllPrograms()
      }, [])

      return<div>
          <header>
                <div class="container">
                      <div class="row">
                          <div class="col-sm">
                          <a href="/"><img src={iiii} height='100px' style={{verticalAlign:"baseline"}}></img></a>
                          </div>
                          <div class="col-sm">
                          <a href="/programs/">Programs</a>
                          </div>
                          <div class="col-sm">
                          <a href="/about/">About</a>
                          </div>
                          <div class="col-sm">
                          {
                              document.cookie ? <a href='/'>Welcome, {Cookies.get('new_family_name')}</a> : <a href="/">Sign Up  or Log In!</a>
                          }
                          </div>
                          <div class="col-sm">
                          {
                              document.cookie ? <a href="/Logout/">Logout</a> : <div></div>
                          }
                          </div>
                          <div class="col-sm">
                          {
                              document.cookie ? <a href="/DeleteAccount/">Delete Account</a> : <div></div>
                          }
                          </div>

                      </div>
                </div>

          </header>


      <div class='container'>
      <table class='table'>
          <thead bgcolor='#F47920'>
          <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Program</th>
          <th>Day of Week</th>
          <th>Dates</th>
          <th>Start Time</th>
          <th>End Time</th>
          </tr>
          </thead>
          <tbody>
          {programs.map(program=>(
              <tr key={program.id}>
                {
                    program.family_name == "" || program.family_name == null ? <td>{program.first_name}</td> : <td>{program.family_name}</td>
                }
                  <td>{program.last_name}</td>
                  <td>{program.name}</td>
                  <td>{program.day_of_week}</td>
                  <td>{program.start_date.toString().split('T')[0]} {program.end_date.toString().split('T')[0]}</td>
                  <td>{program.start_time}</td>
                  <td>{program.end_time}</td>


              </tr>
          ))}

</tbody>
      </table>
    </div>
    </div>
}

export default Registrations
