'use strict';

var mongoose = require('mongoose');
var responses = require('../DTOs/responses');

const User = require('../models/user');
const Session = require('../models/session');

const Init = async function() {
  let admin = await User.findOne({ username: 'admin' });
  if (!admin) {
    admin = new User({ username: 'admin', password: '1234!', isAdmin: true });
    admin = await admin.save();
    if (!admin) {
      console.log('Failed to initialize admin account');
    } else {
      console.log('Initialized admin account');
    }
  }
  let user = await User.findOne({ username: 'user' });
  if (!user) {
    user = new User({ username: 'user', password: 'pass', isAdmin: false });
    user = await user.save();
    if (!user) {
      console.log('Failed to initialize normal user account');
    } else {
      console.log('Initializd normal user account');
    }
  }
};

module.exports = class IdentityController {
  async Login(req, res) {
    await Init();
    if (req.header('X-OBSERVATORY-AUTH')) {
      res.status(401).end();
      return;
    }
    let existingSession = await Session.findOne({
      username: req.body.username
    });
    if (existingSession) {
      if (existingSession.password === req.body.password) {
        // Session Already created
        res.set('X-OBSERVATORY-AUTH', existingSession.id);
        let response = responses.OK;
        response.token = existingSession.id;
        res.json(response);
        return;
      } else {
        res.status(401).end();
        return;
      }
    }
    // New Session Should be created
    let user = await User.findOne({ username: req.body.username });
    if (!user) {
      console.log('User Not Found');
      res.status(401).end();
      return;
    }
    if (user.password === req.body.password) {
      let session = new Session({
        username: user.username,
        password: user.password,
        key: user.id,
        isAdmin: user.isAdmin
      });
      res.set('X-OBSERVATORY-AUTH', user.id);
      let s = await session.save();
      if (!s) {
        res.status(401).json(responses.UNXPECTED_ERROR);
        console.log('database error: ', s);
        return;
      }
      let response = responses.OK;
      response.token = user.id;
      res.json(response);
      return;
    } else {
      res.status(401).end();
      return;
    }
  }

  async Logout(req, res) {
    let auth = req.header('X-OBSERVATORY-AUTH');
    if (auth != null) {
      await Session.findByIdAndDelete({ _id: auth });
      res.json(responses.OK);
    } else {
      res.status(401).end();
    }
  }

  async Register(req, res) {
    if (req.header('X-OBSERVATORY-AUTH')) {
      res.status(401).end();
      return;
    }

    const existingUser = await User.findOne({ username: req.body.username });

    if (existingUser) {
      res.status(400).send('Username already exists.');
      return;
    }

    let userId = new mongoose.mongo.ObjectId();
    let user = new User({
      _id: userId,
      username: req.body.username,
      password: req.body.password,
      isAdmin: false
    });

    await user.save();

    let sessionId = new mongoose.mongo.ObjectId();

    let session = new Session({
      _id: sessionId,
      username: user.username,
      password: user.password,
      isAdmin: false
    });
    await session.save();
    res.set('X-OBSERVATORY-AUTH', userId);

    res.json(responses.OK);
  }

  async IsLoggedOn(req, res) {
    if (!req.header('X-OBSERVATORY-AUTH')) {
      res.status(401).end();
      return false;
    }

    let session = await Session.findOne({
      key: req.header('X-OBSERVATORY-AUTH')
    });
    if (!session) {
      res.status(401).end();
      return false;
    }
    return true;
  }

  async getUserData(req, res) {
    const token = req.header('X-OBSERVATORY-AUTH');
    if (!token) {
      res.status(401).end();
      return;
    }
    try {
      const session = await Session.findOne({
        key: token
      });
      if (!session) {
        res.status(401).end();
        return;
      }
      res.status(200).json({
        isAdmin: session.isAdmin
      });
    } catch (err) {
      console.error(err);
      res.status(500).end();
    }
  }
};
