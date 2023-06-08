var express = require('express');
var router = express.Router();
const authenticate = require('../middlewares/authenticate')
const checkOver = require('../middlewares/checkOver')

router.get('/:username', authenticate, checkOver, function (req, res, next) {
    const { username } = req.params
    res.json({ debug: "Informação confidencial", payload: req.user, username })
});

module.exports = router;
