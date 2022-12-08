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
router.get('/checkprofile', Controller.checkProfile)
router.post('/profile/create', Controller.profileAdd)
router.get('/profile/:profileId', Controller.profile)
router.get('/profile/:profileId/edit', Controller.profileEdit)

//Norizza
// router.get('/home') // halaman post
// router.get('/allprofiles') // Tabel semua user beserta tombol delete






module.exports = router