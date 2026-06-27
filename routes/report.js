const router = require('express').Router();
const ctrl = require('../controllers/reportController');
const auth = require('../middleware/auth');

router.get('/', auth, ctrl.getReport);

module.exports = router;