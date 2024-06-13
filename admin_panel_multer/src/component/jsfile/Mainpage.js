import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Mainform from '../jsfile/Mainform';
import Maintable from '../jsfile/Maintable';
import '../cssfile/Mainpage.css'; // Assuming you have your custom CSS here
import { Link } from 'react-router-dom';

function Mainpage() {
    return (
        <div>
            <header className="fixed-top row bg-primary text-white p-2">
                <div className="col">
                    <h1 className="text-center">WELCOME</h1>
                </div>
            </header>

            <div className="container-fluid mt-5 pt-5">
              
                <div className="row">
                
                    <aside className="col-2 bg-light">
                        <nav className="nav flex-column">
                        <div className='row'>
                    <div className='col'>SK-BookZ</div>
                    <div className='col colwow'><i id='col' class="bi bi-list"></i></div>
                </div>
                            <a className="nav-link active " aria-current="page" as={Link} href="/">Home</a>
                            <a className="nav-link" as={Link} href="/table">Table</a>
                            <a className="nav-link" as={Link} href="/profile">Profile</a>
                            <a className="nav-link" as={Link} href="/settings">Settings</a>
                        </nav>
                    </aside>

                    
<main className="col-10">
                        <Router>
                            <Routes>
                                <Route path='/' element={<Mainform />} />
                                <Route path='/table' element={<Maintable />} />
                                {/* <Route path='/profile' element={<Profile />} />
                                <Route path='/settings' element={<Settings />} /> */}
                            </Routes>
                        </Router>
                    </main>
                
                </div>
            </div>
        </div>
    );
}



export default Mainpage;
