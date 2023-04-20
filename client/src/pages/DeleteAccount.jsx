import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from "axios"
import Cookies from 'js-cookie'
import {useNavigate} from "react-router-dom"

const DeleteAccount = () => {

  const [schedules, setSchedules] = useState([])

  const [query, setQuery] = useState('');
  const [state, setstate] = useState({
    query: '',
    list: schedules
  });

  const navigate = useNavigate();

  useEffect(() => {//No clue if this actually drops all enrolled classes or not...
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
