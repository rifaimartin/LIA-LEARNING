(function() {
    'use strict';

    angular.module('BlurAdmin.pages.TopicForm', [])
        .config(routeConfig);
    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('topic-form', {
                url: '/topic-form/:id?:tab',
                title: 'Topic Form',
                templateUrl: 'app/pages/Topics/form.html',
                controller: 'TopicFormCtrl',
            });
    }
})();