import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './Update.css'

function Update() {
   const[firstname,setfirstname]=useState('');
   const[lastname,setlastname]=useState('');
   const[email,setemail]=useState('');
   const[age,setage]=useState('');
   const[phonenumber,setphonenumber]=useState('');
   const[file,setFile]=useState('')
   const navi=useNavigate()
   const{id}=useParams()

    useEffect(()=>{
        axios.get(`http://localhost:9000/${id}`).then((res)=>{
         setfirstname(res.data.firstname)
         setlastname(res.data.lastname);
         setemail(res.data.email)
         setage(res.data.age)
         setphonenumber(res.data.phonenumber)
         setFile(res.data)
         })
    },[id])

  const clk=(e)=>{
        e.preventDefault()
        const data=new FormData();
        data.append("firstname",firstname)
        data.append("lastname",lastname)
        data.append("email",email)
        data.append("age",age)
        data.append("phonenumber",phonenumber)
        data.append('file',file)
        axios.put(`http://localhost:9000/${id}`,data).then(()=>{
            navi('/')
        })
    }
  const serverhost="http://localhost:9000";

  return (
    <div>
      <div id='fr'>
       <form onSubmit={clk}>
       <input type="text"    value={firstname} onChange={(e)=>setfirstname(e.target.value)} ></input>  <br></br>
       <input type="text"    value={lastname} onChange={(e)=>setlastname(e.target.value)} ></input>  <br></br>
       <input type="email"   value={email} onChange={(e)=>setemail(e.target.value)} ></input>  <br></br>
       <input type="number"  value={age} onChange={(e)=>setage(e.target.value)} ></input>  <br></br>
       <input type="number"  value={phonenumber} onChange={(e)=>setphonenumber(e.target.value)} ></input>  <br></br>
       <img  src={serverhost + '/' + file} style={{width:"50px",height:"40px"}} alt='jhgsxja'></img>
       <input type="file"   onChange={(e)=>setFile(e.target.files[0])} ></input>  
       <input type='submit'></input>
       </form> 
     </div> 
   </div>
  )
}

export default Update
