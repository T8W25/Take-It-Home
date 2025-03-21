import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const API_LOGIN_URL = "http://localhost:3000/api/auth/login";
  const API_LOGOUT_URL = "http://localhost:3000/api/auth/logout";

  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const user = localStorage.getItem("user");
    if (token && user) {
      setIsLoggedIn(true);
    }
  }, []);

  // Handle Login
  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage(null);

    try {
      const response = await fetch(API_LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsLoggedIn(true);
      setMessage({ type: "success", text: "Login successful!" });

      navigate("/post-item");
    } catch (error) {
      setMessage({ type: "danger", text: error.message });
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch(API_LOGOUT_URL, { method: "POST" });

      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setMessage({ type: "success", text: "Logout successful!" });

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">{isLoggedIn ? "Welcome Back!" : "Login"}</h2>

          {message && <Alert variant={message.type}>{message.text}</Alert>}

          {!isLoggedIn && (
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Login
              </Button>
            </Form>
          )}

          {isLoggedIn && (
            <Button variant="danger" className="w-100 mt-3" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
