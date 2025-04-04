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
import './App.css';
import PostItemDonation from './pages/PostItemDonation';
import SearchResults from './pages/SearchResults';
import TradeItemDetail from './pages/TradeItemDetail';
import DonationItemDetail from './pages/DonationItemDetail';
import MessageRequest from './pages/MessageRequest';
import MessageRequestTrade from './pages/MessageRequestTrade';
import ChatPage from './pages/ChatPage';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword'; // ✅ Import ForgotPassword
import ResetPassword from './pages/ResetPassword'; // ✅ Import ResetPassword
import ReportPage from './pages/ReportPage';


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
        <Route path="/trade-item" element={<PostItemTrade />} />
        <Route path="/donate-item" element={<PostItemDonation />} />
        <Route path="/trade/:id" element={<TradeItemDetail />} />
        <Route path="/donate/:id" element={<DonationItemDetail />} />
        <Route path="/donate/:id/message" element={<MessageRequest />} />
        <Route path="/trade/:id/message" element={<MessageRequestTrade />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* ✅ Forgot Password Route */}
        <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* ✅ Reset Password Route */}
        <Route path="/report/:id" element={<ReportPage />} />
      </Routes>
    </>
  );
}

export default App;
