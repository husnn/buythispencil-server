module.exports = {
    httpProtocol: process.env.HTTP_PROTOCOL || "http",
    host: process.env.HOST || "0.0.0.0",
    port: process.env.PORT || 3000,
    clientUrl: "https://buythispencil.com" || process.env.CLIENT_URL,
    ipdata: {
        baseUrl: "https://api.ipdata.co",
        apiKey: process.env.IPDATA_API_KEY
    },
    aws: {
        accessKeyID: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'eu-west-1'
    },
    stripe: {
        pk: process.env.STRIPE_PK,
        sk: process.env.STRIPE_SK
    },
    sendinblue: {
        senderEmail: "hey@buythispencil.com",
        baseUrl: "https://api.sendinblue.com/v3",
        apiKey: process.env.SENDINBLUE_API_KEY
    }
}