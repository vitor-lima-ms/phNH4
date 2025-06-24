const { DataTypes } = require("sequelize");

const db = require("../db/conn");

const Sample = db.define("Sample", {
  importId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  ph: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nh4: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});

module.exports = Sample;
