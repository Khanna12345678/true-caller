import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('/contacts');
        setContacts(response.data.contacts);
      } catch (error) {
        alert('Failed to fetch contacts');
      }
    };
    fetchContacts();
  }, []);

  return (
    <div>
      <h2>Your Contacts</h2>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.contactName} - {contact.phoneNumber}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactsList;
