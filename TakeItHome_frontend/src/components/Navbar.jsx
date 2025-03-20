import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

const NavBar = () => {
  const navigate = useNavigate();

  // Check if user is logged in
  const isAuthenticated = !!localStorage.getItem("token");

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    localStorage.removeItem("user"); // Clear user info
    navigate("/login"); // Redirect to login page
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            alt="logo"
            src="./logo.png"
            width="80"
            height="60"
            style={{ borderRadius: "50%", objectFit: "cover" }}
            className="d-inline-block align-top logo-circle"
          />
        </Navbar.Brand>

        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/explore">Explore</Nav.Link>
          <Nav.Link as={Link} to="/contact">Contact</Nav.Link>

          {/* Show "Post Item" only if user is logged in */}
          {isAuthenticated && (
            <Nav.Link as={Link} to="/post-item">Post Item</Nav.Link>
          )}
        </Nav>

        <Nav className="ms-auto">
          {isAuthenticated ? (
            <Button variant="outline-light" className="me-2" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button as={Link} to="/login" variant="outline-light" className="me-2">
                Login
              </Button>
              <Button as={Link} to="/signup" variant="primary">
                Sign Up
              </Button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
