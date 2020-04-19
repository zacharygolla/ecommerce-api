const express = require('express');
const { 
    getOrders, 
    getOrderById,
    getCurrentUsersOrders,
    createOrder, 
    updateOrder, 
    deleteOrder 
} = require('../controllers/orders');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, authorize('publisher', 'admin'), getOrders)
    .post(protect, createOrder);
router.route('/currentuser')
    .get(protect, getCurrentUsersOrders);
router.route('/:id')
    .get(protect, getOrderById)
    .put(protect, authorize('publisher', 'admin'), updateOrder)
    .delete(protect, authorize('publisher', 'admin'), deleteOrder);


module.exports = router;