This repo holds the skeleton for an ecommerce api.(specifically food delivery)

Current routes include:
  Users
  Orders
  Menu Items
  
run npm init to install node modules
additional installs:
  npm i express,
        dotenv,
        morgan,
        express-mongo-santitize,
        helmet,
        xss-clean,
        express-rate-limit,
        hpp,
        cors,
        cookie-parser,
        colors
        mongoose
        fs,
        nodemailer,
        crypto,
        bcryptjs,
        jswonwebtoken,
        slugify     

create a config.env file in config/

fields for config.env will endclude
NODE_ENV=development
PORT="The port that you choose"

MONGO_URI="mongodb uri, this will be your uri to yoru personal cluster"

JWT_SECRET="This will be the secret key for your json web tokens (related to user authorization)
JWT_EXPIRE="The number value for the amount of time before json web token expires" (This will be followed by h, code changes need to occur for days, seconds, milliseconds changes (default is hours))
JWT_COOKIE_EXPIRE="the number value related to your expiry time. i.e. 30m->30, 2d->2, 1h->1" (Code changes may need to occur if using days, second, milliseconds (default is hours))

SMTP_HOST="host you use for email"
SMTP_PORT="port for email host"
SMTP_EMAIL="email address username"
SMTP_PASSWORD="email address password"
FROM_EMAIL="who email is from (email adress)"
FROM_NAME="who email is from(name)"

routes configured
orders:

menu:

auth:
