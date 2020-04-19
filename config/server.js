const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('../middleware/error');
const connectDB = require('./database');

//Load env vars
dotenv.config({ path: './config/config.env'});

// Connect to database
connectDB();

//Route files
const menu = require('../routes/menu');
const auth = require('../routes/auth');
const order = require('../routes/orders');

const server = express();

//Body parser
server.use(express.json());

server.use(cookieParser());

// Dev logging middleware
if(process.env.NODE_ENV == 'development') {
    server.use(morgan('dev'));
}

//Sanitize data
server.use(mongoSanitize());

//Set security headers
server.use(helmet());

//Prevent XSS attacks
server.use(xss());

//Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10 mins
    max: 100
});
server.use(limiter);

//Prevent http param pollution
server.use(hpp());

//Enable CORS
server.use(cors());

//Mount routers
server.use('/api/food', menu);
server.use('/api/auth', auth);
server.use('/api/orders', order);

server.use(errorHandler);

export default server;