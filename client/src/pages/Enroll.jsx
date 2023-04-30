import React, { useState } from 'react'
import {useNavigate} from "react-router-dom"
import { useEffect } from 'react'
import axios from "axios";
import Cookies from 'js-cookie'
import iiii from './YMCA-Logo-2010.png'
const Enroll = () =>{
  const navigate = useNavigate();

  //This is for the user's currently enrolled classes
  const [schedules, setSchedules] = useState([])
  const [query, setQuery] = useState('');
  const [state, setstate] = useState({
    query: '',
    list: schedules
  });

//Drops the specified class
const DropClass = async (schedule_id, program_id, capac) =>{
    if(JSON.parse(Cookies.get('user_id')).family != null){
        //family
        const res = await axios.post("http://localhost:8802/droppersonalclassfamily", {schedule_id: schedule_id, user_id: JSON.parse(Cookies.get('user_id')).id, family_member_id: JSON.parse(Cookies.get('family_id')) });

    }else{
        //not a family
        const res = await axios.post("http://localhost:8802/droppersonalclass", {schedule_id: schedule_id, user_id: JSON.parse(Cookies.get('user_id')).id });
    }
    const fff=await axios.post("http://localhost:8802/increaseSeats",{enrol:capac-1, program_id: program_id});
    window.location.href = '/Enroll'
  }

  //Drops all classes that conflict with the class the user is currently trying to enroll in.
  const dropConflicts = () =>{
    for(let i=0; i<state.list.length; i++){
      DropClass(state.list[i].schedule_id,state.list[i].program_id,parseInt(state.list[i].current_enrollment));
    }
  }

  //This goes through the user's currently enrolled in programs, and returns any that conflict with the program they're currently enrolling in.
const filtLoad = () =>{
  function dsf(value){
    let dayss=JSON.parse(Cookies.get("program")).day_of_week.length-1;
    while(dayss>=0){
    if(value.start_time>=JSON.parse(Cookies.get("program")).start_time && value.end_time<=JSON.parse(Cookies.get("program")).start_time && value.day_of_week.includes(JSON.parse(Cookies.get("program")).day_of_week.charAt(dayss))){//starts in the middle of another class
      return value;
    }else{
      if(value.start_time<=JSON.parse(Cookies.get("program")).start_time && value.start_time<=JSON.parse(Cookies.get("program")).end_time && value.day_of_week.includes(JSON.parse(Cookies.get("program")).day_of_week.charAt(dayss))){//ends in the middle of another class
        return value;
    }
    else{
      if(value.start_time<=JSON.parse(Cookies.get("program")).start_time && value.end_time>=JSON.parse(Cookies.get("program")).end_time && value.day_of_week.includes(JSON.parse(Cookies.get("program")).day_of_week.charAt(dayss))){//starts before class, and ends after class
        return value;
      }
    }
  }
  dayss-=1;
  }
}
const results = schedules.filter(dsf);
  console.log(results);
  state.list=results;
}

//This is the function that actually enrolls the user in a class
async function handleClick(e, schedule_id){
  console.log("Error reporting soft");
    try{
      setQuery("");
        const prereqname = await axios.post("http://localhost:8802/prereq", {course_id: e});

        if(prereqname.data[0].prereq_name == null){ // there is no prereq, aka good to go
            console.log("there is no prereq, aka good to go");

        }else{
          const prereq_id = await axios.post("http://localhost:8802/prereq2", {prereq_name: prereqname.data[0].prereq_name});
          console.log(prereq_id.data);
          var tookany = false;
          for(let i = 0; i < prereq_id.data.length; i++){
            const didtheytakeit = await axios.post("http://localhost:8802/prereq3", {prereq: prereq_id.data[i].id, user_id: JSON.parse(Cookies.get('user_id')).id});
            if(didtheytakeit.data.length != 0){
              tookany = true;
            }
          }
          if(tookany){
            //took prereq, sign up
            console.log("took prereq, sign up");

          }else{
            //did not take prereq
            console.log("didnt take prereq");
            alert("User has not passed pike level for this class!");
            return;
          }
        }

        //!!IMPORTANT!! If the conflicting class is the same as the one being enrolled in, then when the user drops the class, THE COOKIE DATA IS NOT UPDATED. That's why re-enrolling in the class increases the previous enrollment by 1, rather than
        //keeping it constant.
        const fff=await axios.post("http://localhost:8802/increaseSeats",{enrol:parseInt(JSON.parse(Cookies.get("program")).current_enrollment)+1, program_id: JSON.parse(Cookies.get("program")).id});
        if(JSON.parse(Cookies.get('user_id')).family != 1){
          const result = await axios.post("http://localhost:8802/enrollment", {user_id: JSON.parse(Cookies.get('user_id')).id, course_id: e, schedule_id: schedule_id});

        }else{
          const result = await axios.post("http://localhost:8802/enrollment2", {user_id: JSON.parse(Cookies.get('user_id')).id, course_id: e, schedule_id: schedule_id, family_member_id: Cookies.get('family_id')});
          console.log(result);
        }
      }catch(err){
        console.log(err);
      }
      navigate('/');
}

//Gets user's currently enrolled classes
useEffect(() => {
    const fetchAllSchedules = async ()=>{
      try{
            if(JSON.parse(Cookies.get('user_id')).family != null){
                    //family
                    const res = await axios.post("http://localhost:8802/personalschedulefamily", {user_id: JSON.parse(Cookies.get('user_id')).id, family_member_id: JSON.parse(Cookies.get('family_id'))});
                    setSchedules(res.data)
                     state.list = res.data
                     console.log("familiy");
            }else{
                //not a family
                console.log("not a family");
                const res = await axios.post("http://localhost:8802/personalschedule", {user_id: JSON.parse(Cookies.get('user_id')).id});
                setSchedules(res.data)
                state.list = res.data
            }

      }catch(err){
          console.log(err)
      }
    }
    fetchAllSchedules()
  }, [])


return(
<div>
{filtLoad()}
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

  {state.list[0]!=null ?  (<table class='table'>
        <thead bgcolor='purple'>

          <th>Name</th>
          <th>Day</th>
          <th>Time</th>
          <th>Start/End Date</th>
          <th>Price</th>
          <th>Capacity (current/max)</th>

          </thead>

          <tbody>
          {state.list.map(schedule=>(
            <tr key={schedule.id}>
              <td>{schedule.name}</td>
              <td>{schedule.day_of_week.includes('1') ? <span>M </span>:<span></span>}
              {schedule.day_of_week.includes('2') ? <span>Tu </span>:<span></span>}
              {schedule.day_of_week.includes('3') ? <span>W </span>:<span></span>}
              {schedule.day_of_week.includes('4') ? <span>Th </span>:<span></span>}
              {schedule.day_of_week.includes('5') ? <span>F </span>:<span></span>}
              {schedule.day_of_week.includes('6') ? <span>Sa </span>:<span></span>}
              {schedule.day_of_week.includes('7') ? <span>Su </span>:<span></span>}</td>
              <td>{schedule.start_time}  {schedule.end_time}</td>
              <td>{schedule.start_date.toString().split('T')[0]}  {schedule.end_date.toString().split('T')[0]}</td>
              {(document.cookie && (JSON.parse(Cookies.get('user_id')).private == 1 || JSON.parse(Cookies.get('user_id')).member_status == 2)) ? <td>${schedule.member_price}</td>:<td>${schedule.base_price}</td>}
              <td>{schedule.current_enrollment}/{schedule.max_capacity}</td>
            </tr>
          ))}

          </tbody>
      </table>
    ):(<div><div><h3 style={{margin:"5px"}}>All good!</h3></div><div> <button class="btn btn-sm" style={{backgroundColor:"purple", color:"whitesmoke", margin:"3px"}} onClick={()=> handleClick(JSON.parse(Cookies.get("program")).id, JSON.parse(Cookies.get("program")).schedule_id)}>Confirm enrollment</button>
    <a href="/programs"><button class="btn btn-sm" style={{backgroundColor:"purple", color:"whitesmoke", margin:"3px"}}>Cancel enrollment</button></a></div></div>)}
      {state.list[0]!=null ? (<div><button class="btn btn-sm" style={{backgroundColor:"purple", color:"whitesmoke", margin:"3px"}} onClick={()=> dropConflicts()}>Drop conflicts</button>
        <a href="/programs"><button class="btn btn-sm" style={{backgroundColor:"purple", color:"whitesmoke", margin:"3px"}}>Cancel enrollment</button></a></div>):<div></div>}

  </div>
</div>
)
}
export default Enroll
