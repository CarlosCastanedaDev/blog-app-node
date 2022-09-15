module.exports = (req,res) => {
    if(req.session.userId){
    return res.render('create2')
    }
    res.redirect('/auth/login')
}