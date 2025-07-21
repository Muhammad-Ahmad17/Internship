const joi = require ('joi');

exports.registerSchema = joi.object({
    name: joi.string().required().label('Name'),
    email: joi.string().email().required().label('Email'),
    balance: joi.number().positive().default(0).label('Balance'),
    password: joi.string()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
      // password must contain at least 8 characters, including uppercase, lowercase, number, and special character.
      .required()
      .label('Password')
      .messages({
        'string.pattern.base': 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.'
      }),
  }).messages({
    'any.required': '{{#label}} is required',
    'string.empty': '{{#label}} cannot be empty',
    'string.email': 'Invalid email format',
  });
  

exports.loginSchema = joi.object({
    email: joi.string().email().required().label('Email'),
    password: joi.string().required().label('Password')
})

exports.sendMoneySchema = joi.object({
    amount: joi.number().positive().required().label('Amount'),
    recipientEmail: joi.string().email().required().label('Recipient Email')
})

