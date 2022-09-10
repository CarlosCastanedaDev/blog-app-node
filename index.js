const express = require('express')
const path = require('path')
const app = new express()
const ejs = require('ejs')
const mongoose = require('mongoose')
const bodyParser = require('body-parser') 
const BlogPost = require('./models/BlogPost.js')
const fileUpload = require('express-fileupload')
const customMiddleWare = (req,res,next)=>{
    console.log('Custom middle ware called')
    next() 
} 
const validateMiddleWare = (req,res,next)=>{
    if(req.files == null || req.body == null || req.title == null){ 
        return res.redirect('/posts/new')
    }
    next() 
}


mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true})
app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())
app.use(customMiddleWare)
app.use('/posts/store',validateMiddleWare)

app.listen(4000, () => {
    console.log('App listening on port 4000')
})

app.get('/', async (req,res) => {
    // res.sendFile(path.resolve(__dirname, 'pages/index.html'))
    const blogposts = await BlogPost.find({})
    res.render('index', {
        blogposts
    })
})
app.get('/about', (req,res) => {
    // res.sendFile(path.resolve(__dirname, 'pages/about.html'))
    res.render('about')
})
app.get('/contact', (req,res) => {
    // res.sendFile(path.resolve(__dirname, 'pages/contact.html'))
    res.render('contact')
})
app.get('/post/:id', async (req,res) => {
    // res.sendFile(path.resolve(__dirname, 'pages/post.html'))
    const blogpost = await BlogPost.findById(req.params.id)
    res.render('post',{
        blogpost
    })
})

app.get('/posts/new', (req,res) =>{
    res.render('create2')
})

app.post('/posts/store',(req,res)=>{
    let image = req.files.image ;
        image.mv(path.resolve(__dirname,'public/assets/img',image.name),
            (error)=>{
    BlogPost.create({
    ...req.body ,
     image: '/assets/img/' + image.name
    })
    res.redirect('/') 
    })
})