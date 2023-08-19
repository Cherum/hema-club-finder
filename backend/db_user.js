const sqlite3 = require('sqlite3').verbose();
// Initialize SQLite database
const db_user = new sqlite3.Database('mydatabase.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create a table if it doesn't exist
        db_user.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT NOT NULL,
      email TEXT NOT NULL
    )`, (tableErr) => {
            if (tableErr) {
                console.error('Error creating table:', tableErr.message);
            } else {
                console.log('Table "users" is ready.');
            }
        });
    }
});
module.exports = db_user;