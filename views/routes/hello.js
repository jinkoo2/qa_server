const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('hello', { title: 'My Express App' });
});

module.exports = router;
