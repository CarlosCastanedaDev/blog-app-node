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

mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true})
app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())
app.use(customMiddleWare)
app.use('/posts/store', validateMiddleWare)

app.listen(4000, () => {
    console.log('App listening on port 4000')
})

const newPostController = require('./controllers/newPost')
const homeController = require('./controllers/home')
const storePostController = require('./controllers/storePost') 
const getPostController = require('./controllers/getPost')


app.get('/posts/new', newPostController)

app.get('/', homeController)

app.get('/post/:id', getPostController)

app.post('/posts/store', storePostController)