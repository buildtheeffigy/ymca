import React from 'react'
import { useState } from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom"
const CreateProgram = () => {

    const [program, setProgram] = useState({
        description: "",
        max_capacity: 0,
        current_enrollment: 0,
        base_price: 0,
        member_price: 0,
        teacher_id: 0,
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
            
        }catch(err){
            console.log(err);
        }
        /*  
        try{
          const result = await axios.post("http://localhost:8802/search", user);
          if(result.data.length == 0){
            console.log("null response");
            await axios.post("http://localhost:8802/users", user);
            const result2 = await axios.post("http://localhost:8802/search", user);
            document.cookie = "user_id=" + JSON.stringify(result2.data[0]) + "; path=/;";
            //didnt exist just created
            navigate("/");
          }else{
            //already exists
            console.log(result.data);
            const email_field = document.getElementById("email");
            const username_field = document.getElementById('username');
            if(result.data[0].email == email_field.value && result.data[0].username == username_field.value){
              document.getElementById("redtext").innerHTML = "Email and username already in use!";
            }else if(result.data[0].email == email_field.value ){
              document.getElementById("redtext").innerHTML = "Email already in use!";
            }else if(result.data[0].username == username_field.value){
              document.getElementById("redtext").innerHTML = "Username already in use!";
            }
        }
          
          
    }catch(err){
      console.log(err);
    }
        
        
        */
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
      <label for='Prereq'>Prerequisites</label>
      <select name="Prereq" id="Prereq">
        <option value="volvo">None</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
        </select>
      </div>
      <div>
      <label for='start'>start date</label>
      <input type="date" id="start" name="start_date" value="2018-07-22" min="2018-01-01" max="2018-12-31"/>
      <label for='end'>end date</label>
      <input type="date" id="end" name="end_date" value="2018-07-22" min="2018-01-01" max="2018-12-31"/>
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