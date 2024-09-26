const express = require('express');
const cookieParser = require('cookie-parser');
const {jwtDecode} = require('jwt-decode')
const app = express();
const {retrieveUser} = require("../services/user.service");

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

async function getUser(req, res){
    try {
        const sub  = req.params.id;

        if (!sub){
            return res.status(404).json({"error": "no id found"})
        }

        const user = await retrieveUser(sub)
        return res.status(200).json(user)
    }catch (e){
        return res.status(404).json()
    }
}






module.exports = {getSessionData, getUser}
