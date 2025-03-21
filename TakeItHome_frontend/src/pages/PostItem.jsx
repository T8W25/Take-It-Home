import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";

const PostItem = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState(null);
  const [postedItems, setPostedItems] = useState([]); // Store posted items
  const fileInputRef = useRef(null);

  // Backend API URL
  const API_URL = "http://localhost:3000/api/trade-items";

  // Fetch posted items when the component loads
  useEffect(() => {
    fetchPostedItems();
  }, []);

  // Function to fetch all posted items
  const fetchPostedItems = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }
      const data = await response.json();
      setPostedItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for empty fields
    if (!title || !category || !condition || !description || !image) {
      setMessage({ type: "danger", text: "All fields are required" });
      return;
    }

    // Prepare FormData to send file
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("condition", condition);
    formData.append("description", description);
    formData.append("image", image);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData, // Send formData instead of JSON
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to post trade item");
      }

      setMessage({ type: "success", text: "Trade item posted successfully!" });

      // Reset the form fields
      setTitle("");
      setCategory("");
      setCondition("");
      setDescription("");
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh the posted items list
      fetchPostedItems();
    } catch (error) {
      console.error("Error posting item:", error);
      setMessage({ type: "danger", text: error.message || "Server error" });
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Post a Trade Item</h2>

          {message && <Alert variant={message.type}>{message.text}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Item Name */}
            <Form.Group className="mb-3">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter item name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            {/* Category */}
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
              </Form.Control>
            </Form.Group>

            {/* Condition */}
            <Form.Group className="mb-3">
              <Form.Label>Condition</Form.Label>
              <Form.Control
                as="select"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Refurbished">Refurbished</option>
              </Form.Control>
            </Form.Group>

            {/* Description */}
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter item description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            {/* Upload Image */}
            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                ref={fileInputRef}
                required
              />
            </Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit" className="w-100">
              Post Item
            </Button>
          </Form>
        </Col>
      </Row>

      {/* Display posted items */}
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={8}>
          <h3 className="text-center">Posted Items</h3>
          <div>
            {postedItems.length === 0 ? (
              <p className="text-center">No items posted yet.</p>
            ) : (
              postedItems.map((item) => (
                <div key={item._id} className="mb-3 p-3 border rounded">
                  <h5>{item.title}</h5>
                  <p><strong>Category:</strong> {item.category}</p>
                  <p><strong>Condition:</strong> {item.condition}</p>
                  <p>{item.description}</p>
                  {item.imageUrl && (
                    <img
                      src={`http://localhost:3000${item.imageUrl}`} // Adjust URL based on backend
                      alt={item.title}
                      style={{ width: "100%", maxWidth: "300px", borderRadius: "5px" }}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default PostItem;
