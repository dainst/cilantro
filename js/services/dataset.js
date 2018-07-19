angular
.module("module.dataset", [])
.factory("dataset", ['editables', '$rootScope', 'journalIssue', 'file_manager',
    function(editables, $rootScope, journalIssue, fileManager) {

    /**
     * Refactor Plans
     * - make different models work
     * - rename things from Article to SubObject
     * - remove dataset.loadedFiles and dataset dependency from pdf_file_manager
     */

    const model = journalIssue;

    /* base construction */

    let dataset = {
        data: {},				// metadata for the imported issue
        articles: [],			// collection of articles to import
        thumbnails: {},			// their thumbnails
        loadedFiles: {},        // files loaded into pdf.js

    }; // will be filled by journal.reset()

    /* default data */
    dataset.reset = function() {
        console.log('reset dataset');

        /* the journal metadata */
        dataset.data = new model.MainObjectPrototype();

        /* list of defined articles */
        dataset.articles = [];

        /* list of loaded files for the file selector editable */
        dataset.loadedFiles = {};

        dataset.thumbnails = {};
        /* they are not part of the article obj since they are very large and iterating over the
         articles array in the digest give performance issues otherwise! */
    };

    /* validate */
    dataset.check = function () {
        let invalid = 0;
        angular.forEach(dataset.data, function(property) {
            if (angular.isObject(property) && (property.check() !== false)) {
                invalid += 1;
            }
        });
        return (invalid === 0);
    };

    /* stats */
    dataset.getStats = function() {
        return dataset.articles
            .reduce(
                (acc, article) => {
                    if (typeof article._.confirmed === "undefined") {
                        acc.undecided++;
                    } else if (article._.confirmed === true) {
                        acc.confirmed++;
                    } else if (article._.confirmed === false) {
                        acc.dismissed++;
                    }
                    acc.articles++;
                    return acc;
                },
                {
                    articles: 0,
                    confirmed: 0,
                    undecided: 0,
                    dismissed: 0

                }
            );
    };

    dataset.isStatOk = (k, v) => (k === 'dismissed') ? -1 : ((k === 'confirmed') ? 1 : 0);

    dataset.isReadyToUpload = () => (dataset.getStats().undecided === 0) && (dataset.getStats().confirmed > 0);


    /**
     * get journal data in uploadable form
     * @returns see test/e2e/schema/run_job_param.json
     */
    dataset.get = function() {

        function flatten(obj, modelMeta) {
            let newObj = {
                metadata: {},
                files: []
            };
            angular.forEach(obj, function(editable, key) {
                let value = angular.isFunction(editable.get) ? editable.get() : editable;
                let type = (angular.isDefined(modelMeta[key]) && angular.isDefined(modelMeta[key].type)) ? modelMeta[key].type  : false;
                if (type === "metadata") {
                    newObj[modelMeta[key].type][key] = value;
                }
                if (type === "param") {
                    newObj[key] = value;
                }
                if (angular.isFunction(editable.getFileData)) {
                    newObj.files = newObj.files.concat(editable.getFileData());
                }
            });
            return newObj;
        }

        let returner = flatten(dataset.data, model.getMeta("main"));

        returner.parts = Object.keys(dataset.articles)
            .filter(function(i) {return dataset.articles[i]._.confirmed === true})
            .map(function(i) {return flatten(dataset.articles[i], model.getMeta("sub"))});

        return returner;

    };

    dataset.getModelMeta = model.getMeta;

    /* Sub-Object functions */
    dataset.cleanArticles = function() {
        angular.forEach(dataset.articles, function(article, k) {
            if (typeof article._ !== "undefined") {
                article._ = {};
            }
        });
    };

    // depicated?
    dataset.deleteArticle = function(article) {
        // the price for using an array for articles...
        for (let i = 0; i < dataset.articles.length; i++) {
            if (article === dataset.articles[i]) {
                break;
            }
        }
        dataset.undoDeleteArticle = dataset.articles[i];
        dataset.articles.splice(i, 1);
    };

    function guid() {
        const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    /* Article constructor function */
    dataset.Article = function(data) {
        data = data || {};

        const subObject = new model.SubObjectPrototype(data, dataset.data, dataset);

        // "private" data
        Object.defineProperty(subObject, '_', {enumerable: false, configurable: false, value: {}});

        subObject._.id = guid();

        subObject._.gatherThumbnailRelevantData = () => {
            let set = {};
            Object.keys(model.getMeta("sub"))
                .filter(k => angular.isDefined(model.getMeta("sub")[k]["thumbnailParam"]))
                .forEach(k => {
                    set[model.getMeta("sub")[k]["thumbnailParam"]] = subObject[k].get()
                });
            return set;
        };

        subObject._.getThumbnail = () => angular.isDefined(dataset.thumbnails[subObject._.id])
            ? dataset.thumbnails[subObject._.id]
            : ' '; // angular bug. empty string does not work.

        subObject._.createThumbnail = () => {
            fileManager.createThumbnail(subObject._.gatherThumbnailRelevantData())
                .then(thumbnail => {
                    dataset.thumbnails[subObject._.id] = thumbnail;
                    $rootScope.$broadcast('refreshView');
                })
                .catch(err => {
                    delete dataset.thumbnails[subObject._.id];
                    $rootScope.$broadcast('refreshView');
                });
        };

        Object.keys(model.getMeta("sub"))
            .filter(k => angular.isDefined(model.getMeta("sub")[k]["thumbnailParam"]))
            .forEach(k => subObject[k].watch(subObject._.createThumbnail));

        return subObject;
    };

    dataset.getSortOptionsForSubObjects = () => Object.keys(model.getMeta("sub"))
        .filter(k => angular.isDefined(model.getMeta("sub")[k].sortByAllowed) && model.getMeta("sub")[k].sortByAllowed);

    dataset.sortSubObjects = (sortBy, ascending) => {
        ascending = (!angular.isDefined(ascending) || ascending) ? 1 : -1;

        if (!sortBy || angular.isUndefined(model.getMeta("sub")[sortBy])) {
            console.log('Can not sort by ' + sortBy + " (" + ascending + ")");
            return;
        }

        console.log("Sort by " + sortBy + " (" + ascending + ")");

        dataset.articles.sort((a, b) => (typeof a[sortBy] === "object")
            ? ascending * a[sortBy].compare(b[sortBy])
            : (ascending * a[sortBy].localeCompare(b[sortBy])));

    };

    // maps the data of on subObject on another OF A DIFFERENT KIND. which field shall be mapped onto which field is
    // defined in teh TARGET object model. the datatypes (= types of editables) must be the same.
    // targetObject is of the current model (!)
    // if targetObject is not provided a new SubObject will be generated
    dataset.mapSubObject = (mapName, sourceObject, targetObject) => {
        const getType = obj => Object.prototype.toString.call(obj).slice(8, -1);

        console.log("mapping of " + mapName, sourceObject, targetObject);
        targetObject = targetObject || new dataset.Article();
        const report = Object.keys(model.getMeta("sub")).map(fieldName => {
            const field = model.getMeta("sub")[fieldName];
            if (!field.mappings || !field.mappings[mapName])
                return true;
            const fieldNameInSource = field.mappings[mapName];
            const sourceValue = sourceObject[fieldNameInSource];
            console.log("maps " + fieldNameInSource + " to " + fieldName, sourceValue, targetObject[fieldName]);
            if (getType(sourceValue) !== getType(targetObject[fieldName]))
                return "type mismatch: " + getType(sourceValue) + " != " +  getType(targetObject[fieldName]);
            if (!sourceValue instanceof editables.Base || !targetObject[fieldName] instanceof editables.Base) {
                targetObject[fieldName] = sourceObject[fieldNameInSource];
                return true;
            }
            if (sourceValue.type !== targetObject[fieldName].type)
                return "editable type mismatch: " + sourceValue.type + " != " + targetObject[fieldName].type;
            targetObject[fieldName].set(sourceObject[fieldNameInSource].get());
            return true;
        });
        const success = report.reduce((x, y) => x && y && (y === true), true);
        console.log("mapping of " + mapName + " finished" + (success ? " succesfully" : ""), report, targetObject);
        return targetObject;
    };

    // TODO - how is this geralizable?!
    dataset.setConstraints  = model.setConstraints;

    dataset.reset();

    return (dataset);
}]);
