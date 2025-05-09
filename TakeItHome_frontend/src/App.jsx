// ✅ FULLY UPDATED App.jsx with working routes for posting and viewing
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/Navbar';
import HomePage from './pages/HomePage';
import Explore from './pages/Explore';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';
import SearchResults from './pages/SearchResults';
import TradeItemDetail from './pages/TradeItemDetail';
import DonationItemDetail from './pages/DonationItemDetail';
import MessageRequest from './pages/MessageRequest';
import MessageRequestTrade from './pages/MessageRequestTrade';
import ChatPage from './pages/ChatPage';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ReportPage from './pages/ReportPage';
import ReportTrade from './pages/ReportTrade'; // ✅ NEW IMPORT
import MyPosts from './pages/MyPosts';

// ✅ Newly cleaned-up listing-only pages
import PostItemTrade from './pages/PostItemTrade';
import PostItemDonation from './pages/PostItemDonation';

// ✅ Forms from account section
import PostTradeFromAccount from './pages/PostTradeFromAccount';
import PostDonationFromAccount from './pages/PostDonationFromAccount';



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
        <Route path="/trade/:id" element={<TradeItemDetail />} />       
         <Route path="/donate/:id" element={<DonationItemDetail />} />
        <Route path="/donate/:id/message" element={<MessageRequest />} />
        <Route path="/trade/:id/message" element={<MessageRequestTrade />} />   
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/report/:id" element={<ReportPage />} />
        <Route path="/report-trade/:id" element={<ReportTrade />} /> {/* ✅ NEW ROUTE */}

        {/* ✅ View posted listings only */}
        <Route path="/trade-item" element={<PostItemTrade />} />
        <Route path="/donate-item" element={<PostItemDonation />} />
        
        {/* ✅ My Posts page */}
        <Route path="/my-posts" element={<MyPosts />} />

        {/* ✅ Forms for posting under account section */}
        <Route path="/account/post-trade" element={<PostTradeFromAccount />} />
        <Route path="/account/post-trade/:id" element={<PostTradeFromAccount />} />

        <Route path="/account/post-donation" element={<PostDonationFromAccount />} />
        <Route path="/account/post-donation/:id" element={<PostDonationFromAccount />} />

      </Routes>
    </>
  );
}


export default App;
