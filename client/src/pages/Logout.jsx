import React from 'react'
import {useNavigate} from "react-router-dom"
import Cookies from 'js-cookie'
//Deletes all cookies.
const Logout = () => {
    document.cookie = 'user_id=; Max-Age=0; path=/'
    document.cookie = 'family_id=; Max-Age=0; path=/'
    document.cookie = 'new_family_name=; Max-Age=0; path=/'
    document.cookie = 'program=; Max-Age=0; path=/'
    window.location.href = '/'
  return (
    <div>Logout</div>
  )
}

export default Logout
