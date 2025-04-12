import React, { useState, useEffect } from "react";
import { Alert, Form, Button, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import "./PostDonationFromAccount.css";

const API_BASE ="https://take-it-home-8ldm.onrender.com/api/donation-items";

const PostDonationFromAccount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      const fetchDonationItem = async () => {
        try {
          const token = localStorage.getItem("jwtToken");
          const res = await fetch(`${API_BASE}/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (!res.ok) throw new Error("Failed to fetch donation item");
          const data = await res.json();
          console.log("Fetched donation item:", data);
          setFormData({
            title: data.title || "",
            category: data.category || "",
            condition: data.condition || "",
            description: data.description || "",
            location: data.location || "",
            image: null,
            video: null,
          });
        } catch (err) {
          setMessage({ type: "danger", text: err.message || "Failed to load donation item" });
        } finally {
          setLoading(false);
        }
      };
      fetchDonationItem();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setMessage({ type: "danger", text: "Please log in to submit" });
      setIsSubmitting(false);
      return;
    }

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) form.append(key, value);
    });

    try {
      const url = id ? `${API_BASE}/edit/${id}` : `${API_BASE}/post`; // Changed to /edit/:id
      const method = id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) throw new Error(await res.text());

      setMessage({
        type: "success",
        text: id ? "Donation item updated successfully!" : "Donation item posted successfully!",
      });
      if (id) {
        setTimeout(() => navigate("/my-posts"), 2000);
      } else {
        setFormData({
          title: "",
          category: "",
          condition: "",
          description: "",
          location: "",
          image: null,
          video: null,
        });
      }
    } catch (err) {
      setMessage({ type: "danger", text: err.message || (id ? "Update failed" : "Posting failed") });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <Container className="post-donation-container mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="post-donation-title">{id ? "Edit Donation Item" : "Post Donation Item"}</h2>

          {message && <Alert variant={message.type} className="alert-custom">{message.text}</Alert>}

          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group className="mb-3">
              <Form.Label className="form-label-glow">Item Name</Form.Label>
              <Form.Control
                className="form-control-glow"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter item name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-glow">Category</Form.Label>
              <Form.Select
                className="form-select-glow"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-glow">Condition</Form.Label>
              <Form.Select
                className="form-select-glow"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-glow">Location</Form.Label>
              <Form.Control
                className="form-control-glow"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-glow">Description</Form.Label>
              <Form.Control
                className="form-control-glow"
                as="textarea"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-glow">Image {id ? "(Upload new to replace)" : ""}</Form.Label>
              <Form.Control
                className="file-input-glow"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required={!id}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label-glow">Video (Optional)</Form.Label>
              <Form.Control
                className="file-input-glow"
                type="file"
                name="video"
                accept="video/*"
                onChange={handleChange}
              />
            </Form.Group>

            <Button type="submit" className="submit-btn-glow w-100" disabled={isSubmitting}>
              {isSubmitting ? (id ? "Updating..." : "Posting...") : (id ? "Update Donation Item" : "Post Donation Item")}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default PostDonationFromAccount;
