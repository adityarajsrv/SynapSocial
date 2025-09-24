const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require("axios"); 

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

router.get("/linkedin", (req, res) => {
  const scope = "r_liteprofile w_member_social";
  const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.LINKEDIN_REDIRECT_URI)}&scope=${encodeURIComponent(scope)}`;
  res.redirect(linkedinAuthUrl);
});

router.get("/linkedin/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const body = new URLSearchParams({
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
    }).toString();

    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      body,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenResponse.data.access_token;
    res.send(`LinkedIn Access Token: ${accessToken}`);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send("LinkedIn OAuth failed");
  }
});


module.exports = router;