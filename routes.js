const fs = require('fs')

const requestHandler = (req, res) => {
  if (req.url === '/') {
    res.write('<html>')
    res.write('<head><title>Enter message</title></head>')
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message" /><button type="submit">Send</button></body>'
    )
    res.write('</html>')
    return res.end()
  }
  if (req.url === '/message' && req.method === 'POST') {
    const body = []
    req.on('data', chunk => {
      console.log(chunk)
      body.push(chunk)
    })
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString()
      const message = parsedBody.split('=')[1]
      fs.writeFile('newfile.txt', message, err => {
        res.writeHead(302, { Location: '/' })
        return res.end()
      })
    })
  }
  res.write('<html>')
  res.write('<head><title>Enter message</title></head>')
  res.write('<body><h1>Hello neighbor!</h1></body>')
  res.write('</html>')
  res.end()
}

module.exports = requestHandler
