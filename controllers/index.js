const { User, Profile, Post, Tag, PostTag } = require('../models')
const bcrypt = require('bcryptjs')

class Controller {
    static login (req, res){
        const {validation} = req.query
        res.render('log-in', {validation})
    }

    static register (req, res){
        const {error} = req.query
        res.render('register', {error})
    }

    static registerPost (req, res){
        User.create(req.body)
            .then(_ => res.redirect('/'))
            .catch(err => {
                const error = err.errors.map(x => {
                    return x.message
                })
                res.redirect(`/register?error=${error}`)
            })
    }

    static loginPost (req, res){
        User.findOne({where: {username: req.body.username}})
            .then(user => {
                if(user){
                    if (user.username){
                        let isValidPassword = bcrypt.compareSync(req.body.password, user.password)
                        if (isValidPassword){
                            req.session.username = user.username
                            res.render('home')
                        } else {
                            const validate = "password is not valid"
                            res.redirect(`/?validation=${validate}`)
                        }
                    } 
                } else {
                    const validate = "username/password is not valid"
                    res.redirect(`/?validation=${validate}`)
                }
            })
    }
}

module.exports = Controller