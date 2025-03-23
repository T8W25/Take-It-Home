import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationList = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:3000/api/notifications/${userId}`)
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error('❌ Fetch failed:', err));
  }, [userId]);

  return (
    <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3>🔔 Notifications</h3>
      {notifications.length === 0 ? (
        <p>No notifications yet</p>
      ) : (
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {notifications.map((note) => (
            <li key={note._id} style={{ marginBottom: '0.5rem' }}>
              {note.message}<br />
              <small>{new Date(note.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
