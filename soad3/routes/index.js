const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index1');
});

module.exports = router;