var express = require('express');
var router = express.Router();
const DataTypes = require("sequelize")
const sequelize = require("../../database/sqliteDB")

router.get('/', async function (req, res, next) {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
    await sequelize.sync({ force: true })
    await User.create({
        username: "Usuario",
        password: "senha"
    })
    res.json({ debug: "install" })
});

module.exports = router;
