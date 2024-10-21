const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv')
const {CognitoJwtVerifier} = require("aws-jwt-verify");
const {jwtDecode} = require('jwt-decode');

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

    if(!accessToken){
        console.log("Token not valid!");
        return res.status(401).json({errorMessage: "Unauthorized access"})
    }

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

function getValueFromJwt(jwt, key){
    const decodedToken = jwtDecode(jwt);
    const value = decodedToken[key];
    return value
}

function getUsername(req){
    const idToken = req.cookies.id_token;
    return getValueFromJwt(idToken,"cognito:username")
}

function getEmail(req){
    const idToken = req.cookies.id_token;
    return getValueFromJwt(idToken,"email")
}

function getId(req){
    const idToken = req.cookies.id_token;
    return getValueFromJwt(idToken,"sub")
}

module.exports = {tokenValid, getUsername, getEmail, getId}