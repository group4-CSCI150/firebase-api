const { body, oneOf, param, validationResult } = require('express-validator');
const errorFormater = ({ location, msg, param, value, nestedErrors }) => `${msg}`;
const firestore = require('../firestore')

var users = firestore.collection("Finder").doc("FS").collection("User");

module.exports = {
    post: [
        body('username')
            .not().isEmpty().withMessage("username is empty")
            .isString().withMessage("incorrect username")
            .custom(async (value, {req}) => {
                var doc = users.doc(req.body.username)
                doc.get().then(function(user) {
                    if (user.exists) {
                        throw Error('username already in use');
                    }else{
                        return;
                    }
                }).catch((error) => {
                    return res.status(400).json({ "message": "Unable to connect to Firestore. USER" });
                });
            }),
        body('email')
            .not().isEmpty().withMessage("email is empty")
            .isString().withMessage("incorrect username")
            .isEmail().withMessage("not an e-mail")
            .custom(async (value, {req}) => {
                var doc = users.where('email','=', req.body.email)
                doc.get().then(function(user) {
                    if (user.exists) {
                        throw Error('e-mail already in use');
                    }else{
                        return;
                    }
                }).catch((error) => {
                    return res.status(400).json({ "message": "Unable to connect to Firestore. USER" });
                });
            }),
        body('password')
            .not().isEmpty().withMessage("password is empty")
            .isString().withMessage("incorrect password"),
        (req, res, next) => {
            const errors = validationResult(req).formatWith(errorFormater);
            if (!errors.isEmpty()) {
              return res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
            }
        return next();
        }
    ],
    put: [
        
    ],
    login: [
        body('username')
            .not().isEmpty().withMessage("username is empty")
            .isString().withMessage("incorrect username"),
        body('password')
            .not().isEmpty().withMessage("password is empty")
            .isString().withMessage("incorrect password"),
        (req, res, next) => {
            const errors = validationResult(req).formatWith(errorFormater);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array({ onlyFirstError: true }) });
            }
        return next();
        }
    ]
}