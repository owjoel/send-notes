const dotenv = require('dotenv')
dotenv.config()

const auth_url = process.env.cognito_subdomain + "." + process.env.cognito_domain

async function exchangeCode(code) {
    // console.log(process.env["cognito_client-id"])
    // console.log(process.env.cognito_callback_url)
    return await fetch(`https://${auth_url}/oauth2/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: process.env["cognito_client-id"],
            redirect_uri: process.env.cognito_callback_url,
            code: code,
        })
    });


}

async function refreshTokens(refreshToken) {
    const response = await fetch(`https://${auth_url}/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: process.env["cognito_client-id"],
            refresh_token: refreshToken,
        }),
    });

    return await response.json();
}

module.exports = {exchangeCode, refreshTokens}
