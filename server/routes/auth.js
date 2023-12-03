const router = require('express').Router();
const passport = require('passport');

const authCheck = (req, res, next) => {
    if (req.user) {
        // if user is logged in
        req.session.userId = req.user.id;
        console.log('auth//User ID:', req.session.userId);
        res.redirect('/account');
    } else {
        // if logged in
        next();
    }
};

router.get('/', authCheck, (req, res) => {
    res.render('auth');
});

// auth login
// TODO: delete?
router.get('/login', (req, res) => {
    res.render('login');
});

// auth logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
            return;
        }
      });
    res.redirect('/auth');
});

// auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    //res.send(req.user);
    res.redirect('/auth');
});

module.exports = router;