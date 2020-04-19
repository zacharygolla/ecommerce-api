const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const MenuItem = require('../models/menu-item');

// @desc      Get all menu items
// @route     GET /api/food
// @access    Public
exports.getMenu = asyncHandler(async (req, res, next) => {
    
    // select keyword will allow to select for specific field on call
    // sort will sort the returned data by a desired field
    const reqQuery = { ...req.qeury };
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    //query str & query will allow to filter using greater than, greater than equal, less than, ..
    // in will allow to select all items whos array holds a specific field.
    let queryStr = JSON.stringify(reqQuery).replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    let query = MenuItem.find(JSON.parse(queryStr));
    
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
    const total = await MenuItem.countDocuments();
    query = query.skip(startIndex).limit(limit);

    //the call
    const menu = await query;
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
        count: menu.length,
        pagination,
        data: menu
    });
});

// @desc      Get a single menu item by id
// @route     GET /api/food/:id
// @access    Public
exports.getMenuItem = asyncHandler(async (req, res, next) => {
        const menuItem = await MenuItem.findById(req.params.id);

        if(!menuItem) {
            return next(
                new ErrorResponse(`Resource not found with an id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: menuItem
        });
});

// @desc      Create a new menu item
// @route     POST /api/food
// @access    Private
exports.createMenuItem = asyncHandler(async (req, res, next) => {
        const menuItem = await MenuItem.create(req.body);
    
        res.status(201).json({
            success: true,
            data: menuItem
        })        
});

// @desc      Update a new menu item by id 
// @route     PUT /api/food/:id
// @access    Private
exports.updateMenuItem = asyncHandler(async (req, res, next) => {
        const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!menuItem) {
            return next(
                new ErrorResponse(`Resource not found with an id of ${req.params.id}`, 404)
            );
        }   

        res.status(200).json({
            success: true,
            data: menuItem
        });
});

// @desc      Delete a new menu item by id 
// @route     DELETE /api/food/:id
// @access    Private
exports.deleteMenuItem = asyncHandler(async (req, res, next) => {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

        if(!menuItem) {
            return next(
                new ErrorResponse(`Resource not found with an id of ${req.params.id}`, 404)
            );
        }   

        res.status(200).json({
            success: true,
            data: {}
        });
});