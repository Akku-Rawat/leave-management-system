const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "shivangi@23",
  database: "leave_management",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected");
});

app.post("/leave-request", (req, res) => {
  const {
    user_id,
    type,
    duration,
    start_date,
    end_date,
    reason,
    emergency_contact,
    days,
  } = req.body;

  const sql =
    "INSERT INTO leave_requests (user_id, type, duration, start_date, end_date, reason, emergency_contact, days, submitted_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), 'Pending')";

  db.query(
    sql,
    [user_id, type, duration, start_date, end_date, reason, emergency_contact, days],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(201).json({ message: "Leave request submitted", id: result.insertId });
    }
  );
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
