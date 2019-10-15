
const functions = require("firebase-functions")
const express = require("express");
const organizationRouter = require('./routes/organization')

/* Express */
const app = express();

// app.use('/user', userRouter)
app.use('/organization', organizationRouter)

const api = functions.https.onRequest(app)

module.exports = {
    api
}
