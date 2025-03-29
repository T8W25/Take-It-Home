import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TradeRequestsPage() {
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch user's trade requests (both sent and received)
    axios.get('/api/trade-requests/user')
      .then((response) => {
        setSentRequests(response.data.sentRequests);
        setReceivedRequests(response.data.receivedRequests);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching trade requests:', error);
        setError('Failed to load trade requests');
        setLoading(false);
      });
  }, []);

  const handleResponse = (requestId, status) => {
    axios.put(`/api/trade-requests/${requestId}`, { status })
      .then(() => {
        setReceivedRequests(receivedRequests.map(req =>
          req._id === requestId ? { ...req, status } : req
        ));
        alert(`Trade request ${status} successfully!`);
      })
      .catch(error => {
        console.error('Error updating trade request:', error);
        alert('Failed to update trade request');
      });
  };
  
  

  const handleCancelRequest = (requestId) => {
    axios.delete(`/api/trade-requests/${requestId}`)
      .then(() => {
        setSentRequests(sentRequests.filter(req => req._id !== requestId));
        alert('Trade request canceled successfully');
      })
      .catch(error => {
        console.error('Error canceling trade request:', error);
        alert('Failed to cancel trade request');
      });
  };
  
  return (
    <div>
      <h2>Trade Requests</h2>

      {loading ? <p>Loading trade requests...</p> : (
        <>
          {error && <p style={{ color: 'red' }}>{error}</p>}

          <h3>Sent Requests</h3>
          {sentRequests.length > 0 ? (
            <ul>
              {sentRequests.map((request) => (
                <li key={request._id}>
                  <strong>Item:</strong> {request.item.title} <br />
                  <strong>To:</strong> {request.recipient.username} <br />
                  <strong>Status:</strong> {request.status} <br />
                  {request.status === 'pending' && (
                    <button onClick={() => handleCancelRequest(request._id)}>Cancel</button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No sent trade requests</p>
          )}

<h3>Received Requests</h3>
{receivedRequests.length > 0 ? (
  <ul>
    {receivedRequests.map((request) => (
      <li key={request._id}>
        <strong>Item:</strong> {request.item.title} <br />
        <strong>From:</strong> {request.sender.username} <br />
        <strong>Message:</strong> {request.message} <br />
        <strong>Status:</strong> 
<span style={{ color: request.status === 'accepted' ? 'green' : request.status === 'rejected' ? 'red' : 'orange' }}>
  {request.status}
</span>

        
        {/* Show Accept/Reject buttons only if the request is pending */}
        {request.status === 'pending' && (
          <>
            <button onClick={() => handleResponse(request._id, 'accepted')}>✅ Accept</button>
            <button onClick={() => handleResponse(request._id, 'rejected')}>❌ Reject</button>
          </>
        )}
      </li>
    ))}
  </ul>
) : (
  <p>No received trade requests</p>
)}

        </>
      )}
    </div>
  );
}

export default TradeRequestsPage;
