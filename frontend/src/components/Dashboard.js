import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => (
  <div>
    <h1>Contact Manager Dashboard</h1>
    <nav>
      <Link to="/contacts">Contacts</Link> | 
      <Link to="/calls">Call History</Link> | 
      <Link to="/favorites">Favorites</Link>
    </nav>
  </div>
);

export default Dashboard;
