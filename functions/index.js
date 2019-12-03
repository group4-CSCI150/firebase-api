
const functions = require("firebase-functions")
const express = require("express");
const cors = require('cors');

//const organizationRouter = require('./routes/organization')
const userRouter = require('./routes/user')
const chatRouter = require('./routes/chat')

/* Express */
const app = express();

app.use(cors({ origin: true }))
app.use('/user', userRouter)
app.use('/chat', chatRouter)
//app.use('/organization', organizationRouter)

const api = functions.https.onRequest(app)

module.exports = {
    api
}
