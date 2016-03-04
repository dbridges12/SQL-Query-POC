(function() {
    'use strict';

    function LabeledAddrQueryService($http, $q) {
        var LabeledAddrQueryService = {};


        LabeledAddrQueryService.queryForLabeledAddr = function() {
            var deferred = $q.defer(),  //  Create a deferred operation.
                url = 'http://coinalytics.io/api/blockstem/label/addresses?publicKey=davidb',
                config, data;

            config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };

            data = {
                "page":1,
                "resultsPerPage":20,
                "filterGroup":{
                    "field":"type",
                    "comparisonOperator":"EQUAL",
                    "fieldValue":"Gambling"
                }
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

        return LabeledAddrQueryService;
    }

    angular
        .module('coin')
        .factory('LabeledAddrQueryService',['$http','$q', LabeledAddrQueryService]);

}());