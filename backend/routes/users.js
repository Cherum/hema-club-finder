var express = require('express');
var router = express.Router();
var db_user = require('../db_user');

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
  const { username, email } = req.body;
  if (!username || !email) {
    res.status(400).json({ error: 'Missing required parameters' });
  } else {
    db_user.run('INSERT INTO users (username, email) VALUES (?, ?)', [username, email], (err) => {
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
