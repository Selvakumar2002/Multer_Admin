import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import './Image.css';

function Image() {
   const [firstname, setFirstname] = useState('');
   const [lastname, setLastname] = useState('');
   const [email, setEmail] = useState('');
   const [age, setAge] = useState('');
   const [phonenumber, setPhonenumber] = useState('');
   const [filename, setFilename] = useState(null);
   const [getdata, setGetdata] = useState([]);
   const navigate = useNavigate();
   
   const handleSubmit = (e) => {
       e.preventDefault();
       const formdata = new FormData();
       formdata.append("firstname", firstname);
       formdata.append("lastname", lastname);
       formdata.append("email", email);
       formdata.append("age", age);
       formdata.append("phonenumber", phonenumber);
       formdata.append("file", filename);

       axios.post("http://localhost:9000/", formdata)
            .then(response => {
                console.log('Data submitted successfully');
                setFirstname('');
                setLastname('');
                setEmail('');
                setAge('');
                setPhonenumber('');
                setFilename(null);
                fetchData(); // Refresh the data
            })
            .catch(error => {
                console.error('There was an error submitting the data!', error);
            });
   };

   const fetchData = () => {
       axios.get("http://localhost:9000")
            .then((res) => {
                setGetdata(res.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
   };

   useEffect(() => {
       fetchData();
   }, []);

   const handleDelete = (id) => {
       if (window.confirm("Are you sure you want to delete?")) {
           axios.delete(`http://localhost:9000/${id}`)
                .then(() => {
                    fetchData(); // Refresh the data
                })
                .catch(error => {
                    console.error('There was an error deleting the data!', error);
                });
       }
   };

   const handleEdit = (id) => {
       navigate(`/edit/${id}`);
   };

   const serverhost = "http://localhost:9000/";

   return (
       <>
           <div id='form'>
               <div id='f1'>
                   <form onSubmit={handleSubmit} id="f2">
                       <TextField
                           type="text"
                           placeholder='firstname'
                           onChange={(e) => setFirstname(e.target.value)}
                           id="outlined-basic"
                           label="FirstName"
                           variant="outlined"
                           value={firstname}
                       /><br /><br />
                       <TextField
                           type="text"
                           placeholder='lastname'
                           onChange={(e) => setLastname(e.target.value)}
                           id="outlined-basic"
                           label="LastName"
                           variant="outlined"
                           value={lastname}
                       /><br /><br />
                       <TextField
                           type="email"
                           placeholder='email'
                           onChange={(e) => setEmail(e.target.value)}
                           id="outlined-basic"
                           label="Email"
                           variant="outlined"
                           value={email}
                       /><br /><br />
                       <TextField
                           type="number"
                           placeholder='age'
                           onChange={(e) => setAge(e.target.value)}
                           id="outlined-basic"
                           label="Age"
                           variant="outlined"
                           value={age}
                       /><br /><br />
                       <TextField
                           type="number"
                           placeholder='phonenumber'
                           onChange={(e) => setPhonenumber(e.target.value)}
                           id="outlined-basic"
                           label="PhoneNumber"
                           variant="outlined"
                           value={phonenumber}
                       /><br /><br />
                       <TextField
                           type="file"
                           onChange={(e) => setFilename(e.target.files[0])}
                           id="outlined-basic"
                           label="File"
                           variant="outlined"
                       /><br /><br />
                       <Button variant="contained" type="submit" endIcon={<SendIcon />}>Submit</Button>
                   </form>
               </div>
               <div>
                   <Table>
                       <TableHead>
                           <TableRow>
                               <TableCell>FirstName</TableCell>
                               <TableCell>LastName</TableCell>
                               <TableCell>Email</TableCell>
                               <TableCell>Age</TableCell>
                               <TableCell>PhoneNumber</TableCell>
                               <TableCell>Image</TableCell>
                               <TableCell>Edit</TableCell>
                               <TableCell>Delete</TableCell>
                           </TableRow>
                       </TableHead>
                       <TableBody>
                           {getdata.map((data, index) => (
                               <TableRow key={index}>
                                   <TableCell>{data.firstname}</TableCell>
                                   <TableCell>{data.lastname}</TableCell>
                                   <TableCell>{data.email}</TableCell>
                                   <TableCell>{data.age}</TableCell>
                                   <TableCell>{data.phonenumber}</TableCell>
                                   <TableCell>
                                       <a href={serverhost + data.path} target="_blank" rel="noopener noreferrer">
                                           document
                                       </a>
                                   </TableCell>
                                   <TableCell>
                                       <Button onClick={() => handleEdit(data._id)} variant="outlined" startIcon={<UpgradeIcon />}>
                                           Update
                                       </Button>
                                   </TableCell>
                                   <TableCell>
                                       <Button onClick={() => handleDelete(data._id)} variant="outlined" startIcon={<DeleteIcon />}>
                                           Delete
                                       </Button>
                                   </TableCell>
                               </TableRow>
                           ))}
                       </TableBody>
                   </Table>
               </div>
           </div>
       </>
   );
}

export default Image;
