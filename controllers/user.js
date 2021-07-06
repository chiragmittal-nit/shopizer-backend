import User from './../models/user.js';
import mongoose from 'mongoose';
import lodash from 'lodash';
import bcrypt from 'bcrypt';
const _ = lodash;

export const registerUser = (req, res) => {
  const user = new User(_.pick(req.body, ['email', 'name', 'password']));

  User.findOne({ email: user.email })
    .then((data) => {
      if (data) return res.status(400).send('User already exists');

      hashPassword(user.password)
        .then((hash) => {
          user.password = hash;
          user
            .save()
            .then((data) => {
              const token = user.generateAuthToken();
              res
                .header('x-auth-token', token)
                .header('access-control-expose-headers', 'x-auth-token')
                .status(200)
                .send(_.pick(data, ['_id', 'name', 'email']));
            })
            .catch((err) => res.status(501).send(err.message));
        })
        .catch((err) => {
          return res.status(400).send(err.message);
        });
    })
    .catch((err) => {
      return res.status(400).send(err.message);
    });
};

export const loginUser = (req, res) => {
  // console.log('-----------------------login request body : ', req.body);
  const user = new User(_.pick(req.body, ['email', 'password']));

  User.findOne({ email: user.email })
    .then((data) => {
      if (!data) return res.status(400).send('Invalid Credentials');

      bcrypt
        .compare(user.password, data.password)
        .then((isValid) => {
          if (!isValid) return res.status(400).send('Invalid Credentials');
          user.name = data.name;
          const token = user.generateAuthToken();
          res.send(token);
        })
        .catch((err) => {
          console.log(err);
          return res.status(400).send(err.message);
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).send(err.message);
    });
};

export const updateUserDetails = async (req, res) => {
  const updatedUser = req.body;
  try {
    const hashedPassword = await hashPassword(updatedUser.password);

    const user = await User.findOneAndUpdate(
      { email: updatedUser.email },
      { name: updatedUser.name, password: hashedPassword },
      { returnOriginal: false }
    );
    res.status(200).send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error !!');
  }
};

export const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt
      .genSalt(10)
      .then((salt) => {
        bcrypt
          .hash(password, salt)
          .then((hashedPassword) => resolve(hashedPassword))
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};
