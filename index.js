const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const routes = require('./server/');
const port = 3000;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use('/api', routes);
app.listen(port, (err) => {
  if(err) {
    console.log(err)
  }
  console.log('server running on ', port)
})
