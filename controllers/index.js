const { User, Profile, Post, Tag, PostTag } = require('../models')
const bcrypt = require('bcryptjs')
var emoji = require('node-emoji')
const dateFormat = require('../helpers/formatter')
const { Op } = require('sequelize')

class Controller {
    static login(req, res) {
        const { validation } = req.query
        res.render('log-in', { validation })
    }

    static register(req, res) {
        const { error } = req.query
        res.render('register', { error })
    }

    static registerPost(req, res) {
        User.create(req.body)
            .then(_ => res.redirect('/'))
            .catch(err => {
                const error = err.errors.map(x => {
                    return `${x.message}`
                }).join('\n')
                res.redirect(`/register?error=${error}`)
            })
    }

    static loginPost(req, res) {
        User.findOne({ where: { username: req.body.username } })
            .then(user => {
                if (user) {
                    if (user.username) {
                        let isValidPassword = bcrypt.compareSync(req.body.password, user.password)
                        if (isValidPassword) {
                            req.session.username = user.username
                            req.session.role = user.role
                            res.redirect('/checkprofile')
                        } else {
                            const validate = "Masa masih muda sudah pikun"
                            res.redirect(`/?validation=${validate}`)
                        }
                    }
                } else {
                    const validate = "Tolong di inget-inget lagi"
                    res.redirect(`/?validation=${validate}`)
                }
            })
            .catch(err => res.send(err))
    }

    static checkProfile(req, res) {
        const { error } = req.query
        User.findOne({ where: { username: req.session.username }, include: Profile })
            .then(user => {
                if (!user.Profile) {
                    console.log(user)
                    res.render('profile-add', { error })
                } else {
                    res.redirect(`/profile/${user.Profile.id}`)
                }
            })
            .catch(err => res.send(err))
    }

    static profileAdd(req, res) {
        User.findOne({ where: { username: req.session.username } })
            .then(user => {
                const { fullname, photo, bio, phone, gender } = req.body
                return Profile.create({ fullname, photo, bio, phone, gender, UserId: user.id })
            })
            .then(profile => res.redirect(`/profile/${profile.id}`))
            .catch(err => {
                const error = err.errors.map(x => {
                    return `${x.message}`
                }).join(' ')
                res.redirect(`/checkprofile?error=${error}`)
            })
    }

    static profile(req, res) {
        const { username } = req.session
        Profile.findOne({ where: { id: req.params.profileId }, include: [User, Post] })
            .then(profile => {
                res.render('profile', { profile, username, dateFormat })
            })
            .catch(err => res.send(err))
    }

    static profileEdit(req, res) {
        const error = req.query.error
        Profile.findByPk(req.params.profileId)
            .then(profile => {
                let gender = ["Cowo", "Cewe"]
                res.render('profile-edit', { profile, gender, error })
            })
            .catch(err => res.send(err))
    }

    static postEdit(req, res) {
        const { fullname, photo, phone, bio, gender } = req.body
        const profileId = req.params.profileId
        // res.send([req.body, profileId])
        Profile.update({ fullname, photo, phone, bio, gender }, { where: { id: profileId } })
            .then(() => res.redirect(`/profile/${profileId}`))
            .catch(err => {
                const error = err.errors.map(x => {
                    return `${x.message}`
                }).join('\n')
                res.redirect(`/profile/${profileId}/edit?error=${error}`)
            })
    }


    static profileHome(req, res) {
    const { error } = req.query
    const { validation } = req.query
    const { title, sort } = req.query
    let emoticon = [`${emoji.get('coffee')} NGOPI DULU`, `${emoji.get('pizza')} MAKAN DULU KUY`, `${emoji.get(':fast_forward:')} BURUAN KUY`, `${emoji.get("sleepy")} NGANTUK OY`]
    let option = { include: { all: true, nested: true } }

    let data = {}
    Post.scopeNotVacantPost(option, title, sort)  //dari static model Post
        .then(post => {
            data.post = post
            return User.findOne({ where: { username: req.session.username }, include: Profile })
        })
        .then(user => {
            data.user = user
            return Tag.findAll()
        })
        .then(tag => res.render('home', { ...data, tag, dateFormat, validation, emoticon, error }))
        .catch(err => res.send(err))
}

    static postContent(req, res) {
    const id = +req.params.profileId
    const { title, content, moodStatus } = req.body
    Post.create({ title, content, moodStatus, ProfileId: +id })
        .then(() => res.redirect('/home'))
        .catch(err => res.send(err))
}

    static postContentHome(req, res) {
    const { title, content, moodStatus, ProfileId, TagId } = req.body
    Post.create({ title, content, moodStatus, ProfileId })
        .then(post => {
            return PostTag.create({ PostId: post.id, TagId: TagId })
        })
        .then(_ => {
            res.redirect('/home')
        })
        .catch(err => {
            const error = err.errors.map(x => {
                return x.message
            })
            res.redirect(`/home?error=${error}`)
        })

}

    static allProfiles(req, res) {
    User.findAll({
        include: {
            model: Profile,
            required: true
        }
    })
        .then(users => {
            res.render('allusers', { users })
            // res.send(users)
        })
        .catch(err => res.send(err))
}

    static deleteUser(req, res) {
    const id = +req.params.userId
    console.log(req.params);
    const idToDelete = {}
    User.findByPk(id, { include: Profile })
        .then(data => {
            // console.log(data.Profile.id);
            idToDelete.user = data.id
            idToDelete.profile = data.Profile.id
            return Profile.destroy({ where: { id: idToDelete.profile } })
        })
        .then(() => {
            User.destroy({ where: { id: idToDelete.user } })
            res.redirect('/allprofiles')
        })
        .catch(err => res.send(err))
}

    static logout(req, res) {
    req.session.destroy((err) => res.redirect('/login'))
}

    static tag(req, res) {
    PostTag.findAll({ include: { all: true, nested: true }, where: { TagId: req.params.tagId } })
        .then(posttag => {
            let data = posttag[0].Tag.Posts
            let tag = posttag[0].Tag.name
            let tagId = posttag[0].Tag.id
            res.render('alltags', { data, tag, tagId, dateFormat })
            // res.send(posttag)
        })
        .catch(err => res.send(err))
}
}



module.exports = Controller