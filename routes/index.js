const express = require('express')
const Controller = require('../controllers/index.js')
const router = express.Router()

router.get('/', Controller.login)
router.post('/login', Controller.loginPost)
router.get('/register', Controller.register)
router.post('/register', Controller.registerPost)

router.use((req, res, next) => {
    if (!req.session.username){
        const validate = "please log in first"
        res.redirect(`/?validation=${validate}`)
    } else {
        next()
    }
})

// Diky
router.get('/profile/:username')
router.get('/profile')
router.post('/profile')

//Norizza
router.get('/home') // halaman posting
router.get('/allprofiles') // Tabel semua user beserta tombol delete






module.exports = router