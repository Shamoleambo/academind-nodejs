const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
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
    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString()
      const message = parsedBody.split('=')[1]
      fs.writeFileSync('newfile.txt', message)
    })
    res.writeHead(302, { Location: '/' })
    return res.end()
  }
  res.write('<html>')
  res.write('<head><title>Enter message</title></head>')
  res.write('<body><h1>Hello neighbor!</h1></body>')
  res.write('</html>')
  res.end()
})

server.listen(3000)
