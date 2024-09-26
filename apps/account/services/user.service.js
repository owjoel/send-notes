const dotenv = require('dotenv')
dotenv.config()

async function retrieveUser(sub){
    return {
        username: "only notes",
        email: "onlynotes.service@gmail.com"
    }
}


module.exports = {retrieveUser}
