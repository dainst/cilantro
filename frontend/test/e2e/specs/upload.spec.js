const e = require("../modules/elements");
const a = require('../modules/actions');
const d = require('../modules/documents');
const dropFile = require("../util/dropFile.js");
const message = require('../modules/messages');
const LoginHelper = require("../util/login_helper");
const EC = protractor.ExpectedConditions;

describe('documents page', () => {
    describe("File Upload", () => {

        it("should upload a file", () => {
            LoginHelper.get(browser, browser.baseUrl, 'upload');
            e.home.startBtn.click();
            a.uploadFile();
            d.getStagingAreaFiles().then(list => {
                expect(list).toContain('upload.pdf')
            });
        });

        it("should upload a file on drag&drop", () =>{
            LoginHelper.get(browser, browser.baseUrl, 'upload');
            e.home.startBtn.click();
            dropFile(e.upload.fileUploadArea, "test/e2e/resources/upload/dragndrop.pdf");
            d.getStagingAreaFiles().then(list => {
                expect(list).toContain('dragndrop.pdf')
            });
        });
    });

});