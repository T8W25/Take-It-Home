import React, { useState } from 'react';
import SearchBar from '../components/SearchBar';  // Import the SearchBar component
import NotificationList from '../components/NotificationList';

const HomePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  return (
    <div>
      <h1>Welcome to Take-It-Home</h1>
      {userId ? (
        <NotificationList userId={userId} />
      ) : (
        <p>Please log in to see notifications.</p>
      )}
    </div>
  );
};


export default HomePage;
