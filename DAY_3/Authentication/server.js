require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const userRoutes = require('./routes/user.route');

const app = express();
app.use(express.json());


const PORT = process.env.PORT || 3000;

app.use('/api/users', userRoutes);


const startServer = async () =>  {
    try {
        await connectDB();
        app.listen(PORT, () => {console.log(`Server started on port ${PORT}`);});
    } catch (error) {
        console.error('Error connecting to the server:', error);
        process.exit(1);
    }
};

startServer();