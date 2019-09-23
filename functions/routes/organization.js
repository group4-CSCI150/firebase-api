const router = require("express").Router();
const firestore = require('../firestore')

router.route('/')
    .post((req, res) => {
        var doc = firestore.collection("organization")
        doc.add(req.body)
            .then(org => {
                return res.status(200).json({ "id": org.id });
            }).catch((error) => {
                return res.status(400).json({ "message": "Unable to connect to Firestore. ORG" });
            });
    })

router.route('/:userId')
    .get((req, res) => {
        var doc = firestore.collection("organization").doc(req.params.userId);

        doc.get().then(org => {
            if (org.exists) {
                return res.status(200).json({ "id": org.id, "org": org.data() });
            } else {
                return res.status(400).json({ "message": "ORG ID not found." });
            }
        }).catch((error) => {
            return res.status(400).json({ "message": "Unable to connect to Firestore. ORG" });
        });
    });

module.exports = router;
