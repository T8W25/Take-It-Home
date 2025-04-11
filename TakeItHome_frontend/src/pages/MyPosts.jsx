import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Spinner } from "react-bootstrap";

const API_BASE = "http://localhost:3002";

const MyPosts = () => {
  const [tradeItems, setTradeItems] = useState([]);
  const [donationItems, setDonationItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    const token = localStorage.getItem("jwtToken");
    console.log("Token:", token); // Debug
    if (!token) {
      setError("Please log in to view your posts.");
      setLoading(false);
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const tradeRes = await axios.get(`${API_BASE}/api/trade-items/user`, { headers });
      console.log("Trade items:", tradeRes.data); // Debug
      setTradeItems(tradeRes.data);
    } catch (err) {
      setError("Failed to load trade items: " + err.message);
      console.error("Trade fetch error:", err);
    }

    try {
      const donationRes = await axios.get(`${API_BASE}/api/donation-items/user`, { headers });
      console.log("Donation items:", donationRes.data); // Debug
      setDonationItems(donationRes.data);
    } catch (err) {
      setError("Failed to load donation items: " + err.message);
      console.error("Donation fetch error:", err);
    }

    setLoading(false);
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

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

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
                  <div className="card-actions">
                    <Button variant="warning" size="sm">Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(item._id)}>Delete</Button>
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
                      src={`${API_BASE}${item.imageUrl}`}
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
