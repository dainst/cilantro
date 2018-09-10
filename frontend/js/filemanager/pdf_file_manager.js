angular
.module('module.pdfFileManager', ['module.messenger', 'module.webservice'])
.factory('pdfFileManager', ['$rootScope', 'settings', 'webservice', 'messenger', 'dataset', 'editables', 'fileManager',
    function($rootScope, settings, webservice, messenger, dataset, editables, fileManager) {

        const pdfFileManager = {};

        const requirePdfJs = new Promise(resolve => {
            require.config({paths: {'pdfjs-dist': './node_modules/pdfjs-dist'}});
            require(['pdfjs-dist/build/pdf'], pdfjs => {
                console.log('required pdf.js', pdfjs);

                pdfFileManager.pdfjs = pdfjs;

                // pdfFileManager.PDF.global.PDFJS.workerSrc = 'js/other/pdfjs_worker_loader.js';
                resolve();
            });
        });

        const loadFiles = filesToLoad => {

            pdfFileManager.ready = false;

            const loadFilePromises = [];

            for (let fileid in filesToLoad) {

                const reqestParams = {url: settings.files_url + filesToLoad[fileid].path};

                if (angular.isDefined(settings.server_user) && angular.isDefined(settings.server_pass)) {
                    reqestParams.httpHeaders = {
                        "Authorization": "Basic " + window.btoa(settings.server_user + ":" + settings.server_pass)
                    };
                    reqestParams.withCredentials = true;
                }

                const promise = new Promise((resolve, fail) => {pdfFileManager.pdfjs.getDocument(reqestParams).then(
                    pdf => {
                        const fileInfo = {
                            pdf: pdf,
                            filename: filesToLoad[fileid].name,
                            url: filesToLoad[fileid].path,
                            pagecontext: new editables.types.Pagecontext({maximum: pdf.pdfInfo.numPages, path: filesToLoad[fileid].path}),
                            meta: {}
                        };

                        const promise1 = pdf.getMetadata().then(meta => {
                            fileInfo.meta = meta.info
                        });
                        const promise2 = pdf.getDownloadInfo().then(dil => {
                            fileInfo.size = fileSize(dil.length);
                        });

                        const metadataLoaded = () => {
                            fileManager.loadedFiles[fileInfo.url] = fileInfo;
                            dataset.loadedFiles[fileInfo.url] = { // TODO double counting of files - to be removed
                                size: fileInfo.size,
                                url: fileInfo.url,
                                pagecontext: fileInfo.pagecontext,
                            };
                            messenger.info('document: ' + fileInfo.url + ' loaded');
                            fileManager.stats.loaded += 1;
                            refreshView();
                            resolve();
                        };

                        Promise.all([promise1, promise2]).then(metadataLoaded, metadataLoaded);
                        // if metadata could not be loaded, it's no reason not to continue, therefore we don't fail

                    },

                    reason => {
                        messenger.warning("get document " + reqestParams.url + " failed: " + reason, true);
                        resolve(); //!
                    })}
                );
                loadFilePromises.push(promise);
            }
            return loadFilePromises;
        };

        pdfFileManager.loadFiles = file => {
            //  TODO make recursive!
            console.log("Load File: ", file);

            const filesToLoad = (file.type === 'directory') ? file.contents : [file];
            fileManager.ready = false;
            fileManager.stats.files += filesToLoad.length;

            return new Promise((resolve, reject) => {
                requirePdfJs.then(() => {
                    Promise.all(loadFiles(filesToLoad)).then(() => {
                        if (filesToLoad.length > 1) {
                            messenger.success("All Files loaded");
                        }
                        fileManager.ready = true;
                        refreshView();
                        resolve(filesToLoad);
                    }).catch(reject);
                });
            });

        };

        function renderThumbnail(page) {
            return new Promise((resolve, reject) => {
                const viewport = page.getViewport(1.5); // scale 1.5
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.height = viewport.height; // 626.16 * 1.5
                canvas.width = viewport.width; // 399.84 * 1.5

                let renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                };

                page.render(renderContext).then(function(){
                    console.log("thumbnail created");
                    ctx.globalCompositeOperation = "destination-over";
                    ctx.fillStyle = "#123456";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    fileManager.stats.thumbnails += 1;
                    resolve(canvas.toDataURL());
                });
            });
        }

        pdfFileManager.createThumbnail = params => new Promise((resolve, reject) =>
            fileManager.loadedFiles[params.filePath].pdf
                .getPage(params.pages.startPrint)
                .then(page => renderThumbnail(page)
                    .then(resolve))
                .catch(reject)
            );

        function fileSize(b) {
            let u = 0, s = 1024;
            while (b >= s || -b >= s) {
                b /= s;//
                u++;
            }
            return (u ? b.toFixed(1) + ' ' : b) + ' KMGTPEZY'[u] + 'B';
        }

        // since the pdf.js stuff is happening outside angular is is ansync we need this shit here
        function refreshView() {
            $rootScope.$broadcast('refreshView');
        }

        return pdfFileManager;
}]);