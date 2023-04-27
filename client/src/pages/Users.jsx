import React, { useState } from 'react'
import { useEffect } from 'react'
import {useNavigate} from "react-router-dom"
import axios from "axios"
import Cookies from 'js-cookie'
import iiii from './YMCA-Logo-2010.png'

const Users = () => {
  const navigate = useNavigate();
    const [users, setUsers] = useState([])

    const [query, setQuery] = useState('');
    const [state, setstate] = useState({
      query: '',
      list: users
    });

    const handleQuery = () =>{
      console.log("hiii");
      setQuery(document.getElementById('searchname').value);
        const results = users.filter(post => {
          if(document.getElementById('searchname').value == "") return post
          return post.username.includes(document.getElementById('searchname').value);
        }).filter(post =>{
          if(document.getElementById('searchname1').value == "") return post
          return post.first_name.toLowerCase().includes(document.getElementById('searchname1').value.toLowerCase());
        }).filter(post =>{
          if(document.getElementById('searchname2').value == "") return post
          return post.last_name.toLowerCase().includes(document.getElementById('searchname2').value.toLowerCase());
        }). filter(post =>{
          if(document.getElementById('memSearch').checked == true){
            if(document.getElementById('memStatus').checked == true){
              return post.membership_status==2;
            }else{
              return post.membership_status==0;
            }
          }
          return post;
        }).filter(post =>{
          if(document.getElementById('privSearch').value.toLowerCase() == 'null'){
            return post
          }
          var ds=0;
          if(document.getElementById('privSearch').value=='public'){
            ds=0;
            console.log(ds);
          }
          if(document.getElementById('privSearch').value=="staff"){
            ds=1;
            console.log(ds);
          }
          if(document.getElementById('privSearch').value=="admin"){
            ds=2;
            console.log(ds);
          }
          return post.private==ds;
        }).filter(post =>{
          if(document.getElementById('searchEmail').value == "") return post
          return post.email.includes(document.getElementById('searchEmail').value);
        });
      setstate({
        query: document.getElementById('searchname').value,
        list: results
      });
    }

    const handleHardDelete = async (id) =>{
      const res = await axios.post("http://localhost:8802/harddelete", {user_id: id});
      window.location.href = '/HardDelete'
    }


    useEffect(() => {
      const fetchAllUsers = async ()=>{
        try{
            const res = await axios.get("http://localhost:8802/users");
            setUsers(res.data)
            setstate({
              query: document.getElementById('searchname').value,
              list: res.data
            })
            console.log(res.data);
            console.log("jjjjjjjjjjj");
        }catch(err){
            console.log(err)
        }
      }
      fetchAllUsers()
    }, [])


  return <div>
  <div>
  <header>
        <div class="container">
              <div class="row">
                  <div class="col-sm">
                  <a href="/AdminHome"><img src={iiii} height='100px' style={{verticalAlign:"baseline"}}></img></a>
                  </div>
                  <div class="col-sm">
                  <a href="/AdminProgram/">Programs</a>
                  </div>
                  <div class="col-sm">
                  <a href="/EnrollmentSearch/">Enrollments</a>
                  </div>
                  <div class="col-sm">
                  <a href="/about/">About</a>
                  </div>
                  <div class="col-sm">
                  {
                      document.cookie ? <a href='/AdminHome'>Welcome, {Cookies.get('new_family_name')}</a> : <a href="/AdminHome">Sign Up  or Log In!</a>
                  }
                  </div>
                  <div class="col-sm">
                  {
                      document.cookie ? <a href="/Users/">Users</a> : <div></div>
                  }
                  </div>
                  <div class="col-sm">
                  {
                      document.cookie ? <a href="/Logout/">Logout</a> : <div></div>
                  }
                  </div>

              </div>
        </div>
  </header>
  </div>


  <div style={{width:"80vw", marginRight:"10vw"}}>
    <table>
        <thead bgcolor='purple'>
        <th>Username</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Current Enrollment</th>
        <th>Membership Status</th>
        <th>Private</th>
        <th>Family</th>
        <th>Email</th>
        <th>DELETE</th>
        </thead>
        <tr>
        <td>
          <label for="searchname" style={{fontSize:"20px"}}>Search by</label>
          <input class="SearchFeild" type="search" id='searchname' name='name' placeholder='Username' value={query} onChange={handleQuery}/>
        </td>
        <td>
          <label for="searchname1" style={{fontSize:"20px"}}>Search by</label>
          <input class="SearchFeild" type="search" id='searchname1' name='name' placeholder='First name' onChange={handleQuery}/>
        </td>
        <td>
          <label for="searchname2" style={{fontSize:"20px"}}>Search by</label>
          <input class="SearchFeild" type="search" id='searchname2' name='name' placeholder='Last name' onChange={handleQuery}/>
        </td>
        <td> ??? </td>
        <td>
          <label for="memSearch" style={{fontSize:"15px"}}>Search by member status:</label>
          <input type="checkbox" id="memSearch" onChange={handleQuery}/>
          <label for="memStatus" style={{fontSize:"15px"}}>Filter Non-members:</label>
          <input type="checkbox" id="memStatus" onChange={handleQuery}/>
        </td>
        <td>
        <label for="privSearch" style={{fontSize:"20px"}}>Search by:</label>
        <select name="week" id="privSearch" onChange={handleQuery}>
          <option value="null">User type</option>
          <option value="public">Public</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        </td>
        <td>???</td>
        <td>
          <label for="searchEmail" style={{fontSize:"20px"}}>Search by</label>
          <input class="SearchFeild" type="search" id='searchEmail' name='name' placeholder='Email' onChange={handleQuery}/>
        </td>
        <td></td>

        </tr>
        {state.list.map(user=>(
            <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.current_enrollment}</td>
                <td>{user.membership_status}</td>
                <td>{user.private}</td>
                <td>{user.family}</td>
                <td>{user.email}</td>
                <td><button id={user.id} onClick={() => (handleHardDelete(user.id))}>HARD DELETE</button></td>

            </tr>
        ))}
    </table>
  </div>
  </div>
}

export default Users;
