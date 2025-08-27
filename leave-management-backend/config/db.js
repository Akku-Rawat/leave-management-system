const mysql = require('mysql2');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Root',
  database: 'leave_portal'
});
module.exports = pool.promise(); // promisify queries ke liye
