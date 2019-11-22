import { Selector } from 'testcafe';

fixture(`Index page`).page('http://localhost:8081');

test('start ingest journal job with default values', async testController => {
    await testController
        .typeText('body #main_content input.input', 'test_user')
        .typeText('body #main_content input[type="password"]', 'test_password')
        .click('button')

    const startJobSelector = new Selector('#start_ingest_journal');
    await testController.click(startJobSelector)
    const mainContentSelector = new Selector('body #main_content');
    await testController.expect(mainContentSelector.innerText).contains('Select the folders for the job');

    const createFolderSelector = new Selector('span.is-primary button');
    await testController.click(createFolderSelector)
    const folderNameFieldSelector = new Selector('section.modal-card-body input');
    await testController
        .typeText(folderNameFieldSelector, 'JOURNAL-ZID001449024')
        .click('footer button.is-primary')
        .expect(mainContentSelector.innerText).contains('JOURNAL-ZID001449024');

    await testController
        .click('.table > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(3)') // TODO

    await testController.click(createFolderSelector)
    await testController
        .typeText(folderNameFieldSelector, 'tif')
        .click('footer button.is-primary')
    await testController
        .click('.table > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(3)') // TODO

    await testController
        .setFilesToUpload('input[type="file"]', [
            '../resources/test.tif',
            '../resources/test2.tif',
            '../resources/test3.tif',
            '../resources/test4.tif',
        ])
        .click('input[type="file"]');

    await testController
        .click('i.mdi-home')

    await testController
        .click('.table > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(1) > label:nth-child(1) > input:nth-child(1)')
        .click('#main_content nav button.button.is-primary')
        .wait(2000)
        .expect(mainContentSelector.innerText).contains('Volume');
    await testController
        .click('#main_content nav button.button.is-primary')
        .wait(2000)
        .expect(mainContentSelector.innerText).contains('OJS Options');

    const snackbarSelector = new Selector('div.notices div.snackbar');
    await testController
        .click('#main_content nav button.button.is-danger')
        .expect(snackbarSelector.innerText).contains('started');

    await testController
        .wait(6000)
        .resizeWindow(1200, 800)
        .click('nav.navbar div.navbar-menu a[href="/jobs"]')
        .expect(mainContentSelector.innerText).contains('Show all');

    const lastJobStatusSelector = new Selector('.table > tbody:nth-child(2) > tr:nth-child(1) > td:nth-child(3) > div:nth-child(1)');
    await testController
        .expect(mainContentSelector.innerText).contains('success');

});
