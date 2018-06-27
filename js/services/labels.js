angular
    .module('module.labels', [])
    .factory("labels", ['dataset', function(dataset) {
        let model = dataset.getModel();

        let labels = {
            "main": model.mainObjectLabels,
            "sub": model.subObjectLabels
        };

        return {
            get: function(set, key, short) {
                if (angular.isUndefined(labels[set])) {
                    return "[§" + set + "]";
                }

                if (angular.isUndefined(labels[set][key])) {
                    return "[" + key + "]";
                }

                let label = labels[set][key];

                if (!angular.isUndefined(label.description) && !short) {
                    return label.description;
                }

                if (!angular.isUndefined(label.title)) {
                    return label.title;
                }

                if (!angular.isUndefined(label.description) && short) {
                    return label.description.substr(0,12);
                }

                return "[" + key + "]";
            },
            getStyle: function(set, key) {
                return angular.isDefined(labels[set])
                        && angular.isDefined(labels[set][key])
                        && angular.isDefined(labels[set][key].style)
                    ? labels[set][key].style
                    : {minWidth: '400px'};
            }
        };
    }]);