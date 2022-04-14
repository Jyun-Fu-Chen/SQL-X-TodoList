const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const usePassport = require('./config/passport')
const passport = require('passport')
const flash = require('connect-flash')
const routes = require('./routes')
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const app = express()
const db = require('./models')
const Todo = db.Todo
const User = db.User

const PORT = process.env.PORT


app.engine('.hbs', exphbs.engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))
usePassport(app)

app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

app.use(routes)

app.listen(PORT, () => {
  console.log(`localhost${PORT} is running!!`)
})