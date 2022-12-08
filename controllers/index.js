const { User, Profile, Post, Tag, PostTag } = require('../models')
const bcrypt = require('bcryptjs')
const { use } = require('../routes')

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
                            res.redirect('/checkprofile')
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

    static checkProfile (req, res){
        User.findOne({where: {username: req.session.username}, include: Profile})
            .then(user => {
                if (!user.Profile){
                    console.log(user)
                    res.render('profile-add')
                } else {
                    res.redirect(`/profile/${user.Profile.id}`)
                }
            })
    }

    static profileAdd (req, res){
        User.findOne({where: {username: req.session.username}})
            .then(user => {
                const {fullname, photo, bio, phone, gender} = req.body
                return Profile.create({fullname, photo, bio, phone, gender, UserId: user.id})
            })
            .then(profile => res.redirect(`/profile/${profile.id}`))
    }

    static profile (req, res){
        const {username} = req.session
        Profile.findOne({where: {id: req.params.profileId}, include: User})
            .then(profile => res.render('profile', {profile, username}))
    }

    static profileEdit (req, res){
        Profile.findByPk(req.params.profileId)
            .then(profile => {
                let gender = ["Male", "Female"]
                res.render('profile-edit', {profile, gender})
            })     
    }

}

module.exports = Controller