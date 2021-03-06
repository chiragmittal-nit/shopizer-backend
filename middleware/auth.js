import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  jwt.verify(token, process.env.jwtPrivateKey, (err, user) => {
    if (err) res.status(400).send('Invalid token.');
    req.user = user;
    next();
  });
};
