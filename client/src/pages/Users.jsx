import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from "axios"

const Users = () => {
    const [users, setUsers] = useState([])

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
    

  return <div>
    <table>
        <tr>
        <th>Username</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Current Enrollment</th>
        <th>Password</th>
        <th>Membership Status</th>
        <th>Private</th>
        <th>Family</th>
        <th>Email</th>
        </tr>
        {users.map(user=>(
            <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.current_enrollment}</td>
                <td>{user.password}</td>
                <td>{user.membership_status}</td>
                <td>{user.private}</td>
                <td>{user.family}</td>
                <td>{user.email}</td>
                
            </tr>
        ))}
    </table>
  </div>
}

export default Users;