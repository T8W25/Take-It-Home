import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import "./PostTradeFromAccount.css"; // ✅ correct path
 // IMPORT CSS FILE HERE

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_BASE = "http://localhost:3002/api/trade-items";

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const token = localStorage.getItem("jwtToken");
    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value) form.append(key, value);
    });

    try {
      const res = await fetch(`${API_BASE}/post`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });

      if (!res.ok) throw new Error(await res.text());
      
      const data = await res.json();
      setMessage({ type: "success", text: "Item posted successfully!" });
      setFormData({
        title: "", category: "", condition: "",
        description: "", location: "", image: null, video: null
      });
    } catch (err) {
      setMessage({ type: "danger", text: err.message || "Posting failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-trade-container">
      <h3 className="post-trade-title">Post Trade Item</h3>
      
      {message && (
        <Alert variant={message.type} className="alert-3d">
          {message.text}
        </Alert>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Title Field */}
        <div className="form-group-3d">
          <label className="form-label-3d">Title*</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-control-3d"
            required
            placeholder="Enter item title"
          />
        </div>

        {/* Category Field */}
        <div className="form-group-3d">
          <label className="form-label-3d">Category*</label>
          <select
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
          </select>
        </div>

        {/* Condition Field */}
        <div className="form-group-3d">
          <label className="form-label-3d">Condition*</label>
          <select
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
          </select>
        </div>

        {/* Description Field */}
        <div className="form-group-3d">
          <label className="form-label-3d">Description*</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control-3d"
            rows={4}
            required
            placeholder="Describe your item in detail..."
          />
        </div>

        {/* Location Field */}
        <div className="form-group-3d">
          <label className="form-label-3d">Location*</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="form-control-3d"
            required
            placeholder="City, State"
          />
        </div>

        {/* Image Upload */}
        <div className="form-group-3d">
          <label className="form-label-3d">Item Image*</label>
          <div className="file-input-3d">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required
            />
            <span className="file-cta">
              {formData.image ? formData.image.name : "Choose file..."}
            </span>
          </div>
        </div>

        {/* Video Upload */}
        <div className="form-group-3d">
          <label className="form-label-3d">Video (Optional)</label>
          <div className="file-input-3d">
            <input
              type="file"
              name="video"
              accept="video/*"
              onChange={handleChange}
            />
            <span className="file-cta">
              {formData.video ? formData.video.name : "Choose file..."}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`submit-btn-3d ${isSubmitting ? "submitting" : ""}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Posting...
            </>
          ) : (
            "Post Item Now"
          )}
        </button>
      </form>
    </div>
  );
};

export default PostTradeFromAccount;