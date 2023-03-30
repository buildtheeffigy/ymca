import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from "axios"
import Cookies from 'js-cookie'
import {useNavigate} from "react-router-dom"

const Schedules = () => {
    const navigate = useNavigate();

    

    async function handleClick(e, schedule_id){
        try{
            const prereqname = await axios.post("http://localhost:8802/prereq", {course_id: e});

            if(prereqname.data[0].prereq_name == null){ // there is no prereq, aka good to go
                console.log("there is no prereq, aka good to go");

            }else{
              const prereq_id = await axios.post("http://localhost:8802/prereq2", {prereq_name: prereqname.data[0].prereq_name});
              console.log(prereq_id.data);
              const didtheytakeit = await axios.post("http://localhost:8802/prereq3", {prereq: prereq_id.data[0].id, user_id: JSON.parse(Cookies.get('user_id')).id});

              if(didtheytakeit.data.length != 0){
                //took prereq, sign up
                console.log("took prereq, sign up");
              }else{
                //did not take prereq
                console.log("didnt take prereq");
                alert("User has not passed pike level for this class!");
                //navigate("/about/");
                return;
              }
            }

            //console.log({user_id: JSON.parse(Cookies.get('user_id')).id, course_id: e});
            if(JSON.parse(Cookies.get('user_id')).family != 1){
              const result = await axios.post("http://localhost:8802/enrollment", {user_id: JSON.parse(Cookies.get('user_id')).id, course_id: e, schedule_id: schedule_id});

            }else{
              const result = await axios.post("http://localhost:8802/enrollment2", {user_id: JSON.parse(Cookies.get('user_id')).id, course_id: e, schedule_id: schedule_id, family_member_id: Cookies.get('family_id')});
              //alert(Cookies.get('family_id'));
              console.log(result);
            }
            //console.log(e + result)
            navigate("/");

          }catch(err){
            console.log(err);
          }
    }

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
          <th>Day</th>
          <th>Time</th>
          <th>Start/End Date</th>
          <th>Base Price</th>
          <th>Member Price</th>
          <th></th>
          </tr>
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
            <td>f</td>
            <td>f</td>
            <td>d</td>
            <td>d</td>
            <td>d</td>
            </tr>
          {state.list.map(schedule=>(
              <tr key={schedule.id}>
                  <td>{schedule.name}</td>
                  <td>{schedule.day_of_week}</td>
                  <td>{schedule.start_time}  {schedule.end_time}</td>
                  <td>{schedule.start_date.toString().split('T')[0]}  {schedule.end_date.toString().split('T')[0]}</td>
                  <td>{schedule.base_price}</td>
                  <td>{schedule.member_price}</td>
                  {
                    document.cookie ? <td><button onClick={() => handleClick(schedule.id, schedule.schedule_id)}>Enroll</button></td> : <td></td>
                  }

              </tr>
          ))}

</tbody>
      </table>
    </div>
}

export default Schedules
