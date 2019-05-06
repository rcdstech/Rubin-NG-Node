const express = require('express');
const ui = require('./bsipanel');
var cmd = require('./bsicommand');
const router = express.Router();
router.get('/enteremail', (req, res) => {
  var uiInput = new ui();

  uiInput.UiScreen = ({
    Title: "Email Submit",
    Operations: {
      Submit: "../xml/file/scan2email.json"
    }
  });
  uiInput.TextArea = ({
    Title: "Enter Email Address",
    Mask: true,
    Attributes: {
      id: "email",
    },
    LetterTypes: [
      'LowerCase',
      'Numeric',
      'Glyph'
    ]
  });
  console.log(uiInput.renderXml());
  res.send(uiInput.renderXml());
})
router.get('/toemail', (req, res) => {
  var uiInput = new ui();

  uiInput.UiScreen = ({
    Title: "Email Submit",
    Operations: {
      Submit: "../xml/file/scan2email.json"
    }
  });
  console.log(uiInput.renderXml());
  res.send(uiInput.renderXml());
})
router.post('/password', function (req, res) {
  var scan = new cmd();
  scan.IoScanAndSend = ({
    FileType: 'PDF'
  });
  scan.Scan2FTP = (req.body);
  res.send(scan.renderXml());

})

module.exports = router;
