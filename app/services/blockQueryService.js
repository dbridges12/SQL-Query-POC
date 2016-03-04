(function() {
    'use strict';

    function BlockQueryService($http, $q) {
        var BlockQueryService = {};


        BlockQueryService.queryForBlockData = function(queryData) {
            var deferred = $q.defer(),  //  Create a deferred operation.
                url = 'http://coinalytics.io/api/blockstem/block?publicKey=davidb',
                config, data;

            config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };

            data = queryData;

            /*
            data = {
                "page": 1,
                "resultsPerPage": 20,
                "filterGroup": {
                    "field": "totalFees",
                    "comparisonOperator": "GREATER_THAN",
                    "fieldValue": 100
                },
                "sorts": [
                    {
                        "sortBy": "height",
                        "sortDirection": "ASC"
                    }
                ]
            };
            */

            function successCallback(response) {
                deferred.resolve(response);
            }

            function errorCallback(response) {
                deferred.reject(response);
            }

            $http.post(url, data, config).then(successCallback, errorCallback);

            return deferred.promise;
        };

        return BlockQueryService;
    }

    angular
        .module('coin')
        .factory('BlockQueryService',['$http','$q', BlockQueryService]);

}());