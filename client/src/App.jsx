import { useState } from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Homepage from './components/pages/Homepage';
import LandingPage from './components/pages/LandingPage';
import Collection from './components/pages/Collection';
import Marketplace from './components/Marketplace/Marketplace';
import CreatorHubDocs from './components/pages/CreatorHubDocs';
import { MarketplaceProvider } from './context/MarketplaceProvider';

function App() {

  return (
    <div>
      <MarketplaceProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Homepage />} />
          <Route path='/collection' element={<Collection />} />
          <Route path='/marketplace' element={
            <MarketplaceProvider>
              <Marketplace />
            </MarketplaceProvider>} />
          <Route path='/marketplace/:id/:redirectAddress' element={<Marketplace />} />
          <Route path='/creatorHubDocs' element={<CreatorHubDocs />} />
        </Routes>
      </Router>
      </MarketplaceProvider>
    </div>
  )
}

export default App
