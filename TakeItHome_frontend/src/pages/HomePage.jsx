import React, { useEffect, useState } from "react";
import NotificationList from "../components/NotificationList";
import SearchBar from "../components/SearchBar"; // Already exists
import "./HomePage.css";

const HomePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [location, setLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.error("Geolocation error:", err.message);
      }
    );
  }, []);

  return (
    <div className="home-container">
      {/* 📍 MAP BACKGROUND */}
      {location && (
        <iframe
          className="map-background"
          src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=12&output=embed`}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      )}

      {/* 🔹 OVERLAY CONTENT */}
      <div className="overlay-content">
        <h1 className="title">Welcome to Take-It-Home</h1>

        {userId ? (
          <>
            <NotificationList userId={userId} />
            <p className="location-text">
              Your current location: {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Loading..."}
            </p>
          </>
        ) : (
          <p></p>
        )}

        {/* 🔎 SEARCH SECTION */}
        <div className="search-section">
          <h2>Find what you need</h2>
          <SearchBar />
        </div>

        {/* 📘 ABOUT SECTION */}
        <div className="about-section">
          <h3>About Take-It-Home</h3>
          <p>
            Take-It-Home is a community-driven platform to trade and donate second-hand goods.
            Whether you want to give away something you no longer use or find a useful item near you,
            this platform makes it simple, secure, and local. Join us in promoting sustainability and kindness!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
