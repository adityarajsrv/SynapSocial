const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require("axios");
const crypto = require('crypto');

const router = express.Router();

// LinkedIn
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;

// X (Twitter)
const X_CLIENT_ID = process.env.X_CLIENT_ID;
const X_CLIENT_SECRET = process.env.X_CLIENT_SECRET;
const X_REDIRECT_URI = process.env.X_REDIRECT_URI;


function base64URLEncode(str) {
    return str.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function sha256(buffer) {
    return crypto.createHash('sha256').update(buffer).digest();
}

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword });

        res.json({ msg: "User registered successfully", user });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
})

router.get("/linkedin", (req, res) => {
    const scope = "openid profile email";
    const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.LINKEDIN_REDIRECT_URI)}&scope=${encodeURIComponent(scope)}`;
    res.redirect(linkedinAuthUrl);
});

router.get("/linkedin/callback", async (req, res) => {
  try {
    const code = req.query.code;
    const tokenRes = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenRes.data.access_token;
    const expiresIn = tokenRes.data.expires_in; // seconds
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    const profileRes = await axios.get(
      "https://api.linkedin.com/v2/me",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const emailRes = await axios.get(
      "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const name = `${profileRes.data.localizedFirstName} ${profileRes.data.localizedLastName}`;
    const email = emailRes.data.elements[0]["handle~"].emailAddress;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: await bcrypt.hash(crypto.randomBytes(10).toString("hex"), 10), // dummy password
      });
    }

    user.linkedIn = {
      accessToken,
      refreshToken: tokenRes.data.refresh_token || user.linkedIn?.refreshToken,
      expiresAt,
    };
    await user.save();

    const token = generateToken(user);
    res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}`);
  } catch (err) {
    console.error("LinkedIn callback error:", err.response?.data || err.message);
    res.redirect(`${process.env.CLIENT_URL}/auth-error`);
  }
});

router.get("/x", (req, res) => {
    const codeVerifier = base64URLEncode(crypto.randomBytes(32));
    req.session.codeVerifier = codeVerifier;

    const codeChallenge = base64URLEncode(sha256(codeVerifier));

    const params = new URLSearchParams({
        response_type: "code",
        client_id: process.env.X_CLIENT_ID,
        redirect_uri: process.env.X_REDIRECT_URI,
        scope: "tweet.read tweet.write users.read offline.access",
        state: "random_state_string", 
        code_challenge: codeChallenge,
        code_challenge_method: "S256"
    });

    const url = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
    res.redirect(url);
});

router.get("/x/callback", async (req, res) => {
  try {
    const { code } = req.query;

    const tokenRes = await axios.post(
      "https://api.twitter.com/2/oauth2/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.X_REDIRECT_URI,
        client_id: process.env.X_CLIENT_ID,
        code_verifier: req.session.codeVerifier,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, refresh_token, expires_in } = tokenRes.data;
    const expiresAt = new Date(Date.now() + expires_in * 1000);
    const profileRes = await axios.get("https://api.twitter.com/2/users/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { id, name, username } = profileRes.data.data;

    let user = await User.findOne({ email: req.user?.email }); 
    if (!user) {
      user = await User.create({
        name,
        email: `${username}@x.com`,
        password: await bcrypt.hash(crypto.randomBytes(10).toString("hex"), 10),
      });
    }

    user.twitter = {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt,
    };
    await user.save();

    const token = generateToken(user);
    res.redirect(`${process.env.CLIENT_URL}/auth-success?token=${token}`);
  } catch (err) {
    console.error("X callback error:", err.response?.data || err.message);
    res.redirect(`${process.env.CLIENT_URL}/auth-error`);
  }
});

router.get("/accounts", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    const accounts = [];
    if (user.linkedIn) accounts.push({ platform: "linkedin", username: user.name });
    if (user.twitter) accounts.push({ platform: "twitter", username: user.twitter.username || user.name });

    res.json({ accounts });
  } catch (err) {
    res.status(401).json({ msg: "Unauthorized" });
  }
});


module.exports = router;