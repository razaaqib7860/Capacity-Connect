const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const verifyToken = require('../middleware/auth');

router.get('/competency-analysis', verifyToken, aiController.analyzeGap);
router.post('/trainer-match-explanation', verifyToken, aiController.explainTrainerMatch);

module.exports = router;
