const express = require('express')
const Controller = require('../controllers/index.js')
const router = express.Router()

router.get('/', Controller.login)
router.post('/login', Controller.loginPost)
router.get('/register', Controller.register)
router.post('/register', Controller.registerPost)

router.use((req, res, next) => {
    if (!req.session.username){
        const validate = "Log in dulu baru bisa masuk"
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
router.get('/home', Controller.profileHome) // halaman post
router.post('/profile/:profileId/post', Controller.postContent)
router.post('/home/post', Controller.postContentHome)
router.get('/logout', Controller.logout)

router.use((req, res, next) => {
    if (req.session.role !== 'user'){
        next()
    } else {
        const validate = "please log in first"
        res.redirect(`/home?validate= ${validate}`)
    }
})

router.get('/allprofiles', Controller.allProfiles) // Tabel semua user beserta tombol delete
router.get('/allprofiles/:userId/delete', Controller.deleteUser)


module.exports = router