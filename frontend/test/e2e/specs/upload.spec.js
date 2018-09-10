const e = require("../modules/elements");
const a = require('../modules/actions');
const d = require('../modules/documents');
const message = require('../modules/messages');

describe('documents page', () => {
    describe("File Upload", () => {

        it("should upload a file", () => {
            browser.get(browser.baseUrl);
            e.home.startBtn.click();
            a.uploadFile();
            d.getStagingAreaFiles().then(list => {
                expect(list).toContain('e2e-testing.pdf')
            });
        });

        // @ TODO test drag & drop upload
    });
});