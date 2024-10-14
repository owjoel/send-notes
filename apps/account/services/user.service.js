const dotenv = require('dotenv')
const AWS = require('aws-sdk');
dotenv.config()

const cognito = new AWS.CognitoIdentityServiceProvider();

async function retrieveUser(sub){

    const userPoolId = process.env["cognito_userpool-id"]; // Replace with your Cognito User Pool ID

    const params = {
        UserPoolId: userPoolId,
        Filter: `sub = "${sub}"`    // The `sub` is used as the Username in Cognito
    };
    // console.log(params)
    try {
        const data = await cognito.listUsers(params).promise();

        const userData = data.Users[0]

        // Extract email and sub from Attributes
        const email = userData.Attributes.find(attr => attr.Name === "email").Value;
        const userId = userData.Attributes.find(attr => attr.Name === "sub").Value;
        console.log("T:", email)
// Create new object
        const newUserData = {
            username: userData.Username,
            email: email,
            id: userId,
            userCreateDate: userData.UserCreateDate,
            userStatus: userData.UserStatus
        };

        return newUserData;  // Return user info data (can be formatted)
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
    //
    // return {
    //     username: "only notes",
    //     email: "onlynotes.service@gmail.com"
    // }
}


module.exports = {retrieveUser}
