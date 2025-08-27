const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');


// similarly leaveRoutes if ready

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/leave-records', leaveRoutes);

app.get('/', (req, res) => {
  res.send('Leave Management System Backend Running');
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
