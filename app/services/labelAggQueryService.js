(function() {
    'use strict';

    function LabeledAggQueryService($http, $q) {
        var LabeledAggQueryService = {};


        LabeledAggQueryService.queryForLabelAggr = function() {
            var deferred = $q.defer(),  //  Create a deferred operation.
                url = 'http://coinalytics.io/api/blockstem/label?publicKey=davidb',
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
                "filterGroup":{
                    "field":"type",
                    "comparisonOperator":"EQUAL",
                    "fieldValue":"Bitcoin OTC User"
                },
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

        return LabeledAggQueryService;
    }

    angular
        .module('coin')
        .factory('LabeledAggQueryService',['$http','$q', LabeledAggQueryService]);

}());