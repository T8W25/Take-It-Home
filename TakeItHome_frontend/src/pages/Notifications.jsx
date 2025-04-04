import React, { useEffect, useState } from "react";
import { Container, Card, Spinner, Alert, Tabs, Tab, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:3002";

const Notifications = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("jwtToken");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    if (!token || !userId) {
      setError("Not authenticated.");
      setLoading(false);
      return;
    }

    const fetchRequests = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/requests/received`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRequests(data);
      } catch (err) {
        setError("Failed to load requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`${API_BASE}/api/requests/${id}/${action}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = await res.json();
      setRequests((prev) => prev.map((r) => (r._id === id ? updated.request : r)));
    } catch {
      alert("Failed to update request.");
    }
  };

  const navigateToChat = (req) => {
    navigate("/chat", {
      state: {
        itemId: req.itemId?._id,
        receiverId: req.senderId?._id,
        username: req.senderId?.username,
      },
    });
  };

  const renderRequestList = (list) =>
    list.map((req) => {
      const isReceiver = req.receiverId?._id === userId;
      return (
        <Card key={req._id} className="mb-3">
          <Card.Body>
            <Card.Title>
              {req.itemId?.title || "Item"} ({req.itemType})
            </Card.Title>
            <Card.Text>
              <strong>From:</strong> {req.senderId?.username}<br />
              <strong>Message:</strong> {req.message}<br />
              <strong>Status:</strong>{" "}
              <span className={`badge bg-${req.status === "pending" ? "warning" : req.status === "accepted" ? "success" : "danger"}`}>
                {req.status}
              </span>
            </Card.Text>
            {isReceiver && req.status === "pending" && (
              <div className="d-flex gap-2">
                <Button variant="success" size="sm" onClick={() => handleAction(req._id, "accept")}>Accept</Button>
                <Button variant="danger" size="sm" onClick={() => handleAction(req._id, "decline")}>Decline</Button>
              </div>
            )}
            {req.status === "accepted" && (
              <Button variant="primary" size="sm" className="mt-2" onClick={() => navigateToChat(req)}>
                Chat
              </Button>
            )}
          </Card.Body>
        </Card>
      );
    });

  const pending = requests.filter((r) => r.status === "pending");
  const accepted = requests.filter((r) => r.status === "accepted");
  const declined = requests.filter((r) => r.status === "declined");

  return (
    <Container className="mt-5">
      <h3>Notifications</h3>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <Tabs defaultActiveKey="pending" className="mb-3">
          <Tab eventKey="pending" title={`Pending (${pending.length})`}>
            {pending.length ? renderRequestList(pending) : <Alert variant="info">No pending requests.</Alert>}
          </Tab>
          <Tab eventKey="accepted" title={`Accepted (${accepted.length})`}>
            {accepted.length ? renderRequestList(accepted) : <Alert variant="info">No accepted requests.</Alert>}
          </Tab>
          <Tab eventKey="declined" title={`Declined (${declined.length})`}>
            {declined.length ? renderRequestList(declined) : <Alert variant="info">No declined requests.</Alert>}
          </Tab>
        </Tabs>
      )}
    </Container>
  );
};

export default Notifications;
