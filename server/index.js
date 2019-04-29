const express = require('express');
const ui = require('./bsipanel');
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
module.exports = router;
