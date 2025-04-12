import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Spinner, Alert, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./MyPosts.css";

const API_BASE = "https://take-it-home-8ldm.onrender.com";

const MyPosts = () => {
  const [tradeItems, setTradeItems] = useState([]);
  const [donationItems, setDonationItems] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    const token = localStorage.getItem("jwtToken");
    console.log("Token:", token);
    if (!token) {
      setError("Please log in to view your posts.");
      setLoading(false);
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const tradeRes = await axios.get(`${API_BASE}/api/trade-items/user`, { headers });
      console.log("Trade items fetched:", tradeRes.data.map(item => ({ _id: item._id, sold: item.sold })));
      setTradeItems(tradeRes.data);
    } catch (err) {
      setError("Failed to load trade items: " + err.message);
      console.error("Trade fetch error:", err);
    }

    try {
      const donationRes = await axios.get(`${API_BASE}/api/donation-items/user`, { headers });
      console.log("Donation items fetched:", donationRes.data.map(item => ({ _id: item._id, sold: item.sold })));
      setDonationItems(donationRes.data);
    } catch (err) {
      setError("Failed to load donation items: " + err.message);
      console.error("Donation fetch error:", err);
    }

    setLoading(false);
  };

  const handleDelete = async (id, itemType) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("Please log in to delete items.");
      return;
    }

    const endpoint = itemType === "trade"
      ? `${API_BASE}/api/trade-items/delete/${id}`
      : `${API_BASE}/api/donation-items/delete/${id}`;

    try {
      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete item");
      setSuccess("Item deleted successfully!");
      setError("");
      fetchItems();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Delete error:", err);
      setError("Failed to delete item: " + err.message);
    }
  };

  const handleMarkSold = async (id, itemType) => {
    if (!window.confirm("Are you sure you want to mark this item as sold?")) return;
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("Please log in to mark items as sold.");
      return;
    }

    const endpoint = itemType === "trade"
      ? `${API_BASE}/api/trade-items/mark-sold/${id}`
      : `${API_BASE}/api/donation-items/mark-sold/${id}`;

    // Optimistically update UI
    const prevTradeItems = [...tradeItems];
    const prevDonationItems = [...donationItems];
    if (itemType === "trade") {
      setTradeItems(prev =>
        prev.map(item => (item._id === id ? { ...item, sold: true } : item))
      );
    } else {
      setDonationItems(prev =>
        prev.map(item => (item._id === id ? { ...item, sold: true } : item))
      );
    }

    try {
      console.log(`Sending mark sold for ${itemType} item:`, id);
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log(`Mark sold response (${itemType}):`, data);
      if (!res.ok) throw new Error(data.message || "Failed to mark item as sold");
      setSuccess("Item marked as sold!");
      setError("");
      // Update state with backend response
      if (itemType === "trade") {
        setTradeItems(prev =>
          prev.map(item => (item._id === id ? { ...item, ...data.item, sold: true } : item))
        );
      } else {
        setDonationItems(prev =>
          prev.map(item => (item._id === id ? { ...item, ...data.item, sold: true } : item))
        );
      }
      console.log("Updated state after mark sold:", {
        tradeItems: itemType === "trade" ? tradeItems.map(item => ({ _id: item._id, sold: item.sold })) : undefined,
        donationItems: itemType === "donation" ? donationItems.map(item => ({ _id: item._id, sold: item.sold })) : undefined,
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(`❌ Mark sold error (${itemType}):`, err.message);
      setError(`Failed to mark item as sold: ${err.message}`);
      // Revert optimistic update
      if (itemType === "trade") {
        setTradeItems(prevTradeItems);
      } else {
        setDonationItems(prevDonationItems);
      }
      setTimeout(() => setError(""), 3000);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <div className="container mt-4">
      <h2>My Posts</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

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
                    {item.sold === true && (
                      <Badge bg="success" className="sold-badge">
                        Sold
                      </Badge>
                    )}
                  </div>
                  <div className="card-actions">
                    <Link to={`/account/post-trade/${item._id}`} className="button-wrapper">
                      <Button variant="warning" size="sm" className="action-button">
                        Edit
                      </Button>
                    </Link>
                    <div className="button-wrapper">
                      <Button
                        variant="danger"
                        size="sm"
                        className="action-button"
                        onClick={() => handleDelete(item._id, "trade")}
                      >
                        Delete
                      </Button>
                    </div>
                    {!item.sold && (
                      <div className="button-wrapper">
                        <Button
                          variant="success"
                          size="sm"
                          className="action-button"
                          onClick={() => handleMarkSold(item._id, "trade")}
                        >
                          Mark as Sold
                        </Button>
                      </div>
                    )}
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
                    {item.sold === true && (
                      <Badge bg="success" className="sold-badge">
                        Sold
                      </Badge>
                    )}
                  </div>
                  <div className="card-actions">
                    <Link to={`/account/post-donation/${item._id}`} className="button-wrapper">
                      <Button variant="warning" size="sm" className="action-button">
                        Edit
                      </Button>
                    </Link>
                    <div className="button-wrapper">
                      <Button
                        variant="danger"
                        size="sm"
                        className="action-button"
                        onClick={() => handleDelete(item._id, "donation")}
                      >
                        Delete
                      </Button>
                    </div>
                    {!item.sold && (
                      <div className="button-wrapper">
                        <Button
                          variant="success"
                          size="sm"
                          className="action-button"
                          onClick={() => handleMarkSold(item._id, "donation")}
                        >
                          Mark as Sold
                        </Button>
                      </div>
                    )}
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
