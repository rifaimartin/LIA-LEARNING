
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.master', [])
    .config(routeConfig);
  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('master-rule-list', {
        url: '/master-rule',
        title: 'Master Rule',
        templateUrl: 'app/pages/master/list.html',
        controller: 'masterPageCtrl',
      })
      .state('view-rule-list', {
        url: '/master-rule/:view/:id',
        title: 'Menambah rule',
        templateUrl: 'app/pages/master/form.html',
        controller: 'masterPageCtrl',
      })
  }
})();
