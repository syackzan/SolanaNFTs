import { useState } from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Homepage from './components/pages/Homepage';
import LandingPage from './components/pages/LandingPage';
import Collection from './components/pages/Collection';
import Marketplace from './components/Marketplace/Marketplace';
import CreatorHubDocs from './components/pages/CreatorHubDocs';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Homepage />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/marketplace' element={<Marketplace />} />
          <Route path='/marketplace/:id/:redirectAddress/:priceOfNft/:nameOfNft' element={<Marketplace />} />
          <Route path='/creatorHubDocs' element={<CreatorHubDocs />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
