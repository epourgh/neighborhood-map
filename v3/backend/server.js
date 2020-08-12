const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.ATLAS_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log('MongoDB database connection established successfully!'))
    .catch(err => {
        console.log(`DB CONNECTION ERROR: ${err.message}`);
    });


const locationsRouter = require('./routes/locations');
app.use('/locations', locationsRouter);



app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});