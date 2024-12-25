const express = require('express');
const router = express.Router();
const{createUser,loginUser, getAllUser, getSingleUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout}= require('../controllers/userController');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');
router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/all-users',authMiddleware,isAdmin,getAllUser);
router.get('/refresh',handleRefreshToken);

router.get('/logout',logout);
router.get('/getauser',authMiddleware,getSingleUser);
router.post('/delete-user',authMiddleware,deleteUser);
router.put('/edit-user',authMiddleware,updateUser);
router.put('/block-user/:id',authMiddleware,isAdmin,blockUser);
router.put('/unblock-user/:id',authMiddleware,isAdmin,unblockUser);


module.exports = router