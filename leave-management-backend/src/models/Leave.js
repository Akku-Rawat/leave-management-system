const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const LeaveRequest = sequelize.define("LeaveRequest", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: DataTypes.STRING,
  start: DataTypes.DATEONLY,
  end: DataTypes.DATEONLY,
  days: DataTypes.INTEGER,
  status: DataTypes.STRING,
  reason: DataTypes.TEXT,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

module.exports = LeaveRequest;
