/* eslint-disable indent */
/* eslint-disable max-len */
/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("sk_test_51O440wSGkCgHBrFZVBRiOfJc3V2zXfK8eGIPM8oDdhDtCHRmLoEZBkndtP4ZUz0Ee1JrqxFq7KYdtB0gJagXJdmg00JXz8XMhM");

// App config
const app = express();

// Middlewares
app.use(cors({origin: true}));
app.use(express.json());

// Api Routes
app.get("/", (request, response) => response.status(200).send("hello world"));

app.post("/payments/create", async (request, response) =>{
    const total = request.query.total;
    console.log("Payment Request Received!!!", total);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total, // subunits
        currency: "usd",
    });

    response.status(201).send({
        clientSecret: paymentIntent.client_secret,
    });
});
exports.api = functions.https.onRequest(app);

// http://127.0.0.1:5001/clone-a2247/us-central1/api

