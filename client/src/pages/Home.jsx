///NOTE: If page doesn't load, it may be because there's an unexpected cookie. Delete site cookies, and refreash the page
import React from 'react'
import Cookies from 'js-cookie'
import { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import sha256 from 'crypto-js/sha256.js'
import iiii from './YMCA-Logo-2010.png'
import picO from './pic4.jpg'
import pic1 from './pic1.jpg'
import pic2 from './pic2.jpg'



const Home = () => {
  //When staff create a program, this is the data submitted the the database
  const [program, setProgram] = useState({
      description: "",
      max_capacity: 0,
      current_enrollment: 0,
      base_price: 0,
      member_price: 0,
      teacher_id: document.cookie ? (JSON.parse(Cookies.get('user_id')).id): 0,
      name: "",
      prereq_name: ""

    });
    //These are the classes the user is enrolled in
  const [schedule, setSchedules] = useState([]);

  //these are the classes created by the user
  const [programss, setProgramss] = useState([]);

    const [query, setQuery] = useState('');
    //Used for filtering programs and displaying them in the table/schedules
    const [state, setstate] = useState({
      query: '',
      list: schedule,
      list2: programss
    });
    //The user's variables
  const [user, setUser] = useState({
      email: "",
      username: "",
      first_name: "",
      last_name: "",
      password: "",
      current_enrollment: 0,
      membership_status: 0,
      private: 0,
      family: null,
    });


  const navigate = useNavigate();
  //I don't actually know, I guess this is for login stuff?
  const handleChange = (e) =>{
    if(e.target.name == 'staff'){
      if(e.target.checked){
        setUser(prev=>({...prev, ['private']: 1}))
        document.getElementById('admin').checked = false;
      }
      else{
        setUser(prev=>({...prev, ['private']: 0}))
      }


    }else if(e.target.name == 'admin'){
      if(e.target.checked){
        setUser(prev=>({...prev, ['private']: 2}))
        document.getElementById('staff').checked = false;
      }
      else{
        setUser(prev=>({...prev, ['private']: 0}))
      }
    }else{
      setUser(prev=>({...prev, [e.target.name]: e.target.value}))
    }

}
//Probably updates some variables related to program creation?
const handleChange2 = (e) =>{
    setProgram(prev=>({...prev, [e.target.name]: e.target.value}))
  }

//!! Login page functions{

//Adds new user/creates new account
const handleClickAdd = async e =>{
  e.preventDefault();
  try{
    const result = await axios.post("http://localhost:8802/search", user);
    if(result.data.length == 0){
      //account doesn't exist, create now
      console.log("null response");
      await axios.post("http://localhost:8802/users", user);
      const result2 = await axios.post("http://localhost:8802/search", user);
      document.cookie = "user_id=" + JSON.stringify(result2.data[0]) + "; path=/;";
      document.cookie = "new_family_name=" + result2.data[0].first_name + "; path=/;";

      navigate("/");
    }else{
      //account already exists
      console.log(result.data);
      const email_field = document.getElementById("email");
      const username_field = document.getElementById('username');
      if(result.data[0].email == email_field.value && result.data[0].username == username_field.value){
        document.getElementById("redtext100").innerHTML = "Email and username already in use!";
      }else if(result.data[0].email == email_field.value ){
        document.getElementById("redtext100").innerHTML = "Email already in use!";
      }else if(result.data[0].username == username_field.value){
        document.getElementById("redtext100").innerHTML = "Username already in use!";
      }
    }
  }catch(err){
    console.log(err);
  }
}

//Logs an existing user in
const handleClickLogin = async e =>{
  e.preventDefault();
  try{
    const result = await axios.post("http://localhost:8802/login", user);
    console.log(result)
    if(result.data.length == 0){
      document.getElementById("redtext200").innerHTML = "User does not exist!";
    }
    else if(result.data[0].password == sha256(document.getElementById('password_field').value)){ // correct password
      document.cookie = "user_id=" + JSON.stringify(result.data[0]) + "; path=/;";
      document.cookie = "new_family_name=" + result.data[0].first_name + "; path=/;";
      if(result.data[0].family != null){
        document.cookie = "family_id=0; path=/;";

      }
      navigate("/");
    }else{
      document.getElementById("redtext200").innerHTML = "Password is incorrect!";
    }

  }catch(err){
    console.log(err);
  }
}
//}!! End login page
//!! UserDashboard {

//Changes the active family member (which family member's schedule to show, and who's currently enrolling for classes)
async function changeFamilyMember(e, newName){
  document.cookie = "family_id=" + e + "; path=/;";
  document.cookie = "new_family_name=" + newName + "; path=/;";
  const res = await axios.post("http://localhost:8802/personalschedulefamily", {user_id: JSON.parse(Cookies.get('user_id')).id, family_member_id: JSON.parse(Cookies.get('family_id'))});
  setSchedules(res.data)
  state.list = res.data
  navigate("/");
}

//Debug functions for upgrading to a member account.
async function UpgradeMember(){
  const res = await axios.post("http://localhost:8802/upgradeToMember", {upgrade_id: JSON.parse(Cookies.get('user_id')).id});
    var x = JSON.parse(Cookies.get('user_id'));
    x.membership_status = 2;
  document.cookie = "user_id=" + JSON.stringify(x) + "; path=/;";
  navigate("/");
}
//Debug downgrade
async function DowngradeMember(){
  const res = await axios.post("http://localhost:8802/upgradeToMember", {upgrade_id: JSON.parse(Cookies.get('user_id')).id});
    var x = JSON.parse(Cookies.get('user_id'));
    x.membership_status = 1;
  document.cookie = "user_id=" + JSON.stringify(x) + "; path=/;";
  navigate("/");
}

//Turns a normal user account into a family account
async function MakeFamily(){
  const res = await axios.post("http://localhost:8802/upgradeToFamily", {upgrade_id: JSON.parse(Cookies.get('user_id')).id});
    var x = JSON.parse(Cookies.get('user_id'));
    x.family = 1;
  document.cookie = "user_id=" + JSON.stringify(x) + "; path=/;";
  navigate("/");
}
//Creates/adds a new family member to an account
async function AddMember(){
  if(document.getElementById("fname").value==''){
    document.getElementById("redtextfam").innerHTML="Enter the family member's name!";
  }
  else{
    if(familyMem.length>=7){
      document.getElementById("redtextfam").innerHTML="Your family is full!";
    }
    else{
      const res = await axios.post("http://localhost:8802/familymember", {user_id: JSON.parse(Cookies.get('user_id')).id, name: document.getElementById("fname").value});
      window.location.href = '/'
    }
  }
}

//The list of family members
const [familyMem, setfamilyMem] = useState([])

  useEffect(() => {
      const fetchAllfamilyMems = async ()=>{
        try{
          /*while(!document.cookie){ //This is meant to combat the page loading before all data has been loaded
            var uuuu=4;
          }*/
            const res = await axios.post("http://localhost:8802/families", {user_id: JSON.parse(Cookies.get('user_id')).id});
            setfamilyMem(res.data)
        }catch(err){
            console.log(err)
        }
      }
      fetchAllfamilyMems()
    }, [])

//???
async function RegRedirect(e){
  navigate("/Registrations/");
}

//Handles searches for staff/private users only
const handleQuery = () =>{

  setQuery(document.getElementById('searchname').value);
  const results = programss.filter(post => {
    if(document.getElementById('searchname').value == "") return post
    return post.name.toLowerCase().includes(document.getElementById('searchname').value.toLowerCase());
  })
  .filter(post =>{
    return post.teacher_id==JSON.parse(Cookies.get('user_id')).id;
  })
  .filter(post => {
    if(document.getElementById('week').value.toLowerCase() == 'day'){
      return post
    }
    return post.day_of_week.toLowerCase() == document.getElementById('week').value.toLowerCase();
  }) .filter(post=>{
    if(document.getElementById('searchTime').value == ""){
      return post
    }
    return post.start_time >= document.getElementById('searchTime').value;
  }).filter(post=>{
    if(document.getElementById('searchDate').value == ""){
      return post
  }
    return post.start_date >= document.getElementById('searchDate').value;
  })
  .filter(post=>{
    if(document.getElementById('searchprice').value == ""){
      return post
    }
    return ((document.cookie && (JSON.parse(Cookies.get('user_id')).private == 1 || JSON.parse(Cookies.get('user_id')).member_status == 2))
      ? (post.member_price<=document.getElementById('searchprice').value): (post.base_price<=document.getElementById('searchprice').value));
  });
  setstate({
    query: document.getElementById('searchname').value,
    list: schedule,
    list2:results
  });
}



//Gets the programs data for currently enrolled programs, as well as the programs created by the user
useEffect(() => {
    const fetchAllSchedules = async ()=>{
      try{
            if(JSON.parse(Cookies.get('user_id')).family != null){
                    //is a family
                    const res = await axios.post("http://localhost:8802/personalschedulefamily", {user_id: JSON.parse(Cookies.get('user_id')).id, family_member_id: JSON.parse(Cookies.get('family_id'))});
                    setSchedules(res.data)
                    setProgramss(res.data)
                     state.list = res.data
                     state.list2=res.data
                     console.log("familiy");
            }else{
                //not a family
                console.log("not a family");
                const res2=await axios.post("http://localhost:8802/staffschedule",{teach_id:(JSON.parse(Cookies.get('user_id')).id)});
                console.log(res2);
                const res = await axios.post("http://localhost:8802/personalschedule", {user_id: JSON.parse(Cookies.get('user_id')).id});
                console.log(res2);
                setSchedules(res.data)
                setProgramss(res2.data)

                state.list = res.data
                state.list2 = res2.data.filter(post =>{
                  console.log(JSON.parse(Cookies.get('user_id')).id);
                  return post.teacher_id==JSON.parse(Cookies.get('user_id')).id;
                });
            }
      }catch(err){
          console.log(err)
      }
    }
    fetchAllSchedules()
  }, [])

  const cancelProgram = async (program_id)=>{
    const res = await axios.post("http://localhost:8802/cancelProgram",{program_id: program_id});
    window.location.href = '/'
  }

  //Drops a program
  const DropClass = async (schedule_id, program_id, capac) =>{
      if(JSON.parse(Cookies.get('user_id')).family != null){
          //family
          const res = await axios.post("http://localhost:8802/droppersonalclassfamily", {schedule_id: schedule_id, user_id: JSON.parse(Cookies.get('user_id')).id, family_member_id: JSON.parse(Cookies.get('family_id')) });
      }else{
          //not a family
          const res = await axios.post("http://localhost:8802/droppersonalclass", {schedule_id: schedule_id, user_id: JSON.parse(Cookies.get('user_id')).id });
      }
      const fff=await axios.post("http://localhost:8802/increaseSeats",{enrol:capac-1, program_id: program_id});
      window.location.href = '/'
    }



//Used for "collapsible" divs.
 const coooolll=()=>{
  var coll = document.getElementsByClassName("collap");
    var i;

    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      });
    }
  }

  const warnner=()=>{
    for(let i=0; i<state.list.length; i++){

    }
  }

    //The function that officially creates new programs
    const handleClickNex = async e =>{
      e.preventDefault();
      try{
          const assd=document.getElementsByClassName("redtext");
          for(let i=0; i<assd.length; i++){//Resets all error messages related to program creation
            assd[i].innerHTML = "";
          }
          document.getElementById("success").innerHTML="";
          var q = new Date();
          var date = new Date(q.getFullYear(),q.getMonth(),q.getDate());
          var starDate = new Date(document.getElementById('start').value);
          var endDate = new Date(document.getElementById('end').value);
          if(document.getElementById("name").value == ""){//Error checking and throwing
            document.getElementById("redtext1").innerHTML = "Must enter program name!";
          } if(document.getElementById("description").value == ""){
            document.getElementById("redtext2").innerHTML = "Must enter description name!";
          } if(document.getElementById("max_capacity").value == ""){
            document.getElementById("redtext3").innerHTML = "Must enter maximum capacity!";
          }else if(document.getElementById("max_capacity").value == "0"){
            document.getElementById("redtext3").innerHTML = "Mac capacity must be greater than zero!";
          }
          if(document.getElementById("base_price").value == ""){
            document.getElementById("redtext5").innerHTML = "Must enter base price!";
          }
           if(document.getElementById("member_price").value == ""){
            document.getElementById("redtext6").innerHTML = "Must enter member price!";
          } if(document.getElementById("start_time").value == ""){
            document.getElementById("redtext7").innerHTML = "Must enter start time!";
          }
           if(document.getElementById("end_time").value == ""){
            document.getElementById("redtext8").innerHTML = "Must enter end time!";
          }
          else if(document.getElementById("end_time").value<document.getElementById("start_time").value){
            document.getElementById("redtext8").innerHTML = "End time can't be earlier than start time!";
          }
          if(document.getElementById("start").value == ""){
            document.getElementById("redtext9").innerHTML = "Must enter start date!";
          } else if (date > starDate) {
            document.getElementById("redtext9").innerHTML = "Start date is in the past!";
          }

          if(document.getElementById("end").value == ""){
            document.getElementById("redtext10").innerHTML = "Must enter end date!";
          } else if(endDate < starDate){
            document.getElementById("redtext10").innerHTML = "End date is earlier than start date!";
          }

          if(document.getElementById("Monday").checked == false &&
          document.getElementById("Tuesday").checked == false &&
          document.getElementById("Wednesday").checked == false &&
          document.getElementById("Thursday").checked == false &&
          document.getElementById("Friday").checked == false &&
          document.getElementById("Saturday").checked == false &&
          document.getElementById("Sunday").checked == false
          ){
            document.getElementById("redtextweek").innerHTML = "Must enter days!";
          }

          var numInvalids=0;//if any errors have been thrown, they will be caught here, and the function stopped
          for(let i=0; i<assd.length; i++){
            if(assd[i].innerHTML!=""){
              numInvalids+=1
            }
          }
           if(numInvalids==0){//Else, continue with program creation
             document.getElementById("success").innerHTML="Program successfully created! Check \"created programs\"!"
            if(document.getElementById("prerequisite").checked){//If program has prereq
              const prereq_id = await axios.post("http://localhost:8802/prereq2", {prereq_name: document.getElementById("name").value });
              if(prereq_id.data.length != 0){

                const weekarray=document.getElementsByClassName("weekday");
                for(let i=0; i<weekarray.length; i++){
                   if(weekarray[i].checked){
                    const result = await axios.post("http://localhost:8802/createprogram2", program); // prereq
                    const result2 = await axios.post("http://localhost:8802/scheduletable",
                    {program_id: result.data.insertId,
                    start_time: document.getElementById("start_time").value,
                    end_time: document.getElementById("end_time").value,
                    day_of_week: weekarray[i].value,
                    start_date: document.getElementById("start").value,
                    end_date: document.getElementById("end").value}); // insert into schedules
                    console.log(result);
                    console.log(result2);
                   }
                  }

                  const res2=await axios.post("http://localhost:8802/staffschedule",{teach_id:(JSON.parse(Cookies.get('user_id')).id)});
                  const res = await axios.post("http://localhost:8802/personalschedule", {user_id: JSON.parse(Cookies.get('user_id')).id});
                  state.list = res.data
                  state.list2 = res2.data.filter(post =>{
                    return post.teacher_id==JSON.parse(Cookies.get('user_id')).id;
                  });
                  const resest=document.getElementsByTagName("input");
                  var fasas=0//There's a glitch where if the input feilds are cleared too soon, the database update fails. This loop prevents that
                  while((res2.data.length==[] && fasas<100)){
                    fasas=fasas+1;
                  }
                  for(let i=0; i<resest.length; i++){//Resets all program creation feilds
                    if(resest[i].type!="checkbox"){
                      resest[i].value="";
                    }
                    else{
                      resest[i].checked=false;
                    }
                  }
                navigate("/");

              }else{
                alert("Prerequisite class does not exist!  (Name must match previous class name)");
              }
            }else{


              const weekarray=document.getElementsByClassName("weekday");
             for(let i=0; i<weekarray.length; i++){
                if(weekarray[i].checked){
                  const result = await axios.post("http://localhost:8802/createprogram", program);
                  const result2 = await axios.post("http://localhost:8802/scheduletable",
                                      {program_id: result.data.insertId,
                                      start_time: document.getElementById("start_time").value,
                                      end_time: document.getElementById("end_time").value,
                                      day_of_week: weekarray[i].value,
                                      start_date: document.getElementById("start").value,
                                      end_date: document.getElementById("end").value}); // insert into schedules
                                      console.log(result);
                                      console.log(result2);
                }
               }
               const res2=await axios.post("http://localhost:8802/staffschedule",{teach_id:(JSON.parse(Cookies.get('user_id')).id)});
               const res = await axios.post("http://localhost:8802/personalschedule", {user_id: JSON.parse(Cookies.get('user_id')).id});
               state.list = res.data
               state.list2 = res2.data.filter(post =>{
                 console.log(JSON.parse(Cookies.get('user_id')).id);
                 return post.teacher_id==JSON.parse(Cookies.get('user_id')).id;
               });
               const resest=document.getElementsByTagName("input");
               var fasas=0//There's a glitch where if the input feilds are cleared too soon, the database update fails. This loop prevents that
               while((res2.data.length==[] && fasas<100)){
                 fasas=fasas+1;
               }
               for(let i=0; i<resest.length; i++){//Resets all program creation feilds
                 if(resest[i].type!="checkbox"){
                   resest[i].value="";
                 }
                 else{
                   resest[i].checked=false;
                 }
               }
              navigate("/");
              console.log("Reloaded1");
            }
          }
      }catch(err){
          console.log(err);
      }
    }
