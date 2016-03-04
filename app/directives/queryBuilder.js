/**
 * Created by davidbridges on 3/1/16.
 */
(function() {
    'use strict';

    function queryBuilder($compile) {
        return {
            restrict: 'E',
            scope: {
                group: '='
            },
            templateUrl: 'app/templates/queryBuilderDirective.html',

            compile: function (element, attrs) {
                var content, directive;
                content = element.contents().remove();

                return function (scope, element, attrs) {

                    scope.operators = [
                        { name: 'AND' },
                        { name: 'OR' }
                    ];

                    scope.fields = [
                        { name: 'height' },
                        { name: 'size' },
                        { name: 'totalFees' },
                        { name: 'numTransactions' },
                        { name: 'medianFee' }
                    ];

                    scope.conditions = [
                        { name: '=', value: 'EQUAL' },
                        { name: '<', value: 'LESS_THAN' },
                        { name: '<=', value: 'LESS_THAN_OR_EQUAL' },
                        { name: '>', value: 'GREATER_THAN' },
                        { name: '>=', value: 'GREATER_THAN_OR_EQUAL' }
                    ];

                    scope.addCondition = function () {
                        console.log('scope',scope);

                        scope.group.filters.push({
                            condition: '=',
                            comparisonOperator: 'EQUAL',
                            field: 'height',
                            fieldValue: 0
                        });
                    };

                    scope.removeCondition = function (index) {
                        scope.group.filters.splice(index, 1);
                    };

                    scope.addGroup = function () {
                        scope.group.filters.push({
                            filterGroup: {
                                logicalOperator: 'AND',
                                filters: []
                            }
                        });
                    };

                    scope.removeGroup = function () {
                        "group" in scope.$parent && scope.$parent.group.filters.splice(scope.$parent.$index, 1);
                    };

                    directive || (directive = $compile(content));

                    element.append(directive(scope, function ($compile) {
                        return $compile;
                    }));
                };
            }
        };
    }

    angular
        .module('coin')
        .directive('queryBuilder', ['$compile', queryBuilder]);
}());