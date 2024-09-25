const express = require('express');
const cookieParser = require('cookie-parser');
const {jwtDecode} = require('jwt-decode')
const app = express();
app.use(cookieParser());

async function getSessionData(req, res){

    try {


        const idToken = jwtDecode(req.cookies.id_token);
        const accessToken = jwtDecode(req.cookies.access_token);


        const session = {
            id: accessToken.sub,
            username: accessToken.username,
            email: idToken.email
        }
        // console.log(session)
        res.status(200).json(session)
    }catch (e){
        res.status(400).json()
    }
}


async function getSessionData(req, res){

    try {


        const idToken = jwtDecode(req.cookies.id_token);
        const accessToken = jwtDecode(req.cookies.access_token);


        const session = {
            id: accessToken.sub,
            username: accessToken.username,
            email: idToken.email
        }
        // console.log(session)
        res.status(200).json(session)
    }catch (e){
        res.status(400).json()
    }
}

const {jwtDecode} = require('jwt-decode')
const cookieParser = require('cookie-parser');
app.use(cookieParser());






module.exports = {getSessionData}
