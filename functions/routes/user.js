const router = require("express").Router();

const firestore = require('../firestore')

router.route('/')
    .post((req, res) => {
        var doc = firestore.collection("userProfile")
        doc.add(req.body)
            .then(user => {
                return res.status(200).json({ "id": user.id });
            }).catch((error) => {
                return res.status(400).json({ "message": "Unable to connect to Firestore. USER" });
            });
    })

router.route('/:userId')
    .get((req, res) => {
        var doc = firestore.collection("userProfile").doc(req.params.userId);

        doc.get().then(user => {
            if (user.exists) {
                return res.status(200).json({ "id": user.id, "user": user.data() });
            } else {
                return res.status(400).json({ "message": "User ID not found." });
            }
        }).catch((error) => {
            return res.status(400).json({ "message": "Unable to connect to Firestore. USER" });
        });
    });

module.exports = router;