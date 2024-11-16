import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Truecaller = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contactName, setContactName] = useState('');
  const [searchPhoneNumber, setSearchPhoneNumber] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [allContacts, setAllContacts] = useState([]);
  const [deletePhoneNumber, setDeletePhoneNumber] = useState('');

  // Function to handle adding a contact
  const handleAddContact = async () => {
    if (!phoneNumber || !contactName) {
      alert('Please provide both phone number and contact name');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/contacts', {
        phoneNumber,
        contactName,
      });
      alert(response.data.message);
      setPhoneNumber('');
      setContactName('');
    } catch (error) {
      console.error('Error adding contact:', error);
      alert('Failed to add contact');
    }
  };

  // Function to handle searching a contact
  const handleSearchContact = async () => {
    if (!searchPhoneNumber) {
      alert('Please provide a phone number to search');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3000/contacts/${searchPhoneNumber}`);
      setSearchResult(response.data.contactName);
    } catch (error) {
      console.error('Error searching contact:', error);
      alert('Failed to search for contact');
    }
  };

  // Fetch all contacts when the component mounts
  useEffect(() => {
    const fetchAllContacts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/contacts');
        setAllContacts(response.data);
      } catch (error) {
        console.error('Error fetching all contacts:', error);
        alert('Error fetching all contacts');
      }
    };
    fetchAllContacts();
  }, []);

  // Function to handle showing all contacts
  const handleViewAllContacts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/contacts');
      setAllContacts(response.data);
    } catch (error) {
      console.error('Error fetching all contacts:', error);
      alert('Error fetching all contacts');
    }
  };

  // Function to handle deleting a contact
  const handleDeleteContact = async () => {
    if (!deletePhoneNumber) {
      alert('Please provide a phone number to delete');
      return;
    }
    try {
      const response = await axios.delete(`http://localhost:3000/contacts/${deletePhoneNumber}`);
      alert(response.data.message);
      setDeletePhoneNumber('');
      handleViewAllContacts(); // Refresh contacts after deletion
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete contact');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-center text-3xl text-gray-700 mb-6">Truecaller App</h1>

      {/* Add Contact */}
      <section className="mb-8">
        <h2 className="text-xl text-gray-600 mb-4">Add Contact</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-lg"
          />
          <input
            type="text"
            placeholder="Contact Name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md text-lg"
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleAddContact}
            className="w-full max-w-xs mx-auto mt-4 py-3 bg-green-500 text-white rounded-md text-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            Add Contact
          </button>
        </div>
      </section>

      {/* Search Contact */}
      <section className="mb-8">
        <h2 className="text-xl text-gray-600 mb-4">Search Contact</h2>
        <input
          type="text"
          placeholder="Phone Number"
          value={searchPhoneNumber}
          onChange={(e) => setSearchPhoneNumber(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md text-lg w-full mb-4"
        />
        <div className="flex justify-center">
          <button
            onClick={handleSearchContact}
            className="w-full max-w-xs mx-auto py-3 bg-blue-500 text-white rounded-md text-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Search
          </button>
        </div>
        {searchResult !== null && (
          <p className="mt-4 text-xl text-gray-700">
            {searchResult !== 'Number not found'
              ? `Contact Name: ${searchResult}`
              : 'Contact not found'}
          </p>
        )}
      </section>

      {/* View All Contacts */}
      <section className="mb-8">
        <h2 className="text-xl text-gray-600 mb-4">All Contacts</h2>
        <div className="flex justify-center">
          <button
            onClick={handleViewAllContacts}
            className="w-full max-w-xs mx-auto py-3 bg-purple-500 text-white rounded-md text-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            View All Contacts
          </button>
        </div>
        <ul className="mt-4 text-lg text-gray-700">
          {allContacts.length > 0 ? (
            allContacts.map((contact, index) => (
              <li key={index}>
                {contact.phoneNumber}: {contact.contactName}
              </li>
            ))
          ) : (
            <p>No contacts found</p>
          )}
        </ul>
      </section>

      {/* Delete Contact */}
      <section className="mb-8">
        <h2 className="text-xl text-gray-600 mb-4">Delete Contact</h2>
        <input
          type="text"
          placeholder="Phone Number"
          value={deletePhoneNumber}
          onChange={(e) => setDeletePhoneNumber(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md text-lg w-full mb-4"
        />
        <div className="flex justify-center">
          <button
            onClick={handleDeleteContact}
            className="w-full max-w-xs mx-auto py-3 bg-red-500 text-white rounded-md text-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            Delete Contact
          </button>
        </div>
      </section>
    </div>
  );
};

export default Truecaller;
