import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AvailableItemsPage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Fetch available items from the API
    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/items');
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items", error);
      }
    };
    fetchItems();
  }, []);

  const handleSendTradeRequest = async (itemId) => {
    try {
      // Assuming the backend has an endpoint to send a trade request
      await axios.post('/api/trade-requests', { itemId });
      alert('Trade request sent successfully');
    } catch (error) {
      console.error('Error sending trade request:', error);
      alert('Failed to send trade request');
    }
  };

  return (
    <div>
      <h1>Available Items for Trade</h1>
      <ul>
        {items.map(item => (
          <li key={item._id}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p>Condition: {item.condition}</p>
            <p>Location: {item.location}</p>
            <button onClick={() => handleSendTradeRequest(item._id)}>
              Send Trade Request
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AvailableItemsPage;
