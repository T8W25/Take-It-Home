import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";

function PostItem() {
  const [title, setTitle] = useState(""); // Item name
  const [category, setCategory] = useState(""); // Category selection
  const [condition, setCondition] = useState(""); // Condition selection
  const [description, setDescription] = useState(""); // Item description
  const [image, setImage] = useState(null); // Image upload
  const [message, setMessage] = useState(null); // Success/Error messages
  const [errors, setErrors] = useState({
    title: "",
    category: "",
    condition: "",
    description: "",
    image: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validation logic for form fields
    let valid = true;
    const newErrors = { ...errors };

    if (!title) {
      valid = false;
      newErrors.title = "Item name is required.";
    }
    if (!category) {
      valid = false;
      newErrors.category = "Category is required.";
    }
    if (!condition) {
      valid = false;
      newErrors.condition = "Condition is required.";
    }
    if (!description) {
      valid = false;
      newErrors.description = "Description is required.";
    }
    if (!image) {
      valid = false;
      newErrors.image = "An image is required.";
    }

    setErrors(newErrors);

    if (!valid) return;

    // Simulating a successful submission
    setMessage({ type: "success", text: "Item donated successfully!" });

    // Reset form fields after submission
    setTitle("");
    setCategory("");
    setCondition("");
    setDescription("");
    setImage(null);
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Donate an Item</h2>

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
                isInvalid={!!errors.title}
                required
              />
              <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
            </Form.Group>

            {/* Category */}
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                isInvalid={!!errors.category}
                required
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
            </Form.Group>

            {/* Condition */}
            <Form.Group className="mb-3">
              <Form.Label>Condition</Form.Label>
              <Form.Control
                as="select"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                isInvalid={!!errors.condition}
                required
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Refurbished">Refurbished</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">{errors.condition}</Form.Control.Feedback>
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
                isInvalid={!!errors.description}
                required
              />
              <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
            </Form.Group>

            {/* Upload Image */}
            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                isInvalid={!!errors.image}
                required
              />
              <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>

              {/* Image Preview */}
              {image && (
                <div className="mt-3">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Image preview"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </div>
              )}
            </Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit" className="w-100">
              Donate Item
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default PostItem;
