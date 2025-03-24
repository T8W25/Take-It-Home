
// src/pages/SearchResults.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Alert, Form, Button, Card } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";

function SearchResults() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "trade",
    category: searchParams.get("category") || "",
    location: searchParams.get("location") || "",
  });

  const keyword = searchParams.get("q") || "";

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get("http://localhost:3002/api/search", {
          params: {
            q: keyword,
            type: filters.type,
            category: filters.category || undefined,
            location: filters.location || undefined,
          },
        });

        const data = response.data;
        console.log(`Search Results (${filters.type}):`, data);
        setItems(data);
        setMessage(data.length > 0 ? `${data.length} items found` : "No items found");
      } catch (error) {
        console.error("Search Fetch Error:", error.message);
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
      location: filters.location,
    });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col xs={12} md={8}>
          <h3>Search Results for "{keyword || "All"}"</h3>
          {message && <Alert variant="info">{message}</Alert>}

          <Form className="mb-4">
            <Form.Group className="mb-3">
              <Form.Label>Items</Form.Label>
              <Form.Select name="type" value={filters.type} onChange={handleFilterChange}>
                <option value="trade">Trade Items</option>
                <option value="donation">Donation Items</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" value={filters.category} onChange={handleFilterChange}>
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

          {items.length === 0 ? (
            <Alert variant="warning">
              No {filters.type} items found for "{keyword}". Try adjusting your search or filters.
            </Alert>
          ) : (
            <Row>
              {items.map((item) => (
                <Col md={4} key={item._id} className="mb-3">
                  <Link
                    to={`/${filters.type === "trade" ? "trade" : "donate"}/${item._id}`} // Fix route here
                    style={{ textDecoration: "none", color: "inherit" }}
                    onClick={() => console.log(`Navigating to: /${filters.type === "trade" ? "trade" : "donate"}/${item._id}`)}
                  >
                    <Card>
                      {item.imageUrl && (
                        <Card.Img
                          variant="top"
                          src={`http://localhost:3002${item.imageUrl}`}
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                      )}
                      {!item.imageUrl && item.videoUrl && (
                        <video controls style={{ width: "100%", height: "200px", objectFit: "cover" }}>
                          <source src={`http://localhost:3002${item.videoUrl}`} type="video/mp4" />
                        </video>
                      )}
                      <Card.Body>
                        <Card.Title>{item.title}</Card.Title>
                        <Card.Text>{item.description.substring(0, 100)}...</Card.Text>
                        <Card.Text>
                          <strong>Category:</strong> {item.category} <br />
                          <strong>Location:</strong> {item.location} <br />
                          <strong>Condition:</strong> {item.condition}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default SearchResults;
