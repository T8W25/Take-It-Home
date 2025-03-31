import React, { useState, useEffect } from "react";
import { Dropdown, Badge, Modal, Button } from "react-bootstrap";

function TradeRequestNotifications() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTradeRequests();
  }, []);

  const fetchTradeRequests = async () => {
    try {
      const response = await fetch("https://take-it-home-8ldm.onrender.com/api/trade-requests");
      if (!response.ok) throw new Error("Failed to fetch trade requests");
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching trade requests:", error);
    }
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleResponse = async (requestId, status) => {
    try {
      const response = await fetch(`https://take-it-home-8ldm.onrender.com/api/trade-requests/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update request");
      setRequests(requests.filter((req) => req._id !== requestId));
      setShowModal(false);
    } catch (error) {
      console.error("Error updating trade request:", error);
    }
  };

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle variant="primary">
          Trade Requests <Badge bg="danger">{requests.length}</Badge>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {requests.length === 0 ? (
            <Dropdown.Item disabled>No new requests</Dropdown.Item>
          ) : (
            requests.map((request) => (
              <Dropdown.Item key={request._id} onClick={() => handleRequestClick(request)}>
                {request.itemTitle} from {request.requesterName}
              </Dropdown.Item>
            ))
          )}
        </Dropdown.Menu>
      </Dropdown>

      {/* Modal for Request Details */}
      {selectedRequest && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Trade Request Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Item:</strong> {selectedRequest.itemTitle}</p>
            <p><strong>From:</strong> {selectedRequest.requesterName}</p>
            <p><strong>Email:</strong> {selectedRequest.email}</p>
            <p><strong>Message:</strong> {selectedRequest.message}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={() => handleResponse(selectedRequest._id, "declined")}>Decline</Button>
            <Button variant="success" onClick={() => handleResponse(selectedRequest._id, "accepted")}>Accept</Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default TradeRequestNotifications;
