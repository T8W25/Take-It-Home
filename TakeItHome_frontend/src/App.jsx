import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/Navbar';
import HomePage from './pages/HomePage';
import Explore from './pages/Explore';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
<<<<<<< HEAD
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

=======
import PostItem from './pages/Postitem';
import PostItemDonation from './pages/PostitemDonation';
import SearchResults from './pages/SearchResults';
import ItemDetail from './pages/ItemDetail';
import PostsPage from './pages/PostsPage';
import './App.css';
>>>>>>> 6e68454eb27d5e844f19855eb584bbe2e606f44b

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
<<<<<<< HEAD
        <Route path="/trade-item" element={<PostItemTrade />} />
        <Route path="/donate-item" element={<PostItemDonation />} />
        <Route path="/:type/:id" element={<TradeItemDetail />} />
        <Route path="/donate/:id" element={<DonationItemDetail />} />
        <Route path="/donate/:id/message" element={<MessageRequest />} />
        <Route path="/trade/:id/message" element={<MessageRequestTrade />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/notifications" element={<Notifications />} />
=======
        <Route path="/post-item" element={<PostItem />} />
        <Route path="/post-donation" element={<PostItemDonation />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/posts" element={<PostsPage />} />
>>>>>>> 6e68454eb27d5e844f19855eb584bbe2e606f44b
      </Routes>
    </>
  );
}

export default App;
