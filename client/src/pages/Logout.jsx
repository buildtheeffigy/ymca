import React from 'react'
import {useNavigate} from "react-router-dom"
import Cookies from 'js-cookie'
const Logout = () => {
    //Cookies.remove('user_id')
    document.cookie = 'user_id=; Max-Age=0; path=/'
    document.cookie = 'family_id=; Max-Age=0; path=/'
    document.cookie = 'new_family_name=; Max-Age=0; path=/'
    window.location.href = '/'
  return (
    <div>Logout</div>
  )
}

export default Logout