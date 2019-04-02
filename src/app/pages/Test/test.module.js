
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.Test', [])
        .config(routeConfig);
    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('list-test', {
                url: '/test',
                title: 'Test - List',
                templateUrl: 'app/pages/Test/index.html',
                controller: 'TestCtrl',
            })
    }
})();