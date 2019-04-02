(function() {
    'use strict';

    angular.module('BlurAdmin.pages.ContentPages', [])
        .config(routeConfig);
    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('content-pages', {
                url: '/content-pages/:id',
                title: 'Content Pages',
                templateUrl: 'app/pages/LessonActivity/ContentPage/content-pages.html',
                controller: 'ContentPagesCtrl',
            });
    }
})();