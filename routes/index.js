const express = require('express')
const Controller = require('../controllers/index.js')
const router = express.Router()

router.get('/', Controller.login)
router.get('/register', Controller.register)
router.post('/register', Controller.registerPost)



module.exports = router