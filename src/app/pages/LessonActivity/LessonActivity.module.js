(function() {
    'use strict';

    angular.module('BlurAdmin.pages.LessonActivity', [])
        .config(routeConfig);
    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('lesson-activity', {
                url: '/lesson-activity/:id?:tab',
                title: 'Lesson Activity',
                templateUrl: 'app/pages/LessonActivity/lessonActivity.html',
                controller: 'LessonActivityCtrl',
            });
    }
})();