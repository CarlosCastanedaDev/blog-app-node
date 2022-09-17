module.exports = (req,res) => {
    if(req.session.userId){
    return res.render('create2', {
        createPost: true
    })
    }
    res.redirect('/auth/login')
}