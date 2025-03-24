import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/Navbar';
import HomePage from './pages/HomePage';
import Explore from './pages/Explore';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostItemTrade from './pages/PostItemTrade';
import DonateItem from './pages/PostitemDonation';
import './App.css';
import PostItemDonation from './pages/PostitemDonation';
import SearchResults from './pages/SearchResults';
import TradeItemDetail from './pages/TradeItemDetail';
import DonationItemDetail from './pages/DonationItemDetail';
import MessageRequest from './pages/MessageRequest';
import MessageRequestTrade from './pages/MessageRequestTrade';
import ChatPage from './pages/ChatPage';
import Notifications from './pages/Notifications';


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
        <Route path="/trade-item" element={<PostItemTrade />} />
        <Route path="/donate-item" element={<PostItemDonation />} />
        <Route path="/:type/:id" element={<TradeItemDetail />} />
        <Route path="/donate/:id" element={<DonationItemDetail />} />
        <Route path="/donate/:id/message" element={<MessageRequest />} />
        <Route path="/trade/:id/message" element={<MessageRequestTrade />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </>
  );
}

export default App;