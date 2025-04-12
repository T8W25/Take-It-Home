import React, { useState, useEffect } from "react";
import { Alert, Form, Button, Container } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import "./PostTradeFromAccount.css";

const API_BASE = "https://take-it-home-8ldm.onrender.com/api/trade-items";

const PostTradeFromAccount = () => {
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
      const fetchTradeItem = async () => {
        try {
          const token = localStorage.getItem("jwtToken");
          const res = await fetch(`${API_BASE}/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (!res.ok) throw new Error("Failed to fetch trade item");
          const data = await res.json();
          console.log("Fetched trade item:", data);
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
          setMessage({ type: "danger", text: err.message || "Failed to load trade item" });
        } finally {
          setLoading(false);
        }
      };
      fetchTradeItem();
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
      const url = id ? `${API_BASE}/update/${id}` : `${API_BASE}/post`; // Changed to /update/:id
      const method = id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) throw new Error(await res.text());

      setMessage({
        type: "success",
        text: id ? "Trade item updated successfully!" : "Trade item posted successfully!",
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
    <Container className="post-trade-container">
      <h3 className="post-trade-title">{id ? "Edit Trade Item" : "Post Trade Item"}</h3>

      {message && (
        <Alert variant={message.type} className="alert-3d">
          {message.text}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="form-group-3d">
          <Form.Label className="form-label-3d">Title*</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-control-3d"
            required
            placeholder="Enter item title"
          />
        </Form.Group>

        <Form.Group className="form-group-3d">
          <Form.Label className="form-label-3d">Category*</Form.Label>
          <Form.Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-select-3d"
            required
          >
            <option value="">Select a category</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Sports">Sports</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="form-group-3d">
          <Form.Label className="form-label-3d">Condition*</Form.Label>
          <Form.Select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="form-select-3d"
            required
          >
            <option value="">Select condition</option>
            <option value="New">New</option>
            <option value="Used-LikeNew">Used - Like New</option>
            <option value="Used-Good">Used - Good</option>
            <option value="Used">Used</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="form-group-3d">
          <Form.Label className="form-label-3d">Description*</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control-3d"
            rows={4}
            required
            placeholder="Describe your item in detail..."
          />
        </Form.Group>

        <Form.Group className="form-group-3d">
          <Form.Label className="form-label-3d">Location*</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="form-control-3d"
            required
            placeholder="City, State"
          />
        </Form.Group>

        <Form.Group className="form-group-3d">
          <Form.Label className="form-label-3d">Item Image {id ? "(Upload new to replace)" : "*"}</Form.Label>
          <div className="file-input-3d">
            <Form.Control
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required={!id}
            />
            <span className="file-cta">
              {formData.image ? formData.image.name : "Choose file..."}
            </span>
          </div>
        </Form.Group>

        <Form.Group className="form-group-3d">
          <Form.Label className="form-label-3d">Video (Optional)</Form.Label>
          <div className="file-input-3d">
            <Form.Control
              type="file"
              name="video"
              accept="video/*"
              onChange={handleChange}
            />
            <span className="file-cta">
              {formData.video ? formData.video.name : "Choose file..."}
            </span>
          </div>
        </Form.Group>

        <Button
          type="submit"
          className={`submit-btn-3d ${isSubmitting ? "submitting" : ""}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              {id ? "Updating..." : "Posting..."}
            </>
          ) : (
            id ? "Update Item" : "Post Item Now"
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default PostTradeFromAccount;
