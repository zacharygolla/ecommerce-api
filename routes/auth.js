const express = require('express');
const { register, 
        login, 
        getCurrentUser, 
        updateCurrentUser, 
        forgotPassword, 
        resetPassword, 
        updatePassword,
        logout 
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/currentuser', protect, getCurrentUser);
router.put('/currentuser', protect, updateCurrentUser);
router.post('/forgotpassword', protect, forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatepassword', protect, updatePassword);
router.get('/logout', protect, logout);


module.exports = router;

