const express = require('express')
const Controller = require('../controllers/index.js')
const router = express.Router()

router.get('/', Controller.login)
router.post('/login', Controller.loginPost)
router.get('/register', Controller.register)
router.post('/register', Controller.registerPost)

router.use((req, res, next) => {
    if (req.session.username){
        next()
    } else {
        const validate = "please log in first"
        res.redirect(`/?validation=${validate}`)
    }
})

router.post('/home', (req, res) => {
    res.render('home')
})






module.exports = router