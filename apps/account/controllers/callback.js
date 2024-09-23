const express = require('express');
const app = express();

const {exchangeCode, refreshTokens} = require("../services/auth.service");


async function callback(req, res){
    const { code } = req.query;

    const tokens = await exchangeCode(code);

    return res.status(200).json({tokens})
}

async function refreshToken(req, res){
    const { refreshToken } = req.query;

    const tokens = await refreshTokens(refreshToken);

    return res.status(200).json({tokens})
}





module.exports = {callback, refreshToken}