//} !! end Dashboard


  return (
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

              {
                document.cookie ? (JSON.parse(Cookies.get('user_id')).private == 1 ?
                (//Staff view
                  <div>
                  <div id="notifications" style={{display:"none", width:"100vw", marginLeft:"0vw", marginRight:"0vw", background:"lightyellow", paddingTop:"1px"}}>{/*notifications divs*/}
                  !!NOTICE!! The following classes have been canceled:
                  {state.list.map(schedule=>(
                    schedule.canceled==1 ? <div>{schedule.name}, {schedule.day_of_week}, {schedule.start_time} - {schedule.end_time}, {schedule.start_date.toString().split('T')[0]} - {schedule.end_date.toString().split('T')[0]}<span style={{display:"none"}}>{document.getElementById("notifications").style.display="block"}</span></div>:<span></span>
                  ))}
                  </div>
                    <button onClick={()=> coooolll()} class="collap" >Create NEW class</button>
                    <div class="cont" style={{width:"100vw", marginLeft:"0vw", marginRight:"0vw", background:"lightcyan", paddingTop:"1px"}}>{/*New programs div*/}
                    <div className='form'>
                      <h1>Create Program!</h1>
                      <div id='redtext1' className='redtext'></div>
                      <label for='name'>Name</label>
                      <input type="text" id='name' placeholder='program name' name='name' onChange={handleChange2}/>
                      <div id='redtext2' className='redtext'></div>
                      <label for='description'>Description</label>
                      <input type="text" id='description' placeholder='description' name='description' onChange={handleChange2}/>
                      <div style={{width:"600px"}}>
                      <div style={{width:"50%", float:"left"}}>
                          <div>
                            <div id='redtext3' className='redtext'></div>
                            <label for='max_capacity'>Maximum Capacity</label>
                          </div>
                      <input type="number" id="max_capacity" name="max_capacity" min="1" max="9999" onChange={handleChange2}/>
                      </div>
                      <div style={{width:"50%", float:"right"}}>
                        <div>
                          <label for='Prereq'>Requires prerequisite</label>
                        </div>
                        <input type="checkbox" id="prerequisite" name="prerequisite" value="prerequisite"></input>
                      </div>
                      </div>
                    <div style={{width:"600px"}}>
                      <div style={{width:"50%", float:"left"}}>
                        <div>
                          <div id='redtext5' className='redtext'></div>
                          <label for='base_price'>Base Price</label>
                        </div>
                        <input type="number" id='base_price' name='base_price' min="1" max="9999" onChange={handleChange2}/>
                        </div>
                        <div style={{width:"50%", float:"right"}}>
                          <div>
                            <div id='redtext6' className='redtext'></div>
                            <label for='member_price'>Member Price</label>
                          </div>
                        <input type="number" id='member_price' name='member_price' min="1" max="9999" onChange={handleChange2}/>
                      </div>
                      </div>
                      <div>
                      <div id='redtext9' className='redtext'></div>
                      <label for='start'>start date</label>
                      <input type="date" id="start" name="start_date"/>
                      <div id='redtext10' className='redtext'></div>
                      <label for='end'>end date</label>
                      <input type="date" id="end" name="end_date"/>
                      </div>
                      <div>
                      <div id='redtext7' className='redtext'></div>
                      <label for='start_time'>start time</label>
                      <input type="time" id="start_time" name="start_time" required/>
                      <div id='redtext8' className='redtext'></div>
                      <label for='end_time'>end time</label>
                      <input type="time" id="end_time" name="end_time"required/>
                      <div id='redtextweek' className='redtext'></div>
                      </div>
                      <div>

                        <div id='weekboxes'>
                        <input type="checkbox" className='weekday' name="Monday" id='Monday' value='Monday'/>
                        <label for='Monday'>Monday</label>
                        <input type="checkbox" className='weekday' name="Tuesday" id='Tuesday' value='Tuesday'/>
                        <label for='Tuesday'>Tuesday</label>
                        <input type="checkbox" className='weekday' name="Wednesday" id='Wednesday' value='Wednesday'/>
                        <label for='Wednesday'>Wednesday</label>
                        <input type="checkbox" className='weekday' name="Thursday" id='Thursday' value='Thursday'/>
                        <label for='Thursday'>Thursday</label>
                        <input type="checkbox" className='weekday' name="Friday" id='Friday' value='Friday'/>
                        <label for='Friday'>Friday</label>
                        <input type="checkbox" className='weekday' name="Saturday" id='Saturday' value='Saturday'/>
                        <label for='Saturday'>Saturday</label>
                        <input type="checkbox" className='weekday' name="Sunday" id='Sunday' value='Sunday'/>
                        <label for='Sunday'>Sunday</label>

                        </div>
                      </div>
                      <button className='formButton' onClick={handleClickNex}>Submit</button>
                      <label id="success" style={{color:"blue"}}></label>
                    </div>

                    </div>
                    <button onClick={()=> coooolll()} class="collap" >Created classes</button>
                    <div class="cont" style={{width:"100vw", marginLeft:"0vw", marginRight:"0vw", background:"lightcyan", paddingTop:"1px"}}>{/*Classes created by this user div*/}
                    <button class="btn btn-secondary btn-lg" onClick={() => RegRedirect()}>Registrations</button>
                      <div>
                        <table class='table'>
                          <thead bgcolor='purple'>

                            <th>Name</th>
                            <th>Day</th>
                            <th>Time</th>
                            <th>Start/End Date</th>
                            <th>Price</th>
                            <th>Capacity (current/max)</th>
                            <th></th>

                          </thead>

                          <tbody>
                            <tr>
                              <td><label for="searchname" style={{fontSize:"20px"}}>Search by</label><input type="search" id='searchname' name='name' placeholder='Name' value={query} onChange={handleQuery}/></td>
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
                            <td><label for="searchTime" style={{fontSize:"20px"}}>Earliest start time</label><input type="time" id="searchTime" name="StartTime" onChange={handleQuery}/></td>
                            <td><label for="searchDate" style={{fontSize:"20px"}}>Earliest start date</label><input type="date" id="searchDate" name="StartDate" onChange={handleQuery}/></td>
                            <td><label for="searchprice" style={{fontSize:"20px"}}>Search by</label><input type="search" id='searchprice' name='costs' placeholder='Maximum price' onChange={handleQuery}/></td>

                            </tr>
                        {state.list2.map( programss=>(
                            <tr key={programss.id}>
                                <td>{programss.name}</td>
                                <td>{programss.day_of_week}</td>
                                <td>{programss.start_time}  {programss.end_time}</td>
                                <td>{programss.start_date.toString().split('T')[0]}  {programss.end_date.toString().split('T')[0]}</td>
                                {(document.cookie && (JSON.parse(Cookies.get('user_id')).private == 1 || JSON.parse(Cookies.get('user_id')).member_status == 2)) ? <td>${programss.member_price}</td>:<td>${programss.base_price}</td>}
                                <td>{programss.current_enrollment}/{programss.max_capacity}</td>
                                <td><button onClick={()=> cancelProgram(programss.program_id)}>Cancel</button></td>

                            </tr>
                        ))}

                        </tbody>
                    </table>
                    </div>
                    </div>
                    <button onClick={()=> coooolll()} class="collap" >Schedule</button>
                    <div class="cont" style={{width:"100vw", marginLeft:"0vw", marginRight:"0vw", background:"lightcyan", paddingTop:"1px"}}>{/*Personal schedule div*/}
                    <a href="/programs"><button>Add classes</button></a>
                      <div class='container'>
                        <table class='table'>
                          <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Day of Week</th>
                            <th>Start/End Time</th>
                            <th>Start/End Date</th>
                            <th>Price</th>
                          </tr>
                          {state.list.map(schedule=>(
                            <tr key={schedule.id}>
                            {schedule.canceled==1 ? <td style={{textDecoration:"red line-through"}}>{schedule.name}</td>:<td>{schedule.name}</td>}
                            {schedule.canceled==1 ? <td style={{textDecoration:"red line-through"}}>{schedule.description}</td>:
                            <td>{schedule.description}</td>}

                            {schedule.canceled==1 ? <td style={{textDecoration:"red line-through"}}>{schedule.day_of_week}</td>:
                            <td>{schedule.day_of_week}</td>}

                            {schedule.canceled==1 ? <td style={{textDecoration:"red line-through"}}>{schedule.start_time}  {schedule.end_time}</td>:
                            <td>{schedule.start_time}  {schedule.end_time}</td>}

                            {schedule.canceled==1 ? <td style={{textDecoration:"red line-through"}}>{schedule.start_date.toString().split('T')[0]}  {schedule.end_date.toString().split('T')[0]}</td>:
                            <td>{schedule.start_date.toString().split('T')[0]}  {schedule.end_date.toString().split('T')[0]}</td>}
                            {(document.cookie && (JSON.parse(Cookies.get('user_id')).private == 1 || JSON.parse(Cookies.get('user_id')).membership_status == 2)) ? (<td>${schedule.member_price}</td>):(<td>${schedule.base_price}</td>)}
                            <td><button style={{backgroundColor:"grey"}} id = {schedule.schedule_id} onClick={() => DropClass(schedule.schedule_id, schedule.program_id, schedule.current_enrollment)}>Drop Class!</button></td>
                            </tr>
                          ))}
                    </table>
                    </div>

                    </div>

                  </div>
                )
                :(//Customer view
                  <div>
                  <div id="notifications" style={{display:"none", width:"100vw", marginLeft:"0vw", marginRight:"0vw", background:"lightyellow", paddingTop:"1px"}}>{/*notifications divs*/}
                  !!NOTICE!! The following classes have been canceled:
                  {state.list.map(schedule=>(
                    schedule.canceled==1 ? <div>{schedule.name}, {schedule.day_of_week}, {schedule.start_time} - {schedule.end_time}, {schedule.start_date.toString().split('T')[0]} - {schedule.end_date.toString().split('T')[0]}<span style={{display:"none"}}>{document.getElementById("notifications").style.display="block"}</span></div>:<span></span>
                  ))}
                  </div>
                    <button onClick={()=> coooolll()} class="collap" >Family</button>
                    <div class="cont" style={{width:"100vw", marginLeft:"0vw", marginRight:"0vw", background:"lightcyan", paddingTop:"1px"}}>{/*//Family account div*/}
                      {
                        document.cookie && JSON.parse(Cookies.get('user_id')).family != null
                        ?
                        <div style={{height:"500px"}}>
                        {/*family account view*/}
                            <div style={{ marginLeft:"20vw", width:"20vw", float:"left", marginTop:"10vh"}}>
                            <div id='redtextfam' className='redtext'></div>
                              <input type="text" id="fname" name="fname"></input>
                              <button class="btn btn-secondary btn-lg" id={0} onClick={() => AddMember()}>Add Family Member</button>
                            </div>
                            <div style={{ marginRight:"20vw", width:"30vw", float:"right"}}>
                              <h1 class="display-1">Family Members</h1>
                              <h3 class="display-4">Logged in as: {JSON.parse(Cookies.get('user_id')).first_name} {JSON.parse(Cookies.get('user_id')).last_name}</h3>
                              <div>
                                <button class="btn btn-secondary btn-lg" id={0} onClick={() => changeFamilyMember(0, JSON.parse(Cookies.get('user_id')).first_name)}>{JSON.parse(Cookies.get('user_id')).first_name}</button>
                                {familyMem.map(element=>(<button class="btn btn-secondary btn-lg" id={element.id} name={element.name} onClick={() => changeFamilyMember(element.id, element.name)}>{element.name}</button>))}
                              </div>
                            </div>
                        </div>
                        :
                        (<div>
                          {/*solo account view*/}
                          <div style={{ marginLeft:"20vw", width:"20vw", float:"left", marginTop:"10vh"}}>
                            <button class="btn btn-secondary btn-lg" id={0} onClick={() => MakeFamily()}>Convert to family account</button>
                          </div>
                          <div style={{ marginRight:"20vw", width:"30vw", float:"right"}}>
                            {/*this is empty intentionally. Just meant to show where member switching will be*/}
                          </div>
                        </div>
                      )
                      }
                    </div>
                    <button onClick={()=> coooolll()} class="collap" >Membership</button>
                    <div class="cont" style={{width:"100vw", marginLeft:"0vw", marginRight:"0vw", background:"lightcyan", paddingTop:"1px"}}>{/*member account div*/}
                        {
                          document.cookie && JSON.parse(Cookies.get('user_id')).membership_status != 2
                          ?
                          (<div style={{height:"500px"}}>
                            <div style={{ marginLeft:"20vw", width:"20vw", float:"left", marginTop:"10vh"}}>
                              <button class="btn btn-secondary btn-lg" id={0} onClick={() => UpgradeMember()}>Upgrade to a YMCA Membership!</button>
                            </div>
                            <div style={{padding:"50px", width:"50%", float:"right"}}>
                              <h1 class="display-1">Currently NOT YMCA Member!</h1>
                            </div>
                          </div>)
                          :
                          (<div style={{height:"500px"}}>
                            <div style={{ marginLeft:"20vw", width:"20vw", float:"left", marginTop:"10vh"}}>
                              <button class="btn btn-secondary btn-lg" id={0} onClick={() => DowngradeMember()}>End YMCA Membership!</button>
                            </div>
                            <div style={{padding:"50px", width:"50%", float:"right"}}>
                              <h1 class="display-1">Currently a YMCA Member!</h1>
                            </div>
                          </div>)
                        }
                    </div>
                    <button onClick={()=> coooolll()} class="collap" >Schedule</button>
                    <div class="cont" style={{width:"100vw", marginLeft:"0vw", marginRight:"0vw", background:"lightcyan", paddingTop:"1px"}}>{/*Personal schedule div*/}
                    <a href="/programs"><button>Add classes</button></a>
                      <div class='container'>
                        <table class='table'>
                          <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Day of Week</th>
                            <th>Start/End Time</th>
                            <th>Start/End Date</th>
                            <th>Price</th>
                          </tr>
                          {state.list.map(schedule=>(
                            <tr key={schedule.id}>
                              {schedule.canceled==1 ? <td style={{textDecoration:"red line-through"}}>{schedule.name}</td>:<td>{schedule.name}</td>}
                              {schedule.canceled==1 ? <td style={{textDecoration:"red line-through"}}>{schedule.description}</td>:
                              <td>{schedule.description}</td>}

                              {schedule.canceled==1 ? <td style={{textDecoration:"red line-through"}}>{schedule.day_of_week}</td>:
                              <td>{schedule.day_of_week}</td>}

                              {schedule.canceled==1 ? <td style={{textDecoration:"red line-through"}}>{schedule.start_time}  {schedule.end_time}</td>:
                              <td>{schedule.start_time}  {schedule.end_time}</td>}

                              {schedule.canceled==1 ? <td style={{textDecoration:"red line-through"}}>{schedule.start_date.toString().split('T')[0]}  {schedule.end_date.toString().split('T')[0]}</td>:
                              <td>{schedule.start_date.toString().split('T')[0]}  {schedule.end_date.toString().split('T')[0]}</td>}
                              {(document.cookie && (JSON.parse(Cookies.get('user_id')).private == 1 || JSON.parse(Cookies.get('user_id')).membership_status == 2)) ? (<td>${schedule.member_price}</td>):(<td>${schedule.base_price}</td>)}
                              <td><button style={{backgroundColor:"grey"}} id = {schedule.schedule_id} onClick={() => DropClass(schedule.schedule_id, schedule.program_id, schedule.current_enrollment)}>Drop Class!</button></td>
                            </tr>

                          ))}
                    </table>
                    </div>

                    </div>
                  </div>))
                :(<div>
                      {/*not logged in, get this view*/}
                    <div>
                      <div style={{marginLeft:"1%", width:"45%", float:"left"}}>
                        <marquee behavior="alternate">
                          <img src={picO}></img>
                          <img src={pic1}></img>
                          <img src={pic2}></img>
                        </marquee>
                      </div>
                      <div style={{width:"66%", marginLeft:"33%", marginRight:"auto", marginTop:"4px"}}>
                        <div className='form' style={{marginLeft:"10%", width:"33%", float:"left"}}>
                          <h1>Sign Up!</h1>
                          <div id='redtext100' className='redtext'></div>
                          <input type="text" id='email' placeholder='email' name='email' onChange={handleChange}/>
                          <input type="text" id='username' placeholder='username' name='username' onChange={handleChange}/>
                          <input type="text" placeholder='first name' name='first_name'  onChange={handleChange}/>
                          <input type="text" placeholder='last name' name='last_name' onChange={handleChange}/>
                          <input type="password" placeholder='password' name='password' onChange={handleChange}/>
                          <input type="checkbox" name="staff" id='staff' value='staff' onChange={handleChange}/>
                          <label for="staff">Create staff account</label><br></br>
                          <input type="checkbox" name="admin" id='admin' value='admin' onChange={handleChange}/>
                          <label for="admin">Create admin account</label><br></br>
                          <button className='formButton' onClick={handleClickAdd}>Submit</button>
                        </div>
                        <div className='form' style={{width:"33%", margin_top:"100px"}}>
                          <h1>Log In!</h1>
                          <div id='redtext200' className='redtext'></div>
                          <input type="text" id='email_field' placeholder='email' name='email' onChange={handleChange}/>
                          <input type="password" id='password_field' placeholder='password' name='password' onChange={handleChange}/>
                          <button className='formButton' onClick={handleClickLogin}>Submit</button>
                        </div>
                      </div>
                    </div>
                  </div>)
              }


    </div>
  )
}

export default Home
