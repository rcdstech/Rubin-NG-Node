/** demo: scan to ftp - panel interaction
 *	Berard McLaughlin
 */

var et = require('elementtree');
var ElementTree = et.ElementTree;
var element = et.Element;
var subElement = et.SubElement;
var pd = require('pretty-data').pd;
var logger = require("winston-color");


"use strict";

/**
 * @class Base Class
 * @namespace bsi
 */
class bsiScreenObject {

    constructor () {
        this._root = element('SerioCommands');
        this._root.set('version', '1.2');
    }
    /**
     * @namespace bsi.bsiObject
     * @method renderXml
     * @desc renderXml Generates bsi XML formatted in human readable form (pretty printed)
     * @desc renderXml(cdataToken is replaced with proper CDATA structure and xmlToken is replaced with xml declaration after XML is formated)
     */
    renderXml () {
        this._etree = new ElementTree(this._root);
        this._xml = this._etree.write({'xml_declaration': true});
        this._s = pd.xml(this._xml);
        this._s = this._s.replace("<cdataToken>", "<![CDATA[").replace("</cdataToken>", "]]>").replace("<xmlToken />", "<?xml version='1.0' encoding='utf-8'?>");
        return this._s;
    }
    /**
     * @namespace bsi.bsiObject
     * @method isPlainObject
     * @desc isPlainObject returns true if o is a 'plain' object, i.e. {key1: val, key2: val, ...}, otherwise returns false
     */
    isPlainObject(o) {
        if ((o === null) || (Array.isArray(o)) || (typeof o == 'function')) {
            return false;
        } else {
            return (typeof o == 'object');
        }
    }
}

class DisplayForm extends bsiScreenObject {

    constructor (operations = null) {
        super();
        this._DisplayForm = subElement(this._root, 'DisplayForm');
        this._Script = subElement(this._DisplayForm, 'Script');
        this._cdataToken = subElement(this._Script, 'cdataToken');
        //this._xmlToken = subElement(this._cdataToken, 'xmlToken');
    }
}

class UiScreen extends DisplayForm {

    constructor (operations = null) {
        super();
        this._UiScreen = subElement(this._cdataToken, 'UiScreen');
    }

    Operation (OpValues = {}) {

        for (var ops in OpValues){

            if (OpValues.Operations.Back) {
                this._Op = subElement(this._Operations, 'Op');
                this._Op.set('type', 'Back');
                this._Op.set('action', OpValues.Operations.Back);
            } else if (OpValues.Operations.hasOwnProperty('Back')){
                this._Op = subElement(this._Operations, 'Op');
                this._Op.set('type', 'Back');
            }
            if (OpValues.Operations.Submit) {
                this._Op2 = subElement(this._Operations, 'Op');
                this._Op2.set('type', 'Submit');
                this._Op2.set('action', OpValues.Operations.Submit);
            } else if (OpValues.Operations.hasOwnProperty('Submit')){
                this._Op2 = subElement(this._Operations, 'Op');
                this._Op2.set('type', 'Submit');
            }
        }
    }

    UiScreenSettings (UiSettings = {}) {

        if (UiSettings.Title) {
            this._IoObjectTitle = subElement(this._UiScreen, 'Title');
            this._IoObjectTitle.text = UiSettings.Title;
        }
        if (UiSettings.AutoTransition) {
            this._IoObjectAutoTransition = subElement(this._UiScreen, 'AutoTransition');
            this._IoObjectAutoTransition.text = UiSettings.AutoTransition;
        }
        if (UiSettings.Operations) {
            this._Operations = subElement(this._UiScreen, 'Operations');
            this.Operation({Operations: UiSettings.Operations});
        }
    }
}

class IoScreen extends UiScreen {

    constructor () {
        super();
        this._IoScreen = subElement(this._UiScreen, 'IoScreen');
    }

    set UiScreen (UiSettings = {}) {
        super.UiScreenSettings(UiSettings);
    }

    set Selection (parameters = {}) {
        this._IoObject = subElement(this._IoScreen, 'IoObject');
        this._Selection = subElement(this._IoObject, 'Selection');

        if (parameters.Attributes) {

            if (super.isPlainObject(parameters.Attributes)){

                if (parameters.Attributes.id) {
                    this._Selection.set('id', parameters.Attributes.id);
                } else {
                    logger.error("Selection Attributes must have 'id'");
                }
                if (parameters.Attributes.multiple) {
                    this._Selection.set('multiple', parameters.Attributes.multiple);
                } else {
                    logger.error("Selection Attributes must have 'multiple' = true or false");
                }
                if (parameters.Attributes.minSelectNum) {
                    this._Selection.set('minSelectNum', parameters.Attributes.minSelectNum);
                }
                if (parameters.Attributes.maxSelectNum) {
                    this._Selection.set('maxSelectNum', parameters.Attributes.maxSelectNum);
                }
            } else {
                logger.error("'Attributes' must be passed in as objects i.e. {key: val}");
            }
        } else {
            logger.error("Attributes must contain, 'id' and 'multiple' see schema");
        }
        if (parameters.Items) {

            if (Array.isArray(parameters.Items)){

                for (var Item in parameters.Items){

                    this._Item = subElement(this._Selection, 'Item');

                    if (parameters.Items[Item].selected) {
                        this._Item.set('selected', parameters.Items[Item].selected);
                    }
                    if (parameters.Items[Item].value) {
                        this._Item.set('value', parameters.Items[Item].value);
                    } else {
                        logger.error("'Item' must contain a 'value' attribute");
                    }
                    if (parameters.Items[Item].Label) {
                        this._Label = subElement(this._Item, 'Label');
                        if (super.isPlainObject(parameters.Items[Item].Label)) {
                            if (parameters.Items[Item].Label.imgsrc) {
                                this._Label.set('imgsrc', parameters.Items[Item].Label.imgsrc);
                            } else {
                                logger.error("Invalid 'Label' attribute. see schema");
                            }
                        } else {
                            this._Label.text = parameters.Items[Item].Label;
                        }
                    }
                }
            } else {
                logger.error("'Items' must be passed in as an array of 'Item' object(s)");
            }
        } else {
            logger.error("'Selection' must contain at least 1 'Item' to select");
        }
    }

