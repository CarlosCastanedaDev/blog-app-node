const express = require('express')
const app = new express()
const ejs = require('ejs')
const mongoose = require('mongoose')
const bodyParser = require('body-parser') 
const fileUpload = require('express-fileupload')
const customMiddleWare = (req,res,next)=>{
    console.log('Custom middle ware called')
    next() 
} 
const validateMiddleWare = require('./middleware/validationMiddleware')
const expressSession = require('express-session')
const authMiddleware = require('./middleware/authMiddleware')
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')
const flash = require('connect-flash')

mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true})
app.set('view engine', 'ejs')

global.loggedIn = null

app.use(express.static('public'))
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())
app.use(customMiddleWare)
app.use('/posts/store', validateMiddleWare)
app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))
app.use('*', (req,res, next) =>{
    loggedIn = req.session.userId
    next()
})
app.use(flash())

app.listen(4000, () => {
    console.log('App listening on port 4000')
})

const newPostController = require('./controllers/newPost')
const homeController = require('./controllers/home')
const storePostController = require('./controllers/storePost') 
const getPostController = require('./controllers/getPost')
const newUserController = require('./controllers/newUser')
const storeUserController = require('./controllers/storeUser')
const loginController = require('./controllers/login')
const { application } = require('express')
const loginUserController = require('./controllers/loginUser')
const logoutController = require('./controllers/logout')

app.get('/posts/new', authMiddleware, newPostController)

app.get('/', homeController)

app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController)

app.get('/post/:id', getPostController)

app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController)

app.get('/auth/logout', logoutController)

app.post('/posts/store', authMiddleware, storePostController)

app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController)

app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController)

app.use((req,res) => res.render('notfound'))
