(function() {
    'use strict';

    function ClustAddrHashQueryService($http, $q) {
        var ClustAddrHashQueryService = {};


        ClustAddrHashQueryService.queryForClustAddrData = function() {
            var deferred = $q.defer(),  //  Create a deferred operation.
                url = 'http://coinalytics.io/api/blockstem/cluster/addresses?publicKey=davidb',
                config, data;

            config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };

            data = {
                "page":1,
                "resultsPerPage":5,
                "filterGroup":{
                    "field":"clusterSeedAddress",
                    "comparisonOperator":"EQUAL",
                    "fieldValue":"16i2cjCNeYGU1i6ix8x7mwZsF5gCec4Xn1"
                },
                "sorts":[
                    {
                        "sortBy":"address",
                        "sortDirection":"ASC"
                    }
                ]
            }            ;

            function successCallback(response) {
                deferred.resolve(response);
            }

            function errorCallback(response) {
                deferred.reject(response);
            }

            $http.post(url, data, config).then(successCallback, errorCallback);

            return deferred.promise;
        };

        return ClustAddrHashQueryService;
    }

    angular
        .module('coin')
        .factory('ClustAddrHashQueryService',['$http','$q', ClustAddrHashQueryService]);

}());
