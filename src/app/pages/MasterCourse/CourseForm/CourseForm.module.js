(function() {
    'use strict';

    angular.module('BlurAdmin.pages.CourseForm', [])
        .config(routeConfig);
    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('course-form', {
                url: '/course-form/:id?:tab',
                title: 'Course Form',
                templateUrl: 'app/pages/MasterCourse/CourseForm/form.html',
                controller: 'CourseFormCtrl',
            });
    }
})();