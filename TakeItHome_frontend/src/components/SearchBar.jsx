import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [message, setMessage] = useState(null); // Success/Error messages

  const handleSearch = (event) => {
    event.preventDefault();

    // Validation for empty search query
    if (!searchQuery && !category && !condition) {
      setMessage({ type: "danger", text: "Please enter a search query or select filters" });
      return;
    }

    // Success message (for UI testing)
    setMessage({ type: "success", text: "Search results found! (Backend Pending)" });

    // Reset search bar fields after submission (optional)
    setSearchQuery("");
    setCategory("");
    setCondition("");
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Search Trade Items</h2>

          {message && <Alert variant={message.type}>{message.text}</Alert>}

          <Form onSubmit={handleSearch}>
            {/* Search Query */}
            <Form.Group className="mb-3">
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search for items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form.Group>

            {/* Category Filter */}
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
              </Form.Control>
            </Form.Group>

            {/* Condition Filter */}
            <Form.Group className="mb-3">
              <Form.Label>Condition</Form.Label>
              <Form.Control
                as="select"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Refurbished">Refurbished</option>
              </Form.Control>
            </Form.Group>

            {/* Search Button */}
            <Button variant="primary" type="submit" className="w-100">
              Search
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SearchBar;
