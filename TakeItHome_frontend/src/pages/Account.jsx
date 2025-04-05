// ✅ FINAL IMPLEMENTATION: Account Dropdown with Post Forms Integration

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PostItemTrade from "../components/PostItemTrade";
import PostItemDonation from "../components/PostItemDonation";
import Profile from "../components/Profile";
import Messages from "../components/Messages";
import Notifications from "../components/Notifications";

const Account = () => {
  return (
    <Routes>
      <Route path="/profile" element={<Profile />} />
      <Route path="/chat" element={<Messages />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/trade-item" element={<PostItemTrade />} />
      <Route path="/donate-item" element={<PostItemDonation />} />
      {/* fallback */}
      <Route path="*" element={<Navigate to="/profile" />} />
    </Routes>
  );
};

export default Account;
