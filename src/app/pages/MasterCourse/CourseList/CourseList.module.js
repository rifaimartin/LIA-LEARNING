(function() {
    'use strict';

    angular.module('BlurAdmin.pages.CourseList', [])
        .config(routeConfig)
        .config(function() {
            $.jstree.defaults.core.themes.url = true;
            $.jstree.defaults.core.themes.dir = "assets/img/theme/vendor/jstree/dist/themes";
        });
    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('course-list', {
                url: '/course-list',
                title: 'Course List',
                templateUrl: 'app/pages/MasterCourse/CourseList/index.html',
                controller: 'CourseListCtrl',
            });
    }
})();