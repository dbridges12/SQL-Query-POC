(function() {
    'use strict';

    function LabelTypeQueryService($http, $q) {
        var LabelTypeQueryService = {};


        LabelTypeQueryService.queryForLabelTypes = function() {
            var deferred = $q.defer(),  //  Create a deferred operation.
                url = 'http://coinalytics.io/api/blockstem/label/types?publicKey=davidb',
                config, data;

            config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };

            data = {
                "page":1,
                "resultsPerPage":10,
                "sorts":[
                    {
                        "sortBy":"numLabeledAddresses",
                        "sortDirection":"DESC"
                    }
                ]
            };

            function successCallback(response) {
                deferred.resolve(response);
            }

            function errorCallback(response) {
                deferred.reject(response);
            }

            $http.post(url, data, config).then(successCallback, errorCallback);

            return deferred.promise;
        };

        return LabelTypeQueryService;
    }

    angular
        .module('coin')
        .factory('LabelTypeQueryService',['$http','$q', LabelTypeQueryService]);

}());