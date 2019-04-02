/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.profile2', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('profile2', {
          url: '/profile2',
          title: 'Branch List',
          templateUrl: 'app/pages/profile2/tables.html',
          controller: 'Profile2PageCtrl',
          
        });
  }

})();
