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
        }). filter(post =>{
          if(document.getElementById('privSearch').checked == true){
            if(document.getElementById('privStatus').checked == true){
              return post.private==1;
            }else{
              return post.private==0;
            }
          }
          return post;
        }).filter(post =>{
          if(document.getElementById('searchEmail').value == "") return post
          return post.email.includes(document.getElementById('searchEmail').value);
        });
      setstate({
        query: document.getElementById('searchname').value,
        list: results
      });
    }

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
          <label for="memSearch" style={{fontSize:"20px"}}>Search by member status:</label>
          <input type="checkbox" id="memSearch" onChange={handleQuery}/>
          <label for="memStatus" style={{fontSize:"20px"}}>Member vs. Non-member:</label>
          <input type="checkbox" id="memStatus" onChange={handleQuery}/>
        </td>
        <td>
          <label for="privSearch" style={{fontSize:"20px"}}>Search by account status:</label>
          <input type="checkbox" id="privSearch" onChange={handleQuery}/>
          <label for="privStatus" style={{fontSize:"20px"}}>Public vs. Private:</label>
          <input type="checkbox" id="privStatus" onChange={handleQuery}/>
        </td>
        <td>???</td>
        <td>
          <label for="searchEmail" style={{fontSize:"20px"}}>Search by</label>
          <input class="SearchFeild" type="search" id='searchEmail' name='name' placeholder='Email' onChange={handleQuery}/>
        </td>

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

            </tr>
        ))}
    </table>
  </div>
  </div>
}

export default Users;
