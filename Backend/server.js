import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

class TrieNode {
  constructor() {
    this.children = new Array(10).fill(null);  // Digits 0-9
    this.isEndOfNumber = false;
    this.contactName = "";
    this.isSpam = false;  // New property to mark spam numbers
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
    this.phoneToNameMap = new Map();
    this.spamNumbers = new Set(); // For efficient spam checking
  }

  // Insert phone number and contact name into the trie
  insert(phoneNumber, contactName, isSpam = false) {
    let node = this.root;
    for (let digit of phoneNumber) {
      let index = parseInt(digit);
      if (!node.children[index]) {
        node.children[index] = new TrieNode();
      }
      node = node.children[index];
    }
    node.isEndOfNumber = true;
    node.contactName = contactName;
    node.isSpam = isSpam;
    this.phoneToNameMap.set(phoneNumber, contactName);
    if (isSpam) {
      this.spamNumbers.add(phoneNumber);
    }
  }

  // Bulk insert multiple contacts
  bulkInsert(contactsArray) {
    const results = {
      successful: 0,
      failed: 0,
      failures: []
    };

    for (const contact of contactsArray) {
      try {
        this.insert(contact.phoneNumber, contact.contactName, contact.isSpam || false);
        results.successful++;
      } catch (error) {
        results.failed++;
        results.failures.push({
          contact: contact,
          error: error.message
        });
      }
    }

    return results;
  }

  // Get contact suggestions based on prefix
  getSuggestions(prefix) {
    const suggestions = [];
    let node = this.root;

    // Navigate to the node corresponding to the prefix
    for (let digit of prefix) {
      let index = parseInt(digit);
      if (!node.children[index]) {
        return suggestions; // No matches found
      }
      node = node.children[index];
    }

    // Helper function to find all numbers under this node
    const findNumbers = (currentNode, currentNumber) => {
      if (currentNode.isEndOfNumber) {
        suggestions.push({
          phoneNumber: currentNumber,
          contactName: currentNode.contactName,
          isSpam: currentNode.isSpam
        });
      }

      for (let i = 0; i < 10; i++) {
        if (currentNode.children[i]) {
          findNumbers(currentNode.children[i], currentNumber + i);
        }
      }
    };

    findNumbers(node, prefix);
    return suggestions;
  }

  // Mark a number as spam
  markAsSpam(phoneNumber) {
    let node = this.root;
    for (let digit of phoneNumber) {
      let index = parseInt(digit);
      if (!node.children[index]) {
        return false; // Number not found
      }
      node = node.children[index];
    }
    
    if (node.isEndOfNumber) {
      node.isSpam = true;
      this.spamNumbers.add(phoneNumber);
      return true;
    }
    return false;
  }

  // Check if a number is marked as spam
  isSpam(phoneNumber) {
    return this.spamNumbers.has(phoneNumber);
  }

  // Existing methods remain the same...
  search(phoneNumber) {
    let node = this.root;
    for (let digit of phoneNumber) {
      let index = parseInt(digit);
      if (!node.children[index]) {
        return "Number not found";
      }
      node = node.children[index];
    }
    if (node.isEndOfNumber) {
      return {
        contactName: node.contactName,
        isSpam: node.isSpam
      };
    }
    return "Number not found";
  }

  // Modified delete method to handle spam status
  deleteContact(phoneNumber) {
    let node = this.root;
    let path = [];
    let found = true;

    for (let digit of phoneNumber) {
      let index = parseInt(digit);
      if (!node.children[index]) {
        found = false;
        break;
      }
      path.push({ node, index });
      node = node.children[index];
    }

    if (found && node.isEndOfNumber) {
      node.isEndOfNumber = false;
      node.contactName = '';
      node.isSpam = false;
      this.phoneToNameMap.delete(phoneNumber);
      this.spamNumbers.delete(phoneNumber);
      return true;
    }
    return false;
  }
}

const contacts = new Trie();

app.use(cors());
app.use(express.json());

// Existing endpoints...

// New endpoint for bulk insert
app.post('/contacts/bulk', (req, res) => {
  const { contacts: contactsArray } = req.body;
  
  if (!Array.isArray(contactsArray)) {
    return res.status(400).json({ 
      message: "Invalid input. Expected an array of contacts" 
    });
  }

  try {
    const results = contacts.bulkInsert(contactsArray);
    res.status(201).json({
      message: 'Bulk insert completed',
      results: results
    });
  } catch (error) {
    console.error('Error in bulk insert:', error);
    res.status(500).json({ 
      message: "Failed to perform bulk insert",
      error: error.message 
    });
  }
});

// New endpoint for getting suggestions
app.get('/contacts/suggestions/:prefix', (req, res) => {
  const { prefix } = req.params;
  
  if (!prefix) {
    return res.status(400).json({ 
      message: "Prefix is required" 
    });
  }

  try {
    const suggestions = contacts.getSuggestions(prefix);
    res.json({
      suggestions: suggestions,
      count: suggestions.length
    });
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({ 
      message: "Failed to get suggestions",
      error: error.message 
    });
  }
});

// New endpoint for marking a number as spam
app.post('/contacts/spam/:phoneNumber', (req, res) => {
  const { phoneNumber } = req.params;
  
  if (!phoneNumber) {
    return res.status(400).json({ 
      message: "Phone number is required" 
    });
  }

  try {
    const marked = contacts.markAsSpam(phoneNumber);
    if (marked) {
      res.json({ message: 'Number marked as spam' });
    } else {
      res.status(404).json({ message: 'Number not found' });
    }
  } catch (error) {
    console.error('Error marking number as spam:', error);
    res.status(500).json({ 
      message: "Failed to mark number as spam",
      error: error.message 
    });
  }
});

// New endpoint for checking spam status
app.get('/contacts/spam/:phoneNumber', (req, res) => {
  const { phoneNumber } = req.params;
  
  if (!phoneNumber) {
    return res.status(400).json({ 
      message: "Phone number is required" 
    });
  }

  try {
    const isSpam = contacts.isSpam(phoneNumber);
    res.json({ isSpam });
  } catch (error) {
    console.error('Error checking spam status:', error);
    res.status(500).json({ 
      message: "Failed to check spam status",
      error: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});