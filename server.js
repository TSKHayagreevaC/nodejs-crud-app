const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3010;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/nodejscrudapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Middleware
app.use(bodyParser.json());

// Define a basic schema and model
    const ItemSchema = new mongoose.Schema({
    name: String,
    description: String
    });

const Item = mongoose.model('Item', ItemSchema);

// CRUD Operations

// Create an item
app.post('/items', (req, res) => {
  const newItem = new Item(req.body);
  newItem.save((err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(newItem);
  });
});

// Read all items
app.get('/items', (req, res) => {
  Item.find({}, (err, items) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(items);
  });
});

// Update an item by ID
app.put('/items/:id', (req, res) => {
  Item.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, item) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(item);
    }
  );
});

// Delete an item by ID
app.delete('/items/:id', (req, res) => {
  Item.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Item deleted successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
