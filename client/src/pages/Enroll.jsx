import React, { useState } from 'react'
import {useNavigate} from "react-router-dom"
import { useEffect } from 'react'
import axios from "axios";
import Cookies from 'js-cookie'
import iiii from './YMCA-Logo-2010.png'
const Enroll = () =>{
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([])

  const [query, setQuery] = useState('');
  const [state, setstate] = useState({
    query: '',
    list: schedules
});

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

  const dropConflicts = () =>{
    for(let i=0; i<state.list.length; i++){
      DropClass(state.list[i].schedule_id,state.list[i].program_id,parseInt(state.list[i].current_enrollment));
    }
  }

const filtLoad = () =>{
  function dsf(value){
    if(value.start_time>=JSON.parse(Cookies.get("program")).start_time && value.end_time<=JSON.parse(Cookies.get("program")).start_time && value.day_of_week==JSON.parse(Cookies.get("program")).day_of_week){//starts in the middle of another class
      return value;
    }else{
      if(value.start_time<=JSON.parse(Cookies.get("program")).start_time && value.start_time<=JSON.parse(Cookies.get("program")).end_time && value.day_of_week==JSON.parse(Cookies.get("program")).day_of_week){//ends in the middle of another class
        return value;
    }
    else{
      if(value.start_time<=JSON.parse(Cookies.get("program")).start_time && value.end_time>=JSON.parse(Cookies.get("program")).end_time && value.day_of_week==JSON.parse(Cookies.get("program")).day_of_week){//starts before class, and ends after class
        return value;
      }
    }
  }
}
const results = schedules.filter(dsf);
  console.log(results);
  state.list=results;
}


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

          //console.log(didtheytakeit.data);
          if(tookany){
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
        //!!IMPORTANT!! If the conflicting class is the same as the one being enrolled in, then when the user drops the class, THE COOKIE DATA IS NOT UPDATED. That's why re-enrolling in the class increases the previous enrollment by 1, rather than
        //keeping it constant.
        const fff=await axios.post("http://localhost:8802/increaseSeats",{enrol:parseInt(JSON.parse(Cookies.get("program")).current_enrollment)+1, program_id: JSON.parse(Cookies.get("program")).id});
        if(JSON.parse(Cookies.get('user_id')).family != 1){
          const result = await axios.post("http://localhost:8802/enrollment", {user_id: JSON.parse(Cookies.get('user_id')).id, course_id: e, schedule_id: schedule_id});

        }else{
          const result = await axios.post("http://localhost:8802/enrollment2", {user_id: JSON.parse(Cookies.get('user_id')).id, course_id: e, schedule_id: schedule_id, family_member_id: Cookies.get('family_id')});
          //alert(Cookies.get('family_id'));
          console.log(result);
        }
        //console.log(e + result)
        //navigate("/");

      }catch(err){
        console.log(err);
      }
      navigate('/');
}


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
              <td>{schedule.day_of_week}</td>
              <td>{schedule.start_time}  {schedule.end_time}</td>
              <td>{schedule.start_date.toString().split('T')[0]}  {schedule.end_date.toString().split('T')[0]}</td>
              {(document.cookie && (JSON.parse(Cookies.get('user_id')).private == 1 || JSON.parse(Cookies.get('user_id')).member_status == 2)) ? <td>${schedule.member_price}</td>:<td>${schedule.base_price}</td>}
              <td>{schedule.current_enrollment} {schedule.max_capacity}</td>
            </tr>
          ))}

          </tbody>
      </table>
    ):(<div>All good <button onClick={()=> handleClick(JSON.parse(Cookies.get("program")).id, JSON.parse(Cookies.get("program")).schedule_id)}>Confirm enrollment</button><a href="/programs"><button>Cancel enrollment</button></a></div>)}
      {state.list[0]!=null ? (<div><button onClick={()=> dropConflicts()}>Drop conflicts</button>
        <a href="/programs"><button>Cancel enrollment</button></a></div>):<div></div>}

  </div>
</div>
)
}
export default Enroll
