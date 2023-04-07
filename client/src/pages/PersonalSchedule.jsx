import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from "axios"
import Cookies from 'js-cookie'
import {useNavigate} from "react-router-dom"
import iiii from './YMCA-Logo-2010.png'
const PersonalSchedule = () => {
    const navigate = useNavigate();

    const [schedules, setSchedules] = useState([])

    const [query, setQuery] = useState('');
    const [state, setstate] = useState({
      query: '',
      list: schedules
    });

    const DropClass = async (schedule_id) =>{
        if(JSON.parse(Cookies.get('user_id')).family != null){
            //family
            const res = await axios.post("http://localhost:8802/droppersonalclassfamily", {schedule_id: schedule_id, user_id: JSON.parse(Cookies.get('user_id')).id, family_member_id: JSON.parse(Cookies.get('family_id')) });

        }else{
            //not a family
            const res = await axios.post("http://localhost:8802/droppersonalclass", {schedule_id: schedule_id, user_id: JSON.parse(Cookies.get('user_id')).id });
        }
        window.location.href = '/personalschedule'
      }

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

  return (
    <div>
        <table>
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Day of Week</th>
                <th>Start/End Time</th>
                <th>Start/End Date</th>
                <th>Max Capacity</th>
                <th>Current Enrollment</th>
                <th>Base Price</th>
                <th>Member Price</th>
            </tr>
            {state.list.map(schedule=>(
              <tr key={schedule.id}>
                  <td>{schedule.name}</td>
                  <td>{schedule.description}</td>
                  <td>{schedule.day_of_week}</td>
                  <td>{schedule.start_time}  {schedule.end_time}</td>
                  <td>{schedule.start_date.toString().split('T')[0]}  {schedule.end_date.toString().split('T')[0]}</td>
                  <td>{schedule.max_capacity}</td>
                    <td>{schedule.current_enrollment}</td>
                    <td>${schedule.base_price}</td>
                    <td>${schedule.member_price}</td>
                    <td><button id = {schedule.schedule_id} onClick={() => DropClass(schedule.schedule_id)}>Drop Class!</button></td>
              </tr>
          ))}
        </table>

    </div>
  )
}

export default PersonalSchedule
