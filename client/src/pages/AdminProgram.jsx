import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from "axios"
import {useNavigate} from "react-router-dom"
import Cookies from 'js-cookie'
import iiii from './YMCA-Logo-2010.png'

const AdminProgram=()=>{
  const navigate = useNavigate();


  const [schedules, setSchedules] = useState([])

  const [query, setQuery] = useState('');
  const [state, setstate] = useState({
    query: '',
    list: schedules
  });

  //Search programs function
  const handleQuery = () =>{
    setQuery(document.getElementById('searchname').value);
    const results = schedules.filter(post => {
      if(document.getElementById('searchname').value == "") return post
      return post.name.toLowerCase().includes(document.getElementById('searchname').value.toLowerCase());
    }).filter(post=>{
        if(document.getElementById('searchTime').value == ""){
          return post
        }
        return post.start_time >= document.getElementById('searchTime').value;
      }).filter(post =>{
          return ((document.cookie && JSON.parse(Cookies.get('user_id')).private == 1) ? (post.teacher_id!=JSON.parse(Cookies.get('user_id')).id):(post));
        }).filter(post=>{
        if(document.getElementById('searchprice').value == ""){
          return post
        }
        return ((document.cookie && (JSON.parse(Cookies.get('user_id')).private == 1 || JSON.parse(Cookies.get('user_id')).member_status == 2))
          ? (post.member_price<=document.getElementById('searchprice').value): (post.base_price<=document.getElementById('searchprice').value));
      }).filter(post => {
      if(document.getElementById('week').value.toLowerCase() == 'day'){
        return post
      }
      return post.day_of_week.toLowerCase() == document.getElementById('week').value.toLowerCase();
    });
    setstate({
      query: document.getElementById('searchname').value,
      list: results
    });
  }

  //loads program data
  useEffect(() => {
    const fetchAllSchedules = async ()=>{
      try{
          const res = await axios.get("http://localhost:8802/schedules");
          setSchedules(res.data)
          state.list = res.data.filter(post =>{
              return ((document.cookie && JSON.parse(Cookies.get('user_id')).private == 1) ? (post.teacher_id!=JSON.parse(Cookies.get('user_id')).id):(post));
            });
      }catch(err){
          console.log(err)
      }
    }
    fetchAllSchedules()
  }, [])

  return(
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
    <div>
    <div style={{width:"80vw", marginLeft:"10vw", marginRight:"10vw"}}>
    <table class='table'>
        <thead bgcolor='purple'>

          <th>Name</th>
          <th>Day</th>
          <th>Time</th>
          <th>Start/End Date</th>
          <th>Base Price/Member price</th>
          <th>Capacity (current/max)</th>
          <th>Canceled</th>

        </thead>

        <tbody>
          <tr>
          <td>
            <label for="searchname" style={{fontSize:"20px"}}>Search by</label>
            <input class="SearchFeild" type="search" id='searchname' name='name' placeholder='Name' value={query} onChange={handleQuery}/>
          </td>
          <td>
          <label for="week" style={{fontSize:"20px"}}>Search by</label>
          <select name="week" id="week" onChange={handleQuery}>
            <option value="day">Weekday</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
          </td>
          <td><label for="searchTime" style={{fontSize:"20px"}}>Earliest start time</label> <input class="SearchFeild" type="time" id="searchTime" name="StartTime" placeholder='Name' onChange={handleQuery}/></td>
          <td><label for="searchDate" style={{fontSize:"20px"}}>Earliest start date</label><input class="SearchFeild" type="date" id="searchDate" name="StartDate" placeholder='Name' onChange={handleQuery}/></td>
          <td><label for="searchprice" style={{fontSize:"20px"}}>Search by</label><input class="SearchFeild" type="search" id='searchprice' name='costs' placeholder='Maximum price' onChange={handleQuery}/></td>
          <td></td>
          <td></td>
          </tr>

          { state.list.length!=0 ? (
        state.list.map(schedule=>(
            <tr key={schedule.id}>
                <td>{schedule.name}</td>
                <td>{schedule.day_of_week}</td>
                <td>{schedule.start_time}  {schedule.end_time}</td>
                <td>{schedule.start_date.toString().split('T')[0]}  {schedule.end_date.toString().split('T')[0]}</td>
                <td>${schedule.base_price}/${schedule.member_price}</td>
                <td>{schedule.current_enrollment}/{schedule.max_capacity}</td>
                <td>{schedule.canceled}</td>
            </tr>
        )))
        :<tr><td style={{background:"white"}}>No Results</td></tr>
      }

        </tbody>
    </table>
    </div>
    </div>

    </div>
  )
}

export default AdminProgram
