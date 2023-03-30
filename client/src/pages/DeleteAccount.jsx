import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from "axios"
import Cookies from 'js-cookie'
import {useNavigate} from "react-router-dom"

const DeleteAccount = () => {
    const navigate = useNavigate();

    async function updateDel(){
        const result = await axios.post("http://localhost:8802/deleteaccount", {user_id: JSON.parse(Cookies.get('user_id')).id});
        navigate("/Logout");
    }
    
    updateDel();


  return (
    <div>DeleteAccount</div>
  )
}

export default DeleteAccount