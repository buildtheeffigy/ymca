import React from 'react'
import { useState } from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom"
import Cookies from 'js-cookie'
const CreateProgram = () => {

    const [program, setProgram] = useState({
        description: "",
        max_capacity: 0,
        current_enrollment: 0,
        base_price: 0,
        member_price: 0,
        teacher_id: JSON.parse(Cookies.get('user_id')).id,
        name: "",
        prereq_name: ""

      });

    const navigate = useNavigate();

    const handleChange = (e) =>{
        setProgram(prev=>({...prev, [e.target.name]: e.target.value}))
      }

      const handleClick = async e =>{
        e.preventDefault();

        try{
            //alert(JSON.parse(Cookies.get('user_id')).id);
            const assd=document.getElementsByClassName("redtext");
            for(let i=0; i<assd.length; i++){
              assd[i].innerHTML = "";
            }
            var q = new Date();
            var date = new Date(q.getFullYear(),q.getMonth(),q.getDate());
            var starDate = new Date(document.getElementById('start').value);
            var endDate = new Date(document.getElementById('end').value);
            if(document.getElementById("name").value == ""){
              document.getElementById("redtext1").innerHTML = "Must enter program name!";
            } if(document.getElementById("description").value == ""){
              document.getElementById("redtext2").innerHTML = "Must enter description name!";
            } if(document.getElementById("max_capacity").value == ""){
              document.getElementById("redtext3").innerHTML = "Must enter maximum capacity!";
            }else if(document.getElementById("max_capacity").value == "0"){
              document.getElementById("redtext3").innerHTML = "Mac capacity must be greater than zero!";
            }
             if(document.getElementById("current_enrollment").value == ""){
              document.getElementById("redtext4").innerHTML = "Must enter current enrollment!";
            } if(document.getElementById("base_price").value == ""){
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
            var numInvalids=0;
            for(let i=0; i<assd.length; i++){
              if(assd[i].innerHTML!=""){
                numInvalids+=1
              }
            }
             if(numInvalids==0){
              if(document.getElementById("prerequisite").checked){

                const prereq_id = await axios.post("http://localhost:8802/prereq2", {prereq_name: document.getElementById("name").value });

                if(prereq_id.data.length != 0){
                  const result = await axios.post("http://localhost:8802/createprogram2", program); // prereq
                  const result2 = await axios.post("http://localhost:8802/scheduletable",
                                        {program_id: result.data.insertId,
                                        start_time: document.getElementById("start_time").value,
                                        end_time: document.getElementById("end_time").value,
                                        day_of_week: document.getElementById("week").value,
                                        start_date: document.getElementById("start").value,
                                        end_date: document.getElementById("end").value}); // insert into schedules
                  navigate("/");
                }else{{document.getElementById('start_time').valueAsDate = new Date()}
                  alert("Prerequisite class does not exist!  (Name must match previous class name)");
                }
              }else{
                const result = await axios.post("http://localhost:8802/createprogram", program);
                const result2 = await axios.post("http://localhost:8802/scheduletable",
                                        {program_id: result.data.insertId,
                                        start_time: document.getElementById("start_time").value,
                                        end_time: document.getElementById("end_time").value,
                                        day_of_week: document.getElementById("week").value,
                                        start_date: document.getElementById("start").value,
                                        end_date: document.getElementById("end").value}); // insert into schedules
                navigate("/");
              }
              //document.getElementById("redtext").innerHTML = "";



            }
        }catch(err){
            console.log(err);
        }
      }

  return (
    <div className='form'>
      <h1>Create Program!</h1>
      <div id='redtext1' className='redtext'></div>
      <label for='name'>Name</label>
      <input type="text" id='name' placeholder='program name' name='name' onChange={handleChange}/>
      <div id='redtext2' className='redtext'></div>
      <label for='description'>Description</label>
      <input type="text" id='description' placeholder='description' name='description' onChange={handleChange}/>
      <div style={{width:"600px"}}>
      <div style={{width:"50%", float:"left"}}>
          <div>
            <div id='redtext3' className='redtext'></div>
            <label for='max_capacity'>Maximum Capacity</label>
          </div>
      <input type="number" id="max_capacity" name="max_capacity" min="1" max="9999" onChange={handleChange}/>
      </div>
      <div style={{width:"50%", float:"right"}}>
        <div>
          <div id='redtext4' className='redtext'></div>
          <label for='current_enrollment'>Current Enrollment</label>
        </div>
      <input type="number" id='current_enrollment' name='current_enrollment' min="1" max="9999"  onChange={handleChange}/>
      </div>
      </div>
    <div style={{width:"600px"}}>
      <div style={{width:"50%", float:"left"}}>
        <div>
          <div id='redtext5' className='redtext'></div>
          <label for='base_price'>Base Price</label>
        </div>
        <input type="number" id='base_price' name='base_price' min="1" max="9999" onChange={handleChange}/>
        </div>
        <div style={{width:"50%", float:"right"}}>
          <div>
            <div id='redtext6' className='redtext'></div>
            <label for='member_price'>Member Price</label>
          </div>
        <input type="number" id='member_price' name='member_price' min="1" max="9999" onChange={handleChange}/>
      </div>
      <div>
      <label for='Prereq'>Requires prerequisite</label>
      <input type="checkbox" id="prerequisite" name="prerequisite" value="prerequisite"></input>
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
      </div>
      <div>
      <label for='week'>Day of Week</label>
      <select name="week" id="week">
        <option value="Monday">Monday</option>
        <option value="Tuesday">Tuesday</option>
        <option value="Wednesday">Wednesday</option>
        <option value="Thursday">Thursday</option>
        <option value="Friday">Friday</option>
        <option value="Saturday">Saturday</option>
        <option value="Sunday">Sunday</option>
        </select>
      </div>
      <button className='formButton' onClick={handleClick}>Submit</button>
    </div>
  )
}

export default CreateProgram
