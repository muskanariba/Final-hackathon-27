const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// User model
const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
}));

// Signup route
app.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ error: 'Error signing up' });
  }
});
app.post('/login', async (req, res) => {
    console.log('Received data:', req.body); // Log the data
    try {
      const { email, password } = req.body;
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send('User not found');
      }
  
      // Compare the password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).send('Invalid credentials');
      }
  
      // If login is successful:
      res.status(200).send('Login successful!');
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  

  // Task Model
const Task = mongoose.model('Task', new mongoose.Schema({
    title: String,
    description: String,
    assignedTo: String,
    status: String,
  }));
  
  // Routes
  
  // Get all tasks
  app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
  });
  
  // Add new task
  app.post('/tasks', async (req, res) => {
    const { title, description, assignedTo, status } = req.body;
    const newTask = new Task({ title, description, assignedTo, status });
    await newTask.save();
    res.status(201).json(newTask);
  });
  
  // Update task status
  app.put('/tasks/:id', async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  });

  
  
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
