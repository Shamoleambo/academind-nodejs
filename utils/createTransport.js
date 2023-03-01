const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const dotenv = require('dotenv')

dotenv.config()

module.exports = async () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  )
  oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })

  const accessToken = await oauth2Client.getAccessToken()

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken
    }
  })
}
