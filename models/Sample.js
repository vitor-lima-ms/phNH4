const { DataTypes } = require("sequelize");

const db = require("../db/conn");

const Project = require("./Project");

const Sample = db.define("Sample", {
  importId: {
    type: DataTypes.UUID,
    allowNull: true,
    defaultValue: null,
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false,
  },
});

Sample.belongsTo(Project);
Project.hasMany(Sample);

module.exports = Sample;
