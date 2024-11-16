import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';

const Favourites = () => {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/favorites', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(response.data.favorites || []);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to fetch favorites');
    }
  };

  const addToFavorites = async (phoneNumber) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/favorites',
        { phoneNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Added to favorites successfully');
      fetchFavorites();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add to favorites');
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div>
      <h2>Favourites</h2>
      <ul>
        {favorites.map((fav) => (
          <li key={fav.id}>
            <p>Phone: {fav.phoneNumber}</p>
            <p>Added At: {new Date(fav.addedAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favourites;
