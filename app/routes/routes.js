'use strict'

const passport = require('passport')
const express = require('express')
const config = require('../../config/config')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const mongodb = require('mongodb')
const multer = require('multer')

const User = require('../models/user')
const Status = require('../models/status')
const ReceiverType = require('../models/receivertype')
const Respondent = require('../models/respondent')
const Document = require('../models/document')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../public/pdf/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
const upload = multer({storage: storage}).single('file')

module.exports = initApp

function initApp(app) {
  app.use(passport.initialize())
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())

  require('../../config/passport')(passport)

  var api = express.Router()

  api.post(
    '/register',
    (req, res) => {
      if (!req.body.email || !req.body.password) {
        console.log()
        res.json({success: false, message: 'Missing email or password'})
      } else {
        var newUser = new User({
          email: req.body.email,
          password: req.body.password,
          name: req.body.name,
          role: 'Guest'
        })

        newUser.save((err) => {
          if (err) {
            return res.json({success: false, message: 'Email already exists'})
          }
          res.json({success: true, message: 'Successfully created new user'})
        })
      }
    })

  api.post(
    '/authenticate',
    (req, res) => {
      User.findOne({
        email: req.body.email
      }, (err, user) => {
        if (err) {
          throw err
        }
        if (!user) {
          res.status(404).send('Not found');
          // res.send({success: false, message: 'Not found'})
        } else {
          user.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch && !err) {
              var token = jwt.sign(user, config.secret, {
                expiresIn: 86400
              })
              res.json({success: true, token: 'JWT ' + token})
            } else {
              res.status(404).send('Not found 2');
              // res.send({success: false, message: 'Authentication failed.'})
            }
          })
        }
      })
          })

  api.get(
    '/user',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
      User.find({}, (err, users) => {
        if (err) {
          throw err
        }
        if (!user) {
          res.send({success: false, message: 'Users not found'})
        } else {
          res.json(users)
        }
      })
    }
  )

  api.get(
    '/user/:userId',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
      User.findOne({_id: req.params.userId}, (err, user) => {
        if (err) {
          throw err
        }
        if (!user) {
          res.send({success: false, message: 'User not found'})
        } else {
          res.json(user)
        }
      })
    }
  )

  api.post(
    '/search',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
      var searchedText = req.body.term
      Document.find(
        {$text: {$search: searchedText}},
        {score: {$meta: 'textScore'}}
      )
      .select('_id number status receiver reception subject signDate')
      .sort({score:{$meta: 'textScore'}})
      .exec((err, docs) => {
        if (err) {
          res.send({success: false, message: 'Query failed. Error: ' + err})
        }
        res.send(JSON.stringify(docs))
      })
    }
  )

  api.get(
    '/document',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
      Document.find({}, (err, docs) => {
        if (err) {
          res.send({success: false, message: 'Not found'})
        }
        res.json(docs)
      })
    }
  )

  api.get(
    '/document/:documentId',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
      Document.findOne({_id: req.params.documentId}, (err, doc) => {
        if (err) {
          res.send({success: false, message: 'Not found'})
        }
        res.json(doc)
      })
    }
  )

  api.post(
    '/document',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
      if (req.body._id) {
        var id = req.body._id
        delete req.body._id
        Document.findByIdAndUpdate(
          id,
          {$set: req.body},
          (err, doc) => {
            if (err) {
             res.send({success: false, message: 'Not found'})
            }
            res.json({success: true, message: doc._id})
          }
        )
      } else {
        var doc = new Document(req.body)
        doc.save((err) => {
          if (err) {
            res.send({success: false, message: 'Error: ' + err})
          } else {
            res.json({success: true, message: doc._id})
          }
        })
      }
    }
  )

  ////
  ///router.post(
  ///'/uploads',
  ///function (req, res, next) {
  ///if (!authorized) {
  ///res.send(403)
  ///} else {
  ///next()
  ///}
  ///},
  ///multer({ dest: '/uploads/' }),
  ///function (req, res, next) {
  ///// whatever you were planning to do.
  ///})

  api.post(
    '/document/upload/:documentId',
    // passport.authenticate('jwt', {session: false}),
    (req, res) => {
      upload(req, res, (err) => {
        if (err) {
          res.send({success: false, message: err})
          return
        }
        res.send({success: true, message: 'File uploaded'})
      })
    }
  )

  api.delete(
    '/document/:documentId',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
      Document.findOneAndRemove(
        {_id: req.params.documentId},
        (err, doc) => {
          if (err) {
            res.send({success: false, message: 'Error: ' + err})
          }
          res.json({success: true, message: 'Document removed'})
        }
      )
    }
  )

  api.get(
    '/status',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
      Status.find({}, (err, statusList) => {
        if (err) {
          res.send({success: false, message: 'Not found'})
          throw err
        }
        res.json(statusList)
      })
    }
  )

  api.get(
    '/receiver/type',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
      ReceiverType.find({}, (err, receiverTypes) => {
        if (err) {
          res.send({success: false, message: 'Not found'})
          throw err
        }
        res.json(receiverTypes)
      })
    }
  )

  api.get(
    '/respondent',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
      Respondent.find({}, (err, respondents) => {
        if (err) {
          res.send({success: false, message: 'Not found'})
          throw err
        }
        res.json(respondents)
      })
    }
  )

  api.get(
    '/profile',
    passport.authenticate('jwt', {session: false}),
    (req, res, next) => {
      console.log(req.file)
      // req.file is the `avatar` file
      // req.body will hold the text fields, if there were any
    }
  )

  app.use('/api', api)
}
