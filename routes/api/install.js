var express = require('express');
var router = express.Router();
const DataTypes = require("sequelize")
const sequelize = require("../../database/sqliteDB")

router.get('/', async function (req, res, next) {
    try {
        await sequelize.sync({ force: true })
        res.json({ debug: "install" })
    } catch (error) {
        console.error("Erro ao sincronizar o banco de dados: ", error)
        res.status(500).json({ error: "Erro ao sincronizar o banco de dados" })
    }
});

module.exports = router;
