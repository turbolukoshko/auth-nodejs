const Router = require('express');
const { check } = require('express-validator');
const router = new Router();
const AuthController = require('./authController.js');
const roleMiddleware = require('./middleware/roleMiddleware');

router.post('/registration', [
  check('username', 'Username cannot be empty').notEmpty(),
  check('password', 'Password should be more than 4 equal').isLength({min: 4}),
], AuthController.registration);
router.post('/login', AuthController.login);
router.get('/users', roleMiddleware(['USER', 'ADMIN']), AuthController.getUsers);

module.exports = router;
