import User from './../models/user.js';
import lodash from 'lodash';
import bcrypt from 'bcrypt';
const _ = lodash;

export const registerUser = (req, res) => {
  const user = new User(_.pick(req.body, ['email', 'name', 'password']));

  User.findOne({ email: user.email })
    .then((data) => {
      if (data) return res.status(400).send('User already exists');

      bcrypt
        .genSalt(10)
        .then((salt) => {
          bcrypt
            .hash(user.password, salt)
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
    })
    .catch((err) => {
      return res.status(400).send(err.message);
    });
};

export const loginUser = (req, res) => {
  console.log(req.body);
  const user = new User(_.pick(req.body, ['email', 'password']));

  User.findOne({ email: user.email })
    .then((data) => {
      if (!data) return res.status(400).send('Invalid email or password.');

      bcrypt
        .compare(user.password, data.password)
        .then((isValid) => {
          if (!isValid)
            return res.status(400).send('Invalid email or password.');
          const token = user.generateAuthToken();
          res.send(token);
        })
        .catch((err) => res.status(500).send(err.message));
    })
    .catch((err) => res.status(400).send(err.message));
};
