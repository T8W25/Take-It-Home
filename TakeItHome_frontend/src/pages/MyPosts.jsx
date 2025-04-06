import React, { useEffect, useState } from "react";
import axios from "axios";

const MyPosts = () => {
  const [tradeItems, setTradeItems] = useState([]);
  const [donationItems, setDonationItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const headers = { Authorization: `Bearer ${token}` };

    axios
      .get("http://localhost:3002/api/trade-items/user", { headers })
      .then(res => setTradeItems(res.data))
      .catch(() => setError("Failed to load trade items"));

    axios
      .get("http://localhost:3002/api/donation-items/user", { headers })
      .then(res => setDonationItems(res.data))
      .catch(() => setError("Failed to load donation items"));
  }, []);

  return (
    <div className="container mt-4">
      <h2>My Posts</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <section>
        <h3>Trade Listings</h3>
        {tradeItems.length === 0 ? (
          <p>No trade items posted yet.</p>
        ) : (
          <div className="row">
            {tradeItems.map(item => (
              <div className="col-md-4 mb-3" key={item._id}>
                <div className="card">
                  {item.imageBase64 && (
                    <img src={item.imageBase64} className="card-img-top" alt={item.title} />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-4">
        <h3>Donation Listings</h3>
        {donationItems.length === 0 ? (
          <p>No donation items posted yet.</p>
        ) : (
          <div className="row">
            {donationItems.map(item => (
              <div className="col-md-4 mb-3" key={item._id}>
                <div className="card">
                  {item.imageUrl && (
                    <img
                      src={`http://localhost:3002${item.imageUrl}`}
                      className="card-img-top"
                      alt={item.title}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{item.title}</h5>
                    <p className="card-text">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyPosts;

