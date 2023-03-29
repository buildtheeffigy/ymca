//Unused page

import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from "axios"
import Cookies from 'js-cookie'

const Programs = () => {
    const [programs, setPrograms, ordering] = useState([])

    useEffect(() => {
        const fetchAllPrograms = async ()=>{
          try{
              const res = await axios.get("http://localhost:8802/programs");
              setPrograms(res.data)
          }catch(err){
              console.log(err)
          }
        }
        fetchAllPrograms()
      }, [])
      const updateOrder = async e =>{
        console.log("a");
      }
      return <div class='container'>
<div>
<header>
<div class="container">
    <div class="row">
        <div class="col-sm">
        <a href="/"><img src='https://capitalymca.org/wp-content/uploads/2017/08/y-trenton-site-icon.png' height='75px'></img></a>
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

</div>
</div>
</header>
</div>



      <table class='table'>
          <thead bgcolor='#F47920'>
          <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Maximum Capacity</th>
          <th>Current Enrollment</th>
          <th>Base Price</th>
          <th>Member Price</th>
          <th>Teacher</th>
          </tr>
          </thead>
          <select name="week" id="week" onChange={updateOrder}>
          <option value="name">Name</option>
          <option value="price">Price</option>
          </select>
          <tbody>
          {programs.map(program=>(
              <tr key={program.id}>
                  <td>{program.name}</td>
                  <td>{program.description}</td>
                  <td>{program.max_capacity}</td>
                  <td>{program.current_enrollment}</td>
                  <td>{program.base_price}</td>
                  <td>{program.member_price}</td>
                  <td><div>
                  {program.first_name} {program.last_name}
                    </div><div>
                    {program.email}
                        </div></td>
                  <td></td>

              </tr>
          ))}

</tbody>
      </table>
    </div>
}

export default Programs
