const { User, Profile, Post, Tag, PostTag } = require('../models')

class Controller {
    static login (req, res){
        res.render('log-in')
    }

    static register (req, res){
        const {error} = req.query
        res.render('register', {error})
    }

    static registerPost (req, res){
        console.log(req.body)
        User.create(req.body)
            .then(_ => res.redirect('/'))
            // .catch(err => {
            //     const error = err.errors.map(x => {
            //         return x.message
            //     })
            //     res.redirect(`/register?error=${error}`)
            // })
    }
}

module.exports = Controller