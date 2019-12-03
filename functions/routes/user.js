const router = require("express").Router();
const firestore = require('../firestore')
const validator = require('../validator/validator')
const Multer = require('multer')
const admin = require('firebase-admin');

//var storage = firestore.storage();
var users = firestore.collection("Finder").doc("FS").collection("User");

router.route('/')
    .post(validator.post, (req, res) => {
        var doc = users;
        if (req.body)
            doc.doc(req.body.username).set(req.body)
                .then(user => {
                    return res.status(200).json({ "id": user.id, message: "USER CREATED" });
                }).catch((error) => {
                    return res.status(400).json({ "message": "Unable to connect to Firestore. USER" });
                });
    })
    .get((req, res) => {
        var doc = users
        var all = { 'users': [] };
        doc.get().then(users => {
            users.forEach(element => {
                var userdata = element.data();
                delete userdata['password'];
                all['users'].push({"user": userdata, message: "ALL users returned" });
            });
            return res.status(200).json(all);
        }).catch((error) => {
            return res.status(400).json({ "message": "Unable to connect to Firestore. USER" });
        });
    })

router.route('/byID/:userId')
    .get((req, res) => {
        var doc = users.doc(req.params.userId);
        doc.get().then(user => {
            if (user.exists) {
                var userdata = user.data();
                delete userdata['password'];
                return res.status(200).json({"user": userdata, message: "GOT USER by ID" });
            } else {
                return res.status(404).json({ "message": "User ID not found." });
            }
        }).catch((error) => {
            return res.status(400).json({ "message": "Unable to connect to Firestore. USER" });
        });
    })
    .put((req, res) => {
        var doc = users.doc(req.params.userId);
        doc.update(req.body).then(() => {
            return res.status(200).json({ "message": "Successful update" });
        }).catch(() => {
            return res.status(404).json({ "message": "Fail" });
        })
    })
    .delete((req, res) => {
        var doc = users.doc(req.params.userId);
        doc.delete().then(() => {
            return res.status(200).json({ "message": "Successful Delete" });
        }).catch(() => {
            return res.status(404).json({ "message": "Fail" });
        })
    })

router.route('/byIDList/:userId')
    .get((req, res) => {
        var all = { 'users': [] };
        var doc = users.where("friends", "array-contains", req.params.userId);
        doc.get().then(users => {
            users.forEach(element => {
                var userdata = element.data();
                delete userdata['password'];
                all['users'].push(userdata);
            });
            return res.status(200).json(all);
        }).catch((error) => {
            return res.status(400).json({ "message": "Unable to connect to Firestore. USER" });
        });
    })

router.route('/friendList')
    .post((req, res) => {
        var array = req.body['friends'];
        firestore.runTransaction(t => {
            var all = { 'users': [] };
            array.forEach(user => {
                t.get(user).then(doc => {
                    var userdata = doc.data();
                    delete userdata['password'];
                    all['users'].push(userdata);
                    return;
                }).catch((error) => {return})
            });
            return all;
        }).then(result => {
            return res.status(200).json(result);
        }).catch((error) => {
            return res.status(400).json({ "message": "Unable to connect to Firestore. USER" });
        });
    })

router.route('/addFriend')
    .put((req, res) => {
        var doc0 = users.doc(req.body.users[0]);
        var doc1 = users.doc(req.body.users[1]);

        var batch = firestore.batch();
        batch.update(doc0, {friends: admin.firestore.FieldValue.arrayUnion(req.body.users[1])});
        batch.update(doc1, {friends: admin.firestore.FieldValue.arrayUnion(req.body.users[0])});

        return batch.commit().then(b => {
            return res.status(200).json({ "message": "Friend added."});
        }).catch((error) => {
            return res.status(400).json({ "message": "Unable to connect to Firestore. USER" });
        });
    })

router.route('/login')
    .post(validator.login, (req, res) => {
        var doc = users.doc(req.body.username);
        doc.get().then(user => {
            if (user.exists && user.data()['password'] === req.body.password) {
                var userdata = user.data();
                delete userdata['password'];
                return res.status(200).json({ "user": userdata });
            } else {
                return res.status(404).json({ "message": "username or password incorrect." });
            }
        }).catch((error) => {
            return res.status(400).json({ "message": "Unable to connect to Firestore. USER" });
        });
    })

router.route('/finder')
    .post((req, res) => {
        var tags = req.body['tags'];
        var doc = users;

        if(tags.length === 0)
        {
            return res.status(400).json({ "message": "no tags send." });
        }
        //.where("tags", "array-contains", tags[0]);
        /*
        tags.forEach(tag => {
            doc.where("tags", "array-contains", tag);
        });
        */
        var all = {'users' : []};
        
        doc.get().then(users => {
            users.forEach(user => {
                tags.forEach(tag => {
                    if (user.data()["username"] !== req.body.user)
                    {
                        if (user.data().hasOwnProperty('tags'))
                        {
                            user.data()['tags'].forEach(utag => {
                                if (utag === tag)
                                {
                                    var userdata = user.data();
                                    delete userdata['password'];
                                    all['users'].push( userdata );
                                }
                            }) 
                        }
                    }
                });
            });
            return res.status(200).json(all);
        }).catch((error) => {
            return res.status(400).json({ "message": "Unable to connect to Firestore. USER" });
        });
    })
/*
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

router.route('/uploadImage/:userId')
    .post(multer.single('file'), (req, res) => {
        console.log('1')
        var ref = storage.ref().child(req.params.userId + ".jpg");
        console.log('2')
        ref.put(req.file).then(user => {
            return res.status(200).json({ "message": "Successful Upload." });
        }).catch((error) => {
            return res.status(400).json({ "message": "Unable to connect to Firestore. USER" });
        });
    })
*/
module.exports = router;
