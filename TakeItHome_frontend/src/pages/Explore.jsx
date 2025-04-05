import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Explore.css';

const API_BASE = 'http://localhost:3002'; // Change to your Render URL for deployment

const Explore = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE}/api/items`)
      .then(res => setItems(res.data))
      .catch(err => console.error('Error fetching items:', err));
  }, []);

  const renderImage = (item) => {
    if (item.imageUrl) {
      return (
        <img
          src={`${API_BASE}${item.imageUrl}`} // example: /uploads/filename.jpg
          alt={item.title || "Item Image"}
          className="item-image"
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
      );
    } else {
      return (
        <div className="no-image" style={{
          width: "100%",
          height: "200px",
          backgroundColor: "#eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          No Image
        </div>
      );
    }
  };

  return (
    <div className="explore-container">
      <h1 className="explore-title">Explore Items</h1>

      <div className="explore-grid">
        {items.length === 0 ? (
          <p className="no-items">No items available.</p>
        ) : (
          items.map((item) => (
            <div key={item._id} className="item-card">
              {renderImage(item)}
              <h3 className="item-title">{item.title}</h3>
              <p className="item-description">{item.description}</p>
              <span className={`item-tag ${item.type === 'donate' ? 'donate' : 'trade'}`}>
                {item.type?.toUpperCase() || 'ITEM'}
              </span>
              <button className="view-button">View Details</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Explore;
