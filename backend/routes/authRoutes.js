const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register', async (req, res) => {
    try{
        const { name, email, password } = req.body;
        let userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({ msg: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword });

        res.json({ msg: "User registered successfully", user });
    }catch(err){
        res.status(500).json({ msg: err.message });
    }
})

router.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email})

        if(!user){
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    }catch(err){
        res.status(500).json({ msg: err.message });
    }
})

module.exports = router;