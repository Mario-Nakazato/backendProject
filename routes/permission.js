var express = require('express');
var router = express.Router();
const authenticate = require('../middlewares/authenticate')
const permission = require('../middlewares/permission')

router.get('/:username', authenticate, permission, function (req, res, next) {
    const { username } = req.params
    res.json({ debug: "Acesso a informação confidencial", payload: req.user, username })
})

module.exports = router
