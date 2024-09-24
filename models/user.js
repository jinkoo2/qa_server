const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const UserSchema = mongoose.Schema(
    {
      name: { 
        type: String, 
        required:true, 
        minlength:5,
        maxlength:100
      },

      email: { 
            type: String, 
            required:true, 
            unique: true, 
            minlength:10,
            maxlength:500
      },
      
      userid: { 
        type: String, 
        unique: true, 
        required: true,
        minlength:3,
        maxlength:100
      },

      password: { 
            type: String, 
            required: true,
            minlength:5,
            maxlength:500
        },

      type: {
        type: String,
        default: 'user' // user or admin
      },

      settings: {
        type: Object
      },

      active: {
        type: Boolean,
        default: true
      }
    
    },
    {
        timestamps:true
    }
);

UserSchema.pre('save', function(next) {
    ////////////////////////////////////////////////////////////////////
    // Hash passwrod if this is a new user, or the password has changed, 
    if (this.isNew || this.isModified('password')) {
      // Saving reference to this because of changing scopes
      const document = this;
      console.log('hasing password')
      bcrypt.hash(document.password, saltRounds,
        function(err, hashedPassword) {
        if (err) {
          console.error("hasing failed! err=>", err)
          next(err);
        }
        else {
          document.password = hashedPassword;
          next();
        }
      });
    } else {
      next();
    }
  });

UserSchema.methods.isCorrectPassword = function(password, callback){
  bcrypt.compare(password, this.password, function(err, same) {
    if (err) {
      callback(err);
    } else {
      callback(err, same);
    }
  });
}

UserSchema.methods.hashPassword = function(password, callback){
  bcrypt.hash(password, saltRounds,
    function(err, hashedPassword) {
    if (err) {
      callback(err)
    }
    else {
      callback(err,hashedPassword)
    }
   });
}


module.exports = mongoose.model('User', UserSchema);