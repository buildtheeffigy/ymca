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

            if(document.getElementById("name").value == ""){
              document.getElementById("redtext").innerHTML = "Must enter program name!";
            }else if(document.getElementById("description").value == ""){
              document.getElementById("redtext").innerHTML = "Must enter description name!";
            }else if(document.getElementById("max_capacity").value == ""){
              document.getElementById("redtext").innerHTML = "Must enter maximum capacity!";
            }
            else if(document.getElementById("current_enrollment").value == ""){
              document.getElementById("redtext").innerHTML = "Must enter current enrollment!";
            }else if(document.getElementById("base_price").value == ""){
              document.getElementById("redtext").innerHTML = "Must enter base price!";
            }
            else if(document.getElementById("member_price").value == ""){
              document.getElementById("redtext").innerHTML = "Must enter member price!";
            }else if(document.getElementById("start_time").value == ""){
              document.getElementById("redtext").innerHTML = "Must enter start time!";
            }
            else if(document.getElementById("end_time").value == ""){
              document.getElementById("redtext").innerHTML = "Must enter end time!";
            }else if(document.getElementById("start").value == ""){
              document.getElementById("redtext").innerHTML = "Must enter start date!";
            }else if(document.getElementById("end").value == ""){
              document.getElementById("redtext").innerHTML = "Must enter end date!";
            }
            
            else{
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
                }else{
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
              document.getElementById("redtext").innerHTML = "";
              

              
            }
        }catch(err){
            console.log(err);
        }
      }

  return (
    <div className='form'>
      <h1>Create Program!</h1>
      <div id='redtext' className='redtext'></div>
      <input type="text" id='name' placeholder='program name' name='name' onChange={handleChange}/>
      <input type="text" id='description' placeholder='description' name='description' onChange={handleChange}/>
      <div>
        <label for='max_capacity'>Maximum Capacity</label>
      <input type="number" id="max_capacity" name="max_capacity" min="1" max="9999" onChange={handleChange}/>
      <label for='current_enrollment'>Current Enrollment</label>
      <input type="number" id='current_enrollment' name='current_enrollment' min="1" max="9999"  onChange={handleChange}/>
      </div>
      <div>
        <label for='base_price'>Base Price</label>
        <input type="number" id='base_price' name='base_price' min="1" max="9999" onChange={handleChange}/>
        <label for='member_price'>Member Price</label>
        <input type="number" id='member_price' name='member_price' min="1" max="9999" onChange={handleChange}/>
      </div>
      <div>
      <label for='Prereq'>Requires prerequisite</label>
      <input type="checkbox" id="prerequisite" name="prerequisite" value="prerequisite"></input>
      </div>
      <div>
      <label for='start'>start date</label>
      <input type="date" id="start" name="start_date" />
      <label for='end'>end date</label>
      <input type="date" id="end" name="end_date"/>
      </div>
      <div>
      <label for='start_time'>start time</label>
      <input type="time" id="start_time" name="start_time"required/>
      <label for='start_time'>end time</label>
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