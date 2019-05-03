/** demo: scan to ftp
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
class bsiCommandObject {

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
/**
 * @class extends Base Class
 * @namespace bsi.Command
 */
class Command extends bsiCommandObject {

    constructor () {
        super();
    }

    renderXml() {
        return super.renderXml();
    }

    set IoScanAndSend (scanSettings = {}) {
        this._IoScanAndSend = subElement(this._root, 'IoScanAndSend');
        this._TxProfiles = subElement(this._IoScanAndSend, 'TxProfiles');
        if (scanSettings.JobFinAckUrl){
            this._JobFinAckUrl = subElement(this._IoScanAndSend, 'JobFinAckUrl');
            this._JobFinAckUrl.text = scanSettings.JobFinAckUrl;
        }
        if (scanSettings.FileType){
            this._FileType = subElement(this._IoScanAndSend, 'FileType');
            this._FileType.text = scanSettings.FileType;
        }
    }

    set Scan2FTP (ftpProfile = {}) {

        this.ftpMissing = "FtpParams is missing ";
        this._Ftp = subElement(this._TxProfiles, 'Ftp');
        this._FtpParams = subElement(this._Ftp, 'FtpParams');

        if (ftpProfile.FileName) {
            this._FileName = subElement(this._FtpParams, 'FileName');
            this._FileName.text = ftpProfile.FileName;
        } else { // error
            logger.error(this.ftpMissing + "destination 'FileName'");
        }
        if (ftpProfile.Host) {
            this._Host = subElement(this._FtpParams, 'Host');
            this._Host.text = ftpProfile.Host;
        } else { // error
            logger.error(this.ftpMissing + "FTP 'Host' address");
        }
        if (ftpProfile.User) {
            this._User = subElement(this._FtpParams, 'User');
            this._User.text = ftpProfile.User;
        } else { // error
            logger.error(this.ftpMissing + "FTP 'User' name");
        }
        if (ftpProfile.Password) {
            this._Password = subElement(this._FtpParams, 'Password');
            this._Password.text = ftpProfile.Password;
        } else { // error
            logger.error(this.ftpMissing + "FTP users 'Password'");
        }
        if (ftpProfile.StoreDir) {
            this._StoreDir = subElement(this._FtpParams, 'StoreDir');
            this._StoreDir.text = ftpProfile.StoreDir;
        } else { // default
            this._StoreDir = subElement(this._FtpParams, 'StoreDir');
            this._StoreDir.text = '/'
        }
        if (ftpProfile.PassiveMode) {
            this._PassiveMode = subElement(this._FtpParams, 'PassiveMode');
            this._PassiveMode.text = ftpProfile.PassiveMode;
        } else { // default
            this._PassiveMode = subElement(this._FtpParams, 'PassiveMode');
            this._PassiveMode.text = 'true';
        }
        if (ftpProfile.PortNum) {
            this._PortNum = subElement(this._FtpParams, 'PortNum');
            this._PortNum.text = ftpProfile.PortNum;
        } else { // default
            this._PortNum = subElement(this._FtpParams, 'PortNum');
            this._PortNum.text = '21';
        }
    }
    /**
     * Generates bsi DisplayInfo XML (see schema for details)
     * @namespace bsi.bsiObject
     * @method DisplayInfo
     */
    set DisplayInfo (message = {}) {

        this._DisplayInfo = subElement(this._root, 'DisplayInfo');
        this._Script = subElement(this._DisplayInfo, 'Script');
        this._cdataToken = subElement(this._Script, 'cdataToken');
        this._xmlToken = subElement(this._cdataToken, 'xmlToken');
        this._UiScreen = subElement(this._cdataToken, 'UiScreen');

        if (message) {

            if (message.Title) {
                this._IoScreen = subElement(this._UiScreen, 'IoScreen');
                this._IoObject = subElement(this._IoScreen, 'IoObject');
                this._Title = subElement(this._IoObject, 'Title');
                this._Title.text = message.Title;
            }
            if (message.Message) {
                this._Message = subElement(this._IoObject, 'Message');
                this._Message.text = message.Message;
            }
            if (Object.keys(message).length == 0) {
                this._NullScreen = subElement(this._UiScreen, 'NullScreen');
            }
        }
    }
}

/***************************************************************** Module Exports **********************************************************/

module.exports = Command;

/*******************************************************************************************************************************************/
