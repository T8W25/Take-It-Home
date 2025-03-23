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
import PostItemDonation from './pages/PostitemDonation';
import SearchResults from './pages/SearchResults';
import ItemDetail from './pages/ItemDetail';
import PostsPage from './pages/PostsPage';
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
        <Route path="/post-item" element={<PostItem />} />
        <Route path="/post-donation" element={<PostItemDonation />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/posts" element={<PostsPage />} />
      </Routes>
    </>
  );
}

export default App;
