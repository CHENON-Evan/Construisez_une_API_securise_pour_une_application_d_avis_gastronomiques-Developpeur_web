const jwt = require('jsonwebtoken');
const User = require('../models/users');

function authenticateUser(req, res, next) {

  const header = req.header('Authorization');
  if (header == null) res.status(403).send({ message: 'Invalid' });

  const token = header.split(' ')[1];
  if (token == null)
    return res.status(403).send({ message: 'Token cannot be null' });

  jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => {
    if (err) return res.status(403).send({ message: 'Token invalid' + err });
   
   User.findOne({email: decoded.email }).then(function (user) {

      if (!user) {
        return res.status(403).json({ error: 'Utilisateur non trouvé !' });
      }
      req.currentUser = user;
      next();
    });
  });
}

module.exports = { authenticateUser,  };
