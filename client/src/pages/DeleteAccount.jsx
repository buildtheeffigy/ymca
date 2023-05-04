import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from "axios"
import Cookies from 'js-cookie'
import {useNavigate} from "react-router-dom"
//Deletes the currently logged in account. Acts as a function, and returns
//the user to the home page, logged out of their account.
const DeleteAccount = () => {

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
    }


  const navigate = useNavigate();
  //gets all the programs user is enrolled in.
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

    //First drops all classes user is enrolled in, then soft deletes the the account
    //Before moving to the log out page to log out the user.
    async function updateDel(){
      for(let i=0; i<schedules.length; i++){
        DropClass(schedules[i].schedule_id);
      }
        const result = await axios.post("http://localhost:8802/deleteaccount", {user_id: JSON.parse(Cookies.get('user_id')).id});
        navigate("/Logout");
    }
    updateDel();
  return (
    <div>DeleteAccount</div>
  )
}

export default DeleteAccount
