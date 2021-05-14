const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('./models/User');
const Role = require('./models/Role');
const { secret } = require('./config.js');

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles
  };

  return jwt.sign(payload, secret, {expiresIn: "24h"});
}

class AuthController {
  registration = async (req, res) => {
    try {
      const errors = validationResult(req);

      console.log(errors.errors)
      
      if(!errors.isEmpty()) {
        return res.status(400).json({ message: 'Error due registration', errors });
      }

      const { username, password } = req.body;
      const candidate = await User.findOne({username});

      if(candidate) {
        return res.json(400).json({message: 'User is already exists'});
      }

      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({value: 'USER'})
      const user = new User({ username, password: hashPassword, roles: [userRole.value] });
      await user.save();

      return res.json({message: "User registered"});

    }catch(e) {
      console.log(e);
    }

  }

  login = async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({username});

      if(!user) {
       return res.status(400).json({message: 'User not registered!'});
      }

      const validPassword = bcrypt.compareSync(password, user.password);

      if(!validPassword) {
        return res.status(400).json({message: 'Password is wrong'});
      }

      const token = generateAccessToken(user._id, user.roles);

      return res.json({token: token});
    }catch(e) {
      console.log(e);
    }
  }

  getUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    }catch(e) {
      console.log(e);
    }
  }
}

module.exports = new AuthController();
