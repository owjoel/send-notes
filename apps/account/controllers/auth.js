const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

const {exchangeCode, refreshTokens} = require("../services/auth.service");


async function auth(req, res){
    const { code } = req.query;

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


    return res.status(response.status).json()
}

async function refreshToken(req, res){
    const { refreshToken } = req.query;

    const tokens = await refreshTokens(refreshToken);

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

    return res.status(200).json({tokens})
}

async function authTest(req, res){
    // Access cookies from the request
    const idToken = req.cookies.id_token; // Accessing specific cookie
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    console.log('ID Token:', idToken);
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);

    return res.status(200).json({})
}





module.exports = {callback: auth, refreshToken, authTest}
