import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from "axios"
import Cookies from 'js-cookie'
import {useNavigate} from "react-router-dom"
import iiii from './YMCA-Logo-2010.png'

const Schedules = () => {
    const navigate = useNavigate();






    const [schedules, setSchedules] = useState([])

    const [query, setQuery] = useState('');
    const [state, setstate] = useState({
      query: '',
      list: schedules
    });
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
      //alert(state.query);
    }
    useEffect(() => {
      const fetchAllSchedules = async ()=>{
        try{
            const res = await axios.get("http://localhost:8802/schedules");
            setSchedules(res.data)
            state.list = res.data
        }catch(err){
            console.log(err)
        }
      }
      fetchAllSchedules()

    }, [])



      return <div>

      <div>
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
      </div>
      <div class='container'>
      <table class='table'>
          <thead bgcolor='purple'>

            <th>Name</th>
            <th>Day</th>
            <th>Time</th>
            <th>Start/End Date</th>
            <th>Price</th>
            <th>Capacity (current/max)</th>

          </thead>

          <tbody>
            <tr>
            <td><input type="search" id='searchname' name='name' placeholder='' value={query} onChange={handleQuery}/></td>
            <td>
            <select name="week" id="week" onChange={handleQuery}>
              <option value="day">Choose day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
            </td>
            <td><input type="time" id="searchTime" name="StartTime" onChange={handleQuery}/></td>
            <td><input type="date" id="searchDate" name="StartDate" onChange={handleQuery}/></td>
            <td><input type="search" id='searchprice' name='costs' placeholder='' onChange={handleQuery}/></td>
            <td></td>
            <td></td>
            </tr>
{console.log(state.list[0])}
          {state.list.map(schedule=>(
              <tr key={schedule.id}>
                  <td>{schedule.name}</td>
                  <td>{schedule.day_of_week}</td>
                  <td>{schedule.start_time}  {schedule.end_time}</td>
                  <td>{schedule.start_date.toString().split('T')[0]}  {schedule.end_date.toString().split('T')[0]}</td>
                  {(document.cookie && (JSON.parse(Cookies.get('user_id')).private == 1 || JSON.parse(Cookies.get('user_id')).membership_status == 2)) ? <td>${schedule.member_price}</td>:<td>${schedule.base_price}</td>}
                  <td>{schedule.current_enrollment} {schedule.max_capacity}</td>
                  {
                    document.cookie ? <td><button onClick={() => (document.cookie="program="+JSON.stringify(schedule)+"; path=/;", navigate("/Enroll")) }>Enroll</button></td> : <td></td>
                  }

              </tr>
          ))}

          </tbody>
      </table>
      </div>
    </div>
}

export default Schedules
