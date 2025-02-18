import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Homepage from './components/pages/Homepage';
import LandingPage from './components/pages/LandingPage';
import Collection from './components/pages/Collection';
import Marketplace from './components/Marketplace/Marketplace';
import CreatorHubDocs from './components/pages/CreatorHubDocs';
import CharacterSubmission from './components/pages/CharacterSubmission';
import Admin from './components/pages/Admin';

function App() {

  return (
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Homepage />} />
            <Route path='/collection' element={<Collection />} />
            <Route path='/marketplace' element={<Marketplace />}/>
            <Route path='/marketplace/:id/:redirectAddress' element={<Marketplace />} />
            <Route path='/creatorHubDocs' element={<CreatorHubDocs />} />
            <Route path='/character-submit' element={<CharacterSubmission />} />
            <Route path='/admin' element={<Admin />} />
          </Routes>
        </Router>
  )
}

export default App
