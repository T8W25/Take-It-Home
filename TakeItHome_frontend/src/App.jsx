import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/Navbar';
import HomePage from './pages/HomePage';
import Explore from './pages/Explore';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostItem from './pages/Postitem';  //  Import PostItem page (for trading)
// import PostItemDonation from './pages/PostItemDonation';  // Import PostItemDonation page (for donation)
import './App.css';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/post-item" element={<PostItem />} /> {/* For Trading */}
        {/* <Route path="/donate-item" element={<PostItemDonation />} /> New route for Donation */}
      </Routes>
    </>
  );
}

export default App;
