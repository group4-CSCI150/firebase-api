
const functions = require("firebase-functions")
const express = require("express")
const admin = require('firebase-admin');

const userRouter = require('./routes/index')

/* Express */
const app = express();

app.use('/user', userRouter)

const api = functions.https.onRequest(app)

module.exports = {
    api
}
