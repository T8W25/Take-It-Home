import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";

const PostTradeFromAccount = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    condition: "",
    description: "",
    location: "",
    image: null,
    video: null,
  });
  const [message, setMessage] = useState(null);
  const API_BASE = "http://localhost:3002/api/trade-items";

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");
    const form = new FormData();

    for (let key in formData) {
      if (formData[key]) form.append(key, formData[key]);
    }

    try {
      const res = await fetch(`${API_BASE}/post`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!res.ok) throw new Error("Failed to post item");
      setMessage({ type: "success", text: "Trade item posted successfully!" });
      setFormData({
        title: "",
        category: "",
        condition: "",
        description: "",
        location: "",
        image: null,
        video: null,
      });
    } catch (err) {
      setMessage({ type: "danger", text: err.message });
    }
  };

  return (
    <Container className="mt-4">
      <h3 className="text-center">Post Trade Item</h3>
      {message && <Alert variant={message.type}>{message.text}</Alert>}

      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control name="title" value={formData.title} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Sports">Sports</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Condition</Form.Label>
          <Form.Select name="condition" value={formData.condition} onChange={handleChange} required>
            <option value="">Select Condition</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control name="location" value={formData.location} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control type="file" name="image" accept="image/*" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Upload Video (Optional)</Form.Label>
          <Form.Control type="file" name="video" accept="video/*" onChange={handleChange} />
        </Form.Group>

        <Button type="submit" variant="primary" className="w-100">Post Item</Button>
      </Form>
    </Container>
  );
};

export default PostTradeFromAccount;