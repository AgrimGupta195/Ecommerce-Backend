const express = require('express');
const dbConnect = require('./config/dbconnect');
const app = express();
const dotenv = require('dotenv').config();
const authRouter = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorhandler');
const PORT = process.env.PORT;
const cookieparser = require('cookie-parser');



dbConnect();


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieparser());

app.use('/api/user',authRouter);

app.use(notFound)
app.use(errorHandler);





app.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`)
})