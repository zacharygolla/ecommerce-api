const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    menuItems: {
        type: [mongoose.Schema.ObjectId],
        ref: 'MenuItem',
        required: false
    },  
    subtotal: Number,
    tax: Number,
    total: Number,    
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Order', OrderSchema);