import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    // match: /[a-zA-z0-9]{2,30}@[a-zA-Z]{3,20}\.[a-zA-Z]{2,6}(\.[a-zA-Z]{2,6})*/,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin,
    },
    process.env.jwtPrivateKey
  );
  return token;
};

const User = mongoose.model('User', userSchema);

export default User;
