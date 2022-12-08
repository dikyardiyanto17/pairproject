const { User, Profile, Post, Tag, PostTag } = require('../models')
const bcrypt = require('bcryptjs')
var emoji = require('node-emoji')
const dateFormat = require('../helpers/formatter')
const {Op} = require('sequelize')

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
                            req.session.role = user.role
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
            .catch(err => {
                
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
        Profile.findOne({where: {id: req.params.profileId}, include: [User, Post]})
            .then(profile => {
                res.render('profile', {profile, username, dateFormat})
                // res.send(profile);
            })
    }

    static profileEdit (req, res){
        Profile.findByPk(req.params.profileId)
            .then(profile => {
                let gender = ["Male", "Female"]
                res.render('profile-edit', {profile, gender})
            })     
    }
    static profileHome (req, res) {
        const {validation} = req.query
        let emoticon = [emoji.get('coffee'),emoji.find('🍕')]
        // User.findAll({ include: { all: true, nested: true }});
        let option = {include: { all: true, nested: true }}
        if (req.query.sort){
            option.order= [['createdAt', `${req.query.sort}`]]
        }
        if (req.query.title){
            option.where = {}
            option.where.title = {[Op.iLike]: `%${req.query.title}%`}
        }
        let data = {}
        Post.findAll(option)
        .then(post => {
            // res.send(post);
            data.post = post
            return User.findOne({where: {username: req.session.username} , include: Profile})
        })
        .then(user => {
            
            res.render('home', {...data, user, dateFormat, validation, emoticon})
            // res.send(post)
        })
    }

    static postContent (req, res) {
        const id = +req.params.profileId
        const {title, content, moodStatus} = req.body
        console.log(req.params);
        console.log(req.body);
        Post.create({title, content, moodStatus, ProfileId: +id})
        .then(() => res.redirect('/home'))
    }

    static postContentHome (req, res) {
        let id = {}
        const {title, content, moodStatus, ProfileId, name} = req.body
        Post.create({title, content, moodStatus, ProfileId})
        .then(post => {
            id.post = post.id
            return Tag.create({name})
        })
        .then(tag => {
            PostTag.create({PostId: id.post, TagId: tag.id})
            // id.tag = tag.id
            res.redirect('/home')
        })
    }


    static allProfiles(req, res) {
            // res.send(users)
        User.findAll({
            include: {
                model: Profile,
                required:true
            }
        })
        .then(users => {
            res.render('allusers', {users})
            // res.send(users)
        })
     
    }
    static deleteUser (req, res) {
        const id = +req.params.userId
        console.log(req.params);
        const idToDelete = {}
        User.findByPk(id, {include: Profile})
        .then(data => {
            // console.log(data.Profile.id);
            idToDelete.user = data.id
            idToDelete.profile = data.Profile.id
            return Profile.destroy({where: {id:  idToDelete.profile}})
        })
        .then(() => {
                User.destroy({where: {id: idToDelete.user}})
                res.redirect('/allprofiles')
            })
    }

    static logout (req, res){
        req.session.destroy((err) => res.redirect('/login'))
    }
}



module.exports = Controller