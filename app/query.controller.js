/**
 * Created by davidbridges on 3/2/16.
 */
(function() {
    'use strict';
    function QueryController($scope, BlockQueryService, TransactionQueryService, ClustAddrHashQueryService, LabelTypeQueryService, LabeledAddrQueryService, LabeledAggQueryService) {
        var data = '{"filterGroup": {"logicalOperator": "AND","filters": []}}',
            vm=this;

        // default selection for API endpoint selection
        vm.selectedQuery = 'Block Data';

        // init the connect buttons so the spinner is hidden //
        vm.queryLoading = false;

        // expose grid API //
        vm.gridOptions = {
            onRegisterApi: function(gridApi){
                vm.gridApi = gridApi;
            }
        };

        // list of API endpoints to populate select element //
        vm.queries = [
            { name: 'Block Data' },
            { name: '-Transaction Data' },
            { name: '-Clust Addr Hashes' },
            { name: '-Label Types' },
            { name: '-Label Addresses' },
            { name: '-Label Aggregates' }
        ];

        vm.runQuery = function() {
            // turn on the spinner //
            vm.queryLoading = true;

            // clear the grid columns so we can dynamically update them in callback //
            vm.gridOptions.columnDefs = [];

            // build the date object //
            var queryData = buildQuery();

            switch (vm.selectedQuery) {
                case "Block Data":
                    BlockQueryService.queryForBlockData(queryData).then(successCallback, errorCallback);
                    //blockQueryClicked();
                    break;
                case "Transaction Data":
                    TransactionQueryService.queryForTransData().then(successCallback, errorCallback);
                    break;
                case "Clust Addr Hashes":
                    ClustAddrHashQueryService.queryForClustAddrData().then(successCallback, errorCallback);
                    break;
                case "Label Types":
                    LabelTypeQueryService.queryForLabelTypes().then(successCallback, errorCallback);
                    break;
                case "Label Addresses":
                    LabeledAddrQueryService.queryForLabeledAddr().then(successCallback, errorCallback);
                    break;
                case "Label Aggregates":
                    LabeledAggQueryService.queryForLabelAggr().then(successCallback, errorCallback);
                    break;
                default:
                    console.log ('Invalid Query Selection');
            }
        };

        function buildQuery() {
            var x = $scope.json;
            console.log('Query JSON: ',x);
            var queryObj = {};
            queryObj.page = 1;
            queryObj.resultsPerPage = 100;
            queryObj.projections = ['hash','height','size','totalFees', 'medianFee', 'numTransactions'];
            queryObj.filterGroup = JSON.parse(x).filterGroup;
            queryObj.sorts = [];
            queryObj.sorts.push(
                {   "sortBy": "size",
                    "sortDirection": "ASC"
                }
            );
            return queryObj;
        }

        function successCallback(response) {
            var resultArr = response.data.results;
            vm.queryLoading = false;

            if (vm.selectedQuery === 'Clust Addr Hashes') {
                // result is not array of objects - need to create this on the fly using map //
                var newArray = resultArr.map(function (row, index) {
                    var obj = {
                        item: index,
                        address: row
                    };
                    return obj;
                });
                resultArr = newArray;
            }

            vm.gridOptions.data = resultArr;


        }

        function buildChart() {
            // build the chart //
            var margin = {top: 20, right: 20, bottom: 30, left: 40},
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left")
                .ticks(10, "%");

            var svg = d3.select("body").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            d3.tsv("data.tsv", type, function(error, data) {
                if (error) throw error;

                x.domain(data.map(function(d) { return d.letter; }));
                y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Frequency");

                svg.selectAll(".bar")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.letter); })
                    .attr("width", x.rangeBand())
                    .attr("y", function(d) { return y(d.frequency); })
                    .attr("height", function(d) { return height - y(d.frequency); });
            });

            function type(d) {
                d.frequency = +d.frequency;
                return d;
            }
        }

        function errorCallback(response) {
            vm.queryLoading = false;
            console.log('ERROR', response);
        }

        function htmlEntities(str) {
            return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        // Build the select string to show the user //
        function computed(filterGroup) {
            if (!filterGroup) {
                return "";
            }

            for (var str = "(", i = 0; i < filterGroup.filters.length; i++) {
                i > 0 && (str += " <strong>" + filterGroup.logicalOperator + "</strong> ");
                str += filterGroup.filters[i].filterGroup ?
                    computed(filterGroup.filters[i].filterGroup) :
                filterGroup.filters[i].field + " " + htmlEntities(filterGroup.filters[i].comparisonOperator) + " " + filterGroup.filters[i].fieldValue;
            }

            return str + ")";
        }

        $scope.json = null;

        $scope.filter = JSON.parse(data);

        $scope.$watch('filter', function (newValue) {
            $scope.json = JSON.stringify(newValue, null, 2);
            $scope.output = computed(newValue.filterGroup);
        }, true);
    }

    angular
        .module('coin')
        .controller('QueryController',['$scope', 'BlockQueryService', 'TransactionQueryService', 'ClustAddrHashQueryService', 'LabelTypeQueryService', 'LabeledAddrQueryService', 'LabeledAggQueryService', QueryController]);
}());