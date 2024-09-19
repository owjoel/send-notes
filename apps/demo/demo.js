exports.handler = async (event) => {
    console.log('Event: ', event);
    let responseMessage = 'Hello :)';

    if (event.queryStringParameters && event.queryStringParameters['name']) {
        responseMessage = 'Hello, ' + event.queryStringParameters['name'];
    }

    if (event.httpMethod === 'POST') {
        const body = JSON.parse(event.body);
        responseMessage = 'Hello, ' + body.name;
    }

    const res = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: responseMessage
        }),
    };

    return response;
};