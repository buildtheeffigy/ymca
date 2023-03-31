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

  const handleChange = (e) =>{
    //alert(e.target.name);
    if(e.target.name == 'staff'){
      //alert(e.target.checked);
      if(e.target.checked){
        setUser(prev=>({...prev, ['private']: 1}))
      }
      else{
        setUser(prev=>({...prev, ['private']: 0}))
      }


    }else{
      setUser(prev=>({...prev, [e.target.name]: e.target.value}))
    }

}

//!!Adds new user
const handleClickAdd = async e =>{
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
//!!Logs an existing user in
const handleClickLogin = async e =>{
  e.preventDefault();
  try{
    const result = await axios.post("http://localhost:8802/login", user);
    console.log(result)
    if(result.data.length == 0){
      document.getElementById("redtext").innerHTML = "User does not exist!";
    }
    else if(result.data[0].password == sha256(document.getElementById('password_field').value)){ // correct password
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

//UserDashboard
async function changeFamilyMember(e, newName){
  document.cookie = "family_id=" + e + "; path=/;";
  document.cookie = "new_family_name=" + newName + "; path=/;";
  navigate("/");
}

async function UpgradeMember(){
  const res = await axios.post("http://localhost:8802/upgradeToMember", {upgrade_id: JSON.parse(Cookies.get('user_id')).id});
    var x = JSON.parse(Cookies.get('user_id'));
    x.membership_status = 2;
  document.cookie = "user_id=" + JSON.stringify(x) + "; path=/;";
  navigate("/");
}

async function DowngradeMember(){
  const res = await axios.post("http://localhost:8802/upgradeToMember", {upgrade_id: JSON.parse(Cookies.get('user_id')).id});
    var x = JSON.parse(Cookies.get('user_id'));
    x.membership_status = 1;
  document.cookie = "user_id=" + JSON.stringify(x) + "; path=/;";
  navigate("/");
}



async function MakeFamily(){
  const res = await axios.post("http://localhost:8802/upgradeToFamily", {upgrade_id: JSON.parse(Cookies.get('user_id')).id});
    var x = JSON.parse(Cookies.get('user_id'));
    x.family = 1;
  document.cookie = "user_id=" + JSON.stringify(x) + "; path=/;";
  navigate("/");
}

async function AddMember(){
  const res = await axios.post("http://localhost:8802/familymember", {user_id: JSON.parse(Cookies.get('user_id')).id, name: document.getElementById("fname").value});
  window.location.href = '/'
}

const [programs, setPrograms] = useState([])

  useEffect(() => {
      const fetchAllPrograms = async ()=>{
        try{
            const res = await axios.post("http://localhost:8802/families", {user_id: JSON.parse(Cookies.get('user_id')).id});
            setPrograms(res.data)
        }catch(err){
            console.log(err)
        }
      }
      fetchAllPrograms()
    }, [])


  async function createProgRedirect(e){
    navigate("/CreateProgram/");
}

async function RegRedirect(e){
  navigate("/Registrations/");
}

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
                    <button class="btn btn-secondary btn-lg" onClick={() => createProgRedirect()}>Create Program!</button>
                    <button class="btn btn-secondary btn-lg" onClick={() => RegRedirect()}>Registrations</button>
                  </div>
                )
                :(//Customer view
                  <div>
                    <div style={{width:"600px", marginLeft:"30%", marginRight:"auto", marginTop:"30px"}}>{/*//Family account div*/}
                      {
                        document.cookie && JSON.parse(Cookies.get('user_id')).family != null
                        ?
                        <div>
                            {/*family account view*/}
                            <div style={{padding:"50px", background:"orange", width:"50%", float:"left"}}>
                              <input type="text" id="fname" name="fname"></input>
                              <button class="btn btn-secondary btn-lg" id={0} onClick={() => AddMember()}>Add Family Member</button>
                            </div>
                            <div style={{padding:"50px", background:"orange", width:"50%", float:"right"}}>
                              <h1 class="display-1">Family Members</h1>
                              <h3 class="display-4">Logged in as: {JSON.parse(Cookies.get('user_id')).first_name} {JSON.parse(Cookies.get('user_id')).last_name}</h3>
                              <div>
                                <button class="btn btn-secondary btn-lg" id={0} onClick={() => changeFamilyMember(0, JSON.parse(Cookies.get('user_id')).first_name)}>{JSON.parse(Cookies.get('user_id')).first_name}</button>
                                {programs.map(element=>(<button class="btn btn-secondary btn-lg" id={element.id} onClick={() => changeFamilyMember(element.id, element.name)}>{element.name}</button>))}
                              </div>
                            </div>
                        </div>
                        :
                        (<div>
                          {/*solo account view*/}
                          <div style={{padding:"50px", background:"orange", width:"50%", float:"left"}}>
                            <button class="btn btn-secondary btn-lg" id={0} onClick={() => MakeFamily()}>Convert to family account</button>
                          </div>
                          <div style={{padding:"50px", background:"orange", width:"50%", float:"right", height:"177.778px"}}>
                            {/*this is empty intentionally. Just meant to show where memer switching will be*/}
                          </div>
                        </div>
                      )
                      }
                    </div>
                    <div style={{width:"600px", marginLeft:"30%", marginRight:"auto", marginTop:"30px"}}>{/*member account div*/}
                        {
                          document.cookie && JSON.parse(Cookies.get('user_id')).membership_status != 2
                          ?
                          (<div>
                            <div style={{padding:"50px", background:"sandyBrown", width:"50%", float:"left"}}>
                              <button class="btn btn-secondary btn-lg" id={0} onClick={() => UpgradeMember()}>Upgrade to a YMCA Membership!</button>
                            </div>
                            <div style={{padding:"50px", background:"sandyBrown", width:"50%", float:"right"}}>
                              <h1 class="display-1">Currently NOT YMCA Member!</h1>
                            </div>
                          </div>)
                          :
                          (<div>
                            <div style={{padding:"50px", background:"sandyBrown", width:"50%", float:"left"}}>
                              <button class="btn btn-secondary btn-lg" id={0} onClick={() => DowngradeMember()}>End YMCA Membership!</button>
                            </div>
                            <div style={{padding:"50px", background:"sandyBrown", width:"50%", float:"right"}}>
                              <h1 class="display-1">Currently a YMCA Member!</h1>
                            </div>
                          </div>)
                        }
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
                          <div id='redtext' className='redtext'></div>
                          <input type="text" id='email' placeholder='email' name='email' onChange={handleChange}/>
                          <input type="text" id='username' placeholder='username' name='username' onChange={handleChange}/>
                          <input type="text" placeholder='first name' name='first_name'  onChange={handleChange}/>
                          <input type="text" placeholder='last name' name='last_name' onChange={handleChange}/>
                          <input type="password" placeholder='password' name='password' onChange={handleChange}/>
                          <input type="checkbox" name="staff" id='staff' value='staff' onChange={handleChange}/>
                          <label for="staff">Create staff account</label><br></br>
                          <button className='formButton' onClick={handleClickAdd}>Submit</button>
                        </div>
                        <div className='form' style={{width:"33%", margin_top:"100px"}}>
                          <h1>Log In!</h1>
                          <div id='redtext' className='redtext'></div>
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
