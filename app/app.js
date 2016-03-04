/**
 * Created by davidbridges on 1/7/16.
 */
(function () {
    'use strict';
    function config($httpProvider) {
        //  Force AngularJS to call the JSON Web Service with a 'GET' rather than an 'OPTION'
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }

    angular
        .module('coin',['ngSanitize', 'ui.grid', 'ui.grid.resizeColumns', 'ui.grid.moveColumns'])
        .config(config);
}());
