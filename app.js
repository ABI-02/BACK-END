const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();


online_mongo_uri="mongodb+srv://abi:abi@mydatabase.oiaxk.gcp.mongodb.net/mydatabase?retryWrites=true&w=majority"

mongoose.connect(online_mongo_uri, { useNewUrlParser: true ,  useUnifiedTopology: true })
.then(() => console.log("Database connected .. "))
.catch(err => console.log( `Database not connected due to error ${err}`))

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.get('/api', (req, res) => {
    fs.readFile('docs/apiDocs.json', (err, data) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        }
        const docs = JSON.parse(data);
        res.json(docs);
    });
});
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Unauthorized!' });
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`A Node Js API is listening on port: ${port}`);
});
