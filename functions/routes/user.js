const router = require("express").Router();
const firestore = require('../firestore')

var users = firestore.collection("Finder").doc("FS").collection("User");

router.route('/')
    .post((req, res) => {
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
        var doc = users.orderBy("name");
        var all = {'users' : []};
        doc.get().then(users => {
            users.forEach(element => {
                all['users'].push({"id": element.id,  "user": element.data(), message: "ALL users returned" });
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
                return res.status(200).json({ "id": user.id, "user": user.data(), message: "GOT USER by ID" });
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
            return res.status(200).json({"message": "Successful update"});
        }).catch(() => {
            return res.status(404).json({"message": "Fail"});
        })
    })
    .delete((req, res) => {
        var doc = users.doc(req.params.userId);
        doc.delete().then(() => {
            return res.status(200).json({"message": "Successful Delete"});
        }).catch(() => {
            return res.status(404).json({"message": "Fail"});
        })
    })
/*
router.route('/find/:username')
    .get((req, res) => {
        var doc = users.where("name", "=" ,req.params.username);
        var all = {'users' : []};
        doc.get().then(users => {
            users.forEach(element => {
                all['users'].push({"id": element.id,  "user": element.data() });
            });
            if (all['users'].isEmpty())
            {
                return res.status(200).json({"message": "No user found. USER"});
            }
            return res.status(200).json(all);
        }).catch((error) => {
            return res.status(400).json({ "message": "Unable to connect to Firestore. USER" });
        });
    })
*/
router.route('/login')
    .post((req, res) => {
        var doc = users.doc(req.body.username);
        doc.get().then(user => {
            if (user.exists && user.data()['password'] === req.body.password) {
                return res.status(200).json({ "id": user.id, "user": user.data() });
            } else {
                return res.status(404).json({ "message": "username or password incorrect." });
            }
        }).catch((error) => {
            return res.status(400).json({ "message": "Unable to connect to Firestore. USER" });
        });
    })

module.exports = router;
