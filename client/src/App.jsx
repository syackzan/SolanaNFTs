import { useState } from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Homepage from './components/pages/Homepage';
import LandingPage from './components/pages/LandingPage';
import Collection from './components/pages/Collection';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Marketplace from './components/Marketplace/Marketplace';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Homepage />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/marketplace' element={<Marketplace />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
