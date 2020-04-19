const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//Load env vars
dotenv.config({ path: './config/config.env' });

//Load models
const MenuItem = require('./models/menu-item');
const User = require('./models/user');
const Order = require('./models/order');

//Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

//Read JSON files
const menu = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/menu.json`, 'utf-8')
);

const orders = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/orders.json`, 'utf-8')
);

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

//Import into DB
const importData = async () => {
    try {
        await MenuItem.create(menu);
        await User.create(users);
        await Order.create(orders);

        console.log('Data Imported...'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

// Delete data
const deleteData = async () => {
    try {
        await MenuItem.deleteMany();        
        await User.deleteMany();
        await Order.deleteMany();

        console.log('Data Destoryed...'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

if(process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}