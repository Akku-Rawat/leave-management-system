const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('leave_management', 'root', 'shivangi@23', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
