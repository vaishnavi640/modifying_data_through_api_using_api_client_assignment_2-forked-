const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express();
const port = 3000;

app.use(express.static('static'));
dotenv.config(); 

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Database"))
  .catch(err => console.log("Error connecting to MongoDB Database:", err));


app.put('/menu/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      id, 
      { name, description, price },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).send('Menu item not found.');
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(400).send('Error updating menu item: ' + err.message);
  }
});

app.delete('/menu/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedItem = await MenuItem.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).send('Menu item not found.');
    }

    res.send('Menu item deleted successfully.');
  } catch (err) {
    res.status(400).send('Error deleting menu item: ' + err.message);
  }
});



app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});