import React, { useEffect, useState } from "react";
import {Route} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/">
          <img
            alt="logo"
            src="./logo.png"
            width="80"
            height="60"
            style={{ borderRadius: "50%", objectFit: "cover" }}
            className="d-inline-block align-top"
          />
        </Navbar.Brand>

        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/explore">Explore</Nav.Link>
          <Nav.Link href="/contact">Contact</Nav.Link>
          {isLoggedIn && <Nav.Link href="/trade-item">Trade</Nav.Link>}
          {isLoggedIn && <Nav.Link href="/donate-item">Donate </Nav.Link>}
          {isLoggedIn && <Nav.Link as={Link} to="/chat">Messages</Nav.Link>}
          {isLoggedIn && <Nav.Link as={Link} to="/notifications">Notifications</Nav.Link>}
        </Nav>

        <Nav className="ms-auto">

        <div className="me-3">
          {/* <Route render={({history}) => <SearchBar history={history}/>} /> */}
          <SearchBar />
        </div>
        
          {!isLoggedIn ? (
            <>
              <Button href="/login" variant="outline-light" className="me-2">Login</Button>
              <Button href="/signup" variant="primary">Sign Up</Button>
            </>
          ) : (
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;

