const express    = require('express');
const morgan     = require('morgan');
const bodyParser = require('body-parser');
const cors       = require('cors');
const mongoose   = require('mongoose');
const passport   = require('passport');
require('dotenv').config()

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
require('./passport')(passport);

app.use('/api/users', require('./routes/user'));
app.use('/api/admins', require('./routes/admin'));
app.use('/api/collectors', require('./routes/collector'));
app.use('/api/deposits', require('./routes/deposit'));
app.use('/api/withdraws', require('./routes/withdraw'));



app.get('/', (req, res) => {
    res.send("Welcome to Forwarrd Server")
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@forwarrd-database.dypbf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const port = 7000;
app.listen(process.env.PORT || port, () => {
    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
})
