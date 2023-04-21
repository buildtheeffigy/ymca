import React, { useState } from 'react'
import { useEffect } from 'react'
import {useNavigate} from "react-router-dom"
import axios from "axios"
import Cookies from 'js-cookie'

const HardDelete = () => {
    const [users, setUsers] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllUsers = async ()=>{
          try{
              const res = await axios.get("http://localhost:8802/users");
              setUsers(res.data)
          }catch(err){
              console.log(err)
          }
        }
        fetchAllUsers()
      }, [])

      const handleHardDelete = async (id) =>{
        const res = await axios.post("http://localhost:8802/harddelete", {user_id: id});
        window.location.href = '/HardDelete'
      }

  return (
    <div>
        <table>
        <thead bgcolor='purple'>
        <th>Username</th>
        <th>Email</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Private</th>
        <th></th>
        
        </thead>
        {users.filter(user=>{return user.deleted == 1}).map(user=>(
            <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.private}</td>
                <td><button id={user.id} onClick={() => (handleHardDelete(user.id))}>HARD DELETE</button></td>
                

            </tr>
        ))}
        </table>

    </div>
  )
}

export default HardDelete