    set TextArea (parameters = {}) {
        this._IoObject = subElement(this._IoScreen, 'IoObject');
        this._TextArea = subElement(this._IoObject, 'TextArea');

        if (parameters.Attributes) {
            if (super.isPlainObject(parameters.Attributes)){

                if (parameters.Attributes.id) {
                    this._TextArea.set('id', parameters.Attributes.id);
                } else {
                    logger.error("TextArea Attributes missing 'id'");
                }
                if (parameters.Attributes.priorInput) {
                    this._TextArea.set('priorInput', parameters.Attributes.priorInput);
                }
                if (parameters.Attributes.cpos) {
                    this._TextArea.set('cpos', parameters.Attributes.cpos);
                }
            } else {
                logger.error("'Attributes' must be passed as objects i.e. {key: val}");
            }
        } else {
            logger.error("Missing 'Attributes'. Attributes must contain, at least, a value for 'id' i.e. Attributes: {'id': 'myId'}");
        }

        if (parameters.InitValue) {
            this._InitValue = subElement(this._TextArea, 'InitValue');
            this._InitValue.text = parameters.InitValue;
        }
        if (parameters.MinLength) {
            this._MinLength = subElement(this._TextArea, 'MinLength');
            this._MinLength.text = parameters.MinLength;
        }
        if (parameters.MaxLength) {
            this._MaxLength = subElement(this._TextArea, 'MaxLength');
            this._MaxLength.text = parameters.MaxLength;
        }
        if (parameters.Mask) {
            this._Mask = subElement(this._TextArea, 'Mask');
            this._Mask.text = parameters.Mask;
        }
        if (parameters.LetterType) {
            this._LetterTypes = subElement(this._TextArea, 'LetterTypes');
            this._LetterType = subElement(this._LetterTypes, 'LetterType');
            this._LetterType.text = parameters.LetterType;
        }
        if (parameters.LetterTypes) {
            if (Array.isArray(parameters.LetterTypes)){
                this._LetterTypes = subElement(this._TextArea, 'LetterTypes');
                for (this._i = 0, this._len = parameters.LetterTypes.length; this._i < this._len; this._i++) {
                    this._LetterType = subElement(this._LetterTypes, 'LetterType');
                    this._LetterType.text = parameters.LetterTypes[this._i];
                }
            } else {
                logger.error("LettersTypes must be passed as an array of string values, i.e. ['UpperCase','LowerCase', '...']");
            }
        }
        if (parameters.Title) {
            this._TextAreaTitle = subElement(this._TextArea, 'Title');
            this._TextAreaTitle.text = parameters.Title;
        }
        if (parameters.Description) {
            this._TextAreaDescription = subElement(this._TextArea, 'Description');
            this._TextAreaDescription.text = parameters.Description;
        }
    }
}

/***************************************************************** Module Exports **********************************************************/

module.exports = UiScreen;
module.exports = IoScreen;

/******************************************************************** TESTS ****************************************************************/


/*
// IoScreen Tests
var uiInput = new IoScreen();
var submit = "../doSomething"

uiInput.UiScreen = ({
	Title: "UiScreen Title",
	AutoTransition: 30,
	Operations: {
		Submit: submit,
		Back: "../goHome"
	}
});

uiInput.TextArea = ({
	Title: "My Screen Title",
	Description: "This is screen 1",
	MinLength: 2,
	MaxLength: 10,
	InitValue: 2,
	Mask: true,
	Attributes: {
		id: "screen1",
		cpos: 1,
		priorInput: "Lowercase"
	},
	LetterTypes: [
		'UpperCase',
		'LowerCase',
		'Numeric',
		'Glyph'
	]
})


console.log(uiInput.renderXml())
*/


// Selection tests
/*
var Input = new IoScreen();
Input.UiScreen = ({
	Title: 'UiScreen Title',
	AutoTransition: 30,
	Operations: {
		Submit: '../doSomething',
		Back: '../goHome'
	}
});
Input.Selection = ({
	Attributes: {
		id: 'selected',
		multiple: 'true'
	},
	Items: [
		{
			Label: {imgsrc: '../images/image1.jpg'},
			//Label: 'selection 1',
			value: '1',
			selected: 'false'
		},
		{
			Label: 'selection 2',
			value: '2',
			selected: 'true'
		}
	]
})

console.log(Input.renderXml());
*/
