const express = require('express');
router = express.Router();

router.get('/', (req, res) => {
    res.status(400).json({error:'Tags parameter is required'})
})

module.exports = router;