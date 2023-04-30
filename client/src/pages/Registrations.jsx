import React, { useState } from 'react'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import axios from "axios"
import {useNavigate} from "react-router-dom"
import iiii from './YMCA-Logo-2010.png'
const Registrations = () => {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([])

    const [query, setQuery] = useState('');
    const [state, setstate] = useState({
      query: '',
      list: programs
    });



      //Search programs function
      const handleQuery = () =>{
        setQuery(document.getElementById('searchnameF').value);
        const results = programs.filter(post => {
          if(document.getElementById('searchnameF').value == "") return post
          return (post.family_name == "" || post.family_name == null ? (post.first_name.toLowerCase().includes(document.getElementById('searchnameF').value.toLowerCase()))
           : (post.family_name.toLowerCase().includes(document.getElementById('searchnameF').value.toLowerCase())))

        }).filter(post=>{
          if(document.getElementById('searchnameL').value == "") return post
          post.last_name.toLowerCase().includes(document.getElementById('searchnameL').value.toLowerCase());

        }).filter(post=>{
            if(document.getElementById('searchTime').value == ""){
              return post
            }
            return post.start_time >= document.getElementById('searchTime').value;
            }).filter(post => {
          if(document.getElementById('week').value.toLowerCase() == 'day'){
            return post
          }
          return post.day_of_week.toLowerCase.includes() == document.getElementById('week').value.toLowerCase();
        });
        setstate({
          query: document.getElementById('searchnameF').value,
          list: results
        });
      }

      useEffect(() => {
          const fetchAllPrograms = async ()=>{
            try{
                const res = await axios.get("http://localhost:8802/registrations");
                setPrograms(res.data)
                setstate({
                  query:'',
                  list: res.data
                });
            }catch(err){
                console.log(err)
            }
          }
          fetchAllPrograms()
        }, [])


      return<div>
      <div>
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
                      <a href="/Registrations/">Registrations</a>
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
      </div>

      <div style={{width:"80vw", marginLeft:"2vw", marginRight:"2vw"}}>
      <table class='table'>
          <thead bgcolor='purple'>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Program</th>
          <th>Day of Week</th>
          <th>Dates</th>
          <th>Start Time/End Time</th>
          <th></th>
          </thead>
          <tbody>
          <tr>
          <td>
            <label for="searchnameF" style={{fontSize:"20px"}}>Search by</label>
            <input class="SearchFeild" type="search" id='searchnameF' name='Fname' placeholder='First Name' value={query} onChange={handleQuery}/>
          </td>
          <td>
            <label for="searchnameL" style={{fontSize:"20px"}}>Search by</label>
            <input class="SearchFeild" type="search" id='searchnameL' name='Lname' placeholder='Last Name' onChange={handleQuery}/>
          </td>
          <td>
            <label for="searchProg" style={{fontSize:"20px"}}>Search by</label>
            <input class="SearchFeild" type="search" id='searchProg' name='Prog' placeholder='Program' onChange={handleQuery}/>
          </td>
          <td>
          <label for="week" style={{fontSize:"20px"}}>Search by</label>
          <select name="week" id="week" onChange={handleQuery}>
            <option value="day">Weekday</option>
            <option value="1">Monday</option>
            <option value="2">Tuesday</option>
            <option value="3">Wednesday</option>
            <option value="4">Thursday</option>
            <option value="5">Friday</option>
            <option value="6">Saturday</option>
            <option value="7">Sunday</option>
          </select>
          </td>
          <td><label for="searchDate" style={{fontSize:"20px"}}>Earliest start date</label><input class="SearchFeild" type="date" id="searchDate" name="StartDate" placeholder='Name' onChange={handleQuery}/></td>
          <td><label for="searchTime" style={{fontSize:"20px"}}>Earliest start time</label> <input class="SearchFeild" type="time" id="searchTime" name="StartTime" placeholder='Name' onChange={handleQuery}/></td>
          </tr>


          {state.list.map(programs=>(
              <tr key={programs.id}>
                {
                    programs.family_name == "" || programs.family_name == null ? <td>{programs.first_name}</td> : <td>{programs.family_name}</td>
                }
                  <td>{programs.last_name}</td>
                  <td>{programs.name}</td>
                  <td>{programs.day_of_week.includes('1') ? <span>M </span>:<span></span>}
                  {programs.day_of_week.includes('2') ? <span>Tu </span>:<span></span>}
                  {programs.day_of_week.includes('3') ? <span>W </span>:<span></span>}
                  {programs.day_of_week.includes('4') ? <span>Th </span>:<span></span>}
                  {programs.day_of_week.includes('5') ? <span>F </span>:<span></span>}
                  {programs.day_of_week.includes('6') ? <span>Sa </span>:<span></span>}
                  {programs.day_of_week.includes('7') ? <span>Su </span>:<span></span>}</td>
                  <td>{programs.start_date.toString().split('T')[0]} {programs.end_date.toString().split('T')[0]}</td>
                  <td>{programs.start_time} {programs.end_time}</td>


              </tr>
          ))}

          </tbody>
      </table>
      </div>
    </div>
}

export default Registrations
