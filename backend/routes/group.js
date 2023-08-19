var express = require('express');
var router = express.Router();
var db_user = require('../db_group');
const db_groups = require('../db_group');
const geocoder = require('../geocoder');

router.get('/:id', function (req, res, next) {
  // get single group from db and return json
  const { id } = req.params;
  db_groups.get('SELECT * FROM groups WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching group:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(row);
    }
  });
});

// get all groups from db
router.get('/', function (req, res, next) {
  // get all groups from db and return as json
  db_groups.all('SELECT * FROM groups', (err, rows) => {
    if (err) {
      console.error('Error fetching groups:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.header("Access-Control-Allow-Origin", "*");
      res.json(rows);
    }
  });
});

router.put('/:id', function (req, res, next) {
  const { id } = req.params;
  const { name, street, city, website, facebook, federation_member } = req.body;
  if (!id || !name || !city) {
    res.status(400).json({ error: 'Missing required parameters' });
  } else {
    db_groups.run('UPDATE groups SET name = ?, street = ?, city = ?, website = ?, facebook = ?, federation_member = ? WHERE id = ?', [name, street, city, website, facebook, federation_member, id], (err) => {
      if (err) {
        console.error('Error updating group:', err.message);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json({ message: 'Group updated' });
      }
    });
  }
});

router.delete('/:id', function (req, res, next) {
  // delete a group from a sqlite database
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'Missing required parameters' });
  } else {
    db_groups.run('DELETE FROM groups WHERE id = ?', [id], (err) => {
      if (err) {
        console.error('Error deleting group:', err.message);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json({ message: 'Group deleted' });
      }
    });
  }
});

router.post('/', function (req, res, next) {
  // add a new group to a sqlite database
  const { name, street, city, website, facebook, federation_member } = req.body;
  if (!name || !city || !federation_member) {
    res.status(400).json({ error: 'Missing required parameters' });
  } else {
    // check if group already exists
    db_groups.get('SELECT * FROM groups WHERE name = ?', [name], (err, row) => {
      if (err) {
        console.error('Error fetching group:', err.message);
        res.status(500).json({ error: 'Internal server error' });
      } else if (row) {
        res.status(400).json({ error: 'Group already exists' });
      } else {
        // group doesn't exist, insert new group
        db_groups.run('INSERT INTO groups (name, street, city, website, facebook, federation_member) VALUES (?, ?, ?, ?, ?, ?)', [name, street, city, website, facebook, federation_member], function (err) {
          if (err) {
            console.error('Error inserting group:', err.message);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            console.log("Inserted group with id", this.lastID)
            geocoder(name + ", " + street + " ," + city).then((geocoderes) => {
              console.log("result:", geocoderes)
              // update group with geocoding results
              db_groups.run('UPDATE groups SET latitude = ?, longitude = ?, state = ? WHERE id = ?', [geocoderes[0].latitude, geocoderes[0].longitude, geocoderes[0].administrativeLevels.level1short, this.lastID], (err) => {
                if (err) {
                  console.error('Error updating group:', err.message);
                } else {
                  console.log("Updated group with id", this.lastID)
                }
              });
            });
            // console.log("result:", geocoderes)
            res.json({ message: 'Group added with id ' + this.lastID });
          }
        });
      }
    });
  }
});

module.exports = router;
