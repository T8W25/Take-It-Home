import React, { useState } from "react";

const ProfilePhotoUpload = () => {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      setMessage("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", image);

    const token = localStorage.getItem("jwtToken");

    try {
      const res = await fetch("https://take-it-home-8ldm.onrender.com/api/users/upload-profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        setMessage("✅ Profile image uploaded successfully!");
        window.location.reload(); // reload to reflect image in navbar
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
    } catch (err) {
      setMessage("❌ Upload failed.");
      console.error(err);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
};

export default ProfilePhotoUpload;
