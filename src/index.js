const express = require('express')
const app = express()
const port = process.env.PORT || 5000

/*app.get('/', (req, res) => {
  res.send('Hello World!')
})
*/
// Middlewares

// Routes
app.use(express.static(__dirname + '/public'));

// Server is listening
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})