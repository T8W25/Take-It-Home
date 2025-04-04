// PostItemTrade.jsx

import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert, Card, Modal } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

function PostItemTrade() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState(null);
  const [items, setItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const [reportItemId, setReportItemId] = useState(null);

  const API_BASE = "https://take-it-home-8ldm.onrender.com/api/trade-items";
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, [navigate]);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_BASE}/all`);
      if (!res.ok) throw new Error("Failed to fetch items");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !category || !condition || !description || !location || (!image && !video && !editMode)) {
      setMessage({ type: "danger", text: "All fields (including location) are required with at least one media file." });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("condition", condition);
    formData.append("description", description);
    formData.append("location", location);
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    const token = localStorage.getItem("jwtToken");

    try {
      let res;
      if (editMode) {
        res = await fetch(`${API_BASE}/edit/${editItemId}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      } else {
        res = await fetch(`${API_BASE}/post`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      }

      if (!res.ok) throw new Error(editMode ? "Failed to update item" : "Failed to post item");

      setMessage({ type: "success", text: editMode ? "Item updated successfully!" : "Item posted successfully!" });
      resetForm();
      fetchItems();
    } catch (err) {
      console.error("❌ Post error:", err);
      setMessage({ type: "danger", text: err.message });
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setCondition("");
    setDescription("");
    setLocation("");
    setImage(null);
    setVideo(null);
    setEditMode(false);
    setEditItemId(null);
  };

  const handleEdit = (item) => {
    setEditMode(true);
    setEditItemId(item._id);
    setTitle(item.title);
    setCategory(item.category);
    setCondition(item.condition);
    setDescription(item.description);
    setLocation(item.location);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const token = localStorage.getItem("jwtToken");
    try {
      const res = await fetch(`${API_BASE}/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete item");
      fetchItems();
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  const handleRequestItem = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleRequestSubmit = async () => {
    if (!name || !email || !phoneNumber || !userLocation || !requestMessage) {
      alert("Please fill in all the required fields.");
      return;
    }

    try {
      setShowModal(false);
      alert("Request sent successfully!");
      setRequestMessage("");
      setName("");
      setEmail("");
      setPhoneNumber("");
      setUserLocation("");
    } catch (err) {
      console.error("❌ Request error:", err);
      alert("Failed to send request.");
    }
  };

  const handleReportClick = (item) => {
    setReportItemId(item._id);
    setShowReportModal(true);
  };

  const handleReportSubmit = async () => {
    if (!reportMessage || !reportItemId) {
      alert("All fields are required.");
      return;
    }

    try {
      const res = await fetch("https://take-it-home-8ldm.onrender.com/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportType: "trade",
          itemId: reportItemId,
          message: reportMessage,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit report");
      setShowReportModal(false);
      setReportMessage("");
      alert("Report submitted successfully!");
    } catch (err) {
      console.error("❌ Report error:", err);
      alert("Failed to submit report.");
    }
  };

  return (
    <Container>
      <h3 className="text-center my-5">{editMode ? "Edit Trade Item" : "Post a Trade Item"}</h3>
      {message && <Alert variant={message.type}>{message.text}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group><Form.Label>Title</Form.Label><Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /></Form.Group>
        <Form.Group><Form.Label>Category</Form.Label><Form.Control type="text" value={category} onChange={(e) => setCategory(e.target.value)} required /></Form.Group>
        <Form.Group><Form.Label>Condition</Form.Label><Form.Control type="text" value={condition} onChange={(e) => setCondition(e.target.value)} required /></Form.Group>
        <Form.Group><Form.Label>Description</Form.Label><Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required /></Form.Group>
        <Form.Group><Form.Label>Location</Form.Label><Form.Control type="text" value={location} onChange={(e) => setLocation(e.target.value)} required /></Form.Group>
        <Form.Group><Form.Label>Upload Image/Video</Form.Label><Form.Control type="file" accept="image/*, video/*" onChange={(e) => { if (e.target.files[0]) setImage(e.target.files[0]); }} /></Form.Group>
        <Button variant="primary" type="submit">{editMode ? "Update" : "Post"}</Button>
      </Form>

      <hr className="my-5" />
      <h3 className="text-center">Posted Trade Listings</h3>
      <Row>
        {items.map((item) => (
          <Col md={4} key={item._id} className="mb-4">
            <Link to={`/trade/${item._id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <Card>
                {item.imageUrl && (
                  <Card.Img
                    variant="top"
                    src={`https://take-it-home-8ldm.onrender.com${item.imageUrl}`}
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>{item.description}</Card.Text>
                  <Card.Text>
                    <strong>Category:</strong> {item.category} <br />
                    <strong>Condition:</strong> {item.condition} <br />
                    <strong>Location:</strong> {item.location}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
            <div className="mt-2 d-flex justify-content-between">
              <Button variant="secondary" onClick={() => handleEdit(item)}>Edit</Button>
              <Button variant="danger" onClick={() => handleDelete(item._id)}>Delete</Button>
              <Button variant="primary" onClick={() => handleRequestItem(item)}>Request</Button>
              <Button variant="warning" onClick={() => handleReportClick(item)}>Report</Button>
            </div>
          </Col>
        ))}
      </Row>

      {/* Request Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Request Item</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group><Form.Label>Name</Form.Label><Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required /></Form.Group>
            <Form.Group><Form.Label>Email</Form.Label><Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Form.Group>
            <Form.Group><Form.Label>Phone Number</Form.Label><Form.Control type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required /></Form.Group>
            <Form.Group><Form.Label>Location</Form.Label><Form.Control type="text" value={userLocation} onChange={(e) => setUserLocation(e.target.value)} required /></Form.Group>
            <Form.Group><Form.Label>Message</Form.Label><Form.Control as="textarea" rows={3} value={requestMessage} onChange={(e) => setRequestMessage(e.target.value)} required /></Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleRequestSubmit}>Submit</Button>
        </Modal.Footer>
      </Modal>

      {/* Report Modal */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)}>
        <Modal.Header closeButton><Modal.Title>Report Item</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Reason for reporting:</Form.Label>
            <Form.Control as="textarea" rows={4} value={reportMessage} onChange={(e) => setReportMessage(e.target.value)} placeholder="Enter your reason" required />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleReportSubmit}>Submit Report</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default PostItemTrade;
