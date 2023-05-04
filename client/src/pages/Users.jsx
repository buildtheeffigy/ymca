import React, { useState } from 'react'
import { useEffect } from 'react'
import {useNavigate} from "react-router-dom"
import axios from "axios"
import Cookies from 'js-cookie'
import iiii from './YMCA-Logo-2010.png'
//Where the admin can view the list of users
const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([])

  const [query, setQuery] = useState('');
  const [state, setstate] = useState({
    query: '',
    list: users
  });
  //Search function
  const handleQuery = () =>{
    console.log("hiii");
    setQuery(document.getElementById('searchname').value);
      const results = users.filter(post => {//Filter username
        if(document.getElementById('searchname').value == "") return post
        return post.username.includes(document.getElementById('searchname').value);
      })
      .filter(post =>{//Filter first name
        if(document.getElementById('searchname1').value == "") return post
        return post.first_name.toLowerCase().includes(document.getElementById('searchname1').value.toLowerCase());
      })
      .filter(post =>{//Filter by user ID
        if(document.getElementById('searchID').value == "") return post
        return post.id==document.getElementById('searchID').value;
      })
      .filter(post =>{//Filter by last name
        if(document.getElementById('searchname2').value == "") return post
        return post.last_name.toLowerCase().includes(document.getElementById('searchname2').value.toLowerCase());
      })
      .filter(post =>{//filter by whether user is in a family or not
        console.log(post.family);
        if(document.getElementById('famSearch1').checked == true){
          if(document.getElementById('famSearch').checked == true){
            return post.family!='';
          }else{
            return post.family=='';
          }
        }
        return post;
      })
      .filter(post =>{//filter by whether user is in a member or not
        if(document.getElementById('memSearch').checked == true){
          if(document.getElementById('memStatus').checked == true){
            return post.membership_status==2;
          }else{
            return post.membership_status==0;
          }
        }
        return post;
      })
      .filter(post =>{//Filter by account type
        if(document.getElementById('privSearch').value.toLowerCase() == 'null'){
          return post
        }
        var ds=0;
        if(document.getElementById('privSearch').value=='public'){
          ds=0;
        }
        if(document.getElementById('privSearch').value=="staff"){
          ds=1;
        }
        if(document.getElementById('privSearch').value=="admin"){
          ds=2;
        }
        return post.private==ds;
      })
      .filter(post =>{//Filter by email
        if(document.getElementById('searchEmail').value == "") return post
        return post.email.includes(document.getElementById('searchEmail').value);
      });
    setstate({
      query: document.getElementById('searchname').value,
      list: results
    });
  }

  //Performs hard delete on the user who's id is passed in, then refreshes page
  const handleHardDelete = async (id) =>{
    const res = await axios.post("http://localhost:8802/harddelete", {user_id: id});
    window.location.href = '/Users'
  }

  //Same thing as last functin, but for families
  const handleHardDeleteFamily = async (id) =>{
    const res = await axios.post("http://localhost:8802/deletefamilymember", {id: id});
    window.location.href = '/Users'
  }

  //Gets all the users in the database, and gets all family members in the database
  useEffect(() => {
    const fetchAllUsers = async ()=>{
      try{
          let res = await axios.get("http://localhost:8802/users");
          for(let i = 0; i < res.data.length; i++){
            if(res.data[i].family == 1){
              console.log("family spooted: " + res.data[i].first_name);
              const famresult = await axios.post("http://localhost:8802/families", {user_id: res.data[i].id});
              console.log(famresult.data);
              for(let xanopticon = 0; xanopticon < famresult.data.length; xanopticon++){
                res.data.push({
                  user_id: res.data[i].id,
                  username: res.data[i].username,
                  first_name: famresult.data[xanopticon].name,
                  last_name: res.data[i].last_name,
                  private: res.data[i].private,
                  current_enrollment: res.data[i].current_enrollment,
                  membership_status: res.data[i].membership_status,
                  email: res.data[i].email,
                  family_id: famresult.data[xanopticon].id,
                  family: 2
                });
              }
            }
          }
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
                  <a href="/Registrations/">Registrations</a>
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


  <div style={{width:"100vw", marginRight:"10vw"}}>
    <table>
        <thead bgcolor='purple'>
          <th>ID</th>
          <th>Username</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Membership Status</th>
          <th>Private</th>
          <th>Family</th>
          <th>Email</th>
          <th>DELETE</th>
        </thead>
        <tr>
          <td>
            <label for="searchID" style={{fontSize:"20px"}}>Search by</label>
            <input class="SearchFeild" type="number" id='searchID' name='name' placeholder='ID' onChange={handleQuery}/>
          </td>
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
          <td>
            <div>
              <label for="memSearch" style={{fontSize:"15px"}}>Search by member status:</label>
              <input type="checkbox" id="memSearch" onChange={handleQuery}/>
            </div>
            <div>
              <label for="memStatus" style={{fontSize:"15px"}}>Filter Non-members:</label>
              <input type="checkbox" id="memStatus" onChange={handleQuery}/>
            </div>
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
          <td>
            <label for="famSearch1" style={{fontSize:"15px"}}>Seach by family:</label>
            <input type="checkbox" id="famSearch1" onChange={handleQuery}/>
            <label for="famSearch" style={{fontSize:"15px"}}>Filter non-family:</label>
            <input type="checkbox" id="famSearch" onChange={handleQuery}/>
          </td>
          <td>
            <label for="searchEmail" style={{fontSize:"20px"}}>Search by</label>
            <input class="SearchFeild" type="search" id='searchEmail' name='name' placeholder='Email' onChange={handleQuery}/>
          </td>
          <td></td>
        </tr>
        {state.list.map(user=>(
            <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.membership_status}</td>
                <td>{user.private}</td>
                <td>{user.family}</td>
                <td>{user.email}</td>
                <td>{user.family != 2 ? <button id={user.id} onClick={() => (handleHardDelete(user.id))}>HARD DELETE</button>
                :<button id={user.family_id} onClick={() => (handleHardDeleteFamily(user.family_id))}>HARD DELETE FAMILY MEMBER</button>}</td>
            </tr>
        ))}
    </table>
  </div>
  </div>
}

export default Users;
