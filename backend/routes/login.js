var express = require('express');
const { SHA256 } = require('crypto-js');
var db_user = require('../db_user');

var router = express.Router();

router.post('/', function (req, res) {
  const { username, password_hash } = req.body;

  // Check if the user exists in the database
  const query = 'SELECT id FROM users WHERE username = ? AND password_hash = ?';
  db_user.get(query, [username, password_hash], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (row) {
        // User found, send success response
        res.status(200).json({ message: 'Login successful' });
      } else {
        // User not found or incorrect password, send error response
        console.log('User not found or incorrect password');
        res.status(404).json({ error: 'Invalid credentials or User not found' });
      }
    }
  });
});

module.exports = router;
