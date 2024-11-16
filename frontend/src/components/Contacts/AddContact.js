import React, { useState } from 'react';
import axios from '../../api/axiosInstance';

const AddContact = () => {
  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [tags, setTags] = useState('');

  const handleAddContact = async (e) => {
    e.preventDefault();

    if (!contactName || !phoneNumber) {
      alert('Contact Name and Phone Number are required');
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const response = await axios.post(
        '/contacts',
        { contactName, phoneNumber, email, address, tags: tags.split(',') },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message || 'Contact added successfully');
      setContactName('');
      setPhoneNumber('');
      setEmail('');
      setAddress('');
      setTags('');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add contact');
    }
  };

  return (
    <form onSubmit={handleAddContact}>
      <h2>Add Contact</h2>
      <input
        type="text"
        placeholder="Contact Name"
        value={contactName}
        onChange={(e) => setContactName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email (optional)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Address (optional)"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tags (comma-separated, optional)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <button type="submit">Add Contact</button>
    </form>
  );
};

export default AddContact;
