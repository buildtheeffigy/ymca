//unused page

import React from 'react'
import axios from "axios"
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'

const UserDashboard = () => {
  const navigate = useNavigate();

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

async function MakeFamily(){
  const res = await axios.post("http://localhost:8802/upgradeToFamily", {upgrade_id: JSON.parse(Cookies.get('user_id')).id});
    var x = JSON.parse(Cookies.get('user_id'));
    x.family = 1;
  document.cookie = "user_id=" + JSON.stringify(x) + "; path=/;";
  navigate("/");
}

async function AddMember(){
  const res = await axios.post("http://localhost:8802/familymember", {user_id: JSON.parse(Cookies.get('user_id')).id, name: document.getElementById("fname").value});
  window.location.href = '/UserDashboard'
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

  return (
    <div>
    <header>
            <div class="container">
                <div class="row">
                    <div class="col-sm">
                    <img src='https://capitalymca.org/wp-content/uploads/2017/08/y-trenton-site-icon.png' height='75px'></img>
                    </div>
                    <div class="col-sm">
                    <a href="/programs/">Programs</a>
                    </div>
                    <div class="col-sm">
                    <a href="/schedules/">Schedules</a>
                    </div>
                    <div class="col-sm">
                    <a href="/about/">About</a>
                    </div>
                    <div class="col-sm">
                    {
                        document.cookie ? <a href='/userdashboard'>Welcome, {Cookies.get('new_family_name')}</a> : <a href="/add/">Sign Up!</a>
                    }
                    </div>
                    <div class="col-sm">
                    {
                        document.cookie ? <a href="/Logout/">Logout</a> : <a href="/Login/">Log In</a>
                    }
                    </div>

            </div>
            </div>
    </header>



    <div>
    {
      document.cookie && JSON.parse(Cookies.get('user_id')).family != null
      ?
      <div><h1 class="display-1">Family Members</h1>  <input type="text" id="fname" name="fname"></input><button class="btn btn-secondary btn-lg" id={0} onClick={() => AddMember()}>Add Family Member</button><div>
        <h3 class="display-4">Logged in as: {JSON.parse(Cookies.get('user_id')).first_name} {JSON.parse(Cookies.get('user_id')).last_name}</h3>
        <button class="btn btn-secondary btn-lg" id={0} onClick={() => changeFamilyMember(0, JSON.parse(Cookies.get('user_id')).first_name)}>{JSON.parse(Cookies.get('user_id')).first_name}</button>
        {programs.map(element=>(<button class="btn btn-secondary btn-lg" id={element.id} onClick={() => changeFamilyMember(element.id, element.name)}>{element.name}</button>))}
        </div>
        </div>
      :
      <div>
        <button class="btn btn-secondary btn-lg" id={0} onClick={() => MakeFamily()}>Convert to family account</button>
      </div>
    }
    <div>
      {
        document.cookie && JSON.parse(Cookies.get('user_id')).membership_status != 2
        ?
        <button class="btn btn-secondary btn-lg" id={0} onClick={() => UpgradeMember()}>Upgrade to a YMCA Membership!</button>
        :
        <h1 class="display-1">Currently a YMCA Member!</h1>
      }
    </div>
    </div>
    </div>
  )
}

export default UserDashboard
