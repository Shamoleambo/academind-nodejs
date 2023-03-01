const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const User = require('../models/user')
const createTransport = require('../utils/createTransport')

dotenv.config()

exports.getLogin = (req, res, next) => {
  let message = req.flash('error')
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  })
}

exports.getSignup = (req, res, next) => {
  let message = req.flash('error')
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  })
}

exports.postLogin = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  User.findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.')
        return res.redirect('/login')
      }

      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true
            req.session.user = user

            return req.session.save(err => {
              console.log(err)
              return res.redirect('/')
            })
          }

          req.flash('error', 'Invalid password')
          res.redirect('/login')
        })
        .catch(err => {
          console.log(err)
          res.redirect('/login')
        })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postSignup = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  User.findOne({ email })
    .then(user => {
      if (user) {
        req.flash('error', 'User already exists')
        return res.redirect('/signup')
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const newUser = new User({
            email,
            password: hashedPassword,
            cart: { items: [] }
          })
          return newUser.save()
        })
        .then(async () => {
          res.redirect('/login')
          const transport = await createTransport()
          return transport.sendMail({
            from: `Test Mail <${process.env.MAIL}>`,
            to: email,
            subject: 'Signup succeeded!',
            html: '<h1>You successfully signed up!</h1>'
          })
        })
        .catch(err => {
          console.log(err)
        })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err)
    res.redirect('/')
  })
}

exports.getReset = (req, res, next) => {
  let message = req.flash('error')
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  })
}
