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

    //Search programs function
    const handleQuery = () =>{
      setQuery(document.getElementById('searchname').value);
      const results = schedules.filter(post => {//Filter by name
        if(document.getElementById('searchname').value == "") return post
        return post.name.toLowerCase().includes(document.getElementById('searchname').value.toLowerCase());
      })
      .filter(post=>{//filter by start time
          if(document.getElementById('searchTime').value == ""){
            return post
          }
          return post.start_time >= document.getElementById('searchTime').value;
        })
        .filter(post =>{//Remove program created by this user
            return ((document.cookie && JSON.parse(Cookies.get('user_id')).private == 1) ? (post.teacher_id!=JSON.parse(Cookies.get('user_id')).id):(post));
        })
        .filter(post=>{//filter by price
          if(document.getElementById('searchprice').value == ""){
            return post
          }
          return ((document.cookie && (JSON.parse(Cookies.get('user_id')).private == 1 || JSON.parse(Cookies.get('user_id')).member_status == 2))
            ? (post.member_price<=document.getElementById('searchprice').value) : (post.base_price<=document.getElementById('searchprice').value));
        })
        .filter(post => {//filter by weekday
          if(document.getElementById('week').value.toLowerCase() == 'day'){
            return post
          }
          return post.day_of_week.toLowerCase().includes(document.getElementById('week').value.toLowerCase());
        })
        .filter(post => {//Filter by whether capacity is full or not
          if(document.getElementById('capacityC').checked== false){
            return post
          }
          return post.current_enrollment<post.max_capacity
        })
        .filter(post => {//filter canceled programs
          if(document.getElementById('canceledC').checked== false){
            return post
          }
          return post.canceled==0
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



    return <div>
      <div>
        <header>
        {/*header*/}
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
      <div style={{width:"80vw", marginLeft:"8vw", marginRight:"10vw"}}>
        {/*The top row of the table, names each colum*/}
        <table class='table'>
            <thead bgcolor='purple'>
              <th>Name</th>
              <th>Day</th>
              <th>Time</th>
              <th>Start/End Date</th>
              <th>Price</th>
              <th>Capacity (current/max)</th>
              <th></th>{/*left empty so this row reaches all the way across*/}
            </thead>
            <tbody>
              {/*this is all the search tools*/}
              <tr>
                  <td>
                    <label for="searchname" style={{fontSize:"20px"}}>Search by</label>
                    <input class="SearchFeild" type="search" id='searchname' name='name' placeholder='Name' value={query} onChange={handleQuery}/>
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
                  <td><label for="searchTime" style={{fontSize:"20px"}}>Earliest start time</label> <input class="SearchFeild" type="time" id="searchTime" name="StartTime" placeholder='Name' onChange={handleQuery}/></td>
                  <td><label for="searchDate" style={{fontSize:"20px"}}>Earliest start date</label><input class="SearchFeild" type="date" id="searchDate" name="StartDate" placeholder='Name' onChange={handleQuery}/></td>
                  <td><label for="searchprice" style={{fontSize:"20px"}}>Search by</label><input class="SearchFeild" type="search" id='searchprice' name='costs' placeholder='Maximum price' onChange={handleQuery}/></td>
                  <td>
                    <label for="capacityC" style={{fontSize:"20px"}}>Exclude Filled Classes</label>
                    <input type="checkbox" name="staff" id='capacityC' onChange={handleQuery}/>
                  </td>
                  <td>
                    <label for="canceledC" style={{fontSize:"20px"}}>Exclude Canceled Classes</label>
                    <input type="checkbox" name="staff" id='canceledC' onChange={handleQuery}/>
                  </td>
              </tr>
              {/*the following mapping code lists off all the programs for in the table. Looks horrifying because everything has a conditional:
              if the program is not cancled, print normal stuff. Otherwise, print the same thing, but with strike-through tags*/
            /*Finally, if there aren't any programs, or if they've all been filtered by the search, display that there are "no results"*/}
              {
              state.list.length!=0 ? (
                state.list.map(schedule=>(
                <tr key={schedule.id}>
                    <td>{schedule.canceled == 1 ? <s>{schedule.name}</s> : schedule.name}</td>
                    <td>
                      {schedule.canceled == 1 ?
                        <s>
                          {schedule.day_of_week.includes('1') ? <span>M </span>:<span></span>}
                          {schedule.day_of_week.includes('2') ? <span>Tu </span>:<span></span>}
                          {schedule.day_of_week.includes('3') ? <span>W </span>:<span></span>}
                          {schedule.day_of_week.includes('4') ? <span>Th </span>:<span></span>}
                          {schedule.day_of_week.includes('5') ? <span>F </span>:<span></span>}
                          {schedule.day_of_week.includes('6') ? <span>Sa </span>:<span></span>}
                          {schedule.day_of_week.includes('7') ? <span>Su </span>:<span></span>}
                        </s>
                        :<div>
                          {schedule.day_of_week.includes('1') ? <span>M </span>:<span></span>}
                          {schedule.day_of_week.includes('2') ? <span>Tu </span>:<span></span>}
                          {schedule.day_of_week.includes('3') ? <span>W </span>:<span></span>}
                          {schedule.day_of_week.includes('4') ? <span>Th </span>:<span></span>}
                          {schedule.day_of_week.includes('5') ? <span>F </span>:<span></span>}
                          {schedule.day_of_week.includes('6') ? <span>Sa </span>:<span></span>}
                          {schedule.day_of_week.includes('7') ? <span>Su </span>:<span></span>}
                        </div>
                      }
                    </td>
                    {/*The space are intentional in the below code*/}
                    <td>
                      {schedule.canceled == 1 ? <s>{schedule.start_time}</s> : schedule.start_time }     {schedule.canceled == 1 ? <s>{schedule.end_time}</s> : schedule.end_time}
                    </td>
                    {/*That weird space between the }{ symbols? That's formatting. Don't remove*/}
                    <td>
                      {
                        schedule.canceled == 1 ? <s>{schedule.start_date.toString().split('T')[0]}</s>
                        :schedule.start_date.toString().split('T')[0]
                      }  {
                        schedule.canceled == 1 ? <s>{schedule.end_date.toString().split('T')[0]}</s>
                        :schedule.end_date.toString().split('T')[0]
                      }
                    </td>
                    {(document.cookie && (JSON.parse(Cookies.get('user_id')).private == 1 || JSON.parse(Cookies.get('user_id')).membership_status == 2)) ?
                      <td>${schedule.canceled == 1 ? <s>{schedule.member_price}</s> : schedule.member_price}</td>
                      :<td>${schedule.canceled == 1 ? <s>{schedule.base_price}</s> : schedule.base_price}</td>
                    }
                    <td>
                      {schedule.canceled == 1  ?
                        <s>{schedule.current_enrollment}</s>:schedule.current_enrollment
                      }/{schedule.canceled == 1 ?
                        <s>{schedule.max_capacity}</s> : schedule.max_capacity
                      }
                    </td>
                    {
                      schedule.canceled == 1 ? <td class='redtext'>Cancelled!</td> :
                      /*This button creates a cookie containing the data for the program the user is trying to enroll in, before sending the user to the enroll page*/
                      (document.cookie && schedule.current_enrollment<schedule.max_capacity) ? <td><button onClick={() => (document.cookie="program="+JSON.stringify(schedule)+"; path=/;", navigate("/Enroll")) }>Enroll</button></td> : <td></td>
                    }

                </tr>
            )))
            :<tr><td style={{background:"white"}}>No Results</td></tr>
          }

            </tbody>
        </table>
      </div>
    </div>
}

export default Schedules
