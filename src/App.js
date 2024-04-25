// src/App.js
import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTheme } from './ThemeContext';
import Blogging from './Components/Blogging';
import sun from "./assest/sunny.png"
import moon from "./assest/half-moon.png"
import icon from "./assest/messenger.png"
import 'bootstrap/dist/js/bootstrap.bundle.min';


function App() {
  const { theme, setLightTheme, setDarkTheme } = useTheme();
 
  return (
    <div className={`tea-container ${theme}-theme pt-3`}>
   
       <div className='d-flex ps-4'>
            <img src={icon} width={30}/>
            <h5 className='ps-3'>AI  Blogging</h5>
            </div>
            <hr/>
      <div className='ps-4'>
  <button onClick={setLightTheme} className={`btn me-3 rounded ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}>
      <img width={20} src={sun} className='me-2'/>
       Day
      </button>
      <button onClick={setDarkTheme} className={`btn rounded ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}>
      <img width={20} src={moon} className='me-2'/>
       Night
      </button>
  </div>
     <div className='ps-4 pe-4 pt-3 pb-5'>
     <Blogging />
     </div>
    </div>
  );
}

export default App;
