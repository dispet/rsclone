const resObject = require('../api/resObject')

const auth = async (req, res, next) => {
    // Where to authenticate
    // Make sure you are logged in
    if(!req.session.userInfo){
        const response = resObject(403, false, 'No permission', null);
        res.send(response);
    }
    next();
}

module.exports = auth