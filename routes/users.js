const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authentication } = require('../middlewares/authentication');

router.get('/',authentication, UserController.getAll)
router.post('/register',UserController.create)
router.post('/login',UserController.login)
router.get('/confirm/:emailToken',UserController.confirm)
router.put('/id/:id',authentication,UserController.update)
router.delete('/logout',authentication,UserController.logout)


module.exports = router;
