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
    fs.writeFileSync('newfile.txt', 'Down with the sickness!!')
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
