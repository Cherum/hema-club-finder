var express = require('express');
var router = express.Router();
var db_user = require('../db_user');
const { SHA256 } = require('crypto-js');

/* GET users listing. */
router.get('/', function (req, res, next) {
  db_user.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      console.error('Error fetching users:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(rows);
    }
  });
});

// get single user from db
router.get('/:id', function (req, res, next) {
  const { id } = req.params;
  db_user.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching user:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(row);
    }
  });
});

router.post('/', function (req, res, next) {
  const { username, email, password } = req.body;

  const hashedPassword = SHA256(password).toString();
  if (!username || !email) {
    res.status(400).json({ error: 'Missing required parameters' });
  } else {
    db_user.run('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, hashedPassword], (err) => {
      if (err) {
        console.error('Error inserting user:', err.message);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json({ message: 'User added' });
      }
    });
  }
});

module.exports = router;
