// ✅ Updated Navbar.jsx with Account Dropdown
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import SearchBar from "./SearchBar";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            alt="logo"
            src="./logo.png"
            width="80"
            height="60"
            style={{ borderRadius: "50%", objectFit: "cover" }}
            className="d-inline-block align-top"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/explore">Explore</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
            {isLoggedIn && <Nav.Link as={Link} to="/trade-item">Trade</Nav.Link>}
            {isLoggedIn && <Nav.Link as={Link} to="/donate-item">Donate</Nav.Link>}
          </Nav>

          <div className="me-3">
            <SearchBar />
          </div>

          <Nav className="ms-auto">
            <NavDropdown title="Account" id="account-dropdown" align="end">
              {!isLoggedIn ? (
                <>
                  <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/signup">Sign Up</NavDropdown.Item>
                </>
              ) : (
                <>
                  <NavDropdown.Item as={Link} to="/chat">Messages</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/notifications">Notifications</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
