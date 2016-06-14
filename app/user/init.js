const passport = require('passport')

app.get('/profile', passport.autheticationMiddleware(), renderProfile
