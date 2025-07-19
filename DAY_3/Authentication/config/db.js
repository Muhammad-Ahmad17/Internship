const mongoose = require('mongoose');
const mongoUri = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoUri);      
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
}

module.exports =  connectDB ;


// mongoose.set options:
// 'strictQuery': false   // Allows flexible query filters, not strict to schema
// 'debug': true          // Logs MongoDB operations to the console
// 'bufferCommands': false// Disables buffering of commands when not connected
// 'runValidators': true  // Runs validators on update operations