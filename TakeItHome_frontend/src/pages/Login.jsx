import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert, Spinner } from "react-bootstrap";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null); // Success/Error messages
  const [loading, setLoading] = useState(false); // Loading state

  const API_URL = "http://localhost:3000/api/auth/login"; // Adjust this if needed

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check for empty fields
    if (!email || !password) {
      setMessage({ type: "danger", text: "All fields are required" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setMessage({ type: "success", text: "Login successful!" });

      // Store token in local storage
      localStorage.setItem("token", data.token);

      // Redirect or update UI
      console.log("User logged in:", data.user);
    } catch (error) {
      console.error("Login error:", error);
      setMessage({ type: "danger", text: error.message || "Server error. Try again." });
    }

    setLoading(false);
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Login</h2>

          {message && <Alert variant={message.type}>{message.text}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Login"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
