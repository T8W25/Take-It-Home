import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/Navbar';
import HomePage from './pages/HomePage';
import Explore from './pages/Explore';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostItem from './pages/Postitem';
import DonateItem from './pages/PostitemDonation';
import './App.css';
import PostItemDonation from './pages/PostitemDonation';
import SearchResults from './pages/SearchResults';
import ItemDetail from './pages/ItemDetail';
import DonationItemDetail from './pages/DonationItemDetail';


function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/search" element={<SearchResults />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/post-item" element={<PostItem />} />
        <Route path="/donate-item" element={<PostItemDonation />} />
        <Route path="/item/:type/:id" element={<ItemDetail />} />
        <Route path="/donate/:id" element={<DonationItemDetail />} />


      </Routes>
    </>
  );
}

export default App;