const Sequelize = require("sequelize")

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.SQLITE_STORAGE
})

sequelize.authenticate()
    .then(() => {
        console.log("Conexão estabelecida com sucesso.")
    })
    .catch((error) => {
        console.error("Erro ao conectar com o banco de dados: ", error)
    });

module.exports = sequelize