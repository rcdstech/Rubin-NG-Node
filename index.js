const express = require('express');
const app = express();
const routes = require('./server/');
const port = 3000;
app.use('/api', routes);
app.listen(port, (err) => {
  if(err) {
    console.log(err)
  }
  console.log('server running on ', port)
})
