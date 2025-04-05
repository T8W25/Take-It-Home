import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Explore.css';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:3002'; // or your hosted URL

const Explore = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE}/api/items`)
      .then(res => setItems(res.data))
      .catch(err => console.error('Error fetching items:', err));
  }, []);

  const renderImage = (item) => {
    if (item.imageUrl) {
      return (
        <img
          src={`${API_BASE}${item.imageUrl}`}
          alt={item.title || "Item Image"}
          className="item-image"
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
      );
    } else if (item.imageBase64) {
      return (
        <img
          src={`data:image/jpeg;base64,${item.imageBase64}`}
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

  const handleViewDetails = (item) => {
    const route = item.type === "donate" ? `/donate/${item._id}` : `/trade/${item._id}`;
    navigate(route);
  };

  return (
    <div className="explore-container">
      <h1 className="explore-title">Explore Items</h1>

      <div className="explore-grid">
        {items.length === 0 ? (
          <p className="no-items">No items available.</p>
        ) : (
          items.map((item) => (
            <div
              key={item._id}
              className="item-card"
              style={{ cursor: "pointer" }}
              onClick={() => handleViewDetails(item)}
            >
              {renderImage(item)}
              <h3 className="item-title">{item.title}</h3>
              <p className="item-description">{item.description}</p>
              <span className={`item-tag ${item.type === 'donate' ? 'donate' : 'trade'}`}>
                {item.type?.toUpperCase() || 'ITEM'}
              </span>
              <button
                className="view-button"
                onClick={(e) => {
                  e.stopPropagation(); // prevent outer click
                  handleViewDetails(item);
                }}
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Explore;
