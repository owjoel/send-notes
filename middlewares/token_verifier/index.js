const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv')
const {CognitoJwtVerifier} = require("aws-jwt-verify");

const app = express();

app.use(cookieParser());
dotenv.config()

// const cors = require('cors');
//
// app.use(cors({
//     origin: process.env.frontend_cors,
//     credentials: true,
// }));

async function tokenValid(req,res, next){

    const accessToken = req.cookies.access_token;

    const verifier = CognitoJwtVerifier.create({
        userPoolId: process.env["cognito_userpool-id"],
        tokenUse: "access",
        clientId: process.env["cognito_client-id"],
    });

    try {
        const payload = await verifier.verify(
            accessToken // the JWT as string
        );
        console.log("Token is valid. Payload:", payload);
        next();
    } catch {
        console.log("Token not valid!");
        return res.status(401).json({errorMessage: "Unauthorized access"})
    }
}

module.exports = {tokenValid}