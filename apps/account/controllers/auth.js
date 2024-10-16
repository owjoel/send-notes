const express = require('express');
const cookieParser = require('cookie-parser');

const dotenv = require('dotenv')

const app = express();



app.use(cookieParser());
dotenv.config()

const {exchangeCode, refreshTokens} = require("../services/auth.service");

async function auth(req, res){
    try {
        const {code} = req.query;

        const response = await exchangeCode(code);
        const tokens = await response.json()
        console.log(tokens)

        res.cookie('id_token', tokens["id_token"], {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        });

        res.cookie('access_token', tokens["access_token"], {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        });


        res.cookie('refresh_token', tokens["refresh_token"], {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        });

        res.cookie('auth', "true", {
            httpOnly: false,
            secure: true,
            sameSite: 'Strict'
        });

        const tokenIssuedAtInSeconds = Date.now();
        // const tokenMaxAge = tokenIssuedAtInSeconds + tokens["expires_in"] * 1000
        const tokenMaxAge = tokenIssuedAtInSeconds + 10 * 1000


        res.cookie('access_token_expire', tokenMaxAge, {
            httpOnly: false,
            secure: true,
            sameSite: 'Strict'
        });

        return res.status(response.status).json()
    }catch (e){
        return res.status(404).json()
    }
}

async function refreshToken(req, res){
    try {
        const refreshToken = req.cookies.refresh_token;

        const response = await refreshTokens(refreshToken).then();
        const tokens = await response.json();


        if (!response.ok) {
            res.clearCookie('id_token');
            res.clearCookie('access_token');
            res.clearCookie('refresh_token');
            res.clearCookie('access_token_expire');
            return res.status(400).json({"message": "session expired"})
        }

        res.cookie('id_token', tokens["id_token"], {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        });

        res.cookie('access_token', tokens["access_token"], {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        });
        console.log("HELLO:", tokens["access_token"])

        const tokenIssuedAtInSeconds = Date.now();
        const tokenMaxAge = tokenIssuedAtInSeconds + tokens["expires_in"] * 1000
        // const tokenMaxAge = tokenIssuedAtInSeconds + 10 * 1000


        res.cookie('access_token_expire', tokenMaxAge, {
            httpOnly: false,
            secure: true,
            sameSite: 'Strict'
        });

        return res.status(200).json({tokens})
    }catch (e){
        return res.status(404).json()
    }
}

async function isAuthenticated(req,  res){
    try{
        // const accessToken = jwtDecode(req.cookies.access_token);
        // console.log(accessToken);
        return res.status(200).json();
    }catch (e){
        return res.status(404).json()
    }

}

async function authTest(req, res){
    try{
        // Access cookies from the request
        const idToken = req.cookies.id_token; // Accessing specific cookie
        const accessToken = req.cookies.access_token;
        const refreshToken = req.cookies.refresh_token;

        console.log('ID Token:', idToken);
        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);

        return res.status(200).json({})
    }catch (e){
        return res.status(404).json()
    }
}

async function logout(req, res){
    try {
        res.clearCookie('id_token');
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        res.clearCookie('access_token_expire');
        res.clearCookie('auth')

        res.status(200).json({"message": "logged out"})
    }catch (e){
        return res.status(404).json()
    }
}

async function tokenValid(req,res){

    const accessToken = req.params.accessToken;

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
        return res.status(200).json({valid: true})
    } catch {
        console.log("Token not valid!");
        return res.status(400).json({valid: false})

    }
}





module.exports = {callback: auth, refreshToken, authTest, logout, isAuthenticated}
