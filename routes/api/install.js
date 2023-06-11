var express = require('express');
var router = express.Router();
const { createDatabase, createDefaultUsers, createDefaultProfiles, createDefaultPosts, createDefaultComments, checkInstallationStatus } = require('../../controllers/installController')

router.get('/', async function (req, res, next) {
    try {
        await createDatabase()
        const installationStatus = await checkInstallationStatus()
        if (installationStatus)
            return res.status(406).json({ debug: "Instalação já foi realizada" })

        await createDatabase(true)
        await createDefaultUsers()
        await createDefaultProfiles()
        await createDefaultPosts()
        await createDefaultComments()

        return res.json({ debug: "Instalado" })
    } catch (error) {
        console.error("Erro ao instalar o sistema: ", error)
        return res.status(500).json({ error: "Erro ao instalar o sistema" })
    }
})

module.exports = router