const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();

app.use(express.urlencoded({ extended : true }));
app.use(express.json());

app.use('/', require('./routes/index'));

app.listen(port,function(err){
    if(err){
        console.log(`******Error in running server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});