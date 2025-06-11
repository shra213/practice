import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Signup from './Signup';
import Login from './Login';
import Dashboard from "./Dashboard"
import { RecoilRoot } from 'recoil';
// import Sendmoney from "./Sendmoney";
function App() {
  return (
    <>
      <div>
        <RecoilRoot>
          <Router>
            <Routes>
              {/* <Route path="/sendmoney" element={<Sendmoney/>}/> */}
              <Route path="/" element={<Signup />} />
              <Route path='/login' element={<Login />} />
              <Route path='/Dashboard' element={<Dashboard />} />
            </Routes>
          </Router>
        </RecoilRoot>
      </div>
    </>
  )
}

export default App
