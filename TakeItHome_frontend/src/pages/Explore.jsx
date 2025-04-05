import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Explore.css';

const API_BASE = 'http://localhost:3002';

const Explore = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/api/items`) // Make sure your backend route exists
      .then(res => setItems(res.data))
      .catch(err => console.log('Error fetching items:', err));
  }, []);

  return (
    <div className="explore-container">
      <h1 className="explore-title">Explore Items</h1>

      <div className="explore-grid">
        {items.length === 0 ? (
          <p className="no-items">No items available.</p>
        ) : (
          items.map((item) => (
            <div key={item._id} className="item-card">
              <img src={`${API_BASE}${item.image}`} alt={item.title} className="item-image" />
              <h3 className="item-title">{item.title}</h3>
              <p className="item-description">{item.description}</p>
              <span className={`item-tag ${item.type === 'donate' ? 'donate' : 'trade'}`}>{item.type}</span>
              <button className="view-button">View Details</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Explore;
