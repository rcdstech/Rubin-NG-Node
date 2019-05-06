const express = require('express');
const router = express.Router();
const fs = require('fs');
const convert = require('xml-js');
const _ = require('lodash');
router.get('/file/:fileName', (req, res) => {
  fs.readFile(__dirname + '/' + req.params.fileName, 'utf8', function (err, data) {
    if (err) throw err;
    var options = {compact: true, ignoreComment: true, spaces: 4};
    var result = convert.json2xml(replaceValue(JSON.parse(data), 'Destination', 'Gajerarubin@gmail.com', '_text'), options);
    res.send(result);
  });
})
router.post('/file/:fileName', (req, res) => {
  fs.readFile(__dirname + '/' + req.params.fileName, 'utf8', function (err, data) {
    if (err) throw err;
    var options = {compact: true, ignoreComment: true, spaces: 4};
    var result = convert.json2xml(replaceValue(JSON.parse(data), 'Destination', req.body.email, '_text'), options);
    res.send(result);
  });
})

function replaceValue(object, keyToBeReplace, value, attr) {
  Object.keys(object)
    .forEach(key => {
      if(typeof object[key] === "object") {
        if(key === keyToBeReplace) {
          object[key][attr] = value
        } else {
          replaceValue(object[key], keyToBeReplace, value, attr)
        }
      }
      return key
    })
  return object;
}
module.exports = router;
