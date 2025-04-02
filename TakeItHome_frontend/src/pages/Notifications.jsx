import React, { useEffect, useState } from "react";
import { Container, Card, Spinner, Alert, Tabs, Tab, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3002";

const Notifications = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchRequests = async () => {
      if (!token) {
        setError("Not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/requests/received`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Failed to fetch requests.");

        const data = await res.json();
        setRequests(data);
      } catch (err) {
        setError(err.message || "An error occurred.");
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
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Action failed");

      const data = await res.json();

      setRequests((prev) =>
        prev.map((req) => (req._id === id ? { ...req, status: action } : req))
      );
    } catch (err) {
      alert(err.message || "Error updating request.");
    }
  };

  const navigateToChat = (req) => {
    navigate("/chat", {
      state: {
        itemId: req.itemId._id,
        receiverId: req.senderId._id,
        username: req.senderId.username
      }
    });
  };

  const renderRequestList = (list) => {
    return list.map((req) => {
      const isReceiver = req.receiverId === userId || req.receiverId?._id === userId;

      return (
        <Card key={req._id} className="mb-3">
          <Card.Body>
            <Card.Title>{req.itemId?.title || "Item"} ({req.itemType})</Card.Title>
            <Card.Text>
              <strong>From:</strong> {req.senderId?.username || "Unknown"}<br />
              <strong>Message:</strong> {req.message}<br />
              <strong>Status:</strong>{" "}
              <span className={`badge bg-${req.status === "pending" ? "warning" : req.status === "accepted" ? "success" : "danger"}`}>
                {req.status}
              </span>
            </Card.Text>

            {isReceiver && req.status === "pending" && (
              <div className="d-flex gap-2">
                <Button size="sm" variant="success" onClick={() => handleAction(req._id, "accept")}>
                  Accept
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleAction(req._id, "decline")}>
                  Decline
                </Button>
              </div>
            )}

            {req.status === "accepted" && (
              <Button size="sm" variant="primary" className="mt-2" onClick={() => navigateToChat(req)}>
                Chat
              </Button>
            )}
          </Card.Body>
        </Card>
      );
    });
  };

  const pending = requests.filter((r) => r.status === "pending");
  const accepted = requests.filter((r) => r.status === "accepted");
  const declined = requests.filter((r) => r.status === "declined");

  return (
    <Container className="mt-5">
      <h3>Notifications</h3>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && (
        <Tabs defaultActiveKey="pending" className="mb-3">
          <Tab eventKey="pending" title={`Pending (${pending.length})`}>
            {pending.length === 0 ? (
              <Alert variant="info">No pending requests.</Alert>
            ) : (
              renderRequestList(pending)
            )}
          </Tab>
          <Tab eventKey="accepted" title={`Accepted (${accepted.length})`}>
            {accepted.length === 0 ? (
              <Alert variant="info">No accepted requests.</Alert>
            ) : (
              renderRequestList(accepted)
            )}
          </Tab>
          <Tab eventKey="declined" title={`Declined (${declined.length})`}>
            {declined.length === 0 ? (
              <Alert variant="info">No declined requests.</Alert>
            ) : (
              renderRequestList(declined)
            )}
          </Tab>
        </Tabs>
      )}
    </Container>
  );
};

export default Notifications;
