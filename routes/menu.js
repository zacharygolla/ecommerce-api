const express = require('express');
const { 
    getMenu, 
    getMenuItem, 
    createMenuItem, 
    updateMenuItem, 
    deleteMenuItem 
} = require('../controllers/menu');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(getMenu)
    .post(protect, authorize('publisher', 'admin'), createMenuItem);
router.route('/:id')
    .get(getMenuItem)
    .put(protect, authorize('publisher', 'admin'), updateMenuItem)
    .delete(protect, authorize('publisher', 'admin'),deleteMenuItem);

module.exports = router;