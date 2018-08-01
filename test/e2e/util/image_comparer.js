const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const path = require('path');
const dataUriToBuffer = require('data-uri-to-buffer');
const imgPath = path.join(__dirname,'/../resources/images/');
const outPath = path.join(__dirname,'/../screenshots/');

const ImageComparer = function() {

    const readImage = image => new Promise((resolve, reject) =>
        {let img = fs.createReadStream(image).pipe(new PNG()).on('parsed', () => resolve(img))});

    const readDataUri = uri => PNG.sync.read(dataUriToBuffer(uri));

    this.outputFileName = 'diff.png';

    function compare(imgs) {
        const diff = new PNG({width: imgs[0].width, height: imgs[0].height});
        const diffC = pixelmatch(imgs[0].data, imgs[1].data, diff.data, imgs[0].width, imgs[0].height, {threshold: 0.2});
        diff.pack().pipe(fs.createWriteStream(outPath + this.outputFileName));
        return diffC;
    }

    this.compareDataWithFile = (imageData, fileName) => new Promise((resolve, reject) =>
        Promise.all([readDataUri(imageData), readImage(imgPath + fileName)])
            .then(compare.bind({outputFileName: "diff_" + fileName.replace("/","_")}))
            .then(resolve));

};

module.exports = new ImageComparer();