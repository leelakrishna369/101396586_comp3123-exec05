const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();

// Middleware to parse JSON body
app.use(bodyParser.json());

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

/*
- Serve home.html when the /home route is accessed
*/
router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html')); // Ensure home.html is in the 'public' folder
});

/*
- Return details from user.json as JSON format for /profile route
*/
router.get('/profile', (req, res) => {
  const userFilePath = path.join(__dirname, 'user.json');
  fs.readFile(userFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Server Error' });
    }
    res.json(JSON.parse(data));
  });
});

/*
- Login route that accepts username and password as JSON body parameters
*/
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const userFilePath = path.join(__dirname, 'user.json');
  
  fs.readFile(userFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Server Error' });
    }
    
    const users = JSON.parse(data);
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return res.json({
        status: false,
        message: 'User Name is invalid'
      });
    }
    
    if (user.password !== password) {
      return res.json({
        status: false,
        message: 'Password is invalid'
      });
    }
    
    res.json({
      status: true,
      message: 'User Is valid'
    });
  });
});

/*
- Logout route that accepts username as a URL parameter and displays a message
*/
router.get('/logout/:username', (req, res) => {
  const { username } = req.params;
  res.send(`<b>${username} successfully logged out.</b>`);
});

/*
- Error handling middleware to handle errors and return a 500 page
*/
app.use((err, req, res, next) => {
  res.status(500).send('Server Error');
});

app.use('/', router);

// Start the server
const PORT = process.env.port || 8081;
app.listen(PORT, () => {
  console.log(`Web Server is listening at port ${PORT}`);
});