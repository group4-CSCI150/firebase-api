const router = require("express").Router();
const firestore = require('../firestore')

var finder = firestore.collection("Finder");

/*router.use('*', (req, res, next) => {
    Users = firestore.collection("Finder").doc(req.params.orgId).collection("User");
    return next();
})
*/
router.route('/:orgId')
    .post((req, res) => {
        var doc = finder.doc(req.parans.orgId).collection("User");
        if (req.body)
        doc.add(req.body)
            .then(user => {
                return res.status(200).json({ "id": user.id });
            }).catch((error) => {
                return res.status(400).json({ "message": "Unable to connect to Firestore. USER" });
            });
    })
    .get((req, res) => {
        var doc = finder.doc(req.parans.orgId).collection("User").orderBy("name");
        var all = {'users' : []};
        doc.get().then(users => {
            users.forEach(element => {
                all['users'].push({"id": element.id,  "user": element.data() });
            });
            return res.status(200).json(all);
        }).catch((error) => {
            return res.status(400).json({ "message": "Unable to connect to Firestore. USER" });
        });
    })

router.route('/:orgId/:userId')
    .get((req, res) => {
        var doc = firestore.collection("Finder").doc(req.params.orgId).collection("User").doc(req.params.userId);
        doc.get().then(user => {
            if (user.exists) {
                return res.status(200).json({ "id": user.id, "user": user.data() });
            } else {
                return res.status(404).json({ "message": "User ID not found." });
            }
        }).catch((error) => {
            return res.status(400).json({ "message": "Unable to connect to Firestore. USER" });
        });
    })
    .put((req, res) => {
        var doc = finder.doc(req.parans.orgId).collection("User").doc(req.params.userId);
        doc.update(req.body).then(() => {
            return res.status(200).json({"message": "Successful update"});
        }).catch(() => {
            return res.status(404).json({"message": "Fail"});
        })
    })
    .delete((req, res) => {
        var doc = finder.doc(req.parans.orgId).collection("User").doc(req.params.userId);
        doc.delete().then(() => {
            return res.status(200).json({"message": "Successful Delete"});
        }).catch(() => {
            return res.status(404).json({"message": "Fail"});
        })
    })

router.route('/:orgId/find/:username')
    .get((req, res) => {
        var doc = finder.doc(req.parans.orgId).collection("User").where("name", "=" ,req.params.username);
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

router.route('/login/:orgId/:userId/:pass')
    .get((req, res) => {
        var doc = firestore.collection("Finder").doc(req.params.orgId).collection("User").doc(req.params.userId);
        doc.get().then(user => {
            if (user.exists && user.data()['pass'] === req.params.pass) {
                return res.status(200).json({ "id": user.id, "user": user.data() });
            } else {
                return res.status(404).json({ "message": "git gud" });
            }
        }).catch((error) => {
            return res.status(400).json({ "message": "Unable to connect to Firestore. USER" });
        });
    })

module.exports = router;
