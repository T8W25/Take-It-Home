import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import axios from "axios";
import "./Navbar.css";

const API_BASE = "http://localhost:3002/api/donation-items" || "https://take-it-home-8ldm.onrender.com";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);

    const token = localStorage.getItem("jwtToken");
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!token && !!user);

    if (token) {
      axios
        .get(`${API_BASE}/api/users/profile`, { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setProfileImage(res.data.profileImage))
        .catch(() => setProfileImage(null));
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setProfileImage(null);
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className={`navbar-3d ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="logo" className="logo-hover-3d" />
          <span className="logo-glow"></span>
        </Link>

        <div className="navbar-links-left">
          <Link to="/" className="nav-link-3d">Home</Link>
          <Link to="/explore" className="nav-link-3d">Explore</Link>
          <Link to="/contact" className="nav-link-3d">Contact</Link>
          {isLoggedIn && <Link to="/trade-item" className="nav-link-3d">Trade</Link>}
          {isLoggedIn && <Link to="/donate-item" className="nav-link-3d">Donate</Link>}
        </div>

        <div className="navbar-actions">
          <SearchBar />
          <div className="navbar-account">
            <div className="dropdown-3d">
              <button className="dropbtn-3d">
                <img
                  src={profileImage ? `${API_BASE}${profileImage}` : "/default-profile.png"}
                  alt="Profile"
                  className="profile-img-3d"
                />
                <span className="account-text-3d">Account</span>
              </button>
              <div className="dropdown-content-3d">
                {!isLoggedIn ? (
                  <>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Sign Up</Link>
                  </>
                ) : (
                  <>
                    <Link to="/profile">Profile</Link>
                    <Link to="/chat">Messages</Link>
                    <Link to="/notifications">Notifications</Link>
                    <Link to="/my-posts">My Posts</Link>
                    <Link to="/account/post-trade">Post Trade</Link>
                    <Link to="/account/post-donation">Post Donation</Link>
                    <hr className="dropdown-divider" />
                    <button onClick={handleLogout}>Logout</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;