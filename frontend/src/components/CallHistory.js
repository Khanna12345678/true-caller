import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';

const CallHistory = () => {
  const [callHistory, setCallHistory] = useState([]);

  const fetchCallHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/calls', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCallHistory(response.data.calls || []);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to fetch call history');
    }
  };

  useEffect(() => {
    fetchCallHistory();
  }, []);

  return (
    <div>
      <h2>Call History</h2>
      <ul>
        {callHistory.map((call) => (
          <li key={call.id}>
            <p>Phone: {call.phoneNumber}</p>
            <p>Type: {call.callType}</p>
            <p>Duration: {call.duration} mins</p>
            <p>Date: {new Date(call.timestamp).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CallHistory;
