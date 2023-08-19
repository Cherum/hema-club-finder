const sqlite3 = require('sqlite3').verbose();
// Initialize SQLite database
const db_groups = new sqlite3.Database('mydatabase.db', (err) => {
    // delete db before creating new one
    // db_groups.run('DROP TABLE IF EXISTS groups');
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create a table if it doesn't exist
        db_groups.run(`CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      street TEXT NULL,
      city TEXT NOT NULL,
      website TEXT NULL,
      facebook TEXT NULL,
      federation_member BOOLEAN NOT NULL,
      state_short TEXT NULL,
      state_long TEXT NULL,
      latitude REAL NULL,
      longitude REAL NULL
    )`, (tableErr) => {
            if (tableErr) {
                console.error('Error creating table:', tableErr.message);
            } else {
                console.log('Table "groups" is ready.');
            }
        });
    }
});
module.exports = db_groups;
