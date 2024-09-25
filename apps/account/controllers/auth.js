const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

const {exchangeCode, refreshTokens} = require("../services/auth.service");
const {jwtDecode} = require("jwt-decode");
const MILISECONDS_IN_SECONDS = 1000;

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


        const tokens = await refreshTokens(refreshToken);

        if (tokens.ok) {
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

        res.status(200).json()
    }catch (e){
        return res.status(404).json()
    }
}





module.exports = {callback: auth, refreshToken, authTest, logout, isAuthenticated}
