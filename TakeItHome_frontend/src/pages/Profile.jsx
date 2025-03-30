// pages/Profile.jsx
import React from "react";
import ProfilePhotoUpload from "../components/ProfilePhotoUpload";

const Profile = () => {
  return (
    <div className="container mt-4">
      <h2>Update Profile Photo</h2>
      <ProfilePhotoUpload />
    </div>
  );
};

export default Profile;
