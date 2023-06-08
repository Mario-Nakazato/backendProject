var express = require('express');
var router = express.Router();
const authenticate = require('../middlewares/authenticate')

router.get('/', authenticate, function (req, res, next) {
    res.json({ debug: "Informação protegida", payload: req.user })
});

module.exports = router;
