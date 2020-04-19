const mongoose = require('mongoose');
const slugify = require('slugify');

const MenuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Menu Item must have a name'],
        unique: true,
        trim: true,
        maxlength: [256, 'Name cannot be more than 256 characters']
    },
    slug: String,
    type: {
        type: String, 
        required: [true, 'Menu Item must have a type'],
        maxlength: [10, 'Type can be no longer than 10 characters']
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    cost: Number,
});

// Create menu item slug from the name
MenuItemSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
