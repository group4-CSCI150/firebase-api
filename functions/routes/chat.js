const router = require("express").Router();
const firestore = require('../firestore')
const validator = require('../validator/validator')

var messageCollection = firestore.collection("Finder").doc("FS").collection("ChatMessages");
var userCollection = firestore.collection("Finder").doc("FS").collection("User");


async function authenticate(username, identifier) {
    try {
        var user = await userCollection.doc(username).get();
        if (user.exists) {
            if (identifier.password) {
                return user.data().password === identifier.password;
            }
            else if (identifier.token) {
                return user.data().token === identifier.token;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    catch (error) {
        return false;
    }
}


async function sendMessage(req, res) {
    if (!req.body || !req.body.from || !req.body.to || !req.body.text || !req.body.createdAt) {
        return res.status(400).json({ message: 'Invalid request' });
    }
    auth = await authenticate(req.body.from, {password: req.body.password, token: req.body.token});
    if (!auth) {
        return res.status(400).json({ message: 'Authentication failed' });
    }
    
    try {
        let msg = await messageCollection.add({
            _id: 1,
            from: req.body.from,
            to: req.body.to,
            text: req.body.text,
            createdAt: req.body.createdAt,
            avatar: 'https://placeimg.com/140/140/any', // placeholder
        });
        return res.status(200).json({ message: 'Success' });
    }
    catch (error) {
        return res.status(400).json({ message: 'Error adding message to collection' });
    }
}

async function getMessages(req, res) {
    // req.body.username is the username of the user asking for the messages
    // req.body.from is the user that sent the message to username
    if (!req.body.username || !req.body.from) {
        return res.status(400).json({ message: 'Invalid request' });
    }
    auth = await authenticate(req.body.username, {password: req.body.password, token: req.body.token});
    if (!auth) {
        return res.status(400).json({ message: 'Authentication failed' });
    }
    
    // Retrieve messages
    try {
        var messagesQuery = messageCollection.where("to", "==", req.body.username).where("from", "==", req.body.from);
        var messages = await messagesQuery.get();
        var responseData = { newMessages: [], numOfNewMessages: messages.size, message: 'incomplete' };
        if (messages.size > 0) {
            responseData.queryReturned = true;
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
                        createdAt: messageData.createdAt,
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
    catch (error) {
        return res.status(400).json({ message: 'Unable to retrieve chat messages' });
    }
}

router.route('/') 
    .post(async (req, res) => {
        if (!req.body || !req.body.requestType) {
            return res.status(400).json({ message: 'Invalid request' })
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