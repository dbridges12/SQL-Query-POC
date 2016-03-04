(function() {
    'use strict';

    function TransactionQueryService($http, $q) {
        var TransactionQueryService = {};


        TransactionQueryService.queryForTransData = function() {
            var deferred = $q.defer(),  //  Create a deferred operation.
                url = 'http://coinalytics.io/api/blockstem/transaction?publicKey=davidb',
                config, data;

            config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };

            data = {
                "page": 1,
                "resultsPerPage": 20,
                "filterGroup": {
                    "field": "addresses",
                    "comparisonOperator": "EQUAL",
                    "fieldValue": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                },
                "sorts": [
                    {
                        "sortBy": "blockHeight",
                        "sortDirection": "ASC"
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

        return TransactionQueryService;
    }

    angular
        .module('coin')
        .factory('TransactionQueryService',['$http','$q', TransactionQueryService]);

}());
