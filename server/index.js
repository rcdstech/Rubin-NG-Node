const express = require('express');
const ui = require('./bsipanel');
var cmd = require('./bsicommand');
const router = express.Router();
router.get('/textArea', (req, res) => {
  var uiInput = new ui();

  uiInput.UiScreen = ({
    Title: "Password Entry",
    Operations: {
      Submit: "../scan"
    }
  });
  uiInput.TextArea = ({
    Title: "Enter FTP password",
    Mask: true,
    Attributes: {
      id: "password",
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

router.post('/password', function (req, res) {
  var scan = new cmd();
  scan.IoScanAndSend = ({
    FileType: 'PDF'
  });
  scan.Scan2FTP = ({
    Host: '205.134.48.7',
    FileName: 'testFile',
    StoreDir: 'nodeJS',
    User: 'fsengineers',
    Password: req.body.password
  });
  res.send(scan.renderXml());

})

module.exports = router;
