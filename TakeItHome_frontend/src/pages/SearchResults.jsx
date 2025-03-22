import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Alert, Form, Button, Card } from "react-bootstrap";
import { useLocation, useSearchParams } from "react-router-dom";

function SearchResults() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "trade", // Default to "trade"
    category: searchParams.get("category") || "",
    location: searchParams.get("location") || "",
  });

  const keyword = searchParams.get("q") || "";

  useEffect(() => {
    
    const fetchResults = async () => {
      try {
        // Inside useEffect
        const response = await axios.get("http://localhost:3000/api/search", {
            params: {
            q: keyword,
            type: filters.type, // "trade" or "donation"
            category: filters.category,
            location: filters.location,
            },
        });

        const data = response.data;
        setItems(data);
        setMessage(data.length > 0 ? `${data.length} items found` : "No items found");
      } catch (error) {
        setMessage("An error occurred while searching");
      }
    };

    fetchResults();
  }, [keyword, filters.type, filters.category, filters.location]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    setSearchParams({
      q: keyword,
      type: filters.type,
      category: filters.category,
      location: filters.location, // Include location in query params
    });
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={8}>
          {message && <Alert variant="info">{message}</Alert>}

          {/* Filters */}
          <Form className="mb-4">
            <Form.Group className="mb-3">
              <Form.Label>Items</Form.Label>
              <Form.Select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="trade">Trade Items</option>
                <option value="donation">Donation Items</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Enter location"
              />
            </Form.Group>

            <Button variant="primary" onClick={applyFilters}>
              Apply Filters
            </Button>
          </Form>

          {/* Display Results */}
          {items.map((item) => (
            <Card key={item._id} className="mb-3">
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <Card.Text>
                  <strong>Category:</strong> {item.category} <br />
                  <strong>Location:</strong> {item.location} <br />
                  <strong>Condition:</strong> {item.condition}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
}

export default SearchResults;
