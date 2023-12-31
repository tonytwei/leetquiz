const router = require('express').Router();

const authCheck = (req, res, next) => {
    if (!req.user) {
        // if user is not logged in
        res.redirect('/auth');
    } else {
        // if logged in
        next();
    }
};

router.get('/', authCheck, (req, res) => {
	console.log('account//User ID:', req.session.userId);
    res.render('account', { user: req.user});
});

module.exports = router;