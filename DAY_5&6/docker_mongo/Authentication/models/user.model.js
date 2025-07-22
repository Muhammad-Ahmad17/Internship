// Schema: Describes the structure of user data (fields and types).
// Model: Provides methods to interact with the users collection in MongoDB

const {Schema, model} = require('mongoose');

const userSchema = new Schema ({
    name: {type:String , required:true},
    email: {type:String , required:true, unique:true},
    password: {type:String , required:true}
});

const User = model('User', userSchema);

module.exports = User;



/** 
 * Common Mongoose Schema Validators
 

// type: specifies the data type (String, Number, Date, etc.)
// required: true/false - field must be present
// unique: true/false - value must be unique in the collection
// minlength: minimum length for strings
// maxlength: maximum length for strings
// min: minimum value for numbers
// max: maximum value for numbers
// match: RegExp - value must match the given regular expression
// enum: array of allowed values
// default: default value if none is provided
// validate: custom validation function


*/