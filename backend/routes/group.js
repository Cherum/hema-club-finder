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
  db_groups.all('SELECT * FROM groups ORDER BY name, state_long, city', (err, rows) => {
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


router.delete('/all', function (req, res, next) {
  db_groups.run('DELETE FROM groups', (err) => {
    if (err) {
      console.error('Error deleting groups:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json({ message: 'All Groups deleted' });
    }
  });
});

router.delete('/:id', function (req, res, next) {
  // delete a group from a sqlite database
  const { id } = req.params;
  if (!id || isNaN(id) || !Number.isInteger(Number(id))) {
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

router.post('/add_multi', async function (req, res, next) {
  try {
    const groupsToAdd = req.body;

    if (!Array.isArray(groupsToAdd)) {
      return res.status(400).json({ error: 'Invalid request format. Expected an array of groups.' });
    }

    const results = await Promise.all(
      groupsToAdd.map(async (group) => {
        const { name, street, city, website, facebook, federation_member } = group;

        if (!name || !city) {
          return { status: 400, message: `Missing required parameters for group: ${name}` };
        }

        const existingGroup = await getGroupByName(name);

        if (existingGroup) {
          return { status: 400, message: `Group already exists: ${name}` };
        }

        const groupId = await insertGroup(name, street, city, website, facebook, federation_member);
        const geocodeResult = await geocodeGroup(name, street, city);

        if (geocodeResult) {
          await updateGroupWithGeocoding(groupId, geocodeResult);
        }

        return { status: 200, message: `Group added with id ${groupId}` };
      })
    );

    const response = results.reduce((acc, result) => {
      if (result.status === 200) {
        acc.success.push(result.message);
      } else {
        acc.errors.push(result.message);
      }
      return acc;
    }, { success: [], errors: [] });

    res.json(response);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(error.status || 500).json({ error: 'Internal server error' });
  }
});

router.post('/', async function (req, res, next) {
  try {
    const { name, street, city, website, facebook, federation_member } = req.body;

    if (!name || !city || !federation_member) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const existingGroup = await getGroupByName(name);

    if (existingGroup) {
      return res.status(400).json({ error: 'Group already exists' });
    }

    const groupId = await insertGroup(name, street, city, website, facebook, federation_member);
    const geocodeResult = await geocodeGroup(name, street, city);

    if (!geocodeResult || !Array.isArray(geocodeResult) || geocodeResult.length === 0) {
      console.warn('No geocoding result for group:', name);
    } else {
      await updateGroupWithGeocoding(groupId, geocodeResult);
    }

    res.json({ message: 'Group added with id ' + groupId });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(error.status || 500).json({ error: 'Internal server error' });
  }
});

async function getGroupByName(name) {
  return new Promise((resolve, reject) => {
    db_groups.get('SELECT * FROM groups WHERE name = ?', [name], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

async function insertGroup(name, street, city, website, facebook, federation_member) {
  return new Promise((resolve, reject) => {
    db_groups.run(
      'INSERT INTO groups (name, street, city, website, facebook, federation_member) VALUES (?, ?, ?, ?, ?, ?)',
      [name, street, city, website, facebook, federation_member],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
}

async function geocodeGroup(name, street, city) {
  const nameString = name ? name + ', ' : ''
  const streetString = street ? street + ', ' : ''
  const toGeoCode = nameString + streetString + city

  console.log("Geocode: ", toGeoCode)
  return geocoder(toGeoCode);
}

async function updateGroupWithGeocoding(groupId, geocodeResult) {
  if (!geocodeResult || !Array.isArray(geocodeResult) || geocodeResult.length === 0) {
    return Promise.reject(new Error('Invalid or empty geocodeResult'));
  }

  return new Promise((resolve, reject) => {
    db_groups.run(
      'UPDATE groups SET latitude = ?, longitude = ?, state_short = ?, state_long = ? WHERE id = ?',
      [
        geocodeResult[0].latitude,
        geocodeResult[0].longitude,
        geocodeResult[0].administrativeLevels.level1short,
        geocodeResult[0].administrativeLevels.level1long,
        groupId,
      ],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}


module.exports = router;
