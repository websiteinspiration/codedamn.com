import xdebug from 'debug'
import User from 'models/user'

const debug = xdebug('cd:redirectHello')

async function redirectHello(req, res, next) {
    if(!req.session.auth) {
        res.redirect('/login')
    } else if(!req.session.firstTime || !(await User.findDamner({username: req.session.user.username})).firstTime) {
        res.redirect('/panel')
    } else {
        next()
    }
}

export default redirectHello