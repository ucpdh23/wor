const express = require('express')
const app = express()
const port = process.env.PORT || 5000

/*app.get('/', (req, res) => {
  res.send('Hello World!')
})
*/
// Middlewares
app.use(express.json());

// routes
app.use('/api/stage', require('./routes/stage'));

app.use(express.static(__dirname + '/public'));



// Server is listening
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})