const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Charity = require('../models/Charity');
require('dotenv').config();

exports.register = async (req, res) => {
  try {
    const { name, email, password,role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword ,role});

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(500).json({ error: 'Error registering user', details: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, '8hy98h9yu89y98yn89y98y89', {
      expiresIn: '1d',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: 'Error logging in', details: err.message });
  }
};
 

exports.charityregister = async (req, res) => {
  try {
    const { name, email, password, mission, category,location,registrationNumber } = req.body;
 
    const hashedPassword = await bcrypt.hash(password, 10);
    const charity = await Charity.create({ 
      name, 
      email, 
      password: hashedPassword, 
      mission, 
      category,
      location,
      registrationNumber,
  
    });

    res.status(201).json({ message: 'Charity registered successfully', charity });
  } catch (err) {
    res.status(500).json({ error: 'Error registering charity', details: err.message });
  }
};

exports.charitylogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const charity = await Charity.findOne({ where: { email } });
    if (!charity) {
      return res.status(404).json({ error: 'Charity not found' });
    }

    const validPassword = await bcrypt.compare(password, charity.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const charitytoken = jwt.sign({ id: charity.id, role: charity.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ message: 'Charity login successful', charitytoken });
  } catch (err) {
    res.status(500).json({ error: 'Error logging in charity', details: err.message });
  }
};