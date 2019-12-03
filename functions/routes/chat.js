const router = require("express").Router();
const firestore = require('../firestore')
const validator = require('../validator/validator')

var messageCollection = firestore.collection("Finder").doc("FS").collection("ChatMessages");

async function sendMessage(req, res) {
    if (!req.body || !req.body.from || !req.body.to || !req.body.text) {
        return res.status(200).json({ message: 'Invalid request' });
    }
    var reqUsername = req.body.from;
    try {
        let msg = await messageCollection.add({
            _id: 1,
            from: req.body.from,
            to: req.body.to,
            text: req.body.text,
            avatar: 'https://placeimg.com/140/140/any', // placeholder
        });
        return res.status(200).json({ message: 'Success' });
    }
    catch(error) {
        return res.status(400).json({ message: 'Error adding message to collection' });
    }
}

async function getMessages(req, res) {
    if (!req.body.username) {
        return res.status(400).json({ message: 'Invalid request' });
    }
    var reqUsername = req.body.username;

    // Retrieve messages
    try {
        var messages = await messageCollection.where("to", "==", reqUsername).get();
        var responseData = { newMessages: [], numOfNewMessages: messages.size, message: 'incomplete' };
        if (messages.size > 0) {
            messages.forEach( (message) => {
                // Retrieve message data and place it into messageData
                messageData = message.data();
                // Add relevant message data to the responseData newMessages array
                responseData.newMessages.push(
                    {
                        _id: 1,
                        from: messageData.from,
                        to: messageData.to,
                        text: messageData.text,
                        avatar: 'https://placeimg.com/140/140/any', // placeholder
                    }
                )
                // Finally, delete this document from the collection
                message.ref.delete();
            });
            responseData.message = 'Success';
            return res.status(200).json(responseData);
        }
        else {
            // No messages were sent to this user, so return an empty array
            responseData.message = 'Success';
            return res.status(200).json(responseData);
        }
    }
    catch(error) {
        return res.status(400).json({ message: 'Unable to retrieve chat messages' });
    }
}

router.route('/') 
    .post(async (req, res) => {
        if (!req.body || !req.body.requestType) {
            return res.status(200).json({ message: 'Invalid request' })
        }

        if (req.body.requestType === 'sendMessage') {
            return await sendMessage(req, res);
        }
        else if (req.body.requestType === 'getMessages') {
            return await getMessages(req, res);
        }
        else {
            return res.status(400).json({ message: 'Invalid request type' });
        }
    })

module.exports = router;