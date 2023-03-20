import React from 'react'
import { useState } from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom"

const Login = () => {
    const [user, setUser] = useState({
        email: "",
        username: "",
        first_name: "",
        last_name: "",
        password: "",
        current_enrollment: 0,
        membership_status: 0,
        private: 0,
        family: null
      });
    
     const navigate = useNavigate();
    
      const handleChange = (e) =>{
        setUser(prev=>({...prev, [e.target.name]: e.target.value}))
      }
    
      const handleClick = async e =>{
        e.preventDefault();
        try{
          const result = await axios.post("http://localhost:8802/login", user);
          console.log(result)
          if(result.data.length == 0){
            document.getElementById("redtext").innerHTML = "User does not exist!";
          }
          else if(result.data[0].password == document.getElementById('password_field').value){ // correct password
            document.cookie = "user_id=" + JSON.stringify(result.data[0]) + "; path=/;";
            document.cookie = "new_family_name=" + result.data[0].first_name + "; path=/;";
            if(result.data[0].family != null){
              document.cookie = "family_id=0; path=/;";
              
            }
            navigate("/");
          }else{
            document.getElementById("redtext").innerHTML = "Password is incorrect!";
          }
          
        }catch(err){
          console.log(err);
        }
      }

  return (
    <div className='form'>
      <h1>Log In!</h1>
      <div id='redtext' className='redtext'></div>
      <input type="text" id='email_field' placeholder='email' name='email' onChange={handleChange}/>
      <input type="password" id='password_field' placeholder='password' name='password' onChange={handleChange}/>
      <button className='formButton' onClick={handleClick}>Submit</button>
      <a href="/Add/">Not a user?  Click here</a>
    </div>
  )
}

export default Login