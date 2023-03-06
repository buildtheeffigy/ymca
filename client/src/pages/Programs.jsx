import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from "axios"

const Programs = () => {
    const [programs, setPrograms] = useState([])

    useEffect(() => {
        const fetchAllPrograms = async ()=>{
          try{
              const res = await axios.get("http://localhost:8802/programs");
              setPrograms(res.data)
          }catch(err){
              console.log(err)
          }
        }
        fetchAllPrograms()
      }, [])

      return <div class='container'>
      <table class='table'>
          <thead bgcolor='#F47920'>
          <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Maximum Capacity</th>
          <th>Current Enrollment</th>
          <th>Base Price</th>
          <th>Member Price</th>
          <th>Teacher</th>
          </tr>
          </thead>
          <tbody>
          {programs.map(program=>(
              <tr key={program.id}>
                  <td>{program.name}</td>
                  <td>{program.description}</td>
                  <td>{program.max_capacity}</td>
                  <td>{program.current_enrollment}</td>
                  <td>{program.base_price}</td>
                  <td>{program.member_price}</td>
                  <td><div>
                  {program.first_name} {program.last_name}
                    </div><div>
                    {program.email}
                        </div></td>
                  <td></td>
                  
              </tr>
          ))}

</tbody>
      </table>
    </div>
}

export default Programs