const express = require('express');
const app = express();

const {exchangeCode, refreshTokens} = require("../services/auth.service");


async function callback(req, res){
    const { code } = req.query;

    const tokens = await exchangeCode(code);

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

    console.log("CALLBACK")

    return res.status(200).json({message: "ok"})
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





module.exports = {callback, refreshToken}
