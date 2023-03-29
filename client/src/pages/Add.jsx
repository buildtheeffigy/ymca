import React from 'react'
import { useState } from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom"
const Add = () => {
  //(first_name, last_name, current_enrollment, password, membership_status, private, username, family, email) VALUES (?)";

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
      const result = await axios.post("http://localhost:8802/search", user);
      if(result.data.length == 0){
        console.log("null response");
        await axios.post("http://localhost:8802/users", user);
        const result2 = await axios.post("http://localhost:8802/search", user);
        document.cookie = "user_id=" + JSON.stringify(result2.data[0]) + "; path=/;";
        document.cookie = "new_family_name=" + result2.data[0].first_name + "; path=/;";
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
        //navigate("/add");
      }


    }catch(err){
      console.log(err);
    }
  }

  return (
    <div className='form'>
      <h1>Sign Up!</h1>
      <div id='redtext' className='redtext'></div>
      <input type="text" id='email' placeholder='email' name='email' onChange={handleChange}/>
      <input type="text" id='username' placeholder='username' name='username' onChange={handleChange}/>
      <input type="text" placeholder='first name' name='first_name'  onChange={handleChange}/>
      <input type="text" placeholder='last name' name='last_name' onChange={handleChange}/>
      <input type="password" placeholder='password' name='password' onChange={handleChange}/>
      <button className='formButton' onClick={handleClick}>Submit</button>
      <a href="/Login/">Already a user?  Click here</a>
    </div>
  )
}

export default Add
