import React, { useState } from 'react'
import {useNavigate} from "react-router-dom"
import { useEffect } from 'react'
import axios from "axios";
import Cookies from 'js-cookie'
import iiii from './YMCA-Logo-2010.png'
//The page where the user actually enrolls in programs
const Enroll = () =>{
  const navigate = useNavigate();

  //This is for the user's currently enrolled classes
  const [schedules, setSchedules] = useState([])
  //This is the staff member's created classes
  const [scheStaff, setScheStaff] = useState([])
  const [query, setQuery] = useState('');
  const [state, setstate] = useState({
    query: '',
    list_cust: schedules,
    list_staff: scheStaff
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
    for(let i=0; i<state.list_cust.length; i++){
      DropClass(state.list_cust[i].schedule_id,state.list_cust[i].program_id,parseInt(state.list_cust[i].current_enrollment));
    }
  }

  //This goes through the user's currently enrolled in programs, and returns any that conflict with the program they're currently enrolling in.
  const filtLoad = () =>{
    function dsf(value){
      let dayss=JSON.parse(Cookies.get("program")).day_of_week.length-1;
      //Check that the classes are held over the same set of dates
      if ((value.start_date>=JSON.parse(Cookies.get("program")).start_date && value.start_date<=JSON.parse(Cookies.get("program")).end_date)||
      (value.start_date<=JSON.parse(Cookies.get("program")).start_date && value.end_date>=JSON.parse(Cookies.get("program")).start_date)||
      (value.start_date==JSON.parse(Cookies.get("program")).start_date && value.end_date==JSON.parse(Cookies.get("program")).end_date)){

          while(dayss>=0){
          if(value.start_time>=JSON.parse(Cookies.get("program")).start_time && value.start_time<=JSON.parse(Cookies.get("program")).end_time
          && JSON.parse(Cookies.get("program")).day_of_week.charAt(dayss)!='0'
          && value.day_of_week.includes(JSON.parse(Cookies.get("program")).day_of_week.charAt(dayss))){//Existing enrollment starts in the middle of new one
            return value;
          }
          else{
            if(value.start_time<=JSON.parse(Cookies.get("program")).start_time && value.end_time>=JSON.parse(Cookies.get("program")).start_time
            && JSON.parse(Cookies.get("program")).day_of_week.charAt(dayss)!='0' &&
            value.day_of_week.includes(JSON.parse(Cookies.get("program")).day_of_week.charAt(dayss))){//Existing enrollment ends in the middle of the new one
              return value;
            }
            else{
              if(value.start_time==JSON.parse(Cookies.get("program")).start_time && value.end_time==JSON.parse(Cookies.get("program")).end_time
              && JSON.parse(Cookies.get("program")).day_of_week.charAt(dayss)!='0' &&
              value.day_of_week.includes(JSON.parse(Cookies.get("program")).day_of_week.charAt(dayss))){//Same time frame
                return value;
              }
            }
          }
        dayss-=1;
        }
      }
    }
    const results = schedules.filter(dsf);
    const results2=scheStaff.filter(dsf);
    state.list_cust=results;
    state.list_staff=results2;
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
        const fff=await axios.post("http://localhost:8802/increaseSeats",{enrol:parseInt(JSON.parse(Cookies.get("program")).current_enrollment)+1,
        program_id: JSON.parse(Cookies.get("program")).id});//Updates the recorded number of enrollments for the program
        if(JSON.parse(Cookies.get('user_id')).family != 1){
          //Creates to official enrollment in the database
          const result = await axios.post("http://localhost:8802/enrollment", {user_id: JSON.parse(Cookies.get('user_id')).id, course_id: e, schedule_id: schedule_id});
        }else{
          //Enrollment for family members
          const result = await axios.post("http://localhost:8802/enrollment2", {user_id: JSON.parse(Cookies.get('user_id')).id, course_id: e, schedule_id: schedule_id, family_member_id: Cookies.get('family_id')});
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
        if(JSON.parse(Cookies.get('user_id')).private == 1){//Gets all the user's created classes, stores them is seperapte list from enrollments
          const resA=await axios.post("http://localhost:8802/staffschedule",{teach_id:(JSON.parse(Cookies.get('user_id')).id)});
          setScheStaff(resA.data);
        }
        if(JSON.parse(Cookies.get('user_id')).family != null){//Next two blocks get enrolled classes
                //family
                const res = await axios.post("http://localhost:8802/personalschedulefamily", {user_id: JSON.parse(Cookies.get('user_id')).id, family_member_id: JSON.parse(Cookies.get('family_id'))});
                setSchedules(res.data)
                state.list_cust = res.data
                state.list_staff=scheStaff;
                console.log("familiy");
        }else{
            //not a family
            console.log("not a family");
            const res = await axios.post("http://localhost:8802/personalschedule", {user_id: JSON.parse(Cookies.get('user_id')).id});
            setSchedules(res.data)
            state.list_cust = res.data
            state.list_staff=scheStaff;
        }
      }catch(err){
          console.log(err)
      }
    }
    fetchAllSchedules()
  }, [])


  return(
  <div>
  {/*I don't know why this isn't a hook, but yeah. calls the function that searches for scheduling conflicts*/}
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
    {/*The following block has three states: first, if the conflict is found in the "created programs" list, the program will list ONLY those conflicts, generate the cancel enrollment
    button, and then generate an error message in place of the drop conflicts button
    ELSE, if there's a conflict in the existing enrollment list, then those conflicts are listed out, and both button options are given
    ELSE, the program simply says "all good", and give the options to confirm enrollment or cancel*/}
    <div class='container'>
      {
        state.list_staff[0]!=null ? (
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
              {state.list_staff.map(schedule=>(
                <tr key={schedule.id}>
                  <td>{schedule.name}</td>
                  <td>
                    {schedule.day_of_week.includes('1') ? <span>M </span>:<span></span>}
                    {schedule.day_of_week.includes('2') ? <span>Tu </span>:<span></span>}
                    {schedule.day_of_week.includes('3') ? <span>W </span>:<span></span>}
                    {schedule.day_of_week.includes('4') ? <span>Th </span>:<span></span>}
                    {schedule.day_of_week.includes('5') ? <span>F </span>:<span></span>}
                    {schedule.day_of_week.includes('6') ? <span>Sa </span>:<span></span>}
                    {schedule.day_of_week.includes('7') ? <span>Su </span>:<span></span>}
                  </td>
                  <td>{schedule.start_time}  {schedule.end_time}</td>
                  <td>{schedule.start_date.toString().split('T')[0]}  {schedule.end_date.toString().split('T')[0]}</td>
                  {(document.cookie && (JSON.parse(Cookies.get('user_id')).private == 1 || JSON.parse(Cookies.get('user_id')).member_status == 2)) ?
                  <td>${schedule.member_price}</td>:<td>${schedule.base_price}</td>}
                  <td>{schedule.current_enrollment}/{schedule.max_capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
        :(///
          state.list_cust[0]!=null ?  (
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
                {state.list_cust.map(schedule=>(
                  <tr key={schedule.id}>
                    <td>{schedule.name}</td>
                    <td>
                      {schedule.day_of_week.includes('1') ? <span>M </span>:<span></span>}
                      {schedule.day_of_week.includes('2') ? <span>Tu </span>:<span></span>}
                      {schedule.day_of_week.includes('3') ? <span>W </span>:<span></span>}
                      {schedule.day_of_week.includes('4') ? <span>Th </span>:<span></span>}
                      {schedule.day_of_week.includes('5') ? <span>F </span>:<span></span>}
                      {schedule.day_of_week.includes('6') ? <span>Sa </span>:<span></span>}
                      {schedule.day_of_week.includes('7') ? <span>Su </span>:<span></span>}
                    </td>
                    <td>{schedule.start_time}  {schedule.end_time}</td>
                    <td>{schedule.start_date.toString().split('T')[0]}  {schedule.end_date.toString().split('T')[0]}</td>
                    {(document.cookie && (JSON.parse(Cookies.get('user_id')).private == 1 || JSON.parse(Cookies.get('user_id')).member_status == 2)) ?
                    <td>${schedule.member_price}</td>:<td>${schedule.base_price}</td>}
                    <td>{schedule.current_enrollment}/{schedule.max_capacity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ):(
            <div>
              <div>
                <h3 style={{margin:"5px"}}>All good!</h3>
              </div>
              <div>
                <button class="btn btn-sm" style={{backgroundColor:"purple", color:"whitesmoke", margin:"3px"}} onClick={()=> handleClick(JSON.parse(Cookies.get("program")).id, JSON.parse(Cookies.get("program")).schedule_id)}>Confirm enrollment</button>
                <a href="/programs">
                  <button class="btn btn-sm" style={{backgroundColor:"purple", color:"whitesmoke", margin:"3px"}}>Cancel enrollment</button>
                </a>
              </div>
            </div>
          )
        )
      }
      {
        state.list_cust[0]!=null ? (
          <div>
            {
              state.list_staff[0]==null ?
                <button class="btn btn-sm" style={{backgroundColor:"purple", color:"whitesmoke", margin:"3px"}} onClick={()=> dropConflicts()}>Drop conflicts</button>
                :<span style={{color:"red"}}>You're hosting a class!</span>
            }
            <a href="/programs">
              <button class="btn btn-sm" style={{backgroundColor:"purple", color:"whitesmoke", margin:"3px"}}>Cancel enrollment</button>
            </a>
          </div>
        ):<div></div>
      }
    </div>
  </div>
  )
}
export default Enroll
