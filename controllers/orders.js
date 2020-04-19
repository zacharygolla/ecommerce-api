const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Order = require('../models/order');

// @desc      Get all orders
// @route     GET /api/orders
// @access    Private
exports.getOrders = asyncHandler(async (req, res, next) => {
    
    // select keyword will allow to select for specific field on call
    // sort will sort the returned data by a desired field
    const reqQuery = { ...req.qeury };
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    //query str & query will allow to filter using greater than, greater than equal, less than, ..
    // in will allow to select all items whos array holds a specific field.
    let queryStr = JSON.stringify(reqQuery).replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    let query = Order.find(JSON.parse(queryStr));
    
    //will allow for the query to show only the fields that follow after the 'select' keyword
    if(req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //will allow the query to sort
    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('+type');
    }

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Order.countDocuments();
    query = query.skip(startIndex).limit(limit);

    //the call
    const orders = await query;
    //Pagination result
    const pagination = {};

    if(endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if(startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.status(200).json({ 
        success: true, 
        count: orders.length,
        pagination,
        data: orders
    });
});

// @desc      Create a order
// @route     POST /api/orders
// @access    Private
exports.createOrder = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id;
    const order = await Order.create(req.body);

    res.status(201).json({
        success: true,
        data: order
    })        
});

// @desc      Get a single order by id
// @route     GET /api/orders/:id
// @access    Private
exports.getOrderById = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);


    if(order.user != req.user.id || req.user.role === 'admin') {
        return next(
            new ErrorResponse('Only the user who order belongs to or admin can see that information')
        );
    }

    if(!order) {
        return next(
            new ErrorResponse(`Resource not found with an id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: order
    });
});

// @desc      Get currently logged in users orders
// @route     GET /api/orders/currentuser
// @access    Private
exports.getCurrentUsersOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id });
    
    if(!orders) {
        orders = {};
    }

    res.status(200).json({
        success: true,
        data: orders
    });
});

// @desc      Update an order item by id 
// @route     PUT /api/order/:id
// @access    Private
exports.updateOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!order) {
        return next(
            new ErrorResponse(`Resource not found with an id of ${req.params.id}`, 404)
        );
    }   

    res.status(200).json({
        success: true,
        data: order
    });
});

// @desc      Delete a new menu item by id 
// @route     DELETE /api/food/:id
// @access    Private
exports.deleteOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id);

    if(!order) {
        return next(
            new ErrorResponse(`Resource not found with an id of ${req.params.id}`, 404)
        );
    }   

    res.status(200).json({
        success: true,
        data: {}
    });
